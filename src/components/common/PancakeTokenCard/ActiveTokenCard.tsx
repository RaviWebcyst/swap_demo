import Button from "../Button/Button";
import Input from "../Input/Input";
import TokenselectModal from "../TokenselectModal/TokenselectModal";
import { cryptoDecimals, symbolsArr } from "../../../utils/helpers";
import { useAppSelector } from "../../../app/hooks";
import { BALANCE_HOOK, INPUTS } from "../../../interfaces/common";
import Shimmer from "../Shimmer/Shimmer";
import useIsWrongNetwork from "../../../CustomHook/useisWrongNetwork";
import TokensModal from "../Modals/TokensModal/TokensModal";
import { storeReduxInstance } from "../../../App";
import { TOKEN_DATA } from "../../../interfaces/Liquidity";

const ActiveTokenCard = ({
  field,
  balance,
  input,
  value,
  maxFunction,
  dollarVal,
  balancevalue,
  shimmer,
  setTokenOneChainId,
  showTokensSelectModal,
  setTokenOneValue,
  setTokenTwoValue,
}: {
  field: string;
  balance: BALANCE_HOOK["tokenBalance"];
  input: any;
  value: INPUTS | any;
  maxFunction: any;
  balancevalue?: string | number;
  dollarVal: string | number;
  shimmer: string;
  setTokenOneChainId?: any;
  showTokensSelectModal?: boolean;
  setTokenOneValue?: any;
  setTokenTwoValue?: any;
}) => {

  
  const isWrongNetwork = useIsWrongNetwork();
  const { walletAddress }: { walletAddress: string } = useAppSelector(
    (state: any) => state?.user
  );

    const { tokenOne }: { tokenOne: TOKEN_DATA; } =
      useAppSelector((store: any) => store?.token);

  const modifyTokenBalance = () => {
    return (
      <>
        {typeof balance?.token1Balance === "string" ? (
          <h6 className="balancevalue my-auto">
            <span>Balance :</span>{" "}
            {balance?.token1Balance == 0 ? (
              0
            ) : balance?.token1Balance ? (
              `${balance?.token1Balance}`
            ) : (
              <Shimmer height={10} width={50} />
            )}
              <span className="ms-2">{tokenOne?.name} </span>
          </h6>
        ) : (<h6 className="balancevalue my-auto"> <Shimmer height={30} width={200} /> </h6>)}
      </>
    );
  };
  return (
    <>
      <div className="activeCardtoken">
         
         <div className="d-flex">
          {/* <h4><span className="input_label">From: </span>  {tokenOne?.name} Coin </h4> */}
          <h4><span className="input_label ms-3">From </span> </h4>
            <div className="d-flex ms-auto">
              {showTokensSelectModal ? (
                <TokenselectModal
                  field={field}
                  setTokenOneChainId={setTokenOneChainId}
                  setTokenOneValue={setTokenOneValue}
                  setTokenTwoValue={setTokenTwoValue}
                />
              ) : (
                <TokensModal field={field} />
              )}
              </div>
            </div>
        <ul className="listToken mt-3">
          {/* <div className="d-flex">
              {showTokensSelectModal ? (
                <TokenselectModal
                  field={field}
                  setTokenOneChainId={setTokenOneChainId}
                  setTokenOneValue={setTokenOneValue}
                  setTokenTwoValue={setTokenTwoValue}
                />
              ) : (
                <TokensModal field={field} />
              )}
              </div> */}
          <li>
            {shimmer == "Tk1" ? (
              <Shimmer height={30} width={200} />
            ) : (
              <Input
                placeholder="Enter Amount"
                className="without_bg inputActive"
                type="number"
                onChange={(e: any) => input(e.target.value, false, "TK1")}
                value={value?.inputValue}
              />
            )}
            <div className="listRight">
              <Button
                text="max"
                className="maxBtn without_bg_border"
                onClick={() => maxFunction("TK1")}
              />
            </div>
          </li>
        </ul>
        
      </div>
       <div className="d-flex w-100">
            {isWrongNetwork || !walletAddress ? "" : modifyTokenBalance()}

            <div className="text-end h4 ms-auto">~${Number(dollarVal).toFixed(5)}</div>
          </div>
    </>
  );
};

export default ActiveTokenCard;
