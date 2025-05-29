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
Object.defineProperty(exports, "__esModule", { value: true });
const solc = __importStar(require("solc"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function compileContract(contractName) {
    try {
        console.log(`Compiling ${contractName} contract...`);
        // Read the contract source
        const contractPath = path.join(__dirname, '../contracts', `${contractName}.sol`);
        const source = fs.readFileSync(contractPath, 'utf8');
        // Prepare the input for solc
        const input = {
            language: 'Solidity',
            sources: {
                [`${contractName}.sol`]: {
                    content: source,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };
        // Compile the contract
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        // Check for errors
        if (output.errors) {
            const errors = output.errors.filter((error) => error.severity === 'error');
            if (errors.length > 0) {
                throw new Error(`Compilation errors:\n${errors
                    .map((e) => e.formattedMessage)
                    .join('\n')}`);
            }
        }
        // Get the compiled contract
        const contract = output.contracts[`${contractName}.sol`][contractName];
        // Create build directory if it doesn't exist
        const buildPath = path.join(__dirname, '../build');
        if (!fs.existsSync(buildPath)) {
            fs.mkdirSync(buildPath);
        }
        // Save the ABI
        fs.writeFileSync(path.join(buildPath, `${contractName}.json`), JSON.stringify({
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object,
        }, null, 2));
        console.log('Contract compiled successfully!');
        console.log('ABI and bytecode saved to:', path.join(buildPath, `${contractName}.json`));
    }
    catch (error) {
        console.error('Error compiling contract:', error);
        process.exit(1);
    }
}
// Get contract name from command line argument
const contractName = process.argv[2];
if (!contractName) {
    console.error('Please provide a contract name');
    process.exit(1);
}
compileContract(contractName);
