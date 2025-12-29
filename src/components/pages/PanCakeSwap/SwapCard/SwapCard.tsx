import { AnimatePresence, motion } from "framer-motion";
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropUpswapIcon } from "../../../../assets/icons/svgicons";
import Button from "../../../common/Button/Button";
import SettingOverlay from "../../../common/SettingOverlay/SettingOverlay";
import ActiveTokenCard from "../../../common/PancakeTokenCard/ActiveTokenCard";
import SecondaryTokenCard from "../../../common/PancakeTokenCard/SecondaryTokenCard";
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import "./SwapCard.scss";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useWalletConnect } from "../../../../CustomHook/useWalletConnect";
import {
  BALANCE_HOOK,
  DOLLAR_VAL,
  INPUTS,
  TOKEN_DETAILS,
} from "../../../../interfaces/common";
import { GET_AMOUNTS_DATA } from "../../../../interfaces/swap";
import {
  getAmountsInfunction,
  getAmountsOutfunction,
  getFeePercentage,
  getPriceImpact,
  getUniV3AmountsInfunction,
  getUniV3AmountsOutfunction,
  useGetAmountsInterval,
} from "../../../../services/contractServices/PancakeContractServices";
import {
  convertUsingTokenDecimals,
  cryptoDecimals,
  toCustomFixed,
  validateInputField,
} from "../../../../utils/helpers";
import { TOKEN_DATA } from "../../../../interfaces/Liquidity";
import { store } from "../../../../app/store";
import useFetchTokenBalance from "../../../../CustomHook/useFetchTokenBalance";
// import { swapHelperFunction } from "../../../../services/SwapServices/SwapHelper";
import {
  setTokenOne,
  setTokenTwo,
} from "../../../../features/theme/token.slice";
import { TradeData } from "../../../../services/ApiServices/apiService";
import { setTransactionCounter } from "../../../../features/theme/user.slice";
import ConnectWallet from "../../../common/Header/ConnectWallet/ConnectWallet";
import useIsWrongNetwork from "../../../../CustomHook/useisWrongNetwork";
import TxnModal from "../../../common/Modals/TxnModal/TxnModal";
import CommonModal from "../../../common/Modals/CommonModal/CommonModal";
import ReviewSwap from "../ReviewSwap/ReviewSwap";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import axios from "axios";
import { useAppKit } from "@reown/appkit/react";

import { executeRoute, getRoutes } from '@lifi/sdk'
import Lottie from "lottie-react";
import { ClockIcon, GasIcon } from '../../../../assets/icons/icons/svgicons'
import loader from '../../../../assets/animations/rs_loader_.json'
import { formatUnits, parseUnits } from "viem";
import { TokensModalRef } from "../../../common/Modals/TokensModal/TokensModal";


var oldTknVal = "";

const SwapCard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isWrongNetwork = useIsWrongNetwork();
  const { tokenOne, tokenTwo }: { tokenOne: TOKEN_DATA; tokenTwo: TOKEN_DATA } =
    useAppSelector((store: any) => store?.token);
  const {
    walletAddress,
    transactionCounter,
    slippage,
  }: { walletAddress: string; transactionCounter: boolean; slippage: number } =
    useAppSelector((store: any) => store?.user);
  const { walletProvider } = useWalletConnect();
  const [show, setShow] = useState<boolean>(false);
  const [reviewShow, setReviewShow] = useState<boolean>(false);

  const [modalData, setModalData] = useState<any>({
    status: "",
    bodyText: "",
    title: "",
    txHash: "",
  });

  const [usdPrice, setUsdPrice] = useState<number | string>(0.0);
  const [quoteList, setQuoteList] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lifiRoute, setLifiRoute] = useState<any>([])
  const [activeIndex, setActiveIndex] = useState(0);
  const [bnbdollar, setBnbdollar] = useState<any>(0.0)

  const [quoteListMetaData, setQuoteListMetaData] = useState<any>({});







  const { open } = useAppKit();

  const [showMore, setShowMore] = useState<boolean>(false);
  const [priceImpact, setPriceImpact] = useState<string | undefined>("");
  const [priceList, setPriceList] = useState<any>([0, 0]);
  const [showRight, setShowRight] = useState<boolean>(false);
  const [rate, setRate] = useState<string>("");
  const [rate1, setRate1] = useState<string>("");
  const [rate2, setRate2] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [type1, setType1] = useState<string>("");
  const [type2, setType2] = useState<string>("");
  const [isSwitched, setIsSwitched] = useState<boolean>(false);
  const [shimmerState, setShimmerState] = useState<string>("");
  const [showConnectWallet, setConnectWallet] = useState<boolean>(false);
  const [selectedField, setselectedField] = useState<string>("");
  const [maxValueCheck, setmaxValueCheck] = useState<boolean>(false);
  const [tk1DollarValue, setTk1DollarValue] = useState<number | string>(0.0);
  var [dollar1, setDoller1] = useState<number | string>(0.0);
  const [dollar2, setDoller2] = useState<number | string>(0.0);
  const [tk2DollarValue, setTk2DollarValue] = useState<number | string>(0.0);
  const [contAdd, setConAdd] = useState<any>("");
  const [time, setTime] = useState<number>(59);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sufficientLiquidityCheck, setSufficientLiquidityCheck] =
    useState<boolean>(false);
  const [inputOne, setinputOne] = useState<INPUTS>({
    inputValue: "",
    convertedValue: "",
    toolTipValue: "",
  });
  const [inputTwo, setinputTwo] = useState<INPUTS>({
    inputValue: "",
    convertedValue: "",
    toolTipValue: "",
  });
  const [inputFixedTwo, setfixedinputTwo] = useState<INPUTS>({
    inputValue: "",
    convertedValue: "",
    toolTipValue: "",
  });

  const [active, setActive] = useState<any>({
    active1: true,
    active2: false,
  });

  const [inputFixedOne, setfixedinputOne] = useState<INPUTS>({
    inputValue: "",
    convertedValue: "",
    toolTipValue: "",
  });

  const getPrice = async (coin: any) => {
    var price = 0;
    return price;
    // try {
    //   var res: any = await axios.get(`https://gmteoqbjt5.execute-api.us-east-1.amazonaws.com/src/server/V1/coin/${coin.toString().toLowerCase()}`);
    //   if (res?.data?.status) {
    //     price = res?.data?.data?.priceUSD;
    //   }
    //   return price;
    // }
    // catch {
    //   return price;
    // }
  }

  const tokenModalRef1 = useRef<TokensModalRef>(null)
  const tokenModalRef2 = useRef<TokensModalRef>(null)

  type CostList = { amountUSD?: string }[] | undefined

  type Step = {
    estimate?: { feeCosts?: CostList; gasCosts?: CostList }
    includedSteps?: Step[]
  }

  type StepData = Step[] | undefined


  const data: GET_AMOUNTS_DATA = {
    tokenOneAddress: tokenOne?.address,
    tokenTwoAddress: tokenTwo?.address,
    amountIn: (10 ** tokenOne?.decimals)?.toLocaleString("fullwide", {
      useGrouping: !1,
    }),
    dispatch,
    walletProvider,
  };

  // useGetAmountsInterval(data, 10000);




  const toggleVisibility = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    if (transactionCounter) {
      getBackToOriginalState();
      dispatch(setTransactionCounter(false));
    }
  }, [transactionCounter]);

  useEffect(() => {
    // console.log(selectedField,"selectedField");

    if (
      selectedField == "TK1" &&
      !isSwitched &&
      inputOne?.convertedValue != ""
    ) {

      const delayDebounce: NodeJS.Timeout = setTimeout(() => {
        handleGetAmountsData("TK1", inputOne?.convertedValue, false);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }

  }, [inputOne, inputFixedOne]);

  useEffect(() => {

    if (
      selectedField == "TK2" &&
      !isSwitched &&
      inputTwo?.convertedValue != ""
    ) {
      const delayDebounce: NodeJS.Timeout = setTimeout(() => {
        handleGetAmountsData("TK2", inputTwo?.convertedValue, false);

      }, 500);
      return () => clearTimeout(delayDebounce);
    }

  }, [inputTwo, inputFixedTwo]);

  useEffect(() => {
    getReservesFirstTime();
    if (!isSwitched) emptyValues();

    trade();
    setShowRight(false);
  }, [tokenOne, tokenTwo, walletAddress]);

  const trade = async () => {
    const newTknVal = `${tokenOne.symbol}${tokenTwo.symbol}`;
    if (oldTknVal == newTknVal) {
      return;
    } else {
      oldTknVal = newTknVal;
    }

    // let token1dollarprice = await getPrice(tokenOne.symbol);
    // let token2dollarprice = await getPrice(tokenTwo.symbol);



    // if(token1dollarprice == undefined ){
    //   setTk1DollarValue(0.0);
    // }
    // else{
    //     var value = token1dollarprice * Number(inputOne?.inputValue);
    //      setTk1DollarValue(value);
    // }

    // if(token2dollarprice == undefined ){
    //   setTk2DollarValue(0.0);
    // }
    // else{
    //     var value = token2dollarprice * Number(inputTwo?.inputValue);
    //      setTk2DollarValue(value);
    // }
    // let getDollarPriceValue: DOLLAR_VAL = await TradeData(
    //   tokenOne.symbol,
    //   tokenTwo.symbol
    // );

    // if (
    //   !getDollarPriceValue?.token0 ||
    //   getDollarPriceValue?.token0 === "This token is not Listed on CMC."
    // ) {
    //   setTk1DollarValue(0.0);
    // } else {
    //   setTk1DollarValue(getDollarPriceValue?.token0);
    // }

    // if (
    //   !getDollarPriceValue?.token1 ||
    //   getDollarPriceValue?.token1 === "This token is not Listed on CMC."
    // ) {
    //   setTk2DollarValue(0.0);
    // } else {
    //   setTk2DollarValue(getDollarPriceValue?.token1);
    // }
  };
  // const { chainValues } = useAppSelector((state: any) => user);


  const calculateTotalGasFeeUsd = (stepsData: StepData): number => {
    let totalFeeUsd = 0.0

    const sumCosts = (costs: CostList): number =>
      costs?.reduce((sum, cost) => sum + parseFloat(cost.amountUSD || '0'), 0) || 0

    if (stepsData) {
      stepsData.forEach((step) => {
        const estimate = step.estimate
        if (estimate) {
          // totalFeeUsd += sumCosts(estimate.feeCosts);
          totalFeeUsd += sumCosts(estimate.gasCosts)
        }
      })
    }
    return parseFloat(totalFeeUsd.toFixed(4))
  }


  const getLifiQuote = async (amount: any) => {

    const decimals = tokenOne.decimals; // VERY IMPORTANT

    const blockchainAmount = parseUnits(amount, decimals).toString();


    var data: any = {
      fromChainId: Number(tokenOne?.chainId),
      toChainId: Number(tokenTwo?.chainId),
      fromTokenAddress: tokenOne?.address,
      toTokenAddress: tokenTwo?.address,
      fromAmount: blockchainAmount,
    }



    if (walletAddress) {
      data = { ...data, fromAddress: walletAddress };
    }

    const result = await getRoutes(data);


    const route = result.routes.map((route: any) => ({
      ...route,
      fromAmount: formatUnits(route.fromAmount, decimals),
      toAmount: formatUnits(route.toAmount, tokenTwo.decimals),
    }));

    return route;
  };
  const getReservesFirstTime = async () => {


    // const data: GET_AMOUNTS_DATA = {
    //   tokenOneAddress: tokenOne?.address,
    //   tokenTwoAddress: tokenTwo?.address,
    //   amountIn: (10 ** tokenOne?.decimals)?.toLocaleString("fullwide", {
    //     useGrouping: !1,
    //   }),
    //   dispatch,
    //   walletProvider,
    // };




    // const reserveData: Array<string> = await getAmountsOutfunction(data);






    // if (reserveData == undefined) {
    //   setRate("0");
    //   setRate1("0");
    //   setRate2("0");
    // } else {
    //   var rates =
    //     await convertUsingTokenDecimals(
    //       tokenTwo,
    //       reserveData[1]);





    //   //bigger value in rates1




    //   // setRate(

    //   //   cryptoDecimals(
    //   //     Number(reserveData[1]) / 10 ** tokenTwo?.decimals
    //   //   ).toString()
    //   // );

    //   setRate(Number(rates).toFixed(2));


    // }
  };

  const tokenDetails: TOKEN_DETAILS = useMemo(() => {
    const list: TOKEN_DATA[] = store.getState()?.token?.tokenList;
    return {
      tokenOneAddress: tokenOne?.address,
      tokenTwoAddress: tokenTwo?.address,
      tokenOneData: tokenOne,
      tokenTwoData: tokenTwo,
      // isTokenOneNative:false,
      // isTokenTwoNative:false,
      // isTokenOneNative: (list[0]?.address == tokenOne?.address && list[0]?.isNative) ? true : false,
      // isTokenTwoNative: (list[0]?.address == tokenTwo?.address && list[0]?.isNative) ? true : false,
      isTokenOneNative: list[0]?.address == tokenOne?.address ? true : false,
      isTokenTwoNative: list[0]?.address == tokenTwo?.address ? true : false,
    };
  }, [tokenOne, tokenTwo]);

  const { tokenBalance, fetchData }: BALANCE_HOOK = useFetchTokenBalance({
    dispatch,
    tokenDetails,
  });
  const emptyValues = () => {
    setinputTwo({
      convertedValue: "",
      inputValue: "",
      toolTipValue: "",
    });
    setinputOne({
      convertedValue: "",
      inputValue: "",
      toolTipValue: "",
    });
  };

  const handleInputOne = async (e: string, max: boolean, field: string) => {
    setTk1DollarValue(0.0);
    if (walletAddress) {
      setShimmerState("Tk2");
    }
    const response: boolean | string = await validateInputField(
      e,
      tokenOne?.decimals,
      max,
      emptyValues
    );



    if (response) {
      setselectedField(field);
      let convertedValue: string = (
        max ? response : Number(response) * 10 ** tokenOne?.decimals
      ).toLocaleString("fullwide", {
        useGrouping: !1,
      });

      let originalValue: string = (
        max
          ? cryptoDecimals(Number(response) / 10 ** tokenOne?.decimals)
          : response
      ).toLocaleString("fullwide", {
        useGrouping: !1,
      });
      setIsSwitched(false);

      setinputOne({
        convertedValue: convertedValue,
        inputValue: originalValue,
        toolTipValue: convertedValue,
      });
      let token1dollarprice = await getPrice(tokenOne.symbol);
      if (token1dollarprice == undefined) {
        setTk1DollarValue(0.0);
      }
      else {
        var value = token1dollarprice * Number(originalValue);
        setTk1DollarValue(value);
      }
    } else {
      setShimmerState("null");
      setPriceImpact("0");
      setShowRight(false);
    }
  };

  const handleInputTwo = async (e: string, max: boolean, field: string) => {
    setTk2DollarValue(0.0);
    if (walletAddress) {
      setShimmerState("Tk1");
    }

    const response: boolean | string = await validateInputField(
      e,
      tokenTwo?.decimals,
      max,
      emptyValues
    );


    if (response) {
      setselectedField(field);
      let convertedValue: string = (
        max ? response : Number(response) * 10 ** tokenTwo?.decimals
      ).toLocaleString("fullwide", {
        useGrouping: !1,
      });

      let originalValue: string = (
        max
          ? cryptoDecimals(Number(response) / 10 ** tokenTwo?.decimals)
          : response
      ).toLocaleString("fullwide", {
        useGrouping: !1,
      });



      setIsSwitched(false);
      setinputTwo({
        convertedValue: convertedValue,
        inputValue: originalValue,
        toolTipValue: convertedValue,
      });


      setfixedinputTwo({
        convertedValue: convertedValue,
        inputValue: originalValue,
        toolTipValue: convertedValue,
      });


      let token2dollarprice = await getPrice(tokenTwo.symbol);

      if (token2dollarprice == undefined) {
        setTk2DollarValue(0.0);
      }
      else {
        var value = token2dollarprice * Number(originalValue);
        setTk2DollarValue(value);
      }


    } else {
      setShimmerState("null");
      setPriceImpact("0");
    }
  };

  useEffect(() => {
    if (showRight) {
      handleTime();

      // Cleanup on unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [showRight]);

  const handleTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTime(59);

    var value = selectedField == "TK1" ? inputOne?.convertedValue : inputTwo?.convertedValue;




    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime < 1) {
          return 59;
          // clearInterval(intervalRef.current!);
          // return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }




  const setInputValue = async (amount: any, fieldCondition: any, data: any, active: any, rate: any) => {
    var type = data?.dex

    setActiveIndex(active)

    var decimals = fieldCondition == 'TK1' ? tokenTwo?.decimals : tokenOne?.decimals
    var value: any = cryptoDecimals(Number(amount) * 10 ** decimals).toString()

    const list = store.getState()?.user?.contractDetails

    // var cont_address =
    //   type == 'rzr-v2'
    //     ? list?.router?.address
    //     : type == 'uniswap-v2'
    //       ? list?.uniswap?.address
    //       : type == 'uniswap-v3'
    //         ? '0xed774a004dde83e72be5b3eaad3918f7232b470e'
    //         : list?.panCakeSwap?.address

    // if (type.startsWith('lifi')) {
    //   cont_address = 'lificontract' 
    // }

    // setConAdd(cont_address)

    setinputTwo({
      convertedValue: value,
      inputValue: toCustomFixed(amount, 7),
      toolTipValue: amount,
    })

    setfixedinputTwo({
      convertedValue: value,
      inputValue: toCustomFixed(amount, 7),
      toolTipValue: amount,
    })

    setTk2DollarValue(data?.lifiRoute?.toAmountUSD)

  }


  //without fees

  const handleGetAmountsData = async (
    fieldCondition: string,
    amount: string,
    max: boolean
  ) => {

    // const data: GET_AMOUNTS_DATA = {
    //   tokenOneAddress: tokenOne?.address,
    //   tokenTwoAddress: tokenTwo?.address,
    //   amountIn: amount,
    //   max: max,
    //   dispatch,
    //   walletProvider,
    // };
    setQuoteList([]);

    if (Number(inputOne?.inputValue) <= 0) {
      return;
    }

    setIsLoading(true)
    setShowRight(true)

    setActiveIndex(0)

    var result: any = await getLifiQuote(inputOne?.inputValue);

    if (result.length == 0) {
      setIsLoading(false);
      return;
    }
    console.log(result, "result");


    const ress: any = await getLifiQuote("1");
    console.log(ress, "ress");

    const res = result.map((data: any) => {
      const dataTool = data?.steps?.[0]?.tool;

      // find matching item in entire ress array
      const matchedRess = ress?.find(
        (r: any) => r?.steps?.[0]?.tool === dataTool
      );
      
      const tokenOutPerTokenIn = matchedRess
        ? Number(data?.toAmount)
        : 0;

      return {
        ...data,
        tokenOutPerTokenIn,
      };
    });

    //  tokenOutPerTokenIn


    // setUsdPrice(res[0]?.lifiRoute?.toToken?.priceUSD);
    setTk1DollarValue(res[0]?.fromAmountUSD)
    setTk2DollarValue(res[0]?.toAmountUSD)
    setQuoteList(res)
    setLifiRoute(res[0])
    setIsLoading(false);
    handleTime();

    setinputTwo({
      convertedValue: res[0]?.toAmount,
      inputValue: Number(res[0]?.toAmount).toFixed(7),
      toolTipValue: Number(res[0]?.toAmount).toFixed(7),
    });



    setShimmerState("null");



    // const tokenValue: string[2] | undefined | any =
    //   fieldCondition == "TK1"
    //     ? await getAmountsOutfunction(data)
    //     : await getAmountsInfunction(data);

    // // console.log("all data",data);
    // // console.log("tokenValue data",tokenValue);



    // const u3swaptokenValue: string[2] | undefined | any =
    //   fieldCondition == "TK1"
    //     ? await getUniV3AmountsOutfunction(data)
    //     : await getUniV3AmountsInfunction(data);



    // const fixed_data: GET_AMOUNTS_DATA = {
    //   tokenOneAddress: tokenOne?.address,
    //   tokenTwoAddress: tokenTwo?.address,
    //   amountIn: (10 ** tokenOne?.decimals)?.toLocaleString("fullwide", {
    //     useGrouping: !1,
    //   }),
    //   dispatch,
    //   walletProvider,
    // };


    // if (tokenValue == undefined || (tokenValue[0] && tokenValue[1] == "0")) {
    //   setSufficientLiquidityCheck(true);
    //   setShimmerState("null");
    //   setPriceImpact("0");
    //   setShowRight(false);
    // } else {
    //   setSufficientLiquidityCheck(false);

    //   //maxEthAmount
    //   // var value:any= BigInt(10000);
    //   // var per:any= BigInt(1);
    //   // var tv:any = Number(tokenValue[0]) * Number((value+per)/value);

    //   // tv= tv.toString();

    //   var tokenValue1 = tokenValue[1];




    //   var value1: any = await convertUsingTokenDecimals(
    //     fieldCondition == "TK1" ? tokenTwo : tokenOne,
    //     fieldCondition == "TK1" ? tokenValue[1] : tokenValue[0]
    //   );
    //   var value2: any = await convertUsingTokenDecimals(
    //     fieldCondition == "TK1" ? tokenTwo : tokenOne,
    //     fieldCondition == "TK1" ? u3swaptokenValue[0] : u3swaptokenValue[0]
    //   );


    //   const pancakeData: Array<string> = await getAmountsOutfunction(fixed_data);
    //    const univ3Data: Array<string> = await getUniV3AmountsOutfunction(fixed_data);

    //   var rates1 =await convertUsingTokenDecimals( tokenTwo,pancakeData[1]);
    //   var rates2 =await convertUsingTokenDecimals( tokenTwo,univ3Data[0]);

    //    const list = store.getState()?.user?.contractDetails;
    //      var type1 = "PanCake";
    //     var type2 = "Uniswapv3";
    //     var cont_address = list?.panCakeSwap?.address;


    //   if (Number(u3swaptokenValue[0]) > Number(tokenValue[1])) {
    //     tokenValue1 = u3swaptokenValue[0];

    //     rates1 = await convertUsingTokenDecimals( tokenTwo,univ3Data[0]);
    //     rates2 = await convertUsingTokenDecimals( tokenTwo,pancakeData[1]);

    //     value1 = await convertUsingTokenDecimals(
    //       fieldCondition == "TK1" ? tokenTwo : tokenOne,
    //       fieldCondition == "TK1" ? u3swaptokenValue[0] : u3swaptokenValue[0]
    //     );
    //     value2 = await convertUsingTokenDecimals(
    //       fieldCondition == "TK1" ? tokenTwo : tokenOne,
    //       fieldCondition == "TK1" ? tokenValue[1] : tokenValue[0]
    //     );

    //     type1 = "Uniswapv3";
    //     type2 = "PanCake";
    //     cont_address = list?.quote?.address;
    //   }


    //   setConAdd(cont_address);
    //   setType1(type1);
    //   setType2(type2);
    //   setType(type1);

    //   setRate(Number(rates1).toFixed(2));
    //   setRate1(Number(rates1).toFixed(2));
    //   setRate2(Number(rates2).toFixed(2));

    //   setPriceList([value1, value2]);

    //   setShowRight(true);




    //   //  console.log(tokenValue1,"tokenValue1");



    //   const calculatedBalance: string = await convertUsingTokenDecimals(
    //     fieldCondition == "TK1" ? tokenTwo : tokenOne,
    //     fieldCondition == "TK1" ? tokenValue1 : tokenValue[0]
    //   );


    //   if (Number(calculatedBalance)) {

    //            var inputvalue: any = inputOne.inputValue
    //           var ra: any = Number(calculatedBalance) / Number(inputvalue)
    //           var re = Number(rate)
    //           var ress: any = Number(((re - ra) / re) * 100)
    //           if (ress < 0) {
    //             ress = -ress
    //           }
    //           setPriceImpact(cryptoDecimals(ress))

    //     fieldCondition == "TK1"
    //       ? setinputTwo({
    //         convertedValue: tokenValue1,
    //         inputValue: toCustomFixed(calculatedBalance, 7),
    //         toolTipValue: calculatedBalance,
    //       })
    //       : setinputOne({
    //         convertedValue: tokenValue[0],
    //         inputValue: toCustomFixed(calculatedBalance, 7),
    //         toolTipValue: calculatedBalance,
    //       });
    //     setShimmerState("null");

    //     var tokenprice = fieldCondition == "TK1" ? await getPrice(tokenTwo?.symbol) : await getPrice(tokenOne?.symbol);
    //     if (tokenprice != undefined) {
    //       var value = toCustomFixed(calculatedBalance, 7) * Number(tokenprice);
    //       fieldCondition == "TK1" ? setTk2DollarValue(value) : setTk1DollarValue(value);
    //       var dollar1 = Number(value1 * Number(tokenprice)).toFixed(8);
    //       var dollar2 = Number(value2 * Number(tokenprice)).toFixed(8);
    //       setDoller1(dollar1);
    //       setDoller2(dollar2);
    //     }
    //   }
    // }
  };

  const handleMaximumFunction = async (data: string) => {
    setmaxValueCheck(true);

    if (data == "TK1" && tokenBalance?.token1BalanceConverted > 0) {
      if (tokenDetails?.isTokenOneNative) {
        const newBalance: number =
          tokenBalance?.token1BalanceConverted - 1000000000000000; // deduct 0.001 as gas fees for native currency
        handleInputOne(
          newBalance > 0 ? newBalance.toString() : "0",
          true,
          data
        );
      } else {
        handleInputOne(
          tokenBalance?.token1BalanceConverted.toString(),
          true,
          data
        );
      }
    } else if (data === "TK2" && tokenBalance?.token2BalanceConverted > 0) {
      if (tokenDetails?.isTokenTwoNative) {
        const newBalance: number =
          tokenBalance?.token2BalanceConverted - 1000000000000000; // deduct 0.001 as gas fees for natve currency
        handleInputTwo(
          newBalance > 0 ? newBalance.toString() : "0",
          true,
          data
        );
      } else {
        handleInputTwo(
          tokenBalance?.token2BalanceConverted.toString(),
          true,
          data
        );
      }
    }
  };

  const getBackToOriginalState = async () => {
    emptyValues();
    await fetchData();
  };
  const handleSwitchTokens = async () => {
    dispatch(setTokenOne(tokenTwo));
    dispatch(setTokenTwo(tokenOne));
    if (inputTwo?.convertedValue) {
      setIsSwitched(true);
      setShimmerState("Tk2");


      setinputOne({
        convertedValue: inputTwo?.convertedValue,
        inputValue: inputTwo?.inputValue,
        toolTipValue: (
          Number(inputTwo?.convertedValue) /
          10 ** tokenTwo?.decimals
        ).toString(),
      });

      const data: GET_AMOUNTS_DATA = {
        tokenOneAddress: tokenTwo?.address,
        tokenTwoAddress: tokenOne?.address,
        amountIn: (
          Number(inputTwo?.inputValue) *
          10 ** tokenTwo?.decimals
        )?.toLocaleString("fullwide", {
          useGrouping: !1,
        }),
        dispatch,
        walletProvider,
      };


      const tokenTwoValue: string[2] | undefined = await getAmountsOutfunction(
        data
      );

      const u3swaptokenValue: string[2] | undefined | any = await getUniV3AmountsOutfunction(data)



      if (tokenTwoValue == undefined) {
        setSufficientLiquidityCheck(true);
        setShimmerState("null");
      } else {

        var calculatedBalance: string = await convertUsingTokenDecimals(
          tokenOne,
          tokenTwoValue[1]
        );
        var calculatedBalance1: string = await convertUsingTokenDecimals(
          tokenOne,
          u3swaptokenValue[0]
        );

        if (u3swaptokenValue[0] > tokenTwoValue[1]) {
          calculatedBalance = await convertUsingTokenDecimals(
            tokenOne,
            u3swaptokenValue[0]
          );
          calculatedBalance1 = await convertUsingTokenDecimals(
            tokenOne,
            tokenTwoValue[1]
          );

        }


        setShowRight(true);

        setPriceList([calculatedBalance, calculatedBalance1]);


        if (Number(calculatedBalance)) {


          var inputvalue: any = inputOne.inputValue
          var ra: any = Number(calculatedBalance) / Number(inputvalue)
          var re = Number(rate)
          var ress: any = Number(((re - ra) / re) * 100)
          if (ress < 0) {
            ress = -ress
          }
          setPriceImpact(cryptoDecimals(ress))

          setinputTwo({
            convertedValue: tokenTwoValue[1],
            inputValue: toCustomFixed(calculatedBalance, 7),
            toolTipValue: calculatedBalance,
          });
          setShimmerState("null");
          setSufficientLiquidityCheck(false);
        }
      }
    } else {
      setShimmerState("null");
    }
  };
  /**
   * variable that will store boolean value whether the input fields are empty or not
   */
  /**
   * variable that will store boolean value whether inputs are greater than balances or not
   */
  const insufficientBalance =
    Number(tokenBalance?.token1BalanceConverted) <
    Number(inputOne?.convertedValue);



  return (
    <>
      <div className="addCardBox d-md-flex justify-content-center gap-md-5">
        <div className="addCardBox_swap">
          <div className="addCard_heading mx-auto">
            <h1 className="titleHeading">Swap</h1>
            <div className={`p-3 seticon-bg`}>
              <SettingOverlay />
            </div>
          </div>
          <div className="addCard">
            <div className="addCard_tokenvalues d-grid gap-3">
              <ActiveTokenCard
                field="Field1"
                balance={tokenBalance}
                input={handleInputOne}
                value={inputOne}
                maxFunction={handleMaximumFunction}
                dollarVal={tk1DollarValue}
                shimmer={shimmerState}
              />
              <div className="swapbt">

                <Button className="swapBtn my-2" onClick={() => handleSwitchTokens()}>
                  {/* <DropUpswapIcon /> */}
                  <IoIosArrowRoundDown className="icon down" />
                  <IoIosArrowRoundUp className="icon up" />

                </Button>
              </div>
              <SecondaryTokenCard
                field="Field2"
                balance={tokenBalance}
                input={handleInputTwo}
                value={inputTwo}
                dollarVal={tk2DollarValue}
                shimmer={shimmerState}
                key=""

              />
            </div>

            <div className="addCard_footer ">
              <Button
                fluid
                className={`btnapprove mb-3 ${!walletAddress
                  ? "fluid"
                  : isWrongNetwork ||
                    insufficientBalance ||
                    sufficientLiquidityCheck ||
                    Number(inputOne?.convertedValue) == 0 ||
                    Number(inputTwo?.convertedValue) == 0
                    ? "grayBorder"
                    : "fluid"
                  }`}
                onClick={() => {
                  if (!walletAddress) {
                    open({ view: "Connect" });
                    // setConnectWallet(true);
                  } else {

                    setReviewShow(true);
                    // navigate("review-swap", {
                    //   state: {
                    //     tokenDetails,
                    //     selectedField,
                    //     inputOne,
                    //     inputTwo,
                    //     tk1DollarValue,
                    //     tk2DollarValue,
                    //   },
                    // });
                  }
                }}
                disabled={
                  !walletAddress
                    ? false
                    : isWrongNetwork ||
                    insufficientBalance ||
                    sufficientLiquidityCheck ||
                    Number(inputOne?.inputValue) == 0 ||
                    Number(inputTwo?.inputValue) == 0
                }
              >
                {!walletAddress
                  ? "Connect Wallet"
                  : insufficientBalance
                    ? `Insufficient ${tokenOne?.symbol}`
                    : sufficientLiquidityCheck
                      ? "Insufficient Liquidity"
                      : // : chainValues.label === "SBC"
                      // ? "Trade will be Live Soon!"
                      "Approve and Swap"}
              </Button>
            </div>
            {/* <div className="showBtn">
              <button onClick={toggleVisibility}>
                {!showMore ? "Show More" : "Show Less"}
              
              </button>
            </div>
            <ul className="addCard_valuesList">
              <li>
                <label>Price impact</label>
                <p>~{priceImpact || "0"}%</p>
              </li>

              <li>
                <label>Rate:</label>
                <p>
                  1 {tokenOne?.name} = {rate} {tokenTwo?.name}
                </p>
              </li>
              <AnimatePresence mode="sync">
                {showMore && (
                  <>
                    <motion.li
                      initial={{ x: 100, opacity: 0 }}
                      exit={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.1,
                      }}
                    ></motion.li>
                    <motion.li
                      animate={{ x: 0, opacity: 1 }}
                      initial={{ x: 100, opacity: 0 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{
                        delay: 0.2,
                      }}
                    >
                      <label>Slippage</label>
                      <p>{slippage}%</p>
                    </motion.li>
                    <motion.li
                      exit={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      initial={{ x: 100, opacity: 0 }}
                      transition={{
                        delay: 0.3,
                      }}
                    >
                      <label>Order routing</label>
                      <p>swap</p>
                    </motion.li>
                  </>
                )}
              </AnimatePresence>
            </ul> */}
          </div>
          {/* previous btn  */}
        </div>

        <AnimatePresence mode="sync">
          {showRight && (
            <motion.li
              initial={{ x: 100, opacity: 0 }}
              exit={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.1,
              }}
              style={{ listStyle: 'none' }}
            >
              <div className="addCardBox_recieve ">
                <div className="addCard_heading mx-auto justify-content-between">
                  <h1 className="titleHeading">Receive</h1>
                  <div className={`p-3 seticon-bg`}>
                    {/* <SettingOverlay /> */}
                    <div className="time_left">
                      <div className="d-flex gap-3 align-items-center justify-content-center">
                        <img
                          src="assets/images/swap_reciev/refresh-circle.svg"
                          onClick={() => {
                            handleGetAmountsData('TK1', inputOne.convertedValue, false)
                          }}
                        />
                        <p className="time_second font-geist">{time}s left</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="addCard mh-50">
                  {isLoading && (
                    <Lottie
                      animationData={loader}
                      className={`lottie_animation loading d-flex mx-auto my-auto w-25`}
                      loop={true}
                    />
                  )}
                  {quoteList.length === 0 && !isLoading && (
                    <div className="text-center d-grid gap-3">
                      <div>
                        <svg className="routeImg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 15.18V7c0-2.21-1.79-4-4-4s-4 1.79-4 4v10c0 1.1-.9 2-2 2s-2-.9-2-2V8.82C8.16 8.4 9 7.3 9 6c0-1.66-1.34-3-3-3S3 4.34 3 6c0 1.3.84 2.4 2 2.82V17c0 2.21 1.79 4 4 4s4-1.79 4-4V7c0-1.1.9-2 2-2s2 .9 2 2v8.18c-1.16.41-2 1.51-2 2.82 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.3-.84-2.4-2-2.82"></path>
                        </svg>
                      </div>
                      <h3>No Route Found </h3>
                      <h5>
                        Reasons for that could be: low liquidity, amount selected is too low, gas costs are too high or
                        there are no routes for the selected combination.
                      </h5>
                    </div>
                  )}
                  {quoteList.length > 0 &&
                    quoteList.map((data: any, index: any) => (
                      <div className="addCard_recieveValues mt-4" key={index}>
                        <div
                          className={`recieve_values_div ${index == activeIndex ? 'recieve_active' : ''}`}
                          onClick={() => {
                            setInputValue(
                              data.toAmount,
                              selectedField,
                              data,
                              index,
                              0,
                            )
                            setLifiRoute(data)
                          }}
                        >
                          <div className="best_returns"></div>
                          <div className="first_value_div pt-3">
                            <Accordion>
                              <Accordion.Item eventKey="0" className="border-0">
                                <Accordion.Header>
                                  <div className="d-flex align-items-center gap-3">
                                    <img src={tokenTwo.icon} className="sideicon" />
                                    <div className="font-geist">
                                      <h1 className="fw-bold">{Number(data.toAmount).toFixed(7)}</h1>
                                      <div className="d-flex align-items-center gap-3">
                                        {/* <h5 className="mt-1 fw-medium">${Number(toCustomFixed(data.amountOutFormatted, 7) * Number(usdPrice)).toFixed(1)}</h5> */}
                                        <h5 className="mt-1 fw-medium">
                                          $
                                          {Number(data?.toAmount * data?.toToken?.priceUSD).toFixed(5)}
                                          {/* <small>{data.priceImpactPercentFormatted}</small> */}
                                        </h5>
                                        <div className="d-flex align-items-center gap-2 squid_div">
                                          <img
                                            src={data?.steps?.[0]?.toolDetails?.logoURI || ''}
                                            width={25}
                                          />
                                          {/* {data.dex} */}
                                          {data?.steps[0].toolDetails?.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div className="squid_ul">
                                    <div className="d-flex gap-3">
                                      <img
                                        src={data?.steps?.[0]?.toolDetails?.logoURI || ''}
                                        width={25}
                                      />
                                      {/* <p className="squid_lifi_text">{data.dex}</p> */}
                                      <p className="squid_lifi_text">
                                        {data?.steps[0].toolDetails?.name}
                                      </p>
                                    </div>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-4 recieve_price_div d-flex justify-content-between">
                            <h6>
                              {/* 1 {tokenOne?.name} ~ {Number(data.fixedRate).toFixed(2)} {tokenTwo?.name} */}1{' '}
                              {tokenOne?.name} ~ {data.tokenOutPerTokenIn} {tokenTwo?.name}
                            </h6>
                            <div className="d-flex gap-4">
                              <p className='d-flex gap-2'>
                                <div className='my-auto'>
                                  <GasIcon /></div><div className='my-auto'>$
                                  {data?.steps?.length > 0
                                    ? calculateTotalGasFeeUsd(data.steps).toFixed(5)
                                    : ""} </div>
                              </p>
                              {/* <p><GasIcon /> ${data?.lifiRoute?.gasCostUSD || Number(parseFloat(data.estimatedGasFeeFormatted.replace(/[^\d.]/g, '')) * bnbdollar).toFixed(5)}</p> */}



                              <p className='d-flex gap-2'>
                                <div className='my-auto'>
                                  <ClockIcon />
                                </div>
                                <div className='my-auto'>
                                  {data?.steps[0].estimate.executionDuration || '30'}s
                                </div>
                              </p>


                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.li>
          )}
        </AnimatePresence>

        {/* <AnimatePresence mode="sync">
          {showRight && (
            <motion.li
              initial={{ x: 100, opacity: 0 }}
              exit={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.1,
              }}
              style={{ 'listStyle': 'none' }}
            >
              <div className="addCardBox_recieve">
                <div className="addCard_heading mx-auto">
                  <h1 className="titleHeading">Recieve</h1>
                  <div className={`p-3 seticon-bg`}>
                 
                    <div className="time_left">
                      <div className="d-flex gap-3 align-items-center justify-content-center">
                        <img src="assets/images/swap_reciev/refresh-circle.svg" onClick={() => handleTime()} />
                        <p className="time_second font-geist">{time}s left</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="addCard">
                  {priceList[0] > 0 && (
                  <div className="addCard_recieveValues">
                    <div className={`recieve_values_div ${active.active1 ? 'recieve_active':'' }`} onClick={()=>setInputValue(priceList[0],selectedField,type1,"active1",rate1)}>
                      <div className="best_returns">
                       
                      </div>
                      <div className="first_value_div pt-3">
                        <Accordion>
                          <Accordion.Item eventKey="0" className="border-0">
                            <Accordion.Header>
                              <div className="d-flex align-items-center gap-3" >
                                <img src={tokenTwo.icon} className="sideicon" />
                                <div className="font-geist">
                                  <h1 className="fw-bold">{priceList[0]}</h1>
                                  <div className="d-flex align-items-center gap-3">
                                   
                                    <div className="d-flex align-items-center gap-2 squid_div">
                                      <img src={`${type1 == "Uniswapv3" ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png' : 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'}`} width={25} />{type1}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="squid_ul">
                                <div className="d-flex gap-3">
                                  <img src={`${type1 == "Uniswapv3" ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png' : 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'}`} width={25} />
                                  <p className="squid_lifi_text">{type1} </p>
                                </div>
                              
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-4 recieve_price_div">
                        <h6>
                          1 {tokenOne?.name} ~ {rate1} {tokenTwo?.name}
                        </h6>
                    
                      </div>
                    </div>
                  </div>
                  )}
                    {priceList[1] > 0 && (

                  <div className="addCard_recieveValues mt-4">
                    <div className={`recieve_values_div ${active.active2 ? 'recieve_active':'' }`} onClick={()=>setInputValue(priceList[1],selectedField,type2,"active2",rate2)}>
                      <div className="best_returns">
                     
                      </div>
                      <div className="first_value_div pt-3">
                        <Accordion>
                          <Accordion.Item eventKey="0" className="border-0">
                            <Accordion.Header>
                              <div className="d-flex align-items-center gap-3" >
                                <img src={tokenTwo.icon} className="sideicon" />
                                <div className="font-geist">
                                  <h1 className="fw-bold">{priceList[1]}</h1>
                                  <div className="d-flex align-items-center gap-3">
                                   
                                    <div className="d-flex align-items-center gap-2 squid_div">
                                      <img src={`${type2 == "Uniswapv3" ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png' : 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'}`} width={25} />{type2}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="squid_ul">
                                <div className="d-flex gap-3">
                                  <img src={`${type2 == "Uniswapv3" ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png' : 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'}`} width={25} />
                                  <p className="squid_lifi_text">{type2} </p>
                                </div>
                                
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-4 recieve_price_div">
                        <h6>
                          1 {tokenOne?.name} ~ {rate2} {tokenTwo?.name}
                        </h6>
                        
                      </div>
                    </div>
                  </div>
                    )}
                  
                </div>
              </div>
            </motion.li>
          )}
        </AnimatePresence> */}
      </div>

      <ConnectWallet
        show={showConnectWallet}
        handleClose={() => setConnectWallet(false)}
      />


      <CommonModal
        className="addCardBox"
        show={reviewShow}
        handleClose={() => {
          setReviewShow(false);
        }}
        heading="Review Swap"
        status=""
      >
        <div className="addCardBox mb-0">
          <div >
            <div className="addCard_tokenvalues">
              <div className="token_mainSelected">
                <div className="token_mainSelected_leftSide">
                  <h6 className="mb-2">You Pay</h6>
                  <div className="amount d-grid gap-2">
                    <h1>{inputOne?.inputValue} {tokenOne?.symbol}</h1>
                    {/* <p>
                      ~$
                      {cryptoDecimals(
                        Number(inputOne?.inputValue) * Number(tk1DollarValue) || 0
                      )}
                    </p> */}
                  </div>
                </div>
                {/* <div className="token_mainSelected_rightSide">
                <span className="tokenDetails">
                  <img src={tokenOne.icon} alt="" />
                  {tokenOne?.symbol}
                </span>
              </div> */}
              </div>

              {/* <div className="my-2 ms-4">
                <h1>{type} Aggregator </h1>
              </div> */}
              {/* {quoteList?.length > 0 && (
                  <h1>{quoteList[activeIndex]?.label?.replace(/Aggregator/gi, '').trim() || ''} Aggregator </h1>
                )} */}
              <div className="token_receive">
                <div className="token_receive_leftSide">
                  <h6 className="mb-2">You Receive</h6>
                  <div className="amount d-grid gap-2">
                    <h1>{inputTwo?.inputValue} {tokenTwo?.symbol}</h1>
                    {/* <p>
                      ~$
                      {cryptoDecimals(
                        Number(inputTwo?.inputValue) * Number(tk2DollarValue) || 0
                      )}
                    </p> */}
                  </div>
                </div>
                {/* <div className="token_receive_rightSide">
                <span className="tokenDetails">
                  <img src={tokenTwo.icon} alt="" />
                  {tokenTwo?.symbol}
                </span>
              </div> */}
              </div>
            </div>
            {/* <hr className="reviewLine" /> */}

            <Button
              fluid
              className={`btnapprove mb-3 ${isWrongNetwork ? "grayBorder" : "fluid"
                }`}
              onClick={() => {
                setReviewShow(false);
                setShow(true);
              }}
              disabled={isWrongNetwork}
            >
              Start Swapping
            </Button>
          </div>
        </div>

      </CommonModal>

      <CommonModal
        className="addCardBox"
        show={show}
        handleClose={() => {
          setShow(false);
        }}
        heading="Confirmation"
        status=""
      >
        <ReviewSwap
          state={{
            tokenDetails,
            selectedField,
            inputFixedTwo: inputTwo,
            inputOne,
            inputTwo,
            tk1DollarValue,
            tk2DollarValue,
            contAdd,
            lifiRoute,
            fetchData,
            selectedQuote: quoteList[activeIndex],
            setShowRight
          }}
          isShow={setShow}
        />

      </CommonModal>

      {/* <a href="dapp://main.d2ntv08wzoldtg.amplifyapp.com/swap">Dapp</a> */}
      {/* <a href="https://link.trustwallet.com/open_url?coin_id=56&url=https://main.d2ntv08wzoldtg.amplifyapp.com/swap">Dapp</a> */}
    </>
  );
};

export default SwapCard;
