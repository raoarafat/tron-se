import TronWeb from 'tronweb';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';

export class TronService {
  protected tronWeb: TronWeb;

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

      // Deploy contract
      const compiledContract = await this.tronWeb.contract().new({
        abi: contractData.abi,
        bytecode: contractData.bytecode,
        feeLimit: 1000000000,
        callValue: 0,
        parameters: [],
      });

      return compiledContract.address;
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  }
}
