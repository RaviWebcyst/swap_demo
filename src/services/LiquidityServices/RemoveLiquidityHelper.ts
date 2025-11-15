import { store } from "../../app/store";
import { toast } from "../../components/common/Toasts/Toast";
import { setImportedLps } from "../../features/theme/user.slice";
import {
  PERMIT_SIG,
  REMOVE_LIQUIDITY_SIG,
  TOKEN_DATA,
} from "../../interfaces/Liquidity";
import { localeStringFunction, slicedValue } from "../../utils/helpers";
import { calculateGasPrice } from "../contractServices/PancakeContractServices";
import {
  fetchShareOfUser,
  getTotalSupplyOfLp,
} from "../contractServices/contractCallServices";
import {
  callContractGetMethod,
  callContractSendMethod,
  callSendMethod,
  callWeb3,
} from "../contractServices/contractMethods";

export const fetchLatestLpData = async (
  dispatch: any,
  importedLp: any,
  walletProvider: any
) => {
  
  const fetchData = await Promise.all(
    importedLp?.map(async (obj: any) => {
      const { totalSupply } = await getTotalSupplyOfLp({
        tokenOneAddress: obj?.token0,
        tokenTwoAddress: obj?.token1,
        dispatch,
        walletProvider,
      });
      const { share, tokenBReceive, tokenAReceive, userLpBalance } =
        await fetchShareOfUser(
          obj?.pair,
          obj?.token0,
          obj?.token1,
          dispatch,
          totalSupply,
          obj?.tokenAInfo?.decimals,
          obj?.tokenBInfo?.decimals,
          walletProvider
        );
      const objNmae = {
        ...obj,
        share: share,
        tokenBReceive,
        tokenAReceive,
        userLpBalance,
      };
      return objNmae;
    })
  );
  dispatch(setImportedLps(fetchData));
};

const getPairNonces = async (
  pairAddress: string,
  address: string,
  dispatch: any,
  walletProvider: any
) => {
  try {
    
    const res: number = await dispatch(
      callContractGetMethod(
        "nonces",
        [address],
        "pair",
        pairAddress,
        walletProvider
      )
    );
    return res;
  } catch (err) {
    return err;
  }
};

const splitSignature = async (signature: any) => {
  const result = {
    r: "0x",
    s: "0x",
    _vs: "0x",
    recoveryParam: 0,
    v: 0,
  };

  if (isBytesLike(signature)) {
    const bytes = arrayify(signature);
    if (bytes.length !== 65) {
      throw new Error("invalid signature string; must be 65 bytes");
    }

    result.r = hexlify(bytes.slice(0, 32));
    result.s = hexlify(bytes.slice(32, 64));
    result.v = bytes[64];

    // Allow a recid to be used as the v
    if (result.v < 27) {
      if (result.v === 0 || result.v === 1) {
        result.v += 27;
      } else {
        throw new Error("signature invalid v byte");
      }
    }

    // Compute recoveryParam from v
    result.recoveryParam = 1 - (result.v % 2);

    // Compute _vs from recoveryParam and s
    if (result.recoveryParam) {
      bytes[32] |= 0x80;
    }
    result._vs = hexlify(bytes.slice(32, 64));
  } else {
    result.r = signature.r;
    result.s = signature.s;
    result.v = signature.v;
    result.recoveryParam = signature.recoveryParam;
    result._vs = signature._vs;

    // If the _vs is available, use it to populate missing s, v and recoveryParam
    // and verify non-missing s, v and recoveryParam
    if (result._vs != null) {
      const vs = zeroPad(arrayify(result._vs), 32);
      result._vs = hexlify(vs);

      // Set or check the recid
      const recoveryParam = vs[0] >= 128 ? 1 : 0;
      if (result.recoveryParam == null) {
        result.recoveryParam = recoveryParam;
      } else if (result.recoveryParam !== recoveryParam) {
        throw new Error("signature recoveryParam mismatch _vs");
      }

      // Set or check the s
      vs[0] &= 0x7f;
      const s = hexlify(vs);
      if (result.s == null) {
        result.s = s;
      } else if (result.s !== s) {
        throw new Error("signature v mismatch _vs");
      }
    }

    // Use recid and v to populate each other
    if (result.recoveryParam == null) {
      if (result.v == null) {
        throw new Error("signature missing v and recoveryParam");
      } else if (result.v === 0 || result.v === 1) {
        result.recoveryParam = result.v;
      } else {
        result.recoveryParam = 1 - (result.v % 2);
      }
    } else {
      if (result.v == null) {
        result.v = 27 + result.recoveryParam;
      } else if (result.recoveryParam !== 1 - (result.v % 2)) {
        throw new Error("signature recoveryParam mismatch v");
      }
    }

    if (result.r == null || !isHexString(result.r)) {
      throw new Error("signature missing or invalid r");
    } else {
      result.r = hexZeroPad(result.r, 32);
    }

    if (result.s == null || !isHexString(result.s)) {
      throw new Error("signature missing or invalid s");
    } else {
      result.s = hexZeroPad(result.s, 32);
    }

    const vs = arrayify(result.s);
    if (vs[0] >= 128) {
      throw new Error("signature s out of range");
    }
    if (result.recoveryParam) {
      vs[0] |= 0x80;
    }
    const _vs = hexlify(vs);

    if (result._vs) {
      if (!isHexString(result._vs)) {
        throw new Error("signature invalid _vs");
      }
      result._vs = hexZeroPad(result._vs, 32);
    }

    // Set or check the _vs
    if (result._vs == null) {
      result._vs = _vs;
    } else if (result._vs !== _vs) {
      throw new Error("signature _vs mismatch v and s");
    }
  }
  return result;
};

function isBytesLike(value: any) {
  return (isHexString(value) && !(value.length % 2)) || isBytes(value);
}

// length is optional but may be required....
function isHexString(value: any, length?: any) {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

function isBytes(value: any) {
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return false;
  }
  if (value.length == null) {
    return false;
  }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (typeof v !== "number" || v < 0 || v >= 256 || v % 1) {
      return false;
    }
  }
  return true;
}

function arrayify(value: any, options?: any) {
  if (!options) {
    options = {};
  }

  if (typeof value === "number") {

    const result: any = [];
    while (value) {
      result.unshift(value & 0xff);
      value = parseInt(String(value / 256));
    }
    if (result.length === 0) {
      result.push(0);
    }

    return addSlice(result);
  }

  if (
    options.allowMissingPrefix &&
    typeof value === "string" &&
    value.substring(0, 2) !== "0x"
  ) {
    value = "0x" + value;
  }

  if (isHexable(value)) {
    value = value.toHexString();
  }

  if (isHexString(value)) {
    let hex = value.substring(2);
    if (hex.length % 2) {
      if (options.hexPad === "left") {
        hex = "0x0" + hex.substring(2);
      } else if (options.hexPad === "right") {
        hex += "0";
      } else {
        throw new Error("hex data is odd-length");
      }
    }

    const result: any = [];
    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return addSlice(result);
  }

  if (isBytes(value)) {
    return addSlice(value);
  }

  return new Error("invalid arrayify value");
}

function isHexable(value: any) {
  return !!value.toHexString;
}
function addSlice(array: any) {
  if (array.slice) {
    return array;
  }

  array.slice = function () {
    const args: any = Array.prototype.slice.call(arguments);
    return addSlice(Array.prototype.slice.apply(array, args));
  };
  return array;
}

const HexCharacters = "0123456789abcdef";

function hexlify(value: any, options?: any) {
  if (!options) {
    options = {};
  }

  if (typeof value === "number") {

    let hex = "";
    while (value) {
      hex = HexCharacters[value & 0xf] + hex;
      value = Math.floor(value / 16);
    }

    if (hex.length) {
      if (hex.length % 2) {
        hex = "0" + hex;
      }
      return "0x" + hex;
    }

    return "0x00";
  }

  if (typeof value === "bigint") {
    value = value.toString(16);
    if (value.length % 2) {
      return "0x0" + value;
    }
    return "0x" + value;
  }

  if (
    options.allowMissingPrefix &&
    typeof value === "string" &&
    value.substring(0, 2) !== "0x"
  ) {
    value = "0x" + value;
  }

  if (isHexable(value)) {
    return value.toHexString();
  }

  if (isHexString(value)) {
    if (value.length % 2) {
      if (options.hexPad === "left") {
        value = "0x0" + value.toString().substring(2);
      } else if (options.hexPad === "right") {
        value += "0";
      } else {
        throw new Error("hex data is odd-length");
      }
    }
    return value.toString().toLowerCase();
  }

  if (isBytes(value)) {
    let result = "0x";
    for (let i = 0; i < value.length; i++) {
      let v = value[i];
      result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
  }

  return new Error("invalid hexlify value");
}

function zeroPad(value: any, length: any) {
  value = arrayify(value);

  if (value.length > length) {
    throw new Error("value out of range");
  }

  const result: any = [length];
  result.set(value, length - value.length);
  return addSlice(result);
}

function hexZeroPad(value: any, length: any) {
  if (typeof value !== "string") {
    value = hexlify(value);
  } else if (!isHexString(value)) {
    throw new Error("invalid hex string");
  }

  if (value.length > 2 * length + 2) {
    throw new Error("value out of range");
  }

  while (value.length < 2 * length + 2) {
    value = "0x0" + value.substring(2);
  }
  return value;
}

//removeeee
const getRemoveLiquiditySignature = async (data: REMOVE_LIQUIDITY_SIG) => {
  const {
    walletAddress,
    pairAddress,
    liquidity,
    deadLine,
    dispatch,
    walletProvider,
  } = data;
  const contractInfo = store?.getState()?.user?.contractDetails;
  try {
    const owner: string = walletAddress;
    const spender: string | undefined = contractInfo?.router?.address;
    const value: string = liquidity;
    const web3: any = await callWeb3(walletProvider);
    let chainIdtrue = await web3.eth.getChainId();
    
    let chainId = await web3.utils.hexToNumber(chainIdtrue);

    const nonce: number | unknown = await getPairNonces(
      pairAddress,
      owner,
      dispatch,
      walletProvider
    );

    const EIP712Domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];
    const domain = {
      name: "RezorSwap LPs",
      version: "1",
      value,
      chainId,
      verifyingContract: pairAddress,
    };
    const Permit = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];
    const message = {
      owner,
      spender,
      value,
      nonce: web3.utils.toHex(nonce),
      deadline: deadLine,
    };
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: "Permit",
      message,
    });
    const from: string = owner;
    const params: string[] = [from, data];
    const method: string = "eth_signTypedData_v4";
    const res: any = web3?.currentProvider
      ? await web3?.currentProvider?.request({
          method,
          params,
          from,
        })
      : await web3?.givenProvider?.request({
          method,
          params,
          from,
        });
    try {
      const splits: PERMIT_SIG = await splitSignature(res);

      return splits;
    } catch (err: any) {
      console.log("split signature error", err);
      return err;
    }
  } catch (error: any) {
    return error;
  }
};

export const executeRemoveLiquidity = async (data: any) => {
  const {
    dispatch,
    walletAddress,
    receivableTokensFromLp,
    tokenDetails,
    userLiquiditytoRemove,
    signature,
    deadLine,
    slippage,
    walletProvider,
    setModalData,
  } = data;
  try {
  
    const native =
      tokenDetails?.isTokenOneNative || tokenDetails?.isTokenTwoNative
        ? true
        : false;
    const customToken = tokenDetails?.isTokenOneNative
      ? tokenDetails?.tokenB
      : tokenDetails?.tokenA;
if(userLiquiditytoRemove){
  const data1 = {
    liquidity: userLiquiditytoRemove,
    customTokenAddress: native ? customToken : 0,
    tokenOneAddress: !native ? tokenDetails?.tokenA : 0,
    tokenTwoAddress: !native ? tokenDetails?.tokenB : 0,
    tokenAmin: receivableTokensFromLp?.token1,
    tokenBmin: receivableTokensFromLp?.token2,
    approveMax: false,
    signature,
    deadLine,
    walletAddress,
    slippageTolerance: slippage,
    dispatch,
    walletProvider,
    setModalData,
  };
  setModalData({
    title: "Remove Liquidity",
    bodyText: `Please confirm transaction for ${tokenDetails?.tokenASymbol} - ${tokenDetails?.tokenBSymbol}`,
    status: "in-progress",
    txHash: null,
  });
  const result = native
    ? await removeLiquidityEthWithPermitService(data1)
    : await removeLiquidityWithPermitService(data1);
  if (
    !result?.code &&
    result?.code != 4001 &&
    result?.code != -32603 &&
    result?.transactionHash &&
    result?.code != 5000
  ) {
    setModalData({
      title: "Remove Liquidity",
      bodyText: `Transaction successful for ${tokenDetails?.tokenASymbol} - ${tokenDetails?.tokenBSymbol}`,
      status: "success",
      txHash: result?.transactionHash,
    });
  } else if (
    result?.code == undefined ||
    result?.code == 4001 ||
    result?.code == -32603 ||
    result?.code == 5000
  ) {
    setModalData({
      title: "Remove Liquidity",
      bodyText: result?.message.split("{")[0]
        ? result?.message.split("{")[0]
        : result?.message.split(":")[0],
      status: "failed",
      txHash: null,
    });
  }
  return result
}
  } catch (err) {
    console.log("error", err);
    throw err;
  }
};

const removeLiquidityEthWithPermitService = async (data: any) => {
  const {
    liquidity,
    customTokenAddress,
    tokenAmin,
    tokenBmin,
    approveMax,
    signature,
    deadLine,
    walletAddress,
    slippageTolerance,
    dispatch,
    walletProvider,
    setModalData,
  } = data;
 
  const { v, r, s } = signature;

  console.log(data,"liquidity data");
  
  const contractInfo = store.getState()?.user?.contractDetails;
  try {
    
    const tokenAminWithSlippage = slicedValue(
      localeStringFunction(tokenAmin - (tokenAmin * slippageTolerance) / 100)
    );
    const tokenBminWithSlippage = slicedValue(
      localeStringFunction(tokenBmin - (tokenBmin * slippageTolerance) / 100)
    );
    const gasPrice =  await calculateGasPrice(walletProvider);
    
    return await callSendMethod(
      "removeLiquidityETHWithPermit",
      [
        customTokenAddress,
        liquidity,
        tokenAminWithSlippage,
        tokenBminWithSlippage,
        walletAddress,
        deadLine,
        approveMax,
        v,
        r,
        s,
      ],
      walletAddress,
      "pancakeSwap",
      undefined,
      contractInfo?.router?.address,
      walletProvider,
      gasPrice
    );
  } catch (error: any) {
    if (error?.code !== 4001 && error?.code !== 5000) {
      let taxPercentage = 50;
      try {
        const tokenAminWithSlippage = slicedValue(
          localeStringFunction(tokenAmin - (tokenAmin * taxPercentage) / 100)
        );
        const tokenBminWithSlippage = slicedValue(
          localeStringFunction(tokenBmin - (tokenBmin * taxPercentage) / 100)
        );
    const gasPrice =  await calculateGasPrice(walletProvider);

        return await callSendMethod(
          "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
          [
            customTokenAddress,
            liquidity,
            tokenAminWithSlippage,
            tokenBminWithSlippage,
            walletAddress,
            deadLine,
            approveMax,
            v,
            r,
            s,
          ],
          walletAddress,
          "pancakeSwap",
          undefined,
          contractInfo?.router?.address,
          walletProvider,
          gasPrice
        );
      } catch (error) {
        return error;
        
      }
    } else {
      return error;
    }
  }
};

/**
 * this is a helper function for removing liquidity from a pool that consists of two custom tokens
 * @param data it is an object that contains various params required for this function
 * liquidity is the amount of liquidity that a user wants to remove from the pool
 * tokenOneAddress is the address of token One in the pool
 * tokenTwoAddress is the address of token Two in the pool
 * tokenAmin is the minimum amount of tokenA that user is willing to receive
 * tokenBmin is the minimum amount of tokenB that user is willing to receive
 * approveMax is a boolean value indicating whether user is willing to give max approval of its LP token or not to the contract
 * signature is the EIP712 generated signature
 * deadline is the epoch time after which the transaction will revert
 * walletAddress is user's wallet address
 * slippageTolerance is the slippage percentage that user decided
 * @returns remove liquidity transaction status
 */

const removeLiquidityWithPermitService = async (data: any) => {
  try {
    const {
      liquidity,
      tokenOneAddress,
      tokenTwoAddress,
      tokenAmin,
      tokenBmin,
      approveMax,
      signature,
      deadLine,
      walletAddress,
      slippageTolerance,
      dispatch,
      walletProvider,
    } = data;
    const { v, r, s } = signature;

     console.log(v,r,s,"v,r,s data");
    const contractInfo = store.getState()?.user?.contractDetails;
    const tokenAminWithSlippage = slicedValue(
      localeStringFunction(tokenAmin - (tokenAmin * slippageTolerance) / 100)
    );
    const tokenBminWithSlippage = slicedValue(
      localeStringFunction(tokenBmin - (tokenBmin * slippageTolerance) / 100)
    );
    const gasPrice =  await calculateGasPrice(walletProvider);
    
    return await callSendMethod(
      "removeLiquidityWithPermit",
      [
        tokenOneAddress,
        tokenTwoAddress,
        liquidity,
        tokenAminWithSlippage,
        tokenBminWithSlippage,
        walletAddress,
        deadLine,
        approveMax,
        v,
        r,
        s,
      ],
      walletAddress,
      "pancakeSwap",
      undefined,
      contractInfo?.router?.address,
      walletProvider,
      gasPrice
    );
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export { getRemoveLiquiditySignature };
