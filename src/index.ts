import { TronService } from './tronService';
import { config } from './config';
import express, { Request, Response, Application } from 'express';
import cors from 'cors';

const app: Application = express();
const port = config.port || 3000;

app.use(cors());
app.use(express.json());

const tronService = new TronService();

interface BalanceParams {
  address: string;
}

interface TransactionParams {
  txId: string;
}

interface SendBody {
  to: string;
  amount: number;
}

interface DeployContractBody {
  contractName: string;
}

// Get account balance
app.get(
  '/balance/:address',
  async (req: Request<BalanceParams>, res: Response): Promise<void> => {
    try {
      const balance = await tronService.getAccountBalance(req.params.address);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get balance' });
    }
  }
);

// Send TRX
app.post(
  '/send',
  async (req: Request<{}, {}, SendBody>, res: Response): Promise<void> => {
    try {
      const { to, amount } = req.body;
      if (!to || !amount) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
      }
      const txId = await tronService.sendTransaction(to, amount);
      res.json({ txId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send transaction' });
    }
  }
);

// Get transaction info
app.get(
  '/transaction/:txId',
  async (req: Request<TransactionParams>, res: Response): Promise<void> => {
    try {
      const txInfo = await tronService.getTransactionInfo(req.params.txId);
      res.json(txInfo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get transaction info' });
    }
  }
);

// Deploy smart contract
app.post(
  '/deploy-contract',
  async (
    req: Request<{}, {}, DeployContractBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { contractName } = req.body;
      if (!contractName) {
        res.status(400).json({ error: 'Contract name is required' });
        return;
      }
      const contractAddress = await tronService.deployContract(contractName);
      res.json({
        message: 'Contract deployed successfully',
        contractAddress,
      });
    } catch (error) {
      console.error('Contract deployment error:', error);
      res.status(500).json({ error: 'Failed to deploy contract' });
    }
  }
);

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
