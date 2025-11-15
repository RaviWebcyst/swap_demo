/**
 * this function is used to fetch balance of native currency that user's wallet hold
 * @param walletAddress wallet address of the user
 * @returns an object with original balance and balance divided by token's decimal
 */
// import Web3 from "web3";
import { store } from "../../app/store";
import {
  GET_LP_BALANCE_PARAM,
  GET_LP_BALANCE_RESP,
  TOKEN_DATA,
  TOTAL_LP_PARAM,
} from "../../interfaces/Liquidity";
import { GET_AMOUNTS_DATA } from "../../interfaces/swap";
import { zeroAddress } from "../../utils/constants";
import { cryptoDecimals, fromWeiConvert, toFixer } from "../../utils/helpers";
import { callContractGetMethod, callWeb3 } from "./contractMethods";


import { useEffect } from "react";

// Your polling function here
const useGetAmountsInterval = (data:any, interval = 10000) => {
  useEffect(() => {
    let intervalId:NodeJS.Timeout;

    const callFunction = async () => {
      const res = await getAmountsOutfunction(data);
      // console.log("getAmountsOut result:", res);
    };

    callFunction(); 

    intervalId = setInterval(callFunction, interval); // repeat

    return () => clearInterval(intervalId);

  }, [data, interval]);
};

const getNativeBalance = async (walletAddress: string, walletProvider: any) => {
  try {
    let provider = await callWeb3(walletProvider);
    let gthBalance = await provider?.eth?.getBalance(walletAddress);

    const calculatedBalance: any = cryptoDecimals(fromWeiConvert(gthBalance));

    return { res: gthBalance, calculatedBalance };
  } catch (error) {
    console.log("errorgthBalance", error);
    return 0;
  }
};

/**
 * this function is used to fetch token balances that the user's wallet hold
 * @param data it is an object that contains various params required for this function
 * address is the token address of which balance is to be found
 * wallet Address of the user
 * @returns an object with original balance and balance divided by token's decimal
 */

const getTokenBalance = async ({
  tokenData,
  dispatch,
  walletAddress,
  walletProvider,
}: {
  tokenData: TOKEN_DATA | any;
  dispatch: any;
  walletAddress: string;
  walletProvider: any;
}) => {
  try {

    console.log(tokenData?.address);
    
    const tokenBalance = await dispatch(
      callContractGetMethod(
        "balanceOf",
        [walletAddress],
        "dynamic",
        tokenData?.address,
        walletProvider
      )
    );

    const calculatedBalance: any = cryptoDecimals(
      Number(tokenBalance) / 10 ** tokenData?.decimals
    );
    return { res: tokenBalance, calculatedBalance };
  } catch (error) {
    return { res: 0, calculatedBalance: 0 };
  }
};

const getPairService = async (data: {
  tokenOneAddress: string;
  tokenTwoAddress: string;
  dispatch: any;
  walletProvider: any;
}) => {
  try {
    const contractInfo = store.getState().user.contractDetails;
    const { tokenOneAddress, tokenTwoAddress, dispatch, walletProvider } = data;
    const res: string = await dispatch(
      callContractGetMethod(
        "getPair",
        [tokenOneAddress, tokenTwoAddress],
        "factory",
        contractInfo?.factory?.address,
        walletProvider
      )
    );


    return res;
  } catch (error) {
    console.log("error", error);

    return "0";
  }
};

/**
 * this function is used to get tokens that the pair Address is made up of
 * @param pairAddress LP tokens pair address
 * @param dispatch function for handling async request
 * @returns an object containing two tokens
 */

const getTokensFromPair = async (
  pairAddress: string,
  dispatch: any,
  walletProvider: any
) => {
  try {
    const tokenA: string | undefined = await dispatch(
      callContractGetMethod("token0", [], "pair", pairAddress, walletProvider)
    );
    const tokenB: string | undefined = await dispatch(
      callContractGetMethod("token1", [], "pair", pairAddress, walletProvider)
    );
    if (tokenA && tokenB) {
      const result = { tokenA, tokenB };
      return result;
    } else {
      const result = { tokenA: zeroAddress, tokenB: zeroAddress };
      return result;
    }
  } catch (error) {
    return { tokenA: "0", tokenB: "0" };
  }
};

/**
 * this function is used to get the reserves of tokens in the pool
 * @param data it is an object that contains various params required for this function
 * tokenOneAddress this is the address of token one
 * tokenTwoAddress this is the address of token two
 * @returns reserves of two tokens in the pool
 */

const getReservesFunction = async (data: {
  tokenOneAddress: string;
  tokenTwoAddress: string;
  dispatch: any;
  walletProvider: any;
}) => {
  try {
    const { dispatch, walletProvider } = data;
    const pairAddress = await getPairService(data);
    const res = await dispatch(
      callContractGetMethod(
        "getReserves",
        [],
        "pair",
        pairAddress,
        walletProvider
      )
    );
    if (pairAddress) {
      return res;
    } else {
      return { _reserve0: 0, _reserve1: 0 };
    }
  } catch (error) {}
};

/**
 * this function is used to get tokens that the pair Address is made up of
 * @param pairAddress LP tokens pair address
 * @param dispatch function for handling async request
 * @returns an object containing two tokens
 */

const getTotalSupplyOfLp = async (data: TOTAL_LP_PARAM) => {
  const { dispatch, walletProvider } = data;
  const pairAddress: string = await getPairService(data);

  if (pairAddress != zeroAddress) {
    const totalSupply = await dispatch(
      callContractGetMethod(
        "totalSupply",
        [],
        "pair",
        pairAddress,
        walletProvider
      )
    );
    return { totalSupply, pairAddress };
  } else {
    return { pairAddress: zeroAddress, totalSupply: "0" };
  }
};

const fetchShareOfUser = async (
  pairAddress: string,
  tokenOne: string,
  tokenTwo: string,
  dispatch: any,
  totalSupply: string,
  decimalsA: number,
  decimalsB: number,
  walletProvider: any
) => {
  const { walletAddress }: { walletAddress: string } = store.getState()?.user;
  const { userLpBalance, token1Receive, token2Receive }: GET_LP_BALANCE_RESP =
    await getLPBalance({
      pairAddress,
      tokenOneAddress: tokenOne,
      tokenTwoAddress: tokenTwo,
      dispatch,
      totalSupply,
      walletAddress,
      walletProvider,
    });

  const tokenAReceive: string = toFixer(
    Number(token1Receive) / 10 ** decimalsA
  );
  const tokenBReceive: string = toFixer(
    Number(token2Receive) / 10 ** decimalsB
  );

  const share: string =
    Number(totalSupply) !== 0
      ? toFixer((Number(userLpBalance) * 100) / Number(totalSupply))
      : "0";
  return {
    share,
    tokenBReceive,
    tokenAReceive,
    userLpBalance,
  };
};

/* this function is used to fetch LP token balances that the user's wallet hold
 * @param data it is an object that contains various params required for this function
 * pairAddress is the address of two tokens of which balance is to be found
 * wallet address of the user
 * @returns LP token balance of user
 */

const getLPBalance = async (data: GET_LP_BALANCE_PARAM) => {
  try {
    const {
      pairAddress,
      dispatch,
      tokenOneAddress,
      tokenTwoAddress,
      walletAddress,
      totalSupply,
      walletProvider,
    } = data;
    const userLpBalance = await dispatch(
      callContractGetMethod(
        "balanceOf",
        [walletAddress],
        "pair",
        pairAddress,
        walletProvider
      )
    );

    const tokenABalance = await dispatch(
      callContractGetMethod(
        "balanceOf",
        [pairAddress],
        "dynamic",
        tokenOneAddress,
        walletProvider
      )
    );
    const tokenBBalance = await dispatch(
      callContractGetMethod(
        "balanceOf",
        [pairAddress],
        "dynamic",
        tokenTwoAddress,
        walletProvider
      )
    );

    const token1Receive = (
      (userLpBalance * tokenABalance) /
      Number(totalSupply)
    ).toString();
    const token2Receive = (
      (userLpBalance * tokenBBalance) /
      Number(totalSupply)
    ).toString();
    return { userLpBalance, token1Receive, token2Receive };
  } catch (error) {
    return { userLpBalance: "0", token1Receive: "0", token2Receive: "0" };
  }
};

/**
 * this function is used to get optimal value of second asset, given input value of first asset
 * @param data it is an object that contains various params required for this function
 * amountIn is the input value
 * tokenOneAddress is the token address of first token
 * tokenTwoAddress is the token address of second token
 * max is boolean value to check if user has choosen max token amount or not from its wallet
 * @returns an array of two values first one being the input value and second one being the optimal value
 */

const getAmountsOutfunction = async (data: GET_AMOUNTS_DATA) => {
  try {
    const list = store.getState()?.user?.contractDetails;
    const {
      amountIn,
      tokenOneAddress,
      tokenTwoAddress,
      dispatch,
      walletProvider,
    } = data;

    const path = [tokenOneAddress, tokenTwoAddress];
    let res1 = await dispatch(
      callContractGetMethod(
        "getAmountsOut",
        [amountIn, path],
        "router",
        list?.router?.address,
        walletProvider
      )
    );

   
    let res2 =  await dispatch(
      callContractGetMethod(
        "getAmountsOut",
        [amountIn, path],
        "panRouter",
        list?.panRouter?.address,
        walletProvider
      )
    );


    let res = res1;
    if(Number(res2[1]) > Number(res1[1])){
      res = res2;
    }

    

    return res;
  } catch (error) {
    return ["0", "0"];
  }
};

/**
 * this function is used to get optimal value of first asset, given input value of second asset
 * @param data it is an object that contains various params required for this function
 * amountIn is the input value
 * tokenOneAddress is the token address of first token
 * tokenTwoAddress is the token address of second token
 * max is boolean value to check if user has choosen max token amount or not from its wallet
 * @returns an array of two values first one being the optimal value and second one being the input value
 */

const getAmountsInfunction = async (data: GET_AMOUNTS_DATA) => {
  try {
    const list = store.getState()?.user?.contractDetails;
    const {
      amountIn,
      tokenOneAddress,
      tokenTwoAddress,
      dispatch,
      walletProvider,
    } = data;
    const path = [tokenOneAddress, tokenTwoAddress];
    const res = await dispatch(
      callContractGetMethod(
        "getAmountsIn",
        [amountIn, path],
        "router",
        list?.router?.address,
        walletProvider
      )
    );
    return res;
  } catch (error) {
    return 0;
  }
};

const getPriceImpact = async (
  inputTwo: string,
  tokenOneAddress: string,
  tokenTwoAddress: string,
  dispatch: any,
  walletProvider: any
) => {
  const pairAddress = await getPairService({
    tokenOneAddress,
    tokenTwoAddress,
    dispatch,
    walletProvider,
  });
  if (pairAddress != zeroAddress) {
    const { tokenA, tokenB }: { tokenA: string; tokenB: string } =
      await getTokensFromPair(pairAddress, dispatch, walletProvider);

    const { _reserve0, _reserve1 } = await getReservesFunction({
      tokenOneAddress,
      tokenTwoAddress,
      dispatch,
      walletProvider,
    });

    if (tokenA == tokenTwoAddress) {
      const priceImpact = (Number(inputTwo) / _reserve0) * 100;

      return priceImpact.toString();
    } else {
      const priceImpact = (Number(inputTwo) / _reserve1) * 100;

      return priceImpact.toString();
    }
  } else {
    return "0";
  }
};

export {
  getNativeBalance,
  getTokenBalance,
  getPairService,
  getTokensFromPair,
  getReservesFunction,
  getTotalSupplyOfLp,
  fetchShareOfUser,
  getAmountsOutfunction,
  getAmountsInfunction,
  getPriceImpact,
  useGetAmountsInterval
};
