import { useLocation, useNavigate } from "react-router-dom";
import {
  CloseIcon,
  CurrencyEthereum,
  DropUpswapIcon,
  LeftRightArrowIcon,
  MaticBlueIcon,
  SignIcon,
  WalletIcon,
} from "../../../../assets/icons/svgicons";
import Button from "../../../common/Button/Button";
import "./ReviewSwap.scss";
import { cryptoDecimals } from "../../../../utils/helpers";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
// import { swapHelperFunction } from "../../../../services/PancakeServices/SwapHelper";
import { swapHelperFunction } from "../../../../services/PancakeServices/SwapHelper";
import { useWalletConnect } from "../../../../CustomHook/useWalletConnect";
import { setTransactionCounter } from "../../../../features/theme/user.slice";
import TxnModal from "../../../common/Modals/TxnModal/TxnModal";
import { TOKEN_DATA } from "../../../../interfaces/Liquidity";
import useIsWrongNetwork from "../../../../CustomHook/useisWrongNetwork";

const ReviewSwap = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { walletProvider } = useWalletConnect();
  const isWrongNetwork = useIsWrongNetwork();
  const { tokenOne, tokenTwo }: { tokenOne: TOKEN_DATA; tokenTwo: TOKEN_DATA } =
    useAppSelector((store: any) => store?.token);
  const {
    walletAddress,
    chainValues,
  }: { walletAddress: string; chainValues: any } = useAppSelector(
    (store: any) => store?.user
  );
  // const { state } = useLocation();
  const  state  = props?.state;

  

  // console.log(state,"state");

  
  

  const [show, setShow] = useState<boolean>(false);
  const [previousChain, setPreviousChain] = useState<string>(
    chainValues?.symbol
  );
  const [currentChain, setCurrentChain] = useState<string>(chainValues?.symbol);
  const [modalData, setModalData] = useState<any>({
    status: "", 
    bodyText: "",
    title: "",
    txHash: "",
  });
  useEffect(() => {
    setCurrentChain(chainValues?.symbol);
  }, [chainValues]);

  useEffect(() => {
    if (currentChain != previousChain) {
      navigate("/");
    }
  }, [currentChain]);
  const handleSwap = async () => {
  
    try {
      if (!walletAddress) return;
      setModalData({
        title: "Swap",
        bodyText: `Please confirm transaction to Swap ${tokenOne?.symbol} for ${tokenTwo?.symbol}`,
        status: "pending",
        txHash: null,
      });

      var inputOne = state?.inputOne;
      
      // console.log(inputOne,"inputonevaluedata");
      if(state?.selectedField !== 'TK1'){
        
         const value = BigInt(10000);
        const per = BigInt(1000);
        const inpt = BigInt( state?.inputOne?.convertedValue);

        // Calculate with BigInt only
         inputOne.convertedValue = Number((inpt * (value + per) / value));
      }

      var tokenonedecimals = tokenOne?.decimals;
      var contract_address = state?.contAdd;

  
      
      const swapResult: any = await swapHelperFunction(
        state?.tokenDetails,
        inputOne,
        state?.inputFixedTwo,
        state?.selectedField,
        walletProvider,
        dispatch,
        setModalData,
        tokenonedecimals,
        contract_address
      );

      // console.log(swapResult,"swapResult");
      
      if (swapResult == "SWAP DONE") {
        dispatch(setTransactionCounter(true));
      } else if (swapResult == "SWAP FAILED") {
        dispatch(setTransactionCounter(false));
      } else if (swapResult?.code == 4001) {
        dispatch(setTransactionCounter(false));
      }
    } catch (error) {
      dispatch(setTransactionCounter(false));
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="addCardBox mb-0">
        {/* <div className="addCard"> */}
        <div >
          {/* <div className="addCard_heading">
            <h3 className="titleHeading">Swap</h3>
            <Button
              className="without_bg_border settingBtn"
              onClick={() => navigate("/")}
            >
              <CloseIcon />
            </Button>
          </div> */}
          <div className="addCard_tokenvalues">
            <div className="token_mainSelected">
              <div className="token_mainSelected_leftSide">
                <h6 className="mb-2">You Pay</h6>
                <div className="amount d-grid gap-2">
                  <h1>{state?.inputOne?.inputValue} {tokenOne?.symbol}</h1> 
                  {/* <p>
                    ~$
                    {cryptoDecimals(
                      state?.inputOne?.inputValue * state?.tk1DollarValue || 0
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
            <div className="token_receive">
              <div className="token_receive_leftSide">
                <h6 className="mb-2">You Receive</h6>
                <div className="amount d-grid gap-2">
                  <h1>{state?.inputTwo?.inputValue} {tokenTwo?.symbol}</h1>
                  {/* <p>
                    ~$
                    {cryptoDecimals(
                      state?.inputTwo?.inputValue * state?.tk2DollarValue || 0
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
            className={`btnapprove mb-3 ${
              isWrongNetwork ? "grayBorder" : "fluid"
            }`}
            onClick={() => {
              handleSwap();
              setShow(true);
            }}
            disabled={isWrongNetwork}
          >
            Confirm Swap
          </Button>
        </div>
      </div>
      {show ? (
        <TxnModal
          show={show}
          handleClose={() => {
            props?.isShow(false);
            setShow(false);
            // navigate("/");
          }}
          data={modalData}
        />
      ) : null}
    </>
  );
};

export default ReviewSwap;
