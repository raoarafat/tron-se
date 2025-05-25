import { TronService } from './tronService';

async function deployContract() {
  try {
    const contractName = process.argv[2];
    if (!contractName) {
      throw new Error('Please provide a contract name as an argument');
    }

    const tronService = new TronService();
    const walletAddress = tronService.getAddressFromPrivateKey(
      process.env.WALLET_PRIVATE_KEY || ''
    );

    // Check wallet balance
    const balance = await tronService.getAccountBalance(walletAddress);
    console.log(`Wallet balance: ${balance} TRX`);

    if (balance < 1) {
      throw new Error(
        'Insufficient TRX balance. Please ensure you have at least 1 TRX for deployment.'
      );
    }

    console.log(`Deploying ${contractName} contract...`);

    const contractAddress = await tronService.deployContract(contractName);
    console.log('Contract deployed successfully!');
    console.log('Contract Address:', contractAddress);

    process.exit(0);
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

deployContract();
