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
exports.router = void 0;
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const tronService_1 = require("./tronService");
const config_1 = require("./config");
exports.router = (0, express_1.Router)();
const tronService = new tronService_1.TronService();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount the router
app.use('/', exports.router);
// Initialize stock exchange contract
let stockExchangeAddress = null;
// Get account balance
exports.router.get('/balance/:address', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const balance = yield tronService.getAccountBalance(req.params.address);
        res.json({ balance });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
// Send TRX
exports.router.post('/send', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { to, amount } = req.body;
        if (!to || !amount) {
            return res
                .status(400)
                .json({ error: 'To address and amount are required' });
        }
        const result = yield tronService.sendTransaction(to, amount);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
// Get transaction info
exports.router.get('/transaction/:txId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield tronService.getTransactionInfo(req.params.txId);
        res.json(info);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
// Deploy contract
exports.router.post('/deploy-contract', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractName } = req.body;
        if (!contractName) {
            return res.status(400).json({ error: 'Contract name is required' });
        }
        const result = yield tronService.deployContract(contractName);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
// Stock Exchange Endpoints
exports.router.post('/stock-exchange/initialize', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractAddress } = req.body;
        if (!contractAddress) {
            return res.status(400).json({ error: 'Contract address is required' });
        }
        yield tronService.initializeStockExchange(contractAddress);
        stockExchangeAddress = contractAddress;
        res.json({ message: 'Stock exchange initialized successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.post('/stock-exchange/list', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, name, price, totalSupply } = req.body;
        if (!symbol || !name || !price || !totalSupply) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const result = yield tronService.listStock(symbol, name, price, totalSupply);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.post('/stock-exchange/buy', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, amount } = req.body;
        if (!symbol || !amount) {
            return res.status(400).json({ error: 'Symbol and amount are required' });
        }
        const result = yield tronService.buyStock(symbol, amount);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.post('/stock-exchange/sell', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, amount } = req.body;
        if (!symbol || !amount) {
            return res.status(400).json({ error: 'Symbol and amount are required' });
        }
        const result = yield tronService.sellStock(symbol, amount);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.get('/stock-exchange/holdings/:symbol', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol } = req.params;
        const holdings = yield tronService.getHoldings(symbol);
        res.json(holdings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.get('/stock-exchange/transactions', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield tronService.getTransactionHistory();
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.get('/stock-exchange/transactions/:id', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const details = yield tronService.getTransactionDetails(Number(id));
        res.json(details);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.put('/stock-exchange/price', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, newPrice } = req.body;
        if (!symbol || !newPrice) {
            return res
                .status(400)
                .json({ error: 'Symbol and new price are required' });
        }
        const result = yield tronService.updateStockPrice(symbol, newPrice);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
exports.router.get('/stock-exchange/stock/:symbol', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol } = req.params;
        const details = yield tronService.getStockDetails(symbol);
        res.json(details);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})));
const PORT = config_1.config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
