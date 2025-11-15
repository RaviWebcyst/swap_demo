import { store } from "../../app/store";
import { slicedValue } from "../../utils/helpers";
import { calculateGasPrice } from "../contractServices/PancakeContractServices";
import { callSendMethod } from "../contractServices/contractMethods";

let hundred = 100;
const localeStringFunction = (value: any) => {
  return value?.toLocaleString("fullwide", {
    useGrouping: !1,
  });
};

const swapTokensForExactGTH = async (data: any) => {
  const {
    walletAddress,
    amountOut,
    amountInMax,
    path,
    to,
    deadLine,
    slippageTolerance,
    walletProvider,
    tokenonedecimals,
    contract_address
  } = data;
 // const list = store.getState()?.user?.contractDetails;
 // const routerAddress = list?.router?.address;

const routerAddress = contract_address;
  try {

    
    let amountInMaxWithSlippageTolerance =
      (amountInMax / hundred) * slippageTolerance == 0
        ? amountInMax
        : localeStringFunction(
          slicedValue(
            localeStringFunction((amountInMax / hundred) * slippageTolerance)
          ) + Number(amountInMax)
        );
    const gasPrice = await calculateGasPrice(walletProvider);

    amountInMaxWithSlippageTolerance = Number(amountInMaxWithSlippageTolerance.toString().slice(0, tokenonedecimals));


        
    var type ="pancakeSwap";
    var method = "swapTokensForExactETH";
    
    
    amountInMaxWithSlippageTolerance = amountInMax;
    if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
      method = 'exactOutputSingle';
     type="uniswapv3";
    }


    // console.log("exact data log", amountOut, amountInMaxWithSlippageTolerance);
    

    return await callSendMethod(
      method,
      [amountOut, amountInMaxWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      type,
      undefined,
      routerAddress,
      walletProvider,
      gasPrice
    );


  } catch (error) {
    var string= "Unknown Error:'execution reverted'. Try increasing your slippage tolerance";
    var code = 4000;

   var err= {
      string,
      code
    }

    // console.log(error,"error data mine");

    return err;
    
    // return error;
      // errorHelperContract(error, "send", "swapTokensForExactETH");

     
  }
};
const swapExactTokensForGTH = async (data: any) => {
  const {
    walletAddress,
    amountIn,
    amountOutMin,
    path,
    to,
    deadLine,
    slippageTolerance,
    walletProvider,
    contract_address
  } = data;
 // const list = store.getState()?.user?.contractDetails;
 // const routerAddress = list?.router?.address;

const routerAddress = contract_address;
  try {
    let amountOutMinWithSlippageTolerance =
      (amountOutMin / hundred) * slippageTolerance == 0
        ? amountOutMin
        : localeStringFunction(
          amountOutMin -
          Number(
            slicedValue(
              localeStringFunction(
                (amountOutMin / hundred) * slippageTolerance
              )
            )
          )
        );
    const gasPrice = await calculateGasPrice(walletProvider);

      var type ="pancakeSwap";
      var method = "swapExactTokensForETH";
    
    
    if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
      method = 'exactInputSingle';
     type="uniswapv3";
    }

    return await callSendMethod(
      method,
      [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      type,
      undefined,
      routerAddress,
      walletProvider,
      gasPrice
    );
  } catch (error: any) {
    if (error?.code !== 5000) {
      if (error?.code !== 4001) {
        let taxPercentage = 50;
        try {
          let amountOutMinWithSlippageTolerance = localeStringFunction(
            amountOutMin -
            Number(
              slicedValue(
                localeStringFunction((amountOutMin / hundred) * taxPercentage)
              )
            )
          );
          const gasPrice = await calculateGasPrice(walletProvider);

             var type ="pancakeSwap";
             var method = "swapExactTokensForETHSupportingFeeOnTransferTokens";
    
    
            if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
              method = 'exactInputSingle';
               type="uniswapv3";
            }


          return await callSendMethod(
            method,
            [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            type,
            undefined,
            routerAddress,
            walletProvider,
            gasPrice
          );
        } catch (error) {
          return error;

        }
      } else {
        return error;
      }
    } else {
      return error;
    }
  }
};
const swapExactTokensForToken = async (data: any) => {
  const {
    walletAddress,
    amountIn,
    amountOutMin,
    path,
    to,
    deadLine,
    slippageTolerance,
    walletProvider,
    contract_address
  } = data;
 // const list = store.getState()?.user?.contractDetails;
 // const routerAddress = list?.router?.address;

const routerAddress = contract_address;
  try {
    // console.log("in try");
    // var amountInput = amountIn - (0.01)*amountIn;

    let amountOutMinWithSlippageTolerance =
      (amountOutMin / hundred) * slippageTolerance == 0
        ? amountOutMin
        : localeStringFunction(
          amountOutMin -
          Number(
            slicedValue(
              localeStringFunction(
                (amountOutMin / hundred) * slippageTolerance
              )
            )
          )
        );


    const gasPrice = await calculateGasPrice(walletProvider);

     var type ="pancakeSwap";
    var method = "swapExactTokensForTokens";
    
   

    if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
      method = 'exactInputSingle';
     type="uniswapv3";
    }

    return await callSendMethod(
      method,
      [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      type,
      undefined,
      routerAddress,
      walletProvider,
      gasPrice
    );
  } catch (error: any) {
    // console.log("in catch");

    if (error?.code !== 5000) {
      if (error?.code !== 4001) {
        let taxPercentage = 50;
        // var amountInput = amountIn - (0.01)*amountIn;
        try {
          let amountOutMinWithSlippageTolerance = localeStringFunction(
            amountOutMin -
            Number(
              slicedValue(
                localeStringFunction((amountOutMin / hundred) * taxPercentage)
              )
            )
          );
          const gasPrice = await calculateGasPrice(walletProvider);
            var type ="pancakeSwap";
            var method = "swapExactTokensForTokensSupportingFeeOnTransferTokens";
            
          

            if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
              method = 'exactInputSingle';
             type="uniswapv3";
            }

          return await callSendMethod(
            method,
            // "swapExactTokensForTokens",
            [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            type,
            undefined,
            routerAddress,
            walletProvider,
            gasPrice
          );
        } catch (error) {
          return error;

        }
      } else {
        return error;
      }
    } else {
      return error;
    }
  }
};

//CHECK IT
const swapExactGTHForToken = async (data: any) => {
  const {
    walletAddress,
    amountIn,
    amountOutMin,
    path,
    to,
    deadLine,
    slippageTolerance,
    walletProvider,
    contract_address
  } = data;
 // const list = store.getState()?.user?.contractDetails;
 // const routerAddress = list?.router?.address;

const routerAddress = contract_address;
  // console.log("path2", path);

  try {
    let amountOutMinWithSlippageTolerance =
      (amountOutMin / hundred) * slippageTolerance == 0
        ? amountOutMin
        : localeStringFunction(
          amountOutMin -
          Number(
            slicedValue(
              localeStringFunction(
                (amountOutMin / hundred) * slippageTolerance
              )
            )
          )
        );
    const gasPrice = await calculateGasPrice(walletProvider);

 
    

    var type ="pancakeSwap";

    var method = "swapExactETHForTokens";
    if(path[1] === "0x2111F1f5A8383F27a9f089abB1926dc00eb6beF3" ){
      method = "swapExactETHForTokensSupportingFeeOnTransferTokens";
    }

    if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
      method = 'exactInputSingle';
     type="uniswapv3";
    }

    return await callSendMethod(
      method,
      [amountOutMinWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      type,
      amountIn,
      routerAddress,
      walletProvider,
      gasPrice
    );
  } catch (error: any) {
    if (error?.code !== 5000) {
      if (error?.code !== 4001) {
        let taxPercentage = 50;
        try {
          let amountOutMinWithSlippageTolerance = localeStringFunction(
            amountOutMin -
            Number(
              slicedValue(
                localeStringFunction((amountOutMin / hundred) * taxPercentage)
              )
            )
          );
          const gasPrice = await calculateGasPrice(walletProvider);

            var type ="pancakeSwap";

              var method = "swapExactETHForTokensSupportingFeeOnTransferTokens";
         

          if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
            method = 'exactInputSingle';
           type="uniswapv3";
          }

          return await callSendMethod(
            method,
            [amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            type,
            amountIn,
            routerAddress,
            walletProvider,
            gasPrice
          );
        } catch (error) {
          return error;

        }
      } else {
        return error;
      }
    } else {
      return error;
    }
  }
};

const swapGTHForExactToken = async (data: any) => {
  const {
    walletAddress,
    amountOut,
    amountInMax,
    path,
    to,
    slippageTolerance,
    deadLine,
    walletProvider,
    contract_address
  } = data;
 // const list = store.getState()?.user?.contractDetails;
 // const routerAddress = list?.router?.address;

const routerAddress = contract_address;
  try {
    let amountOutMaxWithSlippageTolerance =
      (amountOut / hundred) * slippageTolerance == 0
        ? amountOut
        : slicedValue(
          localeStringFunction(
            (amountOut / hundred) * slippageTolerance + Number(amountOut)
          )
        );
    const gasPrice = await calculateGasPrice(walletProvider);

      var type ="pancakeSwap";
      var method = "swapETHForExactTokens";
   

      if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
        method = 'exactOutputSingle';
       type="uniswapv3";
      }

    return await callSendMethod(
      method,
      [amountOutMaxWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      type,
      amountInMax,
      routerAddress,
      walletProvider,
      gasPrice
    );
  } catch (error) {
    return error;
  }
};
const swapTokensForExactToken = async (data: any) => {
  const {
    walletAddress,
    amountOut,
    amountInMax,
    path,
    to,
    deadLine,
    slippageTolerance,
    walletProvider,
    contract_address
  } = data;
 // const list = store.getState()?.user?.contractDetails;
 // const routerAddress = list?.router?.address;

const routerAddress = contract_address;
  try {
    let amountInMaxWithSlippageTolerance =
      (amountInMax / hundred) * slippageTolerance == 0
        ? amountInMax
        : localeStringFunction(
          slicedValue(
            localeStringFunction((amountInMax / hundred) * slippageTolerance)
          ) + Number(amountInMax)
        );
    const gasPrice = await calculateGasPrice(walletProvider);

     var type ="pancakeSwap";
    var method = "swapTokensForExactTokens";
   

    if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
      method = 'exactOutputSingle';
     type="uniswapv3";
    }

    return await callSendMethod(
      method,
      [amountOut, amountInMaxWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      type,
      undefined,
      routerAddress,
      walletProvider,
      gasPrice
    );
  } catch (error: any) {
    console.log("error", error, error?.code, error?.code !== 5000);
    if (error?.code !== 5000) {
      if (error?.code !== 4001) {
        let taxPercentage = 50;
        try {
          let amountOutMinWithSlippageTolerance = localeStringFunction(
            Number(amountInMax) +
            slicedValue(
              localeStringFunction((amountInMax / hundred) * taxPercentage)
            )
          );
          const gasPrice = await calculateGasPrice(walletProvider);

           var type ="pancakeSwap";
          var method = "swapExactTokensForTokensSupportingFeeOnTransferTokens";
   

          if(contract_address == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'){
            method = 'exactOutputSingle';
           type="uniswapv3";
          }

          return await callSendMethod(
            method,
            [amountOut, amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            type,
            undefined,
            routerAddress,
            walletProvider,
            gasPrice

          );
        } catch (error) {
          return error;
        }
      } else {
        return error;
      }
    } else {
      return error;
    }
  }
};

const swapTokensOrExactTokensWithTokens = async (data: any) => {
  const {
    input1,
    input2,
    walletAddress,
    tokenOneAddress,
    tokenTwoAddress,
    selectedField,
    deadLine,
    slippageTolerance,
    walletProvider,
    contract_address
  } = data;
  let path = [tokenOneAddress, tokenTwoAddress];
  // console.log("path", path);

  if (selectedField == "TK1") {
    const data = {
      walletAddress,
      amountIn: input1,
      amountOutMin: input2,
      path,
      to: walletAddress,
      deadLine,
      slippageTolerance,
      walletProvider,
      contract_address
    };
    const res: any = await swapExactTokensForToken(data);
    return res;
  } else {
    const data = {
      walletAddress,
      amountOut: input2,
      amountInMax: input1,
      path,
      to: walletAddress,
      deadLine,
      slippageTolerance,
      walletProvider,
      contract_address
    };

    const res: any = await swapTokensForExactToken(data);
    return res;
  }
};

const swapTokensOrExactTokensWithGTH = async (data: any) => {
  const {
    input1,
    input2,
    walletAddress,
    tokenOneAddress,
    tokenTwoAddress,
    selectedField,
    deadLine,
    slippageTolerance,
    walletProvider,
    tokenonedecimals,
    contract_address
  } = data;
  let path = [tokenOneAddress, tokenTwoAddress];
  if (selectedField == "TK1") {
    const data = {
      walletAddress,
      amountIn: input1,
      amountOutMin: input2,
      path,
      to: walletAddress,
      deadLine,
      slippageTolerance,
      walletProvider,
      contract_address
    };

    const res: any = await swapExactTokensForGTH(data);
    return res;
  } else {
    const data = {
      walletAddress,
      amountOut: input2,
      amountInMax: input1,
      path,
      to: walletAddress,
      deadLine,
      slippageTolerance,
      walletProvider,
      tokenonedecimals,
      contract_address
    };

    const res: any = await swapTokensForExactGTH(data);
    return res;
  }
};

const swapGTHOrExactGTHWithTokens = async (data: any) => {
  const {
    input1,
    input2,
    walletAddress,
    tokenOneAddress,
    tokenTwoAddress,
    selectedField,
    deadLine,
    slippageTolerance,
    walletProvider,
    contract_address
  } = data;
  let path = [tokenOneAddress, tokenTwoAddress];
  if (selectedField == "TK1") {
    const data = {
      walletAddress,
      amountIn: input1,
      amountOutMin: input2,
      path,
      to: walletAddress,
      deadLine,
      slippageTolerance,
      walletProvider,
      contract_address
    };
    // console.log(path, "path1");

    const res: any = await swapExactGTHForToken(data);
    return res;
  } else {

    var inpt = input1;
    // var value:any= BigInt(10000);
    // var per:any= BigInt(100);
    // var inpt:any = Number(inpt1) * Number((value+per)/value);

    // console.log(inpt,"inpt");
    

    const data = {
      walletAddress,
      amountOut: input2,
      amountInMax: inpt,
      path,
      to: walletAddress,
      deadLine,
      slippageTolerance,
      walletProvider,
      contract_address
    };
    const res: any = await swapGTHForExactToken(data);
    return res;
  }
};

export {
  swapTokensOrExactTokensWithTokens,
  swapTokensOrExactTokensWithGTH,
  swapGTHOrExactGTHWithTokens,
};
