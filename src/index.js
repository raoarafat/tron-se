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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tronService_1 = require("./tronService");
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("./server");
const app = (0, express_1.default)();
const port = config_1.config.port || 3000;
const tronService = new tronService_1.TronService();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', server_1.router);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get your account balance
            const myAddress = config_1.config.privateKey
                ? tronService.getAddressFromPrivateKey(config_1.config.privateKey)
                : 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8';
            const balance = yield tronService.getAccountBalance(myAddress);
            console.log(`Your balance: ${balance} TRX`);
            console.log('Your wallet address:', myAddress);
            console.log('\nAvailable commands:');
            console.log('1. Check balance: GET /balance/:address');
            console.log('2. Send TRX: POST /send { "to": "address", "amount": number }');
            console.log('3. Get transaction info: GET /transaction/:txId');
            console.log('4. Deploy contract: POST /deploy-contract { "contractName": "name" }');
            console.log('\nStock Exchange commands:');
            console.log('5. Initialize stock exchange: POST /stock-exchange/initialize { "contractAddress": "address" }');
            console.log('6. List stock: POST /stock-exchange/list { "symbol": "string", "name": "string", "price": number, "totalSupply": number }');
            console.log('7. Buy stock: POST /stock-exchange/buy { "symbol": "string", "amount": number }');
            console.log('8. Sell stock: POST /stock-exchange/sell { "symbol": "string", "amount": number }');
            console.log('9. Get holdings: GET /stock-exchange/holdings/:symbol');
            console.log('10. Get transactions: GET /stock-exchange/transactions');
            console.log('11. Get transaction details: GET /stock-exchange/transactions/:id');
            console.log('12. Update stock price: PUT /stock-exchange/price { "symbol": "string", "newPrice": number }');
            console.log('13. Get stock details: GET /stock-exchange/stock/:symbol');
            // Start the server
            app.listen(port, () => {
                console.log(`\nServer running at http://localhost:${port}`);
            });
        }
        catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    });
}
startServer();
