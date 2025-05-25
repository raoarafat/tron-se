declare module 'tronweb' {
  export default class TronWeb {
    constructor(options: {
      fullHost: string;
      headers?: { [key: string]: string };
      privateKey?: string;
    });
    trx: {
      getBalance(address: string): Promise<number>;
      sendTransaction(to: string, amount: number): Promise<{ txid: string }>;
      getTransaction(txId: string): Promise<any>;
    };
    address: {
      fromPrivateKey(privateKey: string): string;
    };
    setPrivateKey(privateKey: string): void;
    contract(): any;
  }
}
