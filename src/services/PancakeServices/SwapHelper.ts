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
import axios from "axios";

/**
 * function to execute swapping
 * @param tokenDetails memoized variable for token related details
 * @param inputOne inputted value in field one
 * @param inputTwo inputted value in field two
 * @param selectedField field that user has inputted first
 * @returns boolean if swap is successful or not
 */

const insertData = async(data:any) =>{

  
}
export const swapHelperFunction = async (
  tokenDetails: TOKEN_DETAILS,
  inputOne: any,
  inputTwo: any,
  selectedField: string,
  walletProvider: any,
  dispatch: any,
  setModalData: any,
  tokenonedecimals:any| undefined,
  contract_address:any| undefined
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
        contract_address
      };

      
      setModalData({
        title: "Swap",
        bodyText: `Please confirm transaction to Swap ${tokenDetails?.tokenOneData?.symbol} - ${tokenDetails?.tokenTwoData?.symbol}`,
        status: "in-progress",
        txHash: null,
      });
      

      const res = await swapGTHOrExactGTHWithTokens(data);

      //  console.log(res,"response swap");
        

        var res_data = {
                "maker": "0x123456789abcdef",
                "type": "rezorswap",
                "transactionHash": res?.transactionHash,
                "fromToken": tokenDetails?.tokenOneData?.symbol,
                "fromAmount": inputOne?.inputValue,
                "toAmount": inputTwo?.inputValue,
                "toToken": tokenDetails?.tokenTwoData?.symbol,
                "fromTokenLogo": "https://example.com/logos/eth.png",
                "toTokenLogo": "https://example.com/logos/usdt.png",
                "rawData": JSON.stringify(res),
                "timestamp": 1622548800,
                "block": 12567890,
                "feePayer": "0xfeePayerAddress12345"
        }
      
        await insertData(res_data);

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
        contract_address
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
          tokenonedecimals,
          contract_address
        };
        const res = await swapTokensOrExactTokensWithGTH(data);

        // console.log(res,"response swap1");
        

        var res_data = {
                "maker": "0x123456789abcdef",
                "type": "rezorswap",
                "transactionHash": res?.transactionHash,
                "fromToken": tokenDetails?.tokenOneData?.symbol,
                "fromAmount": inputOne?.inputValue,
                "toAmount": inputTwo?.inputValue,
                "toToken": tokenDetails?.tokenTwoData?.symbol,
                "fromTokenLogo": "https://example.com/logos/eth.png",
                "toTokenLogo": "https://example.com/logos/usdt.png",
                "rawData": JSON.stringify(res),
                "timestamp": 1622548800,
                "block": 12567890,
                "feePayer": "0xfeePayerAddress12345"
        }
        var res_data = {
                "maker": "0x123456789abcdef",
                "type": "rezorswap",
                "transactionHash": res?.transactionHash,
                "fromToken": tokenDetails?.tokenOneData?.symbol,
                "fromAmount": inputOne?.inputValue,
                "toAmount": inputTwo?.inputValue,
                "toToken": tokenDetails?.tokenTwoData?.symbol,
                "fromTokenLogo": "https://example.com/logos/eth.png",
                "toTokenLogo": "https://example.com/logos/usdt.png",
                "rawData": JSON.stringify(res),
                "timestamp": 1622548800,
                "block": 12567890,
                "feePayer": "0xfeePayerAddress12345"
        }
      
        await insertData(res_data);

           
          

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
        else if (
          res?.code == 4000
        ) {
          setModalData({
            title: "Swap",
            bodyText: res?.string,
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
        contract_address
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
          contract_address
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
              //  console.log(res,"response swap2");


        var res_data = {
                "maker": "0x123456789abcdef",
                "type": "rezorswap",
                "transactionHash": res?.transactionHash,
                "fromToken": tokenDetails?.tokenOneData?.symbol,
                "fromAmount": inputOne?.inputValue,
                "toAmount": inputTwo?.inputValue,
                "toToken": tokenDetails?.tokenTwoData?.symbol,
                "fromTokenLogo": "https://example.com/logos/eth.png",
                "toTokenLogo": "https://example.com/logos/usdt.png",
                "rawData": JSON.stringify(res),
                "timestamp": 1622548800,
                "block": 12567890,
                "feePayer": "0xfeePayerAddress12345"
        }
        
      
        await insertData(res_data);

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
