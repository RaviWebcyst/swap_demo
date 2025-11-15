import {  createSlice } from "@reduxjs/toolkit";
import {
  PANCAKE_TOKEN_LIST,
  REZOR_TOKEN_LIST,
  } from "../../assets/tokens&ContractInfo/info";
import { TOKEN_DATA } from "../../interfaces/Liquidity";

export interface tokenState {
  tokenOne: TOKEN_DATA;
  tokenTwo: TOKEN_DATA;
  tokenList: TOKEN_DATA[];
  rezortokenOne: TOKEN_DATA;
  rezortokenTwo: TOKEN_DATA;
  rezortokenList: TOKEN_DATA[];
}

const initialState: tokenState = {
  tokenOne: PANCAKE_TOKEN_LIST[0],
  tokenTwo: PANCAKE_TOKEN_LIST[1],
  tokenList: PANCAKE_TOKEN_LIST,
  rezortokenOne: PANCAKE_TOKEN_LIST[0],
  rezortokenTwo: PANCAKE_TOKEN_LIST[1],
  rezortokenList: PANCAKE_TOKEN_LIST,
};

const tokenReducer = createSlice({
  name: "token",
  initialState,
  reducers: {
    setTokenOne: (state, action) => {
      state.tokenOne = action.payload;
    },
    setTokenTwo: (state, action) => {
      state.tokenTwo = action.payload;
    },
    setTokenList: (state, action) => {
      state.tokenList = action.payload;
    },
    setrezorTokenOne: (state, action) => {
      state.tokenOne = action.payload;
    },
   setrezorTokenTwo: (state, action) => {
      state.tokenTwo = action.payload;
    },
    setrezorTokenList: (state, action) => {
      state.tokenList = action.payload;
    },
    resetTokenSlice: () => initialState,
  },
});

export default tokenReducer.reducer;
export const { setTokenOne, setTokenTwo, setTokenList,setrezorTokenOne,setrezorTokenTwo,setrezorTokenList, resetTokenSlice } =
  tokenReducer.actions;
