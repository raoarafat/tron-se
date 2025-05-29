import { TronService } from './tronService';
import { config } from './config';
import express from 'express';
import cors from 'cors';
import { router } from './server';

const app = express();
const port = config.port || 3000;
const tronService = new TronService();

app.use(cors());
app.use(express.json());
app.use('/', router);

async function startServer() {
  try {
    // Get your account balance
    const myAddress = config.privateKey
      ? tronService.getAddressFromPrivateKey(config.privateKey)
      : 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8';

    const balance = await tronService.getAccountBalance(myAddress);
    console.log(`Your balance: ${balance} TRX`);
    console.log('Your wallet address:', myAddress);
    console.log('\nAvailable commands:');
    console.log('1. Check balance: GET /balance/:address');
    console.log(
      '2. Send TRX: POST /send { "to": "address", "amount": number }'
    );
    console.log('3. Get transaction info: GET /transaction/:txId');
    console.log(
      '4. Deploy contract: POST /deploy-contract { "contractName": "name" }'
    );
    console.log('\nStock Exchange commands:');
    console.log(
      '5. Initialize stock exchange: POST /stock-exchange/initialize { "contractAddress": "address" }'
    );
    console.log(
      '6. List stock: POST /stock-exchange/list { "symbol": "string", "name": "string", "price": number, "totalSupply": number }'
    );
    console.log(
      '7. Buy stock: POST /stock-exchange/buy { "symbol": "string", "amount": number }'
    );
    console.log(
      '8. Sell stock: POST /stock-exchange/sell { "symbol": "string", "amount": number }'
    );
    console.log('9. Get holdings: GET /stock-exchange/holdings/:symbol');
    console.log('10. Get transactions: GET /stock-exchange/transactions');
    console.log(
      '11. Get transaction details: GET /stock-exchange/transactions/:id'
    );
    console.log(
      '12. Update stock price: PUT /stock-exchange/price { "symbol": "string", "newPrice": number }'
    );
    console.log('13. Get stock details: GET /stock-exchange/stock/:symbol');

    // Start the server
    app.listen(port, () => {
      console.log(`\nServer running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

startServer();
