import { TronService } from './tronService';
import { config } from './config';

async function main() {
  const tronService = new TronService();

  try {
    // Example 1: Get your account balance
    const myAddress = config.privateKey
      ? tronService.getAddressFromPrivateKey(config.privateKey)
      : 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8';

    const balance = await tronService.getAccountBalance(myAddress);
    console.log(`Your balance: ${balance} TRX`);

    // Example 2: Send TRX
    const recipientAddress = 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8'; // Example recipient address
    const amount = 100; // Sending 100 TRX
    console.log(`Sending ${amount} TRX to ${recipientAddress}...`);
    const txId = await tronService.sendTransaction(recipientAddress, amount);
    console.log(`Transaction sent! TXID: ${txId}`);

    // Example 3: Get transaction info
    console.log('Getting transaction info...');
    const txInfo = await tronService.getTransactionInfo(txId);
    console.log('Transaction info:', txInfo);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
