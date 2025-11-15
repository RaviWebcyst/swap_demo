import { createSlice } from "@reduxjs/toolkit";
import { NETWORKS } from "../../utils/constants";
import { NetworkTypes } from "../../interfaces/common";
import { BSC_CONTRACT_LIST } from "../../assets/tokens&ContractInfo/info";

export interface userState {
  walletAddress: string;
  walletType: string;
  chainValues: NetworkTypes;
  contractDetails: any;

  slippage: number;
  deadline: number;
  transactionCounter: boolean;
  importedLp: any;
  userConnected: boolean;
}

const initialState: userState = {
  walletAddress: "",
  walletType: "",
  chainValues: NETWORKS[0],
  contractDetails: BSC_CONTRACT_LIST,
  slippage:2,
  deadline: 10,
  transactionCounter: false,
  importedLp: [], 
  userConnected: false,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setUserConnected: (state, action) => {
      state.userConnected = action.payload;
    },
    setWalletType: (state, action) => {
      state.walletType = action.payload;
    },
    setChainValues: (state, action) => {
      state.chainValues = action.payload;
    },
    setContractDetails: (state, action) => {
      state.contractDetails = action.payload;
    },
  
    setSlippage: (state, action) => {
      state.slippage = action.payload;
    },
    setDeadline: (state, action) => {
      state.deadline = action.payload;
    },
    setTransactionCounter: (state, action) => {
      state.transactionCounter = action.payload;
    },
    setImportedLps: (state, action) => {
      state.importedLp = action.payload;
    },
    resetUserSlice: () => initialState,
  },
});

export default userReducer.reducer;
export const {
  setWalletAddress,
  setChainValues,
  setContractDetails,
  resetUserSlice,
  setWalletType,
  setSlippage,
  setDeadline,
  setTransactionCounter,
  setImportedLps,
  setUserConnected,
  // setRezorChainValues,
  // setRezorContractDetails

} = userReducer.actions;
