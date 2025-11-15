import { useCallback, useEffect, useState } from "react";
import {
  setTokenList,
  setTokenOne,
  setTokenTwo,
} from "../../../features/theme/token.slice";
import { TOKEN_DATA } from "../../../interfaces/Liquidity";
import Button from "../Button/Button";
import CommonModal from "../Modals/CommonModal/CommonModal";
import {
  CheckIcon,
  DownArrowIcon,
  SearchIcon,
} from "../../../assets/icons/svgicons";
import "./TokenselectModal.scss";
import { callContractGetMethod } from "../../../services/contractServices/contractMethods";
import { useWalletConnect } from "../../../CustomHook/useWalletConnect";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AiOutlineCaretDown } from "react-icons/ai";



const TokenselectModal = ({
  tokenActive,
  field,
  readOnly,
  data,
  setTokenOneValue,
  setTokenTwoValue,
}: {
  tokenActive?: boolean;
  field?: string;
  readOnly?: boolean;
  data?: any;
  setTokenOneChainId?: any;
  setTokenOneValue?: any;
  setTokenTwoValue?: any;
}) => {
  const { walletProvider } = useWalletConnect();
  const {
    tokenList,
    tokenOne,
    tokenTwo,
  }: { tokenList: TOKEN_DATA[]; tokenOne: TOKEN_DATA; tokenTwo: TOKEN_DATA } =
    useAppSelector((store: any) => store?.token);

  
  const [showToken, setShowToken] = useState<boolean>(false);
  const [isSearchedTriggered, setIsSearchedTriggered] =
    useState<boolean>(false);
  const [filteredTokenList, setFilteredTokenList] = useState<
    TOKEN_DATA[] | any
  >([]);


  const handleTokenSelect = async (tokenSelected: TOKEN_DATA) => {
    if (field === "Field1") {
      if (tokenTwo?.name === tokenSelected.name) {
        return;
      }
      dispatch(setTokenOne(tokenSelected));
    } else {
      if (tokenOne?.name === tokenSelected.name) {
        return;
      }
      dispatch(setTokenTwo(tokenSelected));
    }
    setShowToken(false);
    setIsSearchedTriggered(false);
  };

  const handleSearch = async (data: string) => {
    const key = data.toLowerCase();
    if (key !== "") {
      const filteredList: any = tokenList.find((token: TOKEN_DATA) => {
        return (
          token?.symbol?.toLowerCase().includes(key) ||
          token?.address?.toLowerCase().includes(key) ||
          token?.name?.toLowerCase().includes(key)
        );
      });
      if (!filteredList && data.length == 42) {
        try {
          const decimals = await dispatch(
            callContractGetMethod(
              "decimals",
              [],
              "dynamic",
              data,
              walletProvider
            )
          );
          const name = await dispatch(
            callContractGetMethod("name", [], "dynamic", data, walletProvider)
          );
          const symbol = await dispatch(
            callContractGetMethod("symbol", [], "dynamic", data, walletProvider)
          );
          if (name && symbol && decimals !== undefined) {
            const newTokenToAdd: any = {
              name,
              symbol,
              decimals,
              isNative: false,
              address: data,
              icon: SearchIcon,
            };
            dispatch(setTokenList([...tokenList, newTokenToAdd]));
            setFilteredTokenList([newTokenToAdd]);
            setIsSearchedTriggered(true);
          } else {
            setFilteredTokenList([]);
            setIsSearchedTriggered(true);
          }
        } catch (error) {
          setFilteredTokenList([]);
          setIsSearchedTriggered(true);
        }
      } else {
        setFilteredTokenList(filteredList);
        setIsSearchedTriggered(true);
      }
    } else {
      setFilteredTokenList([]);
      setIsSearchedTriggered(false);
    }
  };
  const dispatch = useAppDispatch();


  



  
  //we will rebuild it for the revamp version

  

 
  



  

  
  return (
    <>
      {!tokenActive ? (
        <div className="btn-cross-chain-header">
        <Button className="tokenBtn btn-cross" onClick={() => setShowToken(true)}>
          <img
            src={
               readOnly
                  ? data?.tokenLogo
                  : tokenOne.icon
            }
            alt=""
          />
          <span className="tokenIcon">
            {readOnly
                ? data?.tokenName
                : tokenOne?.name
              }
          </span>
          {!readOnly ? <AiOutlineCaretDown /> : null}
        </Button>
        </div>
      ) : (
        <Button className="tokenBtn " onClick={() => setShowToken(true)}>
          <img src={tokenTwo.icon} alt="" />
          <span className="tokenIcon">{tokenTwo?.name}</span>
          <AiOutlineCaretDown />
        </Button>
      )}
      {!readOnly ? (
        <CommonModal
          className="select_token_modal"
          show={showToken}
          handleClose={() => {
            setIsSearchedTriggered(false);
            setShowToken(false);
          }}
          // heading="Select Token"
          heading="Select Pay Token"
          hideCloseButton
        >
          <div className="modal_input">
            <div className="search_icon">
              <SearchIcon />
            </div>
            <input
              placeholder="Search"
              onChange={(e: any) => {
               handleSearch(e.target.value)
              }}
            ></input>
          </div>
         
          <ul>
            {filteredTokenList?.length > 0 ? (
              filteredTokenList?.map((value: any) => (
                <li key={value?.name}>
                  <button
                    className={`${
                      (field === "Field1" &&
                            tokenTwo?.name === value?.name) ||
                          (field === "Field2" && tokenOne?.name === value?.name)
                        ? "active"
                        : "in-active"
                    }`}
                    onClick={() => {
                        handleTokenSelect(value)
                        
                    }}
                    disabled={
                      field === "Field1"
                        ? tokenTwo?.name === value?.name
                        : tokenOne?.name === value?.name
                    }
                  >
                    <span>
                      <img src={value?.icon} alt="" />
                    </span>
                    {value?.name}
                    <span className="checkbtn">
                      <CheckIcon />
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <p className="no_token_found">No token found.</p>
            )}
          </ul>
        </CommonModal>
      ) : null}
    </>
  );
};

export default TokenselectModal;
