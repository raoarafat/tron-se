import * as solc from 'solc';
import * as fs from 'fs';
import * as path from 'path';

function compileContract(contractName: string) {
  try {
    console.log(`Compiling ${contractName} contract...`);

    // Read the contract source
    const contractPath = path.join(
      __dirname,
      '../contracts',
      `${contractName}.sol`
    );
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
      const errors = output.errors.filter(
        (error: any) => error.severity === 'error'
      );
      if (errors.length > 0) {
        throw new Error(
          `Compilation errors:\n${errors
            .map((e: any) => e.formattedMessage)
            .join('\n')}`
        );
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
    fs.writeFileSync(
      path.join(buildPath, `${contractName}.json`),
      JSON.stringify(
        {
          abi: contract.abi,
          bytecode: contract.evm.bytecode.object,
        },
        null,
        2
      )
    );

    console.log('Contract compiled successfully!');
    console.log(
      'ABI and bytecode saved to:',
      path.join(buildPath, `${contractName}.json`)
    );
  } catch (error) {
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
