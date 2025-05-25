import express, { Request, Response, Router, RequestHandler } from 'express';
import cors from 'cors';
import { TronService } from './tronService';
import { config } from './config';

interface BalanceParams {
  address: string;
}

interface TransactionParams {
  txId: string;
}

interface HoldingsParams {
  symbol: string;
}

interface StockParams {
  symbol: string;
}

interface TransactionIdParams {
  id: string;
}

interface SendBody {
  to: string;
  amount: number;
}

interface DeployContractBody {
  contractName: string;
}

interface InitializeStockExchangeBody {
  contractAddress: string;
}

interface ListStockBody {
  symbol: string;
  name: string;
  price: number;
  totalSupply: number;
}

interface BuySellStockBody {
  symbol: string;
  amount: number;
}

interface UpdatePriceBody {
  symbol: string;
  newPrice: number;
}

const app = express();
const router = Router();
const tronService = new TronService();

app.use(cors());
app.use(express.json());

// Initialize stock exchange contract
let stockExchangeAddress: string | null = null;

// Get account balance
router.get('/balance/:address', (async (req: Request, res: Response) => {
  try {
    const balance = await tronService.getAccountBalance(req.params.address);
    res.json({ balance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

// Send TRX
router.post('/send', (async (req: Request, res: Response) => {
  try {
    const { to, amount } = req.body;
    if (!to || !amount) {
      return res
        .status(400)
        .json({ error: 'To address and amount are required' });
    }
    const result = await tronService.sendTransaction(to, amount);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

// Get transaction info
router.get('/transaction/:txId', (async (req: Request, res: Response) => {
  try {
    const info = await tronService.getTransactionInfo(req.params.txId);
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

// Deploy contract
router.post('/deploy-contract', (async (req: Request, res: Response) => {
  try {
    const { contractName } = req.body;
    if (!contractName) {
      return res.status(400).json({ error: 'Contract name is required' });
    }
    const result = await tronService.deployContract(contractName);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

// Stock Exchange Endpoints
router.post('/stock-exchange/initialize', (async (
  req: Request,
  res: Response
) => {
  try {
    const { contractAddress } = req.body;
    if (!contractAddress) {
      return res.status(400).json({ error: 'Contract address is required' });
    }
    await tronService.initializeStockExchange(contractAddress);
    stockExchangeAddress = contractAddress;
    res.json({ message: 'Stock exchange initialized successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.post('/stock-exchange/list', (async (req: Request, res: Response) => {
  try {
    const { symbol, name, price, totalSupply } = req.body;
    if (!symbol || !name || !price || !totalSupply) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await tronService.listStock(
      symbol,
      name,
      price,
      totalSupply
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.post('/stock-exchange/buy', (async (req: Request, res: Response) => {
  try {
    const { symbol, amount } = req.body;
    if (!symbol || !amount) {
      return res.status(400).json({ error: 'Symbol and amount are required' });
    }
    const result = await tronService.buyStock(symbol, amount);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.post('/stock-exchange/sell', (async (req: Request, res: Response) => {
  try {
    const { symbol, amount } = req.body;
    if (!symbol || !amount) {
      return res.status(400).json({ error: 'Symbol and amount are required' });
    }
    const result = await tronService.sellStock(symbol, amount);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.get('/stock-exchange/holdings/:symbol', (async (
  req: Request,
  res: Response
) => {
  try {
    const { symbol } = req.params;
    const holdings = await tronService.getHoldings(symbol);
    res.json(holdings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.get('/stock-exchange/transactions', (async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await tronService.getTransactionHistory();
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.get('/stock-exchange/transactions/:id', (async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const details = await tronService.getTransactionDetails(Number(id));
    res.json(details);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.put('/stock-exchange/price', (async (req: Request, res: Response) => {
  try {
    const { symbol, newPrice } = req.body;
    if (!symbol || !newPrice) {
      return res
        .status(400)
        .json({ error: 'Symbol and new price are required' });
    }
    const result = await tronService.updateStockPrice(symbol, newPrice);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

router.get('/stock-exchange/stock/:symbol', (async (
  req: Request,
  res: Response
) => {
  try {
    const { symbol } = req.params;
    const details = await tronService.getStockDetails(symbol);
    res.json(details);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

app.use('/', router);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
