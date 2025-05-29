"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tronService_1 = require("./tronService");
function deployContract() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contractName = process.argv[2];
            if (!contractName) {
                throw new Error('Please provide a contract name as an argument');
            }
            const tronService = new tronService_1.TronService();
            const walletAddress = tronService.getAddressFromPrivateKey(process.env.WALLET_PRIVATE_KEY || '');
            // Check wallet balance
            const balance = yield tronService.getAccountBalance(walletAddress);
            console.log(`Wallet balance: ${balance} TRX`);
            if (balance < 1) {
                throw new Error('Insufficient TRX balance. Please ensure you have at least 1 TRX for deployment.');
            }
            console.log(`Deploying ${contractName} contract...`);
            const contractAddress = yield tronService.deployContract(contractName);
            console.log('Contract deployed successfully!');
            console.log('Contract Address:', contractAddress);
            process.exit(0);
        }
        catch (error) {
            console.error('Error deploying contract:', error);
            process.exit(1);
        }
    });
}
deployContract();
