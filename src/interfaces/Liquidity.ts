import { MODAL_STATE } from "./common";

export interface GET_RESERVES {
  tokenOneAddress: string;
  tokenTwoAddress: string;
  input1: string | number;
  input2: string | number;
  selectedField: string;
  max: boolean;
  dispatch: any;
  walletProvider: any;
}

export interface TOKEN_DATA {
  icon: string| undefined;
  name: string;
  address: string;
  isNative: boolean;
  decimals: number;
  symbol: string;
}

export interface GET_LP_BALANCE_RESP {
  userLpBalance: string;
  token1Receive: string;
  token2Receive: string;
}

export interface GET_LP_BALANCE_PARAM {
  pairAddress: string;
  dispatch: any;
  tokenOneAddress: string;
  tokenTwoAddress: string;
  walletAddress: string;
  totalSupply: string;
  walletProvider: any;
}

export interface TOTAL_LP_PARAM {
  dispatch: any;
  tokenOneAddress: string;
  tokenTwoAddress: string;
  walletProvider: any;
}

export interface TOTAL_LP_RESP {
  totalSupply: string;
  pairAddress: string;
}

export interface SHARE_RESP {
  share: string;
  tokenBReceive: string;
  tokenAReceive: string;
  userLpBalance: string;
}

export interface REMOVE_LIQUIDITY_SIG {
  walletAddress: string;
  pairAddress: string;
  liquidity: string;
  deadLine: number;
  dispatch: any;
  walletProvider: any;
}
export interface PERMIT_SIG {
  r: string;
  v: number;
  s: string;
  _vs: string;
  recoveryParam: number;
}
export interface LP_DATA {
  tokenBReceive: string;
  tokenAReceive: string;
  userLpBalance: string;
}
