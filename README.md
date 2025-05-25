# Tron Simple Transaction Project

A simple TypeScript project for interacting with the Tron blockchain, allowing you to perform basic transactions and query account information.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Tron wallet with some TRX (for testnet, you can get test TRX from the Shasta faucet)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   TRON_NETWORK=shasta
   TRON_PRIVATE_KEY=your_private_key_here
   TRON_FULL_NODE=https://api.shasta.trongrid.io
   TRON_SOLIDITY_NODE=https://api.shasta.trongrid.io
   TRON_EVENT_SERVER=https://api.shasta.trongrid.io
   ```

## Usage

The project provides basic functionality for:

- Checking account balances
- Sending TRX transactions
- Querying transaction information

To run the example:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Features

- Account balance checking
- TRX transfer functionality
- Transaction information retrieval
- TypeScript support
- Environment configuration

## Security Notes

- Never commit your private keys to version control
- Always use environment variables for sensitive information
- For production use, consider using a hardware wallet or secure key management solution

## License

ISC
