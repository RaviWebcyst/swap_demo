import moment from "moment";
import { store } from "../../app/store";
import { calculateDeadlineHelper } from "../../utils/helpers";
import { getAllowanceAndApprovalHelper } from "../LiquidityServices/AddLiquidityHelper";
import {
  swapGTHOrExactGTHWithTokens,
  swapTokensOrExactTokensWithGTH,
  swapTokensOrExactTokensWithTokens,
} from "./SwapFunctions";
import { TOKEN_DETAILS } from "../../interfaces/common";

/**
 * function to execute swapping
 * @param tokenDetails memoized variable for token related details
 * @param inputOne inputted value in field one
 * @param inputTwo inputted value in field two
 * @param selectedField field that user has inputted first
 * @returns boolean if swap is successful or not
 */
export const swapHelperFunction = async (
  tokenDetails: TOKEN_DETAILS,
  inputOne: any,
  inputTwo: any,
  selectedField: string,
  walletProvider: any,
  dispatch: any,
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
    
    if (tokenDetails?.isTokenOneNative) {
      const data = {
        input1: inputOne?.convertedValue,
        input2: inputTwo?.convertedValue,
        walletAddress: walletAddress,
        tokenOneAddress: tokenDetails?.tokenOneAddress,
        tokenTwoAddress: tokenDetails?.tokenTwoAddress,
        selectedField: selectedField,
        deadLine,
        slippageTolerance: slippage,
        walletProvider,
      };
      setModalData({
        title: "Swap",
        bodyText: `Please confirm transaction to Swap ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
        status: "in-progress",
        txHash: null,
      });

      const res = await swapGTHOrExactGTHWithTokens(data);
      if (
        res?.code != 4001 &&
        res?.code != -32603 &&
        res?.code != 5000 &&
        res?.transactionHash &&
        !res?.code
      ) {
       
        setModalData({
          title: "Swap",
          bodyText: `Transaction successful for Swapping of ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "success",
          txHash: res?.transactionHash,
        });
        return "SWAP DONE";
      } else if (
        res?.code == undefined ||
        res?.code == 4001 ||
        res?.code == -32603 ||
        res?.code == 5000
      ) {
        setModalData({
          title: "Swap",
          bodyText: res?.message.split("{")[0]
            ? res?.message.split("{")[0]
            : res?.message.split(":")[0],
          status: "failed",
          txHash: null,
        });
        return "SWAP FAILED";
      }
    } else if (tokenDetails?.isTokenTwoNative) {
      const data = {
        customToken: tokenDetails?.tokenOneAddress,
        tokenOneAddress: 0,
        tokenTwoAddress: 0,
        walletAddress,
        inputOne,
        inputTwo,
        swap: true,
        walletProvider,
        dispatch,
      };
      setModalData({
        title: "Approval",
        bodyText: `Please confirm approval for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
        status: "in-progress",
        txHash: null,
      });

      const res = await getAllowanceAndApprovalHelper(data);
      if (res) {
        setModalData({
          title: "Approval",
          bodyText: `Approval success for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "success",
          txHash: null,
        });
        setTimeout(() => {}, 2000);

        setModalData({
          title: "Swap",
          bodyText: `Please confirm transaction to Swap ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "in-progress",
          txHash: null,
        });

        const data = {
          input1: inputOne?.convertedValue,
          input2: inputTwo?.convertedValue,
          walletAddress: walletAddress,
          tokenOneAddress: tokenDetails?.tokenOneAddress,
          tokenTwoAddress: tokenDetails?.tokenTwoAddress,
          selectedField: selectedField,
          deadLine,
          slippageTolerance: slippage,
          walletProvider,
        };
        const res = await swapTokensOrExactTokensWithGTH(data);
        if (
          res?.code != 4001 &&
          res?.code != -32603 &&
          res?.code != 5000 &&
          res?.transactionHash &&
          !res?.code
        ) {
          
          setModalData({
            title: "Swap",
            bodyText: `Transaction successful for Swapping of ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
            status: "success",
            txHash: res?.transactionHash,
          });
          return "SWAP DONE";
        } else if (
          res?.code == undefined ||
          res?.code == 4001 ||
          res?.code == -32603 ||
          res?.code == 5000
        ) {
          setModalData({
            title: "Swap",
            bodyText: res?.message.split("{")[0]
              ? res?.message.split("{")[0]
              : res?.message.split(":")[0],
            status: "failed",
            txHash: null,
          });
          return "SWAP FAILED";
        }
      } else {
        setModalData({
          title: "Approval",
          bodyText: `Approval failed for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "failed",
          txHash: null,
        });
        return "APPROVAL FAILED";
      }
    } else {
      const data = {
        customToken: 0,
        tokenOneAddress: tokenDetails?.tokenOneAddress,
        tokenTwoAddress: tokenDetails?.tokenTwoAddress,
        walletAddress,
        inputOne,
        inputTwo,
        swap: true,
        walletProvider,
        dispatch,
      };
      setModalData({
        title: "Approval",
        bodyText: `Please confirm approval for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
        status: "in-progress",
        txHash: null,
      });
      const res = await getAllowanceAndApprovalHelper(data);
      if (res) {
        const data = {
          input1: inputOne?.convertedValue,
          input2: inputTwo?.convertedValue,
          walletAddress: walletAddress,
          tokenOneAddress: tokenDetails?.tokenOneAddress,
          tokenTwoAddress: tokenDetails?.tokenTwoAddress,
          selectedField: selectedField,
          deadLine,
          slippageTolerance: slippage,
          walletProvider,
        };
        setModalData({
          title: "Approval",
          bodyText: `Approval success for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "success",
          txHash: null,
        });
        setTimeout(() => {}, 2000);

        setModalData({
          title: "Swap",
          bodyText: `Please confirm transaction to Swap ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "in-progress",
          txHash: null,
        });
        const res = await swapTokensOrExactTokensWithTokens(data);
        if (
          res?.code != 4001 &&
          res?.code != -32603 &&
          res?.code != 5000 &&
          res?.transactionHash &&
          !res?.code
        ) {
          setModalData({
            title: "Swap",
            bodyText: `Transaction successful for Swapping of ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
            status: "success",
            txHash: res?.transactionHash,
          });
          
          return "SWAP DONE";
        } else if (
          res?.code == undefined ||
          res?.code == 4001 ||
          res?.code == -32603 ||
          res?.code == 5000
        ) {
          setModalData({
            title: "Swap",
            bodyText: res?.message.split("{")[0]
              ? res?.message.split("{")[0]
              : res?.message.split(":")[0],
            status: "failed",
            txHash: null,
          });
          return "SWAP FAILED";
        }
      } else {
        setModalData({
          title: "Approval",
          bodyText: `Approval failed for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
          status: "failed",
          txHash: null,
        });
        return "APPROVAL FAILED";
      }
    }
  } catch (error) {
    setModalData({
      title: "Swap",
      bodyText: `Transaction failed for ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
      status: "failed",
      txHash: null,
    });
    console.log("error", error);
    return error;
  }
};
