import { TronService } from './tronService';

async function deployContract() {
  try {
    const tronService = new TronService();
    console.log('Deploying SimpleToken contract...');

    const contractAddress = await tronService.deployContract('SimpleToken');
    console.log('Contract deployed successfully!');
    console.log('Contract Address:', contractAddress);

    process.exit(0);
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

deployContract();
