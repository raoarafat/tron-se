# Tron Stock Exchange

A decentralized stock exchange built on the Tron blockchain network.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Tron wallet with test TRX (for Shasta testnet)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd tron-se
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
WALLET_PRIVATE_KEY=your_private_key_here
TRON_FULL_NODE=https://api.shasta.trongrid.io
TRON_NETWORK=shasta
TRONGRID_API_KEY=your_trongrid_api_key
```

## Building

1. Compile the smart contracts:

```bash
# Compile StockExchange contract
npm run compile StockExchange

# Or compile all contracts
npm run compile-all
```

2. Build the TypeScript code:

```bash
npm run build
```

## Deployment

1. Deploy the StockExchange contract:

```bash
npm run deploy StockExchange
```

This will return a contract address. Save this address for later use.

2. Initialize the stock exchange:

```bash
curl -X POST http://localhost:3000/stock-exchange/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "your_contract_address_here"
  }'
```

## Running the Server

Start the server:

```bash
npm run start
```

The server will start on port 3000 by default.

## API Endpoints

### Tron Operations

1. Get Account Balance

```bash
curl http://localhost:3000/balance/your_address_here
```

2. Send TRX

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "toAddress": "recipient_address",
    "amount": 100
  }'
```

3. Get Transaction Info

```bash
curl http://localhost:3000/transaction/your_transaction_id
```

### Stock Exchange Operations

1. List a New Stock

```bash
curl -X POST http://localhost:3000/stock-exchange/list \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150,
    "totalSupply": 1000000
  }'
```

2. Buy Stock

```bash
curl -X POST http://localhost:3000/stock-exchange/buy \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "amount": 10
  }'
```

3. Sell Stock

```bash
curl -X POST http://localhost:3000/stock-exchange/sell \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "amount": 5
  }'
```

4. Get Holdings

```bash
curl http://localhost:3000/stock-exchange/holdings/AAPL
```

5. Get Transaction History

```bash
curl http://localhost:3000/stock-exchange/transactions
```

6. Get Transaction Details

```bash
curl http://localhost:3000/stock-exchange/transactions/1
```

7. Update Stock Price

```bash
curl -X PUT http://localhost:3000/stock-exchange/price \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "newPrice": 160
  }'
```

8. Get Stock Details

```bash
curl http://localhost:3000/stock-exchange/stock/AAPL
```

## Getting Test TRX

For testing on Shasta testnet:

1. Visit [Shasta Faucet](https://www.trongrid.io/faucet)
2. Enter your Tron wallet address
3. Request test TRX

## Development

1. Run tests:

```bash
npm test
```

2. Run linter:

```bash
npm run lint
```

## Troubleshooting

1. If you get "insufficient TRX" errors:

   - Make sure you have enough test TRX in your wallet
   - Use the Shasta faucet to get more test TRX

2. If contract deployment fails:

   - Check your private key in .env
   - Ensure you have enough TRX for deployment
   - Verify the TronGrid API key is valid

3. If API calls fail:
   - Ensure the server is running
   - Check that the contract is properly initialized
   - Verify the contract address is correct

## License

MIT
