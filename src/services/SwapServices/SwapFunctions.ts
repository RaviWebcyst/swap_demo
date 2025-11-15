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
  } = data;
  const list = store.getState()?.user?.contractDetails;
  const routerAddress = list?.router?.address;
  try {
    let amountInMaxWithSlippageTolerance =
      (amountInMax / hundred) * slippageTolerance == 0
        ? amountInMax
        : localeStringFunction(
            slicedValue(
              localeStringFunction((amountInMax / hundred) * slippageTolerance)
            ) + Number(amountInMax)
          );
          const gasPrice =  await calculateGasPrice(walletProvider);

    return await callSendMethod(
      "swapTokensForExactETH",
      [amountOut, amountInMaxWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      "router",
      undefined,
      routerAddress,
      walletProvider,
      gasPrice
    );
  } catch (error) {
    return error;
    //   errorHelperContract(error, "send", "swapTokensForExactETH");
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
  } = data;
  const list = store.getState()?.user?.contractDetails;
  const routerAddress = list?.router?.address;
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
          const gasPrice =  await calculateGasPrice(walletProvider);

    return await callSendMethod(
      "swapExactTokensForETH",
      [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      "router",
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
          const gasPrice =  await calculateGasPrice(walletProvider);

          return await callSendMethod(
            "swapExactTokensForETHSupportingFeeOnTransferTokens",
            [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            "router",
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
  } = data;
  const list = store.getState()?.user?.contractDetails;
  const routerAddress = list?.router?.address;
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
          const gasPrice =  await calculateGasPrice(walletProvider);

    return await callSendMethod(
      "swapExactTokensForTokens",
      [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      "router",
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
          const gasPrice =  await calculateGasPrice(walletProvider);

          return await callSendMethod(
            "swapExactTokensForTokensSupportingFeeOnTransferTokens",
            [amountIn, amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            "router",
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
  } = data;
  const list = store.getState()?.user?.contractDetails;
  const routerAddress = list?.router?.address;
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
    const gasPrice =  await calculateGasPrice(walletProvider);

    return await callSendMethod(
      "swapExactETHForTokens",
      [amountOutMinWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      "router",
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
          const gasPrice =  await calculateGasPrice(walletProvider);

          return await callSendMethod(
            "swapExactETHForTokensSupportingFeeOnTransferTokens",
            [amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            "router",
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
  } = data;
  const list = store.getState()?.user?.contractDetails;
  const routerAddress = list?.router?.address;
  try {
    let amountOutMaxWithSlippageTolerance =
      (amountOut / hundred) * slippageTolerance == 0
        ? amountOut
        : slicedValue(
            localeStringFunction(
              (amountOut / hundred) * slippageTolerance + Number(amountOut)
            )
          );
          const gasPrice =  await calculateGasPrice(walletProvider);

    return await callSendMethod(
      "swapETHForExactTokens",
      [amountOutMaxWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      "router",
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
  } = data;
  const list = store.getState()?.user?.contractDetails;
  const routerAddress = list?.router?.address;
  try {
    let amountInMaxWithSlippageTolerance =
      (amountInMax / hundred) * slippageTolerance == 0
        ? amountInMax
        : localeStringFunction(
            slicedValue(
              localeStringFunction((amountInMax / hundred) * slippageTolerance)
            ) + Number(amountInMax)
          );
          const gasPrice =  await calculateGasPrice(walletProvider);

    return await callSendMethod(
      "swapTokensForExactTokens",
      [amountOut, amountInMaxWithSlippageTolerance, path, to, deadLine],
      walletAddress,
      "router",
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
          const gasPrice =  await calculateGasPrice(walletProvider);

          return await callSendMethod(
            "swapExactTokensForTokensSupportingFeeOnTransferTokens",
            [amountOut, amountOutMinWithSlippageTolerance, path, to, deadLine],
            walletAddress,
            "router",
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
    };
    const res: any = await swapExactGTHForToken(data);
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
