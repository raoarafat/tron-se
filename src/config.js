"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = [
    'TRON_NETWORK',
    'TRON_FULL_NODE',
    'TRON_SOLIDITY_NODE',
    'TRON_EVENT_SERVER',
    'TRON_GRID_API_KEY',
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
exports.config = {
    // Server config
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    // Tron network config
    network: process.env.TRON_NETWORK,
    fullNode: process.env.TRON_FULL_NODE,
    solidityNode: process.env.TRON_SOLIDITY_NODE,
    eventServer: process.env.TRON_EVENT_SERVER,
    tronGridApiKey: process.env.TRON_GRID_API_KEY,
    // Wallet config
    privateKey: process.env.WALLET_PRIVATE_KEY,
    walletAddress: process.env.WALLET_ADDRESS,
    // Contract config
    contractAddress: process.env.CONTRACT_ADDRESS,
    // Security
    jwtSecret: process.env.JWT_SECRET,
    apiKey: process.env.API_KEY,
    // Database config
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '27017'),
        name: process.env.DB_NAME || 'tron_db',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
};
