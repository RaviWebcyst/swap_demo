import { TOKEN_DATA } from "./Liquidity";

export interface BALANCE_HOOK {
  tokenBalance: {
    token1Balance: number;
    token1BalanceConverted: number;
    token2Balance: number;
    token2BalanceConverted: number;
  };
  fetchData: () => Promise<void>;
}

export interface INPUTS {
  inputValue: string;
  convertedValue: string;
  toolTipValue?: string;
}

export interface NetworkTypes {
  name: string;
  currency: string;
  chainId: number;
  chainIdHex: string;
  symbol: string;
  icon: string;
  explorerUrl: string;
  rpcUrl: string;
  decimals: number;
  label: string;
}
export interface MODAL_STATE {
  status: "success" | "failed" | "in-progress" | "";
  bodyText: string;
  title: string;
  txHash: string | null;
}
export interface DOLLAR_VAL {
  token0: number | string;
  token1?: number | string;
}
export interface DAYS_TO_VALUE_MAP {
  [days: number]: number;
}

export interface TOKEN_DETAILS {
  tokenA?: string;
  tokenB?: string;
  tokenASymbol?: string;
  tokenBSymbol?: string;
  isTokenOneNative: boolean;
  isTokenTwoNative?: boolean;
  tokenOneAddress?: string;
  tokenTwoAddress?: string;
  tokenOneData?: TOKEN_DATA;
  tokenTwoData?: TOKEN_DATA;
}

export interface LP_TO_RECEIVE {
  token1: string;
  token2: string;
}
