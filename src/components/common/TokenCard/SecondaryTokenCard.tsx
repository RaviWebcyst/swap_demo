import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { BALANCE_HOOK, INPUTS } from "../../../interfaces/common";
import { cryptoDecimals, symbolsArr } from "../../../utils/helpers";
import Shimmer from "../Shimmer/Shimmer";
import useIsWrongNetwork from "../../../CustomHook/useisWrongNetwork";
import {  useAppSelector } from "../../../app/hooks";
import TokensModal from "../Modals/TokensModal/TokensModal";
import TokenselectReceivedModal from "../TokenselectReceivedModal/TokenselectReceivedModal";



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

  const isWrongNetwork = useIsWrongNetwork();

  

  const modifyTokenBalance = () => {
    return (
      <>
        {typeof balance?.token2Balance === "string"  && (
          <h6>
            <span>Balance :</span>{" "}
            {balance?.token2Balance == 0 ? (
              0
            ) : balance?.token2Balance ? (
              `${balance?.token2Balance}`
            ) : (
              <Shimmer height={10} width={50} />
            )}
          </h6>
        )}
      </>
    );
  };
  

 

 
  return (
    <>
      <div className="secondaryCardToken">
        <ul className="listToken">
          <li>
            {shimmer == "Tk2" ? (
              <Shimmer height={30} width={200} />
            ) : (
              <Input
                placeholder="0"
                className="without_bg"
                type="number"
                onChange={(e: any) => input(e.target.value, false, "TK2")}
                value={ value?.inputValue}
                disabled={
                  isWrongNetwork || !walletAddress
                }
              />
            )}
            <div className="listRight">
              {false ? (
                <Button
                  text="MAX"
                  className="maxBtn without_bg_border"
                  onClick={() => maxFunction("TK2")}
                />
              ) : (
                ""
              )}
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
          </li>
          <li>
            <h6>
              ~$
              {cryptoDecimals(
                Number(dollarVal) * Number(value?.inputValue) || 0
              )}
            </h6>
           
            {isWrongNetwork || !walletAddress ? "" : modifyTokenBalance()}
          </li>
        </ul>
      </div>
    </>
  );
};

export default SecondaryTokenCard;
