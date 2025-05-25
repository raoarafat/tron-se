import TronWeb from 'tronweb';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';

export class TronService {
  protected tronWeb: TronWeb;
  protected stockExchangeContract: any;

  constructor() {
    if (!config.privateKey) {
      throw new Error(
        'Private key is required. Please set WALLET_PRIVATE_KEY in .env file'
      );
    }

    this.tronWeb = new TronWeb({
      fullHost: config.fullNode as string,
      headers: { 'TRON-PRO-API-KEY': config.tronGridApiKey as string },
    });

    // Set private key and verify the wallet
    this.tronWeb.setPrivateKey(config.privateKey);

    // Verify the wallet is properly set
    const address = this.tronWeb.address.fromPrivateKey(config.privateKey);
    if (!address) {
      throw new Error('Failed to derive address from private key');
    }

    console.log('Wallet initialized with address:', address);
  }

  getAddressFromPrivateKey(privateKey: string): string {
    return this.tronWeb.address.fromPrivateKey(privateKey);
  }

  async getAccountBalance(address: string): Promise<number> {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return balance / 1e6; // Convert from SUN to TRX
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async sendTransaction(toAddress: string, amount: number): Promise<string> {
    try {
      const transaction = await this.tronWeb.trx.sendTransaction(
        toAddress,
        amount * 1e6
      ); // Convert TRX to SUN
      return transaction.txid;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async getTransactionInfo(txId: string): Promise<any> {
    try {
      const transaction = await this.tronWeb.trx.getTransaction(txId);
      return transaction;
    } catch (error) {
      console.error('Error getting transaction info:', error);
      throw error;
    }
  }

  async deployContract(contractName: string): Promise<string> {
    try {
      // Read contract ABI and bytecode from build folder
      const buildPath = path.join(
        __dirname,
        '../build',
        `${contractName}.json`
      );
      if (!fs.existsSync(buildPath)) {
        throw new Error(
          `Contract build file not found for ${contractName}. Please compile the contract first.`
        );
      }

      const contractData = JSON.parse(fs.readFileSync(buildPath, 'utf8'));
      console.log('Contract data loaded successfully');

      // Deploy contract
      console.log('Starting contract deployment...');
      const compiledContract = await this.tronWeb.contract().new({
        abi: contractData.abi,
        bytecode: contractData.bytecode,
        feeLimit: 1000000000,
        callValue: 0,
        parameters: [],
      });

      if (!compiledContract || !compiledContract.address) {
        throw new Error('Contract deployment failed: No address returned');
      }

      console.log('Contract deployment transaction sent');
      return compiledContract.address;
    } catch (error: any) {
      console.error('Detailed deployment error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        details: error.details || error,
      });
      throw new Error(`Failed to deploy contract: ${error.message}`);
    }
  }

  // Stock Exchange Methods
  async initializeStockExchange(contractAddress: string) {
    try {
      const contractData = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../build/StockExchange.json'),
          'utf8'
        )
      );
      this.stockExchangeContract = await this.tronWeb
        .contract()
        .at(contractAddress, contractData.abi);
      console.log('Stock Exchange contract initialized at:', contractAddress);
    } catch (error) {
      console.error('Error initializing stock exchange:', error);
      throw error;
    }
  }

  async listStock(
    symbol: string,
    name: string,
    price: number,
    totalSupply: number
  ) {
    try {
      const result = await this.stockExchangeContract
        .listStock(symbol, name, price, totalSupply)
        .send();
      return result;
    } catch (error) {
      console.error('Error listing stock:', error);
      throw error;
    }
  }

  async buyStock(symbol: string, amount: number) {
    try {
      const stockDetails = await this.stockExchangeContract
        .getStockDetails(symbol)
        .call();
      const totalPrice = stockDetails.price * amount;

      const result = await this.stockExchangeContract
        .buyStock(symbol, amount)
        .send({
          value: totalPrice,
        });
      return result;
    } catch (error) {
      console.error('Error buying stock:', error);
      throw error;
    }
  }

  async sellStock(symbol: string, amount: number) {
    try {
      const result = await this.stockExchangeContract
        .sellStock(symbol, amount)
        .send();
      return result;
    } catch (error) {
      console.error('Error selling stock:', error);
      throw error;
    }
  }

  async getHoldings(symbol: string) {
    try {
      const holdings = await this.stockExchangeContract
        .getHoldings(symbol)
        .call();
      return holdings;
    } catch (error) {
      console.error('Error getting holdings:', error);
      throw error;
    }
  }

  async getTransactionHistory() {
    try {
      const transactionIds = await this.stockExchangeContract
        .getTransactionHistory()
        .call();
      return transactionIds;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  async getTransactionDetails(transactionId: number) {
    try {
      const details = await this.stockExchangeContract
        .getTransactionDetails(transactionId)
        .call();
      return {
        symbol: details.symbol,
        amount: details.amount,
        price: details.price,
        buyer: details.buyer,
        seller: details.seller,
        timestamp: new Date(Number(details.timestamp) * 1000),
        isBuy: details.isBuy,
      };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }

  async updateStockPrice(symbol: string, newPrice: number) {
    try {
      const result = await this.stockExchangeContract
        .updateStockPrice(symbol, newPrice)
        .send();
      return result;
    } catch (error) {
      console.error('Error updating stock price:', error);
      throw error;
    }
  }

  async getStockDetails(symbol: string) {
    try {
      const details = await this.stockExchangeContract
        .getStockDetails(symbol)
        .call();
      return {
        name: details.name,
        price: details.price,
        totalSupply: details.totalSupply,
        availableSupply: details.availableSupply,
        isActive: details.isActive,
      };
    } catch (error) {
      console.error('Error getting stock details:', error);
      throw error;
    }
  }
}
