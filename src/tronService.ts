import TronWeb from 'tronweb';
import { config } from './config';
import * as fs from 'fs';
import * as path from 'path';

export class TronService {
  protected tronWeb: TronWeb;

  constructor() {
    this.tronWeb = new TronWeb({
      fullHost: config.fullNode,
      headers: { 'TRON-PRO-API-KEY': config.apiKey },
    });

    // Only set private key if it exists
    if (config.privateKey) {
      this.tronWeb.setPrivateKey(config.privateKey);
    }
  }

  getAddressFromPrivateKey(privateKey: string): string {
    return this.tronWeb.address.fromPrivateKey(privateKey);
  }

  async getAccountBalance(address: string): Promise<number> {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return balance / 1e6; // Convert from SUN to TRX
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async sendTransaction(toAddress: string, amount: number): Promise<string> {
    try {
      const transaction = await this.tronWeb.trx.sendTransaction(
        toAddress,
        amount * 1e6
      ); // Convert TRX to SUN
      return transaction.txid;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async getTransactionInfo(txId: string): Promise<any> {
    try {
      const transaction = await this.tronWeb.trx.getTransaction(txId);
      return transaction;
    } catch (error) {
      console.error('Error getting transaction info:', error);
      throw error;
    }
  }

  async deployContract(contractName: string): Promise<string> {
    try {
      // Read contract ABI and bytecode
      const contractPath = path.join(
        __dirname,
        '../../contracts',
        `${contractName}.sol`
      );
      const contractSource = fs.readFileSync(contractPath, 'utf8');

      // Compile contract
      const compiledContract = await this.tronWeb.contract().new({
        abi: this.getContractABI(contractName),
        bytecode: this.getContractBytecode(contractName),
        feeLimit: 1000000000,
        callValue: 0,
        parameters: [],
      });

      return compiledContract.address;
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  }

  private getContractABI(contractName: string): any[] {
    // This is a simplified version. In a real application, you would use a proper compiler
    if (contractName === 'SimpleToken') {
      return [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
          ],
          name: 'allowance',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'decimals',
          outputs: [
            {
              internalType: 'uint8',
              name: '',
              type: 'uint8',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transfer',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
    }
    throw new Error(`Contract ABI not found for ${contractName}`);
  }

  private getContractBytecode(contractName: string): string {
    // This is a simplified version. In a real application, you would use a proper compiler
    if (contractName === 'SimpleToken') {
      return '608060405234801561001057600080fd5b50604080518082018252600b81526a53696d706c6520546f6b656e60a81b6020808301918252835180850190945260038085526214d3d360ea1b9185019190915282519293926100629291906100c9565b5080516100769060049060208401906100c9565b50506005805460ff19166012179055506001600655610164565b82805461009c90610129565b90600052602060002090601f0160209004810192826100be5760008555610104565b82601f106100d757805160ff1916838001178555610104565b82800160010185558215610104579182015b828111156101045782518255916020019190600101906100e9565b50610110929150610114565b5090565b5b808211156101105760008155600101610115565b600181811c9082168061013d57607f821691505b6020821081141561015e57634e487b7160e01b600052602260045260246000fd5b50919050565b6108a7806101736000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063313ce567146100ae57806370a08231146100cd57806395d89b41146100f6578063a0712d68146100fe578063a457c2d714610113578063a9059cbb14610126578063dd62ed3e14610139578063e7a324dc1461014c578063f1127ed814610173575b600080fd5b6100b66101b0565b60405160ff90911681526020015b60405180910390f35b6100e06100db3660046106f6565b6101c5565b6040516100c49190610711565b6100e06101e0565b61011161010c366004610745565b6101ef565b005b61011161012136600461075e565b6101fc565b61011161013436600461075e565b61021d565b6100e061014736600461078a565b610235565b6100e07f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a86681565b6101866101813660046107bd565b610260565b60408051825163ffffffff1681526020928301516001600160e01b031692810192909252016100c4565b60055460ff165b60405190151581526020016100c4565b6001600160a01b031660009081526020819052604090205490565b6060600480546101ef9061080d565b80601f016020809104026020016040519081016040528092919081815260200182805461021b9061080d565b80156102685780601f1061023d57610100808354040283529160200191610268565b820191906000526020600020905b81548152906001019060200180831161024b57829003601f168201915b5050505050905090565b60003361027d8185856102a1565b5060019392505050565b6000336102958582856103c5565b6102a085858561043f565b506001949350505050565b6001600160a01b0383166103035760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084015b60405180910390fd5b6001600160a01b0382166103645760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360e81b60648201526084016102fa565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610439578181101561042c5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016102fa565b61043984848484036102a1565b50505050565b6001600160a01b0383166104a35760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016102fa565b6001600160a01b0382166105055760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016102fa565b6001600160a01b0383166000908152602081905260409020548181101561057d5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016102fa565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906105b490849061085e565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161060091815260200190565b60405180910390a3610439565b80356001600160a01b038116811461062457600080fd5b919050565b60006020828403121561063b57600080fd5b6106448261060d565b9392505050565b6000806040838503121561065e57600080fd5b6106678361060d565b91506106756020840161060d565b90509250929050565b60008060006060848603121561069357600080fd5b61069c8461060d565b92506106aa6020850161060d565b9150604084013590509250925092565b600080604083850312156106cd57600080fd5b6106d68361060d565b946020939093013593505050565b6000602082840312156106f657600080fd5b5035919050565b60006020828403121561070857600080fd5b6106448261060d565b600060208083528351808285015260005b8181101561073e57858101830151858201604001528201610722565b81811115610750576000604083870101525b50601f01601f1916929092016040019392505050565b60006020828403121561075757600080fd5b5051919050565b6000806040838503121561077157600080fd5b61077a8361060d565b91506106756020840161060d565b600080604083850312156107d757600080fd5b823563ffffffff811681146107eb57600080fd5b915060208301356001600160e01b03198116811461078f57600080fd5b600181811c9082168061082157607f821691505b6020821081141561084257634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561087157610871610848565b50019056fea2646970667358221220f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f64736f6c634300080c0033';
    }
    throw new Error(`Contract bytecode not found for ${contractName}`);
  }
}
