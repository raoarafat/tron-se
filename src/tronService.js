"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TronService = void 0;
const tronweb_1 = __importDefault(require("tronweb"));
const config_1 = require("./config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class TronService {
    constructor() {
        if (!config_1.config.privateKey) {
            throw new Error('Private key is required. Please set WALLET_PRIVATE_KEY in .env file');
        }
        this.tronWeb = new tronweb_1.default({
            fullHost: config_1.config.fullNode,
            headers: { 'TRON-PRO-API-KEY': config_1.config.tronGridApiKey },
        });
        // Set private key and verify the wallet
        this.tronWeb.setPrivateKey(config_1.config.privateKey);
        // Verify the wallet is properly set
        const address = this.tronWeb.address.fromPrivateKey(config_1.config.privateKey);
        if (!address) {
            throw new Error('Failed to derive address from private key');
        }
        console.log('Wallet initialized with address:', address);
    }
    getAddressFromPrivateKey(privateKey) {
        return this.tronWeb.address.fromPrivateKey(privateKey);
    }
    getAccountBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.tronWeb.trx.getBalance(address);
                return balance / 1e6; // Convert from SUN to TRX
            }
            catch (error) {
                console.error('Error getting balance:', error);
                throw error;
            }
        });
    }
    sendTransaction(toAddress, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.tronWeb.trx.sendTransaction(toAddress, amount * 1e6); // Convert TRX to SUN
                return transaction.txid;
            }
            catch (error) {
                console.error('Error sending transaction:', error);
                throw error;
            }
        });
    }
    getTransactionInfo(txId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.tronWeb.trx.getTransaction(txId);
                return transaction;
            }
            catch (error) {
                console.error('Error getting transaction info:', error);
                throw error;
            }
        });
    }
    deployContract(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Read contract ABI and bytecode from build folder
                const buildPath = path.join(__dirname, '../build', `${contractName}.json`);
                if (!fs.existsSync(buildPath)) {
                    throw new Error(`Contract build file not found for ${contractName}. Please compile the contract first.`);
                }
                const contractData = JSON.parse(fs.readFileSync(buildPath, 'utf8'));
                console.log('Contract data loaded successfully');
                // Deploy contract
                console.log('Starting contract deployment...');
                const compiledContract = yield this.tronWeb.contract().new({
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
            }
            catch (error) {
                console.error('Detailed deployment error:', {
                    message: error.message,
                    code: error.code,
                    stack: error.stack,
                    details: error.details || error,
                });
                throw new Error(`Failed to deploy contract: ${error.message}`);
            }
        });
    }
    // Stock Exchange Methods
    initializeStockExchange(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contractData = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/StockExchange.json'), 'utf8'));
                // Initialize contract using the correct TronWeb contract API
                this.stockExchangeContract = yield this.tronWeb
                    .contract()
                    .at(contractAddress);
                console.log('Stock Exchange Initialized address:', this.stockExchangeContract.address);
                console.log('Stock Exchange contract initialized at:', contractAddress);
            }
            catch (error) {
                console.error('Error initializing stock exchange:', error);
                throw error;
            }
        });
    }
    // async listStock(
    //   symbol: string,
    //   name: string,
    //   price: number,
    //   totalSupply: number
    // ) {
    //   try {
    //     const result = await this.stockExchangeContract
    //       .listStock(symbol, name, price, totalSupply)
    //       .send();
    //     return result;
    //   } catch (error) {
    //     console.error('Error listing stock:', error);
    //     throw error;
    //   }
    // }
    listStock(symbol, name, price, totalSupply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!this.stockExchangeContract) {
                    throw new Error('Stock Exchange contract not initialized. Please initialize it first using /stock-exchange/initialize endpoint.');
                }
                console.log('\nListing Stock Details:');
                console.log('---------------------');
                console.log('Symbol:', symbol);
                console.log('Name:', name);
                console.log('Price:', price, 'TRX');
                console.log('Total Supply:', totalSupply);
                console.log('Network:', config_1.config.network);
                console.log('Contract Address:', this.stockExchangeContract.address);
                console.log('---------------------');
                const result = yield this.stockExchangeContract
                    .listStock(symbol, name, price, totalSupply)
                    .send();
                // Log the raw result for debugging
                console.log('Raw transaction result:', JSON.stringify(result, null, 2));
                // Extract transaction ID from the result
                const txId = (result === null || result === void 0 ? void 0 : result.txid) ||
                    (result === null || result === void 0 ? void 0 : result.transaction) ||
                    (result === null || result === void 0 ? void 0 : result.transaction_id) ||
                    ((_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a.txid);
                console.log('\nTransaction Details:');
                console.log('-------------------');
                console.log('Transaction ID:', txId);
                console.log('Transaction URL:', `https://${config_1.config.network === 'shasta' ? 'shasta.' : ''}tronscan.org/#/transaction/${txId}`);
                console.log('-------------------\n');
                return {
                    result,
                    transactionId: txId,
                    transactionUrl: `https://${config_1.config.network === 'shasta' ? 'shasta.' : ''}tronscan.org/#/transaction/${txId}`,
                    stockDetails: {
                        symbol,
                        name,
                        price,
                        totalSupply,
                    },
                    status: 'success',
                    message: 'Stock listed successfully',
                };
            }
            catch (error) {
                console.error('\nError listing stock:', error);
                throw error;
            }
        });
    }
    buyStock(symbol, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stockDetails = yield this.stockExchangeContract
                    .getStockDetails(symbol)
                    .call();
                const totalPrice = stockDetails.price * amount;
                const result = yield this.stockExchangeContract
                    .buyStock(symbol, amount)
                    .send({
                    value: totalPrice,
                });
                return result;
            }
            catch (error) {
                console.error('Error buying stock:', error);
                throw error;
            }
        });
    }
    sellStock(symbol, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.stockExchangeContract
                    .sellStock(symbol, amount)
                    .send();
                return result;
            }
            catch (error) {
                console.error('Error selling stock:', error);
                throw error;
            }
        });
    }
    getHoldings(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const holdings = yield this.stockExchangeContract
                    .getHoldings(symbol)
                    .call();
                return holdings;
            }
            catch (error) {
                console.error('Error getting holdings:', error);
                throw error;
            }
        });
    }
    getTransactionHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionIds = yield this.stockExchangeContract
                    .getTransactionHistory()
                    .call();
                return transactionIds;
            }
            catch (error) {
                console.error('Error getting transaction history:', error);
                throw error;
            }
        });
    }
    getTransactionDetails(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield this.stockExchangeContract
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
            }
            catch (error) {
                console.error('Error getting transaction details:', error);
                throw error;
            }
        });
    }
    updateStockPrice(symbol, newPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.stockExchangeContract
                    .updateStockPrice(symbol, newPrice)
                    .send();
                return result;
            }
            catch (error) {
                console.error('Error updating stock price:', error);
                throw error;
            }
        });
    }
    getStockDetails(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield this.stockExchangeContract
                    .getStockDetails(symbol)
                    .call();
                return {
                    name: details.name,
                    price: details.price,
                    totalSupply: details.totalSupply,
                    availableSupply: details.availableSupply,
                    isActive: details.isActive,
                };
            }
            catch (error) {
                console.error('Error getting stock details:', error);
                throw error;
            }
        });
    }
}
exports.TronService = TronService;
