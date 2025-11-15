/**
 * helper function to calculate reserves of a particular pool
 * @param data it is an object that contains various params required for this function
 * address of the token in the first input field
 * address of the token in the second input field
 * input value that user has entered in the first input field
 * input value that user has entered in the second input field
 * first input field out of the two fields in which user has entered value
 * boolean variable to check if user has clicked on max button or not
 * @returns reserves of the token in the input field that user has not selected
 */

import moment from "moment";
import { store } from "../../app/store";
import { zeroAddress } from "../../utils/constants";
import {
  calculateDeadlineHelper,
  fromWeiConvert,
  localeStringFunction,
  slicedValue,
} from "../../utils/helpers";
import {
  getPairService,
  getReservesFunction,
  getTokensFromPair,
} from "../contractServices/contractCallServices";
import {
  callContractGetMethod,
  callContractSendMethod,
} from "../contractServices/contractMethods";
import { calculateGasPrice } from "../contractServices/PancakeContractServices";

const getReservesHelper = async (data: any) => {
  const {
    tokenOneAddress,
    tokenTwoAddress,
    input1,
    input2,
    selectedField,
    max,
    dispatch,
    walletProvider,
  } = data;

  const convertedAmountOne = max ? input1?.toString() : input1;
  const convertedAmountTwo = max ? input2?.toString() : input2;

  const pairAddress = await getPairService({
    tokenOneAddress,
    tokenTwoAddress,
    dispatch,
    walletProvider,
  });
  if (pairAddress == zeroAddress || pairAddress == undefined) {
    return "firstLiquidity";
  }

  const { tokenA, tokenB }: { tokenA: string; tokenB: string } | any =
    await getTokensFromPair(pairAddress, dispatch, walletProvider);

  const { _reserve0, _reserve1 } = await getReservesFunction({
    tokenOneAddress,
    tokenTwoAddress,
    dispatch,
    walletProvider,
  });
  let res;
  if (_reserve0 == 0 && _reserve1 == 0) {
    return "firstLiquidity";
  }
  if (selectedField == "TK1") {
    if (tokenOneAddress?.toLowerCase() == tokenA?.toLowerCase()) {
      res = slicedValue(
        localeStringFunction(convertedAmountOne * (_reserve1 / _reserve0))
      );

      return res;
    } else {
      res = slicedValue(
        localeStringFunction(convertedAmountOne * (_reserve0 / _reserve1))
      );

      return res;
      
    }
  } else if (selectedField == "TK2") {
    if (tokenTwoAddress?.toLowerCase() == tokenA?.toLowerCase()) {
      res = slicedValue(
        localeStringFunction(convertedAmountTwo * (_reserve1 / _reserve0))
      );
      return res;
    } else {
      res = slicedValue(
        localeStringFunction(convertedAmountTwo * (_reserve0 / _reserve1))
      );
      return res;
    }
  }
};

/**
 * helper function to handle add Liquidity both with native coin and custom tokens
 * @param dispatch hook to update values in redux
 * @param tokenDetails memoized variable for token related details
 * @param walletAddress user address
 * @param inputOne input in the first field
 * @param inputTwo input in the second field
 * @param getBackToOriginalState function to update value when a transaction occurs
 * @returns based on the output it returns success,failure or error
 */

const addLiquidityHelperFunction = async (
  dispatch: any,
  tokenDetails: any,
  inputOne: any,
  inputTwo: any,
  walletProvider: any,
  setModalData: any
) => {
  try {
    const { walletAddress, slippage, deadline } = store?.getState()?.user;

    let deadLine = await calculateDeadlineHelper(deadline);

    let currentTime = new Date();
    let deadLinetime = moment(currentTime).unix();
    if (deadLine <= deadLinetime) {
      deadLine = await calculateDeadlineHelper();
    }
    if (tokenDetails?.isTokenOneNative || tokenDetails?.isTokenTwoNative) {
      const customToken = tokenDetails?.isTokenOneNative
        ? tokenDetails?.tokenTwoAddress
        : tokenDetails?.tokenOneAddress;
      const data1 = {
        customToken,
        dispatch,
        tokenOneAddress: tokenDetails?.tokenOneAddress,
        tokenTwoAddress: tokenDetails?.tokenTwoAddress,
        walletAddress,
        inputOne,
        inputTwo,
        walletProvider,
      };

      console.log("data1",data1);
      
      setModalData({
        title: "Approval",
        bodyText: `Please confirm approval for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
        status: "in-progress",
        txHash: null,
      });

      const res = await getAllowanceAndApprovalHelper(data1);
      const amountTokenMin = tokenDetails?.isTokenOneNative
        ? slicedValue(
            localeStringFunction(
              inputTwo?.convertedValue -
                (inputTwo?.convertedValue * slippage) / 100
            )
          )
        : slicedValue(
            localeStringFunction(
              inputOne?.convertedValue -
                (inputOne?.convertedValue * slippage) / 100
            )
          );
      const amountTokenETHMin = tokenDetails?.isTokenOneNative
        ? slicedValue(
            localeStringFunction(
              inputOne?.convertedValue -
                (inputOne?.convertedValue * slippage) / 100
            )
          )
        : slicedValue(
            localeStringFunction(
              inputTwo?.convertedValue -
                (inputTwo?.convertedValue * slippage) / 100
            )
          );

      if (res) {
        setModalData({
          title: "Approval",
          bodyText: `Approval success for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "success",
          txHash: null,
        });
        setTimeout(() => {}, 2000);
        setModalData({
          title: "Add Liquidity",
          bodyText: `Please confirm transaction for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "in-progress",
          txHash: null,
        });

        const result = await addLiquidityEthService({
          inputOne: tokenDetails?.isTokenOneNative
            ? inputOne?.convertedValue
            : inputTwo?.convertedValue,
          inputTwo: tokenDetails?.isTokenTwoNative
            ? inputOne?.convertedValue
            : inputTwo?.convertedValue,
          tokenOneAddress: customToken,
          amountTokenMin,
          amountTokenETHMin,
          walletAddress,
          deadLine,
          dispatch,
          walletProvider,
        });

        
        if (
          !result?.code &&
          result?.code != 4001 &&
          result?.code != -32603 &&
          result?.code != 5000 &&
          result?.transactionHash
        ) {
        
          setModalData({
            title: "Add Liquidity",
            bodyText: `Transaction successful for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
            status: "success",
            txHash: result?.transactionHash,
          });
          return result?.transactionHash;
        } else if (
          result?.code == undefined ||
          result?.code == 4001 ||
          result?.code == -32603 ||
          result?.code == 5000
        ) {
          setModalData({
            title: "Add Liquidity",
            bodyText: result?.message.split("{")[0]
              ? result?.message.split("{")[0]
              : result?.message.split(":")[0],
            status: "failed",
            txHash: null,
          });
         
          return false;
        }
      } else {
        setModalData({
          title: "Approval",
          bodyText: `Approval Failed for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "failed",
          txHash: null,
        });
      }
    } else {
      const data2 = {
        customToken: 0,
        walletAddress,
        tokenOneAddress: tokenDetails?.tokenOneAddress,
        tokenTwoAddress: tokenDetails?.tokenTwoAddress,
        dispatch,
        inputOne,
        inputTwo,
        walletProvider,
      };
      setModalData({
        title: "Approval",
        bodyText: `Please confirm approval for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
        status: "in-progress",
        txHash: null,
      });
      const res = await getAllowanceAndApprovalHelper(data2);
      const amountTokenAMin = slicedValue(
        localeStringFunction(
          inputOne?.convertedValue - (inputOne?.convertedValue * slippage) / 100
        )
      );

      const amountTokenBMin = slicedValue(
        localeStringFunction(
          inputTwo?.convertedValue - (inputTwo?.convertedValue * slippage) / 100
        )
      );

      if (res) {
        setModalData({
          title: "Approval",
          bodyText: `Approval success for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "success",
          txHash: null,
        });
        setTimeout(() => {}, 2000);

        setModalData({
          title: "Add Liquidity",
          bodyText: `Please confirm transaction for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "in-progress",
          txHash: null,
        });
        const result = await addLiquidityService({
          tokenOneAddress: tokenDetails?.tokenOneAddress,
          tokenTwoAddress: tokenDetails?.tokenTwoAddress,
          amountTokenADesired: inputOne?.convertedValue,
          amountTokenBDesired: inputTwo?.convertedValue,
          amountTokenAMin:
            inputOne?.convertedValue < 100000000000000000 ? 0 : amountTokenAMin,
          amountTokenBMin:
            inputOne?.convertedValue < 100000000000000000 ? 0 : amountTokenBMin,
          walletAddress,
          deadLine,
          dispatch,
          walletProvider,
        });

        console.log(result,'result');
        
        if (
          !result?.code &&
          result?.code != 4001 &&
          result?.code != -32603 &&
          result?.code != 5000 &&
          result?.transactionHash
        ) {
          setModalData({
            title: "Liquidity Success",
            bodyText: `Transaction successful for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
            status: "success",
            txHash: result?.transactionHash,
          });
          return result?.transactionHash;
        } else if (
          result?.code == undefined ||
          result?.code == 4001 ||
          result?.code == -32603 ||
          result?.code == 5000
        ) {
          setModalData({
            title: "Liquidity failed",
            bodyText: result?.message.split("{")[0]
              ? result?.message.split("{")[0]
              : result?.message.split(":")[0],
            status: "failed",
            txHash: null,
          });
          return false;
        }
      } else {
        setModalData({
          title: "Approval",
          bodyText: `Approval Failed for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "failed",
          txHash: null,
        });
        return false;
      }
    }
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

/**
 * common function for both approval and allowance of tokens
 * @param data it is an object that contains various params required for this function
 * token other than native token
 * dispatch function
 * address of tokenOne,
 * address of tokenTwo,
 * walletAddress of user,
 * input value that user has entered in the first input field,
 * input value that user has entered in the second input field,
 * boolean indicating whether allowance os for swap or liquidity,
 * @returns boolean describing the result of the call
 */
const getAllowanceAndApprovalHelper = async (data: any) => {
  try {
    const {
      customToken,
      dispatch,
      tokenOneAddress,
      tokenTwoAddress,
      walletAddress,
      inputOne,
      inputTwo,
      swap,
      walletProvider,
      spender,
      contract_address
    } = data;
    let allowanceResultA = 0;
    let allowanceResultB = 0;
    const list = store.getState()?.user?.contractDetails;
    

    // var cont_address = list?.panCakeSwap?.address;
    var cont_address = contract_address;
    if(window.location.pathname == "/liquidity"){
      cont_address = list?.router?.address;
    }

    if (customToken) {
      allowanceResultB = await getTokenAllowance({
        tokenAddress: customToken,
        dispatch,
        spender: spender ? spender : cont_address,
        walletAddress,
        walletProvider,
      });
      allowanceResultB = Number(fromWeiConvert(allowanceResultB).split(".")[0]);
    
      if (Number(allowanceResultB) > Number(inputOne?.inputValue)) return true;
      else {
        const approval = await getTokenApproval({
          tokenAddress: customToken,
          dispatch,
          walletAddress,
          spender: spender ? spender : cont_address,
          walletProvider,
        });
        const result = approval?.code != 4001 ? true : false;
        return result;
      }
    } else {
      allowanceResultA = await getTokenAllowance({
        tokenAddress: tokenOneAddress,
        dispatch,
        walletAddress,
        spender: cont_address,
        walletProvider,
      });

      allowanceResultB = await getTokenAllowance({
        tokenAddress: tokenTwoAddress,
        dispatch,
        walletAddress,
        spender: cont_address,
        walletProvider,
      });

      allowanceResultA = Number(fromWeiConvert(allowanceResultA).split(".")[0]);
      allowanceResultB = Number(fromWeiConvert(allowanceResultB).split(".")[0]);

      if (
        (Number(allowanceResultA) > Number(inputOne?.inputValue) &&
          Number(allowanceResultB) > Number(inputTwo?.inputValue) &&
          !swap) ||
        (swap && Number(allowanceResultA) > Number(inputOne?.inputValue))
      ) {
        return true;
      } else if (
        (!Number(allowanceResultA) &&
          Number(allowanceResultB) > Number(inputTwo?.inputValue) &&
          !swap) ||
        (swap && !Number(allowanceResultA))
      ) {
        const approval = await getTokenApproval({
          tokenAddress: tokenOneAddress,
          dispatch,
          walletAddress,
          spender: cont_address,
          walletProvider,
        });
        const result = approval?.code != 4001 ? true : false;
        return result;
      } else if (
        Number(allowanceResultA) > Number(inputOne?.inputValue) &&
        !Number(allowanceResultB) &&
        !swap
      ) {
        const approval = await getTokenApproval({
          tokenAddress: tokenTwoAddress,
          dispatch,
          walletAddress,
          spender: cont_address,
          walletProvider,
        });
        const result = approval?.code != 4001 ? true : false;
        return result;
      } else {
        let approval1;
        let approval2;
        approval1 = await getTokenApproval({
          tokenAddress: tokenOneAddress,
          dispatch,
          walletAddress,
          spender: cont_address,
          walletProvider,
        });
        if (!swap) {
          approval2 = await getTokenApproval({
            tokenAddress: tokenTwoAddress,
            dispatch,
            walletAddress,
            spender: cont_address,
            walletProvider,
          });
        }
        const result =
          approval1?.code != 4001 && approval2?.code != 4001 && !swap
            ? true
            : approval1 && swap
            ? true
            : false;
        return result;
      }
    }
  } catch (error) {
    return false;
  }
};
/**
 * this function is used to fetch token allowance for a particular walletAddress
 * @param data it is an object that contains various params required for this function
 * tokenAddress is the token address of which allowance is to be found
 * wallet Address of the user
 * @returns allowance
 */

const getTokenAllowance = async (data: any) => {
  try {
    const { tokenAddress, dispatch, walletAddress, walletProvider, spender } =
      data;
      

    const res = await dispatch(
      callContractGetMethod(
        "allowance",
        [walletAddress, spender],
        "dynamic",
        tokenAddress,
        walletProvider
      )
    );
    return res;
  } catch (error) {
    return 0;
  }
};

const getTokenApproval = async (data: any) => {
  try {
    const { tokenAddress, dispatch, walletAddress, walletProvider, spender } =
      data;
    const list = store.getState()?.user?.contractDetails;
    const gasPrice =  await calculateGasPrice(walletProvider);

    const res = await dispatch(
      callContractSendMethod(
        "approve",
        [spender, "0xfffffffffffffffffffffff"],
        walletAddress,
        "dynamic",
        undefined,
        tokenAddress,
        walletProvider,
        gasPrice
      )
    );
    return res;
  } catch (error) {
   
    return 0;
  }
};

/**
 * this is a helper function for adding liquidity in a pool for one custom token and one native token
 * @param data it is an object that contains various params required for this function
 * inputOne is the input amount of tokenA
 * inputTwo is the input amount of tokenB
 * tokenOneAddress is the address of token One
 * amountTokenMin is the minimum amount of custom token that user will add in the pool
 * amountTokenETHMin is the minimum amount of native token that user will add in the pool
 * walletAddress is user's wallet address
 * deadline is the epoch time after which the transaction will revert
 * @returns add liquidity transaction status
 */

const addLiquidityEthService = async (data: any) => {
  const list = store.getState()?.user?.contractDetails;
  try {
    const {
      inputOne,
      inputTwo,
      tokenOneAddress,
      amountTokenMin,
      amountTokenETHMin,
      deadLine,
      dispatch,
      walletAddress,
      walletProvider,
    } = data;

    console.log(data,"data");
    

    const gasPrice =  await calculateGasPrice(walletProvider);
    var cont_address = list?.panCakeSwap?.address;
    if(window.location.pathname == "/liquidity"){
      cont_address = list?.router?.address;
    }

    // console.log(cont_address,"cont_address");
    

    console.log(tokenOneAddress,"tokenOneAddress");
    
    const res = await dispatch(
      callContractSendMethod(
        "addLiquidityETH",
        [
          tokenOneAddress,
          inputTwo?.toString(),
          amountTokenMin?.toString(),
          amountTokenETHMin?.toString(),
          walletAddress,
          deadLine,
        ],
        walletAddress,
        "pancakeSwap",
        inputOne?.toString(),
        cont_address,
        walletProvider,
        gasPrice
      )
    );

    return res;
  } catch (error) {
    return error;
  }
};

/**
 * this is a helper function for adding liquidity in a pool for two custom tokens
 * @param data it is an object that contains various params required for this function
 * tokenOneAddress is the address of token One
 * tokenTwoAddress is the address of token Two
 * amountTokenADesired is the input amount of tokenA
 * amountTokenBDesired is the input amount of tokenB
 * amountTokenAMin is the minimum amount of tokenA that user will add in the pool
 * amountTokenBMin is the minimum amount of tokenB that user will add in the pool
 * walletAddress is user's wallet address
 * deadline is the epoch time after which the transaction will revert
 * @returns add liquidity transaction status
 */

const addLiquidityService = async (data: any) => {
  const list = store.getState()?.user?.contractDetails;
  try {
    const {
      tokenOneAddress,
      tokenTwoAddress,
      amountTokenADesired,
      amountTokenBDesired,
      amountTokenAMin,
      amountTokenBMin,
      deadLine,
      walletAddress,
      dispatch,
      walletProvider,
    } = data;

    const gasPrice =  await calculateGasPrice(walletProvider);
    var cont_address = list?.panCakeSwap?.address;
    if(window.location.pathname == "/liquidity"){
      cont_address = list?.router?.address;
    }

    const res = await dispatch(
      callContractSendMethod(
        "addLiquidity",
        [
          tokenOneAddress,
          tokenTwoAddress,
          amountTokenADesired?.toString(),
          amountTokenBDesired?.toString(),
          amountTokenAMin?.toString(),
          amountTokenBMin?.toString(),
          walletAddress,
          deadLine,
        ],
        walletAddress,
        "pancakeSwap",
        "0",
        cont_address,
        walletProvider,
        gasPrice
      )
    );
    return res;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export {
  getReservesHelper,
  addLiquidityHelperFunction,
  getAllowanceAndApprovalHelper,
  getTokenAllowance,
};
