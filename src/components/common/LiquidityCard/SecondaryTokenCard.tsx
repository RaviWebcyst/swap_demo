import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import TokenselectModal from "../TokenselectModal/TokenselectModal";
import Button from "../Button/Button";
import { BALANCE_HOOK, INPUTS } from "../../../interfaces/common";
import { cryptoDecimals, symbolsArr } from "../../../utils/helpers";
import Shimmer from "../Shimmer/Shimmer";
import useIsWrongNetwork from "../../../CustomHook/useisWrongNetwork";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import TokensModal from "../Modals/TokensModal/TokensModal";
import TokenselectReceivedModal from "../TokenselectReceivedModal/TokenselectReceivedModal";
// import axios from "axios";



import { TOKEN_DATA } from "../../../interfaces/Liquidity";

const SecondaryTokenCard = ({
  field,
  balance,
  input,
  value,
  maxFunction,
  dollarVal,
  balancevalue,
  shimmer,
  showTokensSelectModal,
  showCrossToken,
  setTokenTwoIconnew,
  setTokenOneChainId,
  setTwoDecinmal,
  setCurrencyNameForTokenTwo,
  setTokenTwoValue,
  setTokenOneValue,
}: {
  field: string;
  balance: BALANCE_HOOK["tokenBalance"];
  input: any;
  value: any;
  balancevalue?: string | number;
  maxFunction?: any;
  dollarVal: string | number;
  shimmer: string;
  showTokensSelectModal?: boolean;
  showCrossToken?: any;
  setTokenTwoIconnew?: any;
  setTwoDecinmal?: any;
  setTokenOneChainId?: any;
  setCurrencyNameForTokenTwo?: any;
  setTokenTwoValue?: any;
  setTokenOneValue?: any;
}) => {
  

  const { walletAddress }: { walletAddress: string } = useAppSelector(
    (state: any) => state?.user
  );

    const { tokenTwo }: { tokenTwo: TOKEN_DATA } =
        useAppSelector((store: any) => store?.token);

  const isWrongNetwork = useIsWrongNetwork();

  const dispatch = useAppDispatch();
 

  const modifyTokenBalance = () => {
    return (
      <>
        {typeof balance?.token2Balance === "string"  ? (
          <h6 className="balancevalue my-auto">
            <span>Balance :</span>{" "}
            {balance?.token2Balance == 0 ? (
              0
            ) : balance?.token2Balance ? (
              `${balance?.token2Balance}`
            ) : (
              <Shimmer height={10} width={50} />
            )}
              <span className="ms-2">{tokenTwo?.name} </span>
          </h6>
        ) : (<h6 className="balancevalue my-auto"> <Shimmer height={30} width={200} /> </h6>)}
      </>
    );
  };
 

 

  
  return (
    <>
      <div className="secondaryCardToken">
        <div className="d-flex">
          {/* <h4 ><span className="input_label">To:</span> {tokenTwo?.name} Coin  </h4> */}
          {/* <h4 ><span className="input_label">To</span> </h4> */}
          <div className="d-flex ms-auto">
            {showTokensSelectModal ? (
              <TokenselectReceivedModal
                setTokenTwoValue={setTokenTwoValue}
                setTokenOneValue={setTokenOneValue}
                tokenActive
                field={field}
                setTokenTwoIconnew={setTokenTwoIconnew}
                setTokenOneChainId={setTokenOneChainId}
                setTwoDecinmal={setTwoDecinmal}
                setCurrencyNameForTokenTwo={setCurrencyNameForTokenTwo}
              />
            ) : (
              <TokensModal tokenActive field={field} />
            )}
          </div>
        </div>
        <ul className="listToken mt-3">
          
          <li>
            {shimmer == "Tk2" ? (
              <Shimmer height={30} width={200} />
            ) : (
              <Input
                placeholder="Enter Amount"
                className="without_bg"
                type="number"
                onChange={(e: any) => input(e.target.value, false, "TK2")}
                value={ value?.inputValue}
              />
            )}
            
          </li>
          
        </ul>
      </div>

       <div className="d-flex w-100">
            {isWrongNetwork || !walletAddress ? "" : modifyTokenBalance()}

            <div className="text-end h4 ms-auto">~${Number(dollarVal).toFixed(4)}</div>
          </div>
      
    </>
  );
};

export default SecondaryTokenCard;
