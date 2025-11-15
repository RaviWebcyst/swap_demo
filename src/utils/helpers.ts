import Web3 from "web3";
import Swal from 'sweetalert2'

const Big = require("big.js");

export const symbolsArr = ["e", "E", "+", "-"];

export const customizeAddress = (address: string) => {
  let firstFive = address.substring(0, 5);
  let lastFour = address.substring(address.length - 4);
  return firstFive + "..." + lastFour;
};

export const cryptoDecimals = (inValue: string | number) => {
  let value = Number(inValue);
  if (value == 0) {
    return 0.0;
  } else if ((value > 0 && value <= 9) || (value < 0 && value >= -9)) {
    return toCustomFixed(value, 5);
  } else if ((value > 9 && value <= 99) || (value < -9 && value >= -99)) {
    return toCustomFixed(value, 4);
  } else if ((value > 99 && value <= 999) || (value < -99 && value >= -999)) {
    return toCustomFixed(value, 3);
  } else if (
    (value > 999 && value <= 9999) ||
    (value < -999 && value >= -9999)
  ) {
    return toCustomFixed(value, 2);
  } else if (value > 9999 || value < -9999) {
    return toCustomFixed(value, 0);
  }
};

export const toCustomFixed = (num: any, fixed: number) => {
  if (num == Infinity && fixed == 0) {
    return 0;
  } else {
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)[0];
  }
};

export const convertUsingTokenDecimals = async (
  tokenInfo: any,
  amount: any
) => {
  try {
    let amountstake =
      Number(amount) > 1000000
        ? Number(amount) / 10 ** tokenInfo?.decimals
        : Number(amount) / 10 ** tokenInfo?.decimals;
    return toFixer(amountstake);
  } catch (error) {
    return "0";
  }
};

export const toFixer = (x: any) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

export const localeStringFunction = (value: string | number) => {
  return value.toLocaleString("fullwide", {
    useGrouping: !1,
  });
};

export const slicedValue = (value: string) => {
  if (value?.includes(".")) {
    return value.slice(0, value?.indexOf("."));
  } else {
    return value;
  }
};

export const calculateDeadlineHelper = async (value?: number) => {
  let deadLine = Math.floor(new Date().getTime() / 1000);
  deadLine = value ? deadLine + value * 60 : deadLine + 10 * 60;
  
  return deadLine;
};

export const fromWeiConvert = (amount: string | any) => {
  return Web3.utils.fromWei(amount, "ether");
};

export const toFixed = (x: any) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};
export const validateInputField = async (
  e: string,
  decimals: number,
  max: boolean,
  emptyValues: any
) => {
  let values: any;
  const maxLength = 26;
  const regexHere = /^[+]?\d*(?:[.]\d*)?$/;
  const isInputValid = regexHere.test(e);
  if (!e) {
    emptyValues();
    return false;
  } else if (isInputValid) {
    values = e;
    if (values.includes(".")) {
      const split = values.split(".");
      if (split[1].length > decimals) {
        return false;
      }
    }
  }
  if (e?.length <= maxLength) {
    values = e;
  } else if (e?.length > maxLength) {
    return false;
  }
  if (
    values?.length > 1 &&
    Array.from(values)[0] == "0" &&
    Array.from(values)[1] != "."
  ) {
    values = values?.slice(1);
  }

  if (values?.toString().charAt(0) == ".") {
    values = "0" + values;
  }

  if (values?.toString()?.length > 18 && !max) {
    return false;
  } else {
    return values;
  }
};

export const divideBigNumber = (value: string, decimals: number) => {
  if (value) {
    const numerator = new Big(value);
    const denominator = new Big(10).pow(decimals); // Using pow method to raise 10 to the power of 18
    const result = numerator.div(denominator);
    const withoute = toFixer(result.toString());
    return withoute;
  }
};

export const walletConnectAlert = async (chain: string) => {
  try {
    Swal.fire({
      // customClass: 'walletmeta',
      icon: 'warning',
      title: 'Switch Network!',
      text: `Switch your network to the ${chain} chain in your mobile wallet app.`,
      showCancelButton: false,
      confirmButtonText: 'Ok',
      timer: 8000
    });
  } catch (error) {
  }
};


export const BlockExploreUrl: any = {
  1: "https://etherscan.io/tx/",
  324: "https://explorer.zksync.io/tx/",
  10: "https://optimistic.etherscan.io/tx/",
  137: "https://polygonscan.com/tx/",
  56: "https://bscscan.com/tx/",
  43114: "https://snowtrace.io/block/",
  42161: "https://arbiscan.io/tx/",
  59144: "https://lineascan.build/tx/",
  250: "https://ftmscan.com/tx/",
  1030: "https://www.confluxscan.io/transaction/",
  8453: "https://basescan.org/tx/",
  5000: "https://mantlescan.info/tx/",
};

export const networkChainName: any = {
  1: "Ethereum",
  324: "zkSync Era",
  10: "Optimism",
  137: "Polygon",
  56: "Binance Coin",
  66: "OKTC",
  43114: "Avalanche",
  42161: "Arbitrum",
  59144: "Linea",
  250: "Fantom",
  1030: "Conflux Espace",
  8453: "Base",
  5000: "Mantle",
};