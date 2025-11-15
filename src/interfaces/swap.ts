export interface GET_AMOUNTS_DATA {
  tokenOneAddress: string;
  tokenTwoAddress: string;
  amountIn: string;
  max?: boolean;
  dispatch: any;
  walletProvider: any;
}
