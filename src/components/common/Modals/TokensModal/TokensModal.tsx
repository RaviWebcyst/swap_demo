import { useEffect, useState } from "react";
import {
  setTokenList,
  setTokenOne,
  setTokenTwo,
} from "../../../../features/theme/token.slice";
import { TOKEN_DATA } from "../../../../interfaces/Liquidity";
import Button from "../../Button/Button";
import CommonModal from "../CommonModal/CommonModal";
import {
  CheckIcon,
  DownArrowIcon,
  SearchIcon,
} from "../../../../assets/icons/svgicons";
import
NotFoundIcon
  from "../../../../assets/icons/tokens/notFound.svg";
import { AiOutlineCaretDown, AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosInformation } from "react-icons/io";
import "./TokensModal.scss";
import { callContractGetMethod } from "../../../../services/contractServices/contractMethods";
import { useWalletConnect } from "../../../../CustomHook/useWalletConnect";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import search from "../../../../assets/icons/Search.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { PANCAKE_TOKEN_LIST } from "../../../../assets/tokens&ContractInfo/info";
import axios from "axios";
import { ethers } from "ethers";

import DynamicABI from "../../../../assets/abi/erc20.json";
import { Tab, Tabs } from "react-bootstrap";


const PANCAKE_API = "https://tokens.pancakeswap.finance/pancakeswap-extended.json";

const TokensModal = ({
  tokenActive,
  field,
  readOnly,
  data,
}: {
  tokenActive?: boolean;
  field?: string;
  readOnly?: boolean;
  data?: any;
}) => {

  // console.log(tokenActive, field, readOnly, data, "hiiiiii")
  const dispatch = useAppDispatch();

  const [showModel, setShowModel] = useState<boolean>(false);


  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [pancakeTokens, setPancakeTokens] = useState<any[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<any[]>([]);




  useEffect(() => {


    axios.get(PANCAKE_API)
      .then(res => {
        const apiTokens = res.data.tokens.map((token: any) => ({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          decimals: token.decimals,
          icon: token.logoURI,
          isNative: false,
        }));
        setPancakeTokens(apiTokens)
      })
      .catch(err => console.error("Failed to fetch PancakeSwap tokens", err));
  }, []);

  //   function isValidImageUrl(url:any) {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.onload = () => resolve(true);   // Image loaded successfully
  //     img.onerror = () => resolve(false); // Failed to load
  //     img.src = url;
  //   });
  // }

  const searchToken = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {

      const key = e.target.value.toLowerCase();
      setQuery(key);

      if (!key) {
        setFiltered([]);
        return;
      }

      const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
      const contract = new ethers.Contract(key, DynamicABI, provider);
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);


      const checksummed = ethers.getAddress(key);


      // Usage
      var imageUrl = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/' + checksummed + '/logo.png';


      if (name === "Rezor") {
        imageUrl = "https://assets.coingecko.com/coins/images/55692/thumb/1000444573.jpg?1747037831";
      }
      // var isValid = await isValidImageUrl(imageUrl);
      // console.log(isValid, "isValidImageUrl");

      const tokenData = {
        name,
        symbol,
        address: checksummed,
        decimals: Number(decimals),
        icon: imageUrl, // optional, maybe use a default icon
        isNative: false,
      };

      setFiltered([tokenData]);
    } catch (err) {
      console.error("Token address not found on chain", err);
      setFiltered([]);
    }
    // const key = e.target.value.toLowerCase();
    // setQuery(key);

    // if (!key) {
    //   setFiltered([]);
    //   return;
    // }

    // const matches = pancakeTokens.filter(token =>
    //   token.name.toLowerCase().includes(key) ||
    //   token.symbol.toLowerCase().includes(key) ||
    //   token.address.toLowerCase() === key
    // );

    // setFiltered(matches.slice(0, 15)); 
  };

  const toggleTokenSelect = (token: any) => {
    const exists = selectedTokens.find(t => t.address === token.address);
    if (exists) {
      setSelectedTokens(selectedTokens.filter(t => t.address !== token.address));
    } else {
      setSelectedTokens([...selectedTokens, token]);
    }
  };

  const handleImportTokens = () => {
    const unique = selectedTokens.filter(sel =>
      !tokenList.some(existing => existing.address === sel.address)
    );

    if (unique.length > 0) {

      dispatch(setTokenList([...tokenList, ...unique]));
    }

    // Optional cleanup
    setSelectedTokens([]);
    setFiltered([]);
    setQuery("");
    setShowModel(false); // close the modal
  };

  // const location = useLocation();

  // useEffect(() => {
  //   console.log("locationssss.pathname", location.pathname);

  //   if (location.pathname === "/pancakeswap") {
  //     dispatch(setTokenList(PANCAKE_TOKEN_LIST));
  //     dispatch(setTokenOne(PANCAKE_TOKEN_LIST[0]));
  //     dispatch(setTokenTwo(PANCAKE_TOKEN_LIST[1]));
  //   } else {
  //     dispatch(setTokenList([...tokenList]));
  //   }
  // }, [location.pathname, dispatch]);

  const { walletProvider } = useWalletConnect();
  var {
    tokenList,
    tokenOne,
    tokenTwo,
    rezortokenList
  }: { tokenList: TOKEN_DATA[]; tokenOne: TOKEN_DATA; tokenTwo: TOKEN_DATA,rezortokenList:TOKEN_DATA[] } =
    useAppSelector((store: any) => store?.token);

    if(useLocation().pathname === '/liquidity'){
        tokenList = rezortokenList;
    }
    
  const { chainValues } = useAppSelector((state: any) => state?.user);

  const [showToken, setShowToken] = useState<boolean>(false);
  const [isSearchedTriggered, setIsSearchedTriggered] =
    useState<boolean>(false);
  const [filteredTokenList, setFilteredTokenList] = useState<TOKEN_DATA[]>([]);
  const navigate = useNavigate();

  const handleTokenSelect = async (tokenSelected: TOKEN_DATA) => {
    console.log("Field value:", field);
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text");
    if (!/^0x[a-fA-F0-9]{40}$/.test(pastedData)) {
      e.preventDefault();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e);
  };

  const handleSearch = async (e: any) => {
    const key = e.target.value.toLowerCase();
    const isSym = /^[A-Za-z]*$/.test(key);
    const isAddr = /^0x[a-fA-F0-9]*$/.test(key);

    if (isSym || isAddr) {
      const filteredList: any = tokenList.filter((token: TOKEN_DATA) => {
        return (
          token?.symbol?.toLowerCase().includes(key) ||
          token?.address?.toLowerCase().includes(key) ||
          token?.name?.toLowerCase().includes(key)
        );
      });
      if (filteredList?.length == 0 && isAddr) {
        try {
          const decimals = await dispatch(
            callContractGetMethod(
              "decimals",
              [],
              "dynamic",
              key,
              walletProvider
            )
          );
          const name = await dispatch(
            callContractGetMethod("name", [], "dynamic", key, walletProvider)
          );
          const symbol = await dispatch(
            callContractGetMethod("symbol", [], "dynamic", key, walletProvider)
          );


          if (name && symbol && decimals !== undefined) {
            const newTokenToAdd: any = {
              name,
              symbol,
              decimals,
              isNative: false,
              address: key,
              icon: search,
            };
            dispatch(setTokenList([...tokenList, newTokenToAdd]));
            setFilteredTokenList([newTokenToAdd]);
            setIsSearchedTriggered(true);
          } else {
            setFilteredTokenList([]);
            setIsSearchedTriggered(true);
          }
        } catch (error) {
          console.log(error, "error");
          setFilteredTokenList([]);
          setIsSearchedTriggered(true);
        }
      } else {
        setFilteredTokenList(filteredList);
        setIsSearchedTriggered(true);
      }
    } else {
      e.target.value = "";
      setFilteredTokenList([]);
      setIsSearchedTriggered(false);
    }
  };
  const handleInfoIconClick = (symbol: string, address: string) => {
    // navigate(`/token/${symbol}/${address}`);
    window.open(`https://bscscan.com/address/${address}`, "_blank");
  };

  const searchTokenbyName = (e: React.ChangeEvent<HTMLInputElement>) => {
  const key = e.target.value.toLowerCase();
  setQuery(key);

  if (!key) {
    setFiltered([]);
    return;
  }

  const matches = pancakeTokens.filter(token =>
    token.name.toLowerCase().includes(key) ||
    token.symbol.toLowerCase().includes(key) ||
    token.address.toLowerCase() === key
  );

  setFiltered(matches.slice(0, 15)); // optional limit
};

  return (
    <>
      {!tokenActive ? (
        <Button className="tokenBtn " onClick={() => setShowToken(true)}>
          <img src={readOnly ? data?.tokenLogo : tokenOne.icon} alt="" onError={(e) => {
            e.currentTarget.onerror = null; // prevent infinite loop
            e.currentTarget.src = NotFoundIcon; // your fallback image URL
          }} />
          <span className="tokenIcon">
            {readOnly ? data?.tokenName : tokenOne?.name}
          </span>
          {!readOnly ? <AiOutlineCaretDown className="token_drop" /> : null}
        </Button>
      ) : (
        <Button className="tokenBtn " onClick={() => setShowToken(true)}>
          <img src={tokenTwo.icon} alt="" onError={(e) => {
            e.currentTarget.onerror = null; // prevent infinite loop
            e.currentTarget.src = NotFoundIcon; // your fallback image URL
          }} />
          <span className="tokenIcon">{tokenTwo?.name}</span>
          <AiOutlineCaretDown className="token_drop" />
        </Button>
      )}



      <CommonModal
        className="tokens_modal_custom import_token_modal"
        show={showModel}
        handleClose={() => { setShowModel(false); setQuery(""); setFiltered([]); setSelectedTokens([]) }}
        heading="Import Token"
      >

        <Tabs
          defaultActiveKey="search"
          className="mb-3 center-tabs"
          justify
        >
          <Tab eventKey="search" title="Search">
            <div className="modal_input">
              <div className="search_icon">
                <SearchIcon />
              </div>
              <input
                placeholder="Search by token name"
                value={query}
                onChange={searchTokenbyName}
              />
            </div>

            <div className="search-results">
              {filtered.map(token => {
                const isChecked = selectedTokens.some(t => t.address === token.address);
                return (
                  <div key={token.address} className="token-row d-flex align-items-center w-100 my-4 ms-5">
                    <input
                      name={token.symbol}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTokenSelect(token)}
                    />
                    <img src={token.icon} alt={token.symbol} width={20} style={{ margin: '0 8px' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = NotFoundIcon; // your fallback image URL
                      }} />
                    <div>
                      <div className="h4">{token.symbol}</div>
                      <div className="h5">{token.name}</div>
                    </div>

                  </div>
                );
              })}
            </div>


            <div className=" my-5 d-flex justify-content-center">
              <Button onClick={handleImportTokens} disabled={selectedTokens.length === 0}>
                Import Token{selectedTokens.length > 1 ? 's' : ''}
              </Button>
            </div>

          </Tab>
          <Tab eventKey="custom" title="Token">
            <div className="modal_input">
              <div className="search_icon">
                <SearchIcon />
              </div>
              <input
                placeholder="Paste token address"
                value={query}
                onChange={searchToken}
              />
            </div>

            <div className="search-results">
              {filtered.map(token => {
                const isChecked = selectedTokens.some(t => t.address === token.address);
                return (
                  <div key={token.address} className="token-row d-flex align-items-center w-100 my-4 ms-5">
                    <input
                      name={token.symbol}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTokenSelect(token)}
                    />
                    <img src={token.icon} alt={token.symbol} width={20} style={{ margin: '0 8px' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = NotFoundIcon; // your fallback image URL
                      }} />
                    <div>
                      <div className="h4">{token.symbol}</div>
                      <div className="h5">{token.name}</div>
                    </div>

                  </div>
                );
              })}
            </div>


            <div className=" my-5 d-flex justify-content-center">
              <Button onClick={handleImportTokens} disabled={selectedTokens.length === 0}>
                Import Token{selectedTokens.length > 1 ? 's' : ''}
              </Button>
            </div>

          </Tab>
        </Tabs>

      </CommonModal>

      {!readOnly ? (
        <CommonModal
          className="tokens_modal_custom"
          show={showToken && !showModel}
          handleClose={() => {
            setIsSearchedTriggered(false);
            setShowToken(false);
          }}
          heading="Select Token"
          footer={
            <div className="import-tokens">
              <Button className="tokenBtn text-primary" onClick={() => setShowModel(true)}>Import Token</Button>
            </div>
          }
        >
          {/* <div className="import-tokens">
            <Button className="tokenBtn text-primary ms-auto mt-2" onClick={() => setShowModel(true)}>Import Token</Button>
          </div> */}
          <div className="ms-5 my-3 h4">


            <span className="my-auto">
              <img src={field === "Field1" ? tokenOne?.icon : tokenTwo?.icon} alt="" width={20} onError={(e) => {
                e.currentTarget.onerror = null; // prevent infinite loop
                e.currentTarget.src = NotFoundIcon; // your fallback image URL
              }}
              />
            </span>
            <span className="ms-3  my-auto selected_token_name">
              {field === "Field1" ? tokenOne?.name : tokenTwo?.name} </span>


          </div>
          <div className="modal_input">
            <div className="search_icon">
              <SearchIcon />
            </div>
            <input
              placeholder="Search"
              maxLength={42}
              onPaste={handlePaste}
              pattern="^0x[a-fA-F0-9]{0,40}$"
              onChange={handleInputChange}
            ></input>
          </div>

          <ul className="modal_coins">
            {tokenList?.slice(0, 4).map((token: any, index: any) => (
              <li className="modal_coins_in" key={index}>
                <button onClick={() => handleTokenSelect(token)} >
                  <span>
                    <img src={token.icon} alt="" onError={(e) => {
                      e.currentTarget.onerror = null; // prevent infinite loop
                      e.currentTarget.src = NotFoundIcon; // your fallback image URL
                    }} />
                  </span>
                  {token.name}
                </button>
              </li>
            ))}
          </ul>

          <ul>
            {(isSearchedTriggered ? filteredTokenList : tokenList)?.length > 0 ? (
              (isSearchedTriggered ? filteredTokenList : tokenList).map(
                (value: any, index: number) => {

                  const isChecked = (field === "Field1" && tokenTwo?.name === value?.name) ||
                    (field === "Field2" && tokenOne?.name === value?.name);

                  return (
                    <li key={value?.name} className="list-item">
                      <button
                        className={`${isChecked ? "active" : "in-active"}`}
                        onClick={() => handleTokenSelect(value)}
                        disabled={field === "Field1" ? tokenTwo?.name === value?.name : tokenOne?.name === value?.name}
                      >
                        <span>
                          <img src={value?.icon} alt="" onError={(e) => {
                            e.currentTarget.onerror = null; // prevent infinite loop
                            e.currentTarget.src = NotFoundIcon; // your fallback image URL
                          }}
                          />
                        </span>
                        {value?.name}
                        <span className="checkbtn">
                          {isChecked && <CheckIcon />}
                        </span>
                      </button>
                      {!isChecked && (
                        <span
                          className="info-icon"
                          onClick={() => handleInfoIconClick(value.symbol, value.address)}

                        >
                          {/* <AiOutlineInfoCircle fontSize={20} /> */}
                        </span>
                      )}
                    </li>
                  );
                }
              )
            ) : (
              <p className="no_token_found">No token found.</p>
            )}
          </ul>


        </CommonModal>
      ) : null}
    </>
  );
};

export default TokensModal;
