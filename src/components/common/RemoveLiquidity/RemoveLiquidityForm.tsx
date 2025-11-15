import "../../../interfaces/Liquidity";
import Button from "../Button/Button";
import Input from "../Input/Input";
import "./RemoveLiquidity.scss";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {  TOKEN_DATA } from "../../../interfaces/Liquidity";
import { useEffect, useState } from "react";
import {
  executeRemoveLiquidity,
  fetchLatestLpData,
  getRemoveLiquiditySignature,
} from "../../../services/LiquidityServices/RemoveLiquidityHelper";
import { useWalletConnect } from "../../../CustomHook/useWalletConnect";
import {
  calculateDeadlineHelper,
  cryptoDecimals,
  divideBigNumber,
  slicedValue,
} from "../../../utils/helpers";
import {
  INPUTS,
  LP_TO_RECEIVE,
  MODAL_STATE,
  TOKEN_DETAILS,
} from "../../../interfaces/common";
import { getPairService } from "../../../services/contractServices/contractCallServices";
import TxnModal from "../Modals/TxnModal/TxnModal";
import useIsWrongNetwork from "../../../CustomHook/useisWrongNetwork";
// @ts-ignore
import { multiplier } from "universal-calci-pro";

type propstype = {
  show?: { show: boolean; data: any };
  handleClose: () => void;
  fetchData: () => void;
};






const RemoveLiquidityForm = (props:any) => {
  
  const dispatch = useAppDispatch();
  const isWrongNetwork = useIsWrongNetwork();
  const { walletProvider } = useWalletConnect();
  const {
    walletAddress,
    slippage,
  }: { walletAddress: string; slippage: number } = useAppSelector(
    (store: any) => store?.user
  );
  const { tokenOne, tokenTwo }: { tokenOne: TOKEN_DATA; tokenTwo: TOKEN_DATA } =
    useAppSelector((store: any) => store?.token);
  const { importedLp } = useAppSelector((state: any) => state?.user);
  const [show, setShow] = useState<boolean>(false);
  const [userDeadline, setUserDeadline] = useState(0);
  const [signedData, setSignedData] = useState<string>("");
  const [percentage, setpercentage] = useState<number | null>(null);
  const [enableRemove, setEnableRemove] = useState<boolean>(false);
  const [eye, setEye] = useState(-1);
  const [percentDisabled, setPercentDisabled] = useState([!1, !1, !1, !1])
  const [modalData, setModalData] = useState<MODAL_STATE>({
    status: "",
    bodyText: "",
    title: "",
    txHash: "",
  });
  const [removeAmount, setremoveAmount] = useState<INPUTS>({
    inputValue: "",
    convertedValue: "",
  });
  const [receivableTokensFromLp, setReceivableTokensFromLp] =
    useState<LP_TO_RECEIVE>({
      token1: "0", 
      token2: "0",
    });


  useEffect(() => {
    emptyValues();
  }, [props, tokenOne, tokenTwo]);

  const emptyValues = async () => {
    setremoveAmount({
      convertedValue: "",
      inputValue: "",
    });
    setSignedData("");
    setEnableRemove(false);
    setpercentage(null);
    setReceivableTokensFromLp({
      token1: "",
      token2: "",
    });
  };

  const handleInput = async (e: string, max: boolean) => {

    setEnableRemove(false);
    setpercentage(null);

  e = e.replace(/^0+/, '');

  if (e.startsWith('.')) {
    e = '0' + e;
  }

  const decimalIndex = e.indexOf('.');
  if (decimalIndex !== -1) {
    const beforeDecimal = e.slice(0, decimalIndex);
    const afterDecimal = e.slice(decimalIndex + 1).replace(/\./g, ''); // Remove any additional decimal points
    e = beforeDecimal + '.' + afterDecimal;
  }

    let convertedValue: string = (
      max ? e : Number(e) * 10 ** 18
    ).toString();

    let originalValue: string = (
      max ? cryptoDecimals(Number(e) / 10 ** 18) : e
    ).toString();

    try {
      parseFloat(convertedValue)
      parseFloat(originalValue)
    } catch(e) {
      console.log('error parsing floats', convertedValue, originalValue)
    }

    setremoveAmount({
      convertedValue: convertedValue,
      inputValue: originalValue,
    });
    if (Number(convertedValue) <= Number(props?.lpTokens)) {
      setReceivableTokensFromLp({
        token1: (
          (Number(e) / Number(props?.lpTokens)) *
          Number(props?.tokenAReceive) *
          10 ** 18
        ).toString(),
        token2: (
          (Number(e) / Number(props?.lpTokens)) *
          Number(props?.tokenBReceive) *
          10 ** 18
        ).toString(),
      });
    } else {
      setReceivableTokensFromLp({
        token1: "Not Enough Lp token",
        token2: "Not Enough Lp token",
      });
    }
  };
  const handlePercClick = (percentage: number, i: number) => {
  var convertedVal = (percentage/100) * Number(props.lpTokens);
    
    setEye(i)
    setpercentage(percentage);

    if (Number(props?.lpTokens) > 0) {
      setReceivableTokensFromLp({
        token1: (
          (percentage / 100) *
          Number(props?.tokenAReceive)
        ).toString(),
        token2: (
          (percentage / 100) *
          Number(props?.tokenBReceive)
        ).toString(),
      });
      setremoveAmount({
        inputValue: multiplier(
          (percentage / 100).toString(),
          divideBigNumber(props?.lpTokens, 18)
        ).output,
        convertedValue: convertedVal.toString(),
        // convertedValue: multiplier(
        //   (percentage / 100).toString(),
        //   Number(props?.lpTokens)
        // ).output,
      });
    }
  };

  const handleDec = (v: any): string => {
    const t = typeof v != 'string' ? `${v}` : v;
    if(t.indexOf('e') != -1) {
      v = parseFloat(v).toLocaleString('fullwide', {useGrouping:false})
    } else {
    }
    const i = v.indexOf('.')
    if(i != -1) {
      console.log('has . v:', v)
  return v.substring(0, i)
    }
    console.log(v,"insideHandleDec")
    return v
  }

  const approveTransaction = async () => {

    console.log(removeAmount?.convertedValue,"removeAmount?.convertedValue");
    
    try {
      const pairAddress: string = await getPairService({
        tokenOneAddress: tokenOne?.address,
        tokenTwoAddress: tokenTwo?.address,
        dispatch,
        walletProvider,
      });
      const epochDeadline: number = await calculateDeadlineHelper();
      const signature = await getRemoveLiquiditySignature({
        
        walletAddress,
        pairAddress,
        liquidity: handleDec(removeAmount?.convertedValue),
        deadLine: epochDeadline,
        dispatch,
        walletProvider,
      });
if (!signature?.code && signature?.code != 4001) {
        setSignedData(signature);
        setUserDeadline(epochDeadline);
        setEnableRemove(true);
        let d = []
        for(let j=0; j<4; ++j) {
          if(eye == j) {
            d.push(!1)
          }
          d.push(!0)
        }
        setPercentDisabled(d)

      } else {
        setEnableRemove(false);
      }
    } catch (error) {
      console.log("error", error);
      setEnableRemove(true);
    }
  };

  const removeLiquidity = async () => {

   
    setShow(true);
    // props?.handleClose();
    try {
      const tokenDetails: TOKEN_DETAILS = {
        tokenA: tokenOne?.address,
        tokenB: tokenTwo?.address,
        isTokenOneNative: tokenOne?.isNative,
        isTokenTwoNative: tokenTwo?.isNative,
        tokenASymbol: tokenOne?.symbol,
        tokenBSymbol: tokenTwo?.symbol,
      };

      
      const res = await executeRemoveLiquidity({
        dispatch,
        walletAddress,
        receivableTokensFromLp,
        tokenDetails,
        userLiquiditytoRemove: handleDec(removeAmount?.convertedValue),
        signature: signedData,
        deadLine: userDeadline,
        slippage,
        walletProvider,
        setModalData,
      });
      await fetchLatestLpData(dispatch, importedLp, walletProvider);
      emptyValues();
      // props?.handleClose();
      props?.fetchData();
      setPercentDisabled([!1, !1, !1, !1])

    } catch (error) {
      console.log("errr", error);
    }
  };

  return (
    <>
     <div className="card border-0 border remove_liq_form">
      <div className="card-body">
        <form className="custom_form">
          <label>
            <p className="fs-4">Amount</p>{" "}
          </label>
          <Input
            placeholder="Enter Amount"
            value={removeAmount?.inputValue}
            onChange={(e: any) => handleInput(e.target.value, false)}
            disabled={isWrongNetwork || !walletAddress}
          />
          <ul className="persents_btn d-flex gap-2" style={{"listStyle":"none"}}>
            <li>
              <Button
                className={percentage == 25 ? "active h-100 px-3" : " h-100 px-3"}
                onClick={() => handlePercClick(25, 0)}
                disabled = {percentDisabled[0]}
              >
                25%
              </Button>
            </li>
            <li>
              <Button
                className={percentage == 50 ? "active h-100 px-3" : " h-100 px-3"}
                onClick={() => handlePercClick(50, 1)}
                disabled = {percentDisabled[1]}
              >
                50%
              </Button>
            </li>
            <li>
              <Button
                className={percentage == 75 ? "active h-100 px-3" : " h-100 px-3"}
                onClick={() => handlePercClick(75, 2)}
                disabled = {percentDisabled[2]}
              >
                75%
              </Button>
            </li>
            <li>
              <Button
                className={percentage == 100 ? "active h-100 px-3" : " h-100 px-3"}
                onClick={() => handlePercClick(100, 3)}
                disabled = {percentDisabled[3]}
              >
                100%
              </Button>
            </li>
          </ul>
          <ul>
            <li>
              <p>{tokenOne.symbol}</p>
              <h6>{cryptoDecimals(receivableTokensFromLp?.token1)}</h6>
            </li>
            <li>
              <p>{tokenTwo.symbol}</p>
              <h6>{cryptoDecimals(receivableTokensFromLp?.token2)}</h6>
            </li>
          </ul>

          <div className="approve_remove_btn d-flex gap-3 my-3">

            {props.lpTokens > 0 ? (<>
            <Button
            className="w-50"
              onClick={approveTransaction}
              disabled={
                Number(removeAmount?.inputValue) <= 0 ||
                Number(removeAmount?.convertedValue) >
                  Number(props?.lpTokens)
              }
            >
              Approve
            </Button>
            <Button
              
              className={!enableRemove ? "grayBorder w-50" : "w-50"}
              disabled={!enableRemove}
              onClick={() => removeLiquidity()}
            >
              Remove
            </Button>
            </>
            ):( <Button
              
              className={ "grayBorder w-100"}
              disabled={true}
            >
              No Lp Found
            </Button>)}
          </div>

          <h3>Token in your Wallet</h3>
          <div className="token_num">
            <ul>
              <li>
                <p>
                  <span className="d-flex gap-2">
                    <img src={tokenOne.icon} alt="" width={25} className="rounded-circle d-none d-md-flex"  />
                    <img
                      src={tokenTwo.icon}
                      width={25}
                      alt=""
                      className="rounded-circle d-none d-md-flex me-2"
                    />
                  </span>
                  {tokenOne.symbol}/
                  {tokenTwo.symbol}
                </p>
                <h6>
                  {divideBigNumber(props?.lpTokens, 18) || 0}
                </h6>
              </li>
            </ul>
          </div>
          <ul>
            <li>
              <p>{tokenTwo.symbol}</p>
              <h6>{cryptoDecimals(props?.tokenAReceive || 0)}</h6>
            </li>
            <li>
              <p>{tokenOne.symbol}</p>
              <h6>{cryptoDecimals(props?.tokenBReceive || 0)}</h6>
            </li>
          </ul>
        </form>
        </div>
        </div>
      {show ? (
        <TxnModal
          show={show}
          handleClose={() => setShow(false)}
          data={modalData}
        />
      ) : null}
    </>
  );
};

export default RemoveLiquidityForm;
