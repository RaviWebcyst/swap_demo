import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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

import evmChains from "../../../../assets/evmChains.json";
import loader from "../../../../assets/animations/rs_loader_.json";
import Lottie from "lottie-react";
import { customizeAddress } from "../../../../utils/helpers";
import { custom } from "viem";
import store from "../../../../app/store";
import { useAppKitNetwork } from "@reown/appkit/react";
import { mainnet, bsc } from "@reown/appkit/networks";
import { NetworkTypes } from "../../../../interfaces/common";
import { useSelector } from "react-redux";
import * as chains from "viem/chains";




// const PANCAKE_API = "https://tokens.pancakeswap.finance/pancakeswap-extended.json";


export interface TokensModalRef {
  switchTokens: (token: any) => Promise<void>;
}


const TokensModal = forwardRef<TokensModalRef, any>(
  (
    {
      tokenActive,
      field,
      readOnly,
      data,

    }: {
      tokenActive?: boolean;
      field?: string;
      readOnly?: boolean;
      data?: any;

    },
    ref
  ) => {



    // console.log(tokenActive, field, readOnly, data, "hiiiiii")
    const dispatch = useAppDispatch();

    const [showModel, setShowModel] = useState<boolean>(false);


    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [tokensList, setTokensList] = useState<any[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<any[]>([]);
    const [tokenOneChain, setTokenOneChain] = useState<any>("");
    const [tokenTwoChain, setTokenTwoChain] = useState<any>("");
    const [firstCheck, setFirstCheck] = useState<any>("");
    const [secondCheck, setSecondCheck] = useState<any>("");


    const [searchTerm, setSearchTerm] = useState("");


    const filteredNetworks = evmChains.filter((value: any) =>
      value.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { walletProvider } = useWalletConnect();
    var {
      tokenList,
      tokenOne,
      tokenTwo,
    }: { tokenList: any[]; tokenOne: any; tokenTwo: any, } =
      useAppSelector((store: any) => store?.token);

    var chain = "BNB";

    const [showMoreModal, setShowMoreModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChange, setIsChange] = useState<any>(56);





    var getTokens = async (net: any) => {





      field === "Field1" ? setFirstCheck(net.chainId ? net.chainId : net.id) : setSecondCheck(net.chainId ? net.chainId : net.id);

      setTokensList([]);
      setIsLoading(true);
      var chain = net.name.toLowerCase();
      var chainId = net?.chainId ? net?.chainId : net.id;
      // if(net == 'Arbitrum') {
      //   chain = 'arbitrum-one';
      // }
      // var API = `https://tokens.coingecko.com/${chain}/all.json`;
      var API = `https://li.quest/v1/tokens?chains=${chainId}`;
      var res = await axios.get(API);



      var data = res.data.tokens[chainId].map((token: any) => ({
        name: token.symbol,
        symbol: token.name,
        address: token.address,
        decimals: token.decimals,
        icon: token.logoURI,
        isNative: token.name == 'BNB' || token.name == 'ETH',
        chain: chain,
        chainId: chainId
      }));

      setIsLoading(false);
      setTokensList(data);

    



      // setFirstCheck(tokenOne.chainId);
      // setSecondCheck(tokenTwo.chainId);






      // setTokenOneChain(data.filter((dat:any)=>dat.chainId == tokenOne.chainId)?.[0].chain);

      // setTokenTwoChain(data.filter((dat:any)=>dat.chainId == tokenTwo.chainId)?.[0].chain);



    }

    useImperativeHandle(ref, () => ({
      switchTokens: async (token: any) => {
        

        setTokenOneChain(evmChains.filter((dat: any) => dat.id == token.tokenTwo.chainId)?.[0]?.name);

        setTokenTwoChain(evmChains.filter((data: any) => data.id == token.tokenOne.chainId)?.[0]?.name);
        // field === "Field1" ? getTokens(token.tokenTwo) : getTokens(token.tokenOne);
      },
    }));

    var setTokens = async () => {

      // var PANCAKE_API = "https://tokens.pancakeswap.finance/pancakeswap-extended.json";
      var PANCAKE_API = `https://li.quest/v1/tokens?chains=56`;
      var chainId = "56";

      if (store.getState().user.chainValues.currency === 'ETH') {
        // PANCAKE_API = "https://tokens.coingecko.com/uniswap/all.json";
        PANCAKE_API = `https://li.quest/v1/tokens?chains=1`;
        chain = "Etherum";
        chainId = "1";
      }


      // axios.get(PANCAKE_API)
      //   .then(res => {

      //     const apiTokens = res.data.tokens[chainId].map((token: any) => ({
      //       name: token.name,
      //       symbol: token.symbol,
      //       address: token.address,
      //       decimals: token.decimals,
      //       icon: token.logoURI,
      //       isNative: token.name == 'BNB' || token.name == 'ETH',
      //       chain: chain,
      //       chainId:chainId
      //     }));

      axios.get(PANCAKE_API)
        .then(res => {
          const tokens = res.data.tokens[chainId] || [];

          // Remove duplicates by address or name
          const apiTokens = tokens.filter((token: any, index: number, self: any) =>
            index === self.findIndex(
              (t: any) => t.address.toLowerCase() === token.address.toLowerCase()
            )
          )
            // 2️⃣ Optionally deduplicate by name if addresses are missing or same
            .filter((token: any, index: number, self: any) =>
              index === self.findIndex(
                (t: any) => t.address.toLowerCase() === token.address.toLowerCase()
              )

            ).map((token: any) => ({
              name: token.name,
              symbol: token.symbol,
              address: token.address,
              decimals: token.decimals,
              icon: token.logoURI,
              isNative: token.name == 'BNB' || token.name == 'ETH',
              chain: chain,
              chainId: chainId
            }));





          setTokenOneChain(evmChains.filter((data: any) => data.id == tokenOne.chainId)?.[0].name);

          setTokenTwoChain(evmChains.filter((data: any) => data.id == tokenTwo.chainId)?.[0].name);

          setFirstCheck(tokenOne.chainId);
          setSecondCheck(tokenTwo.chainId);




          // setTokensList(apiTokens)

          // const updatedTokens = [
          //   ...tokenList,
          //   ...apiTokens
          // ];

          if (chainId === '56') {
            var rezor = [{
              name: "REZOR",
              address: "0x9D0d41Df4cA809dC16A9BFf646d3c6CbC4EbC707",
              isNative: false,
              decimals: 9,
              symbol: "RZR",
              chain: "BNB",
              chainId: 56,
              icon: "https://assets.coingecko.com/coins/images/55692/thumb/1000444573.jpg?1747037831",
            }];

            const updatedTokens = [
              ...rezor,
              ...apiTokens
            ];



            setTokensList(updatedTokens);
          }
          else {
            setTokensList(apiTokens);

          }





          // if(store.getState().user.chainValues.currency != 'ETH'){          
          //   const customToken =  {
          //     name: "REZOR",
          //     address: "0x2111F1f5A8383F27a9f089abB1926dc00eb6beF3",
          //     isNative: false,
          //     decimals: 9,
          //     symbol: "RZR",
          //     icon: "https://assets.coingecko.com/coins/images/55692/thumb/1000444573.jpg?1747037831",
          //    };
          //    const updatedTokens = [
          //     apiTokens[0], 
          //     customToken,  
          //     ...apiTokens.slice(1) 
          //   ];

          //   setTokensList(updatedTokens);
          // }

        })
        .catch(err => console.error("Failed to fetch PancakeSwap tokens", err));
    }

    useEffect(() => {



      setTokens();

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

        var url = "https://bsc-dataseed.binance.org/";

        // if(store.getState().user.chainValues.currency === 'ETH'){
        //     return
        // }


        const provider = new ethers.JsonRpcProvider(url);
        const contract = new ethers.Contract(key, DynamicABI, provider);
        const [name, symbol, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
        ]);


        const checksummed = ethers.getAddress(key);
        // console.log(checksummed,"check");



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


      // if(store.getState().user.chainValues.currency === 'ETH'){
      //     return
      // }
      // const key = e.target.value.toLowerCase();
      // setQuery(key);

      // if (!key) {
      //   setFiltered([]);
      //   return;
      // }

      // const matches = tokensList.filter(token =>
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




    const { chainValues } = useAppSelector((state: any) => state?.user);

    const [showToken, setShowToken] = useState<boolean>(false);
    const [isSearchedTriggered, setIsSearchedTriggered] =
      useState<boolean>(false);
    const [filteredTokenList, setFilteredTokenList] = useState<TOKEN_DATA[]>([]);
    const navigate = useNavigate();

    const selectedChain: NetworkTypes = useSelector((state: any) => state?.user?.chainValues);

    const chainMap: Record<number, any> = {
      1: mainnet,
      56: bsc,
      137: chains.polygon,
      8453: chains.base,
      42161: chains.arbitrum,
      146: chains.sonic,
    
      
    }


    const handleTokenSelect = async (tokenSelected: any) => {
      // console.log("Field value:", field);


      if (field === "Field1") {
        if (tokenTwo?.name === tokenSelected.name && tokenTwo.chainId === tokenSelected.chainId) {
          return;
        }
        dispatch(setTokenOne(tokenSelected));
      } else {
        if (tokenOne?.name === tokenSelected.name && tokenOne.chainId === tokenSelected.chainId) {
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
        // const filteredList: any = tokenList.filter((token: TOKEN_DATA) => {
        const filteredList: any = tokensList.filter((token: TOKEN_DATA) => {
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
              // dispatch(setTokenList([...tokenList, newTokenToAdd]));
              dispatch(setTokenList([...tokensList, newTokenToAdd]));
              setFilteredTokenList([newTokenToAdd]);
              setIsSearchedTriggered(true);
            } else {
              setFilteredTokenList([]);
              setIsSearchedTriggered(true);
            }
          } catch (error) {
            // console.log(error, "error");
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
    const handleInfoIconClick = (chainId:any,address:any) => {
      // navigate(`/token/${symbol}/${address}`);
      // var url = `https://bscscan.com/address/${address}`;

      // if (store.getState().user.chainValues.currency === "ETH") {
      //   url = `https://etherscan.io/address/${address}`;
      // }

      var url = evmChains.filter((data)=>data.id === chainId)?.[0]?.metamask?.blockExplorerUrls[0]+"address/"+address;      
      window.open(url, "_blank");
    };

    const searchTokenbyName = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = e.target.value.toLowerCase();
      setQuery(key);

      if (!key) {
        setFiltered([]);
        return;
      }
      // await setTokens();

      // console.log(tokensList, "tokensList");


      const matches = tokensList.filter(token =>
        token.name.toLowerCase().includes(key) ||
        token.symbol.toLowerCase().includes(key) ||
        token.address.toLowerCase() === key
      );

      setFiltered(matches.slice(0, 15)); // optional limit
    }

    const { switchNetwork } = useAppKitNetwork();
    const { setNetworkInReduxState } = useWalletConnect();
    const walletAddress = useAppSelector(
      (store: any) => store?.user,
    );


    // const handleSwitchNetwork = async (e: any) => {

    //   if (e.chainId == selectedChain?.chainId) return
    //   else {

    //     var chain = e.chainId === 1 ? mainnet : e.chainId == 56 ? bsc : e.name.toLowerCase();
    //     setNetworkInReduxState(e.chainId);
    //       switchNetwork(chain);
    //     // if (walletAddress) {
    //     // }
    //   }

    // }

    const handleSwitchNetwork = async (e: any) => {

      try {
        if (e?.chainId === selectedChain?.chainId) return;

        setNetworkInReduxState(e.chainId);
        const chain = chainMap[e?.chainId];

        await switchNetwork(chain);

       


      } catch (err) {
        console.error("Failed to switch network:", err);
      }
    };


    return (
      <>
        {!tokenActive ? (
          <div className="my-3" >
            <Button className="d-flex gap-2 tokenSelectBtn rzrtokenBtn" onClick={() => {
            getTokens(field === "Field1" ? tokenOne : tokenTwo);
            setShowToken(true);
            setTokenOneChain(evmChains.filter((data: any) => data.id == tokenOne.chainId)?.[0].name);
          }}>
              <span className="d-flex">
                <span className="networkIcon">
                  <img src={evmChains.filter((data: any) => data.id == tokenOne.chainId)?.[0]?.logoURI} alt="" />
                </span>
                <span className="tokenChainIcon d-flex gap-2">
                  <span>
                    <img src={readOnly ? data?.tokenLogo : tokenOne?.icon ? tokenOne?.icon : NotFoundIcon} alt="" onError={(e) => {
                      e.currentTarget.onerror = null; // prevent infinite loop
                      e.currentTarget.src = NotFoundIcon; // your fallback image URL
                    }} />
                  </span>
                  <span className="tokenIcon">
                    {(readOnly ? data?.tokenName : tokenOne?.name).length > 10 ? customizeAddress(readOnly ? data?.tokenName : tokenOne?.name) : (readOnly ? data?.tokenName : tokenOne?.name)}
                  </span>
                </span>
              </span>

            </Button>
            {/* <div className="ps-5">
              {!readOnly ? <AiOutlineCaretDown className="token_drop" /> : null}
            </div> */}
          </div>
        ) : (
          <div className="my-3 " >
            <Button className="d-flex gap-2 tokenSelectBtn rzrtokenBtn" onClick={() => {
            getTokens(field === "Field1" ? tokenOne : tokenTwo); setShowToken(true);
            setTokenTwoChain(evmChains.filter((data: any) => data.id == tokenTwo.chainId)?.[0]?.name);
          }}>
              <span className="d-flex">
                <span className="networkIcon">
                  <img src={evmChains.filter((data: any) => data.id == tokenTwo.chainId)?.[0]?.logoURI} alt="" />
                </span>
                <span className="tokenChainIcon d-flex gap-2">
                  <span>
                    <img src={tokenTwo?.icon ? tokenTwo?.icon : NotFoundIcon} alt="" onError={(e) => {
                      e.currentTarget.onerror = null; // prevent infinite loop
                      e.currentTarget.src = NotFoundIcon; // your fallback image URL
                    }} />
                  </span>
                <span className="tokenIcon">{tokenTwo?.name.length > 10 ? customizeAddress(tokenTwo?.name) : tokenTwo?.name}</span>
                </span>
              </span>
            </Button>
            {/* <div className="ps-5">
              <AiOutlineCaretDown className="token_drop" />
            </div> */}
          </div>
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
                  placeholder={store.getState().user.chainValues.currency === 'ETH' ? "Search by token name or address" : "Search by token name"}
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
                      <img src={token?.icon ? token?.icon : NotFoundIcon} alt={token.symbol} width={20} style={{ margin: '0 8px' }}
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
            {store.getState().user.chainValues.currency !== 'ETH' && (
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
            )}
          </Tabs>

        </CommonModal>

        {!readOnly ? (
          <>
            {/* <CommonModal
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
      

            <ul className="d-flex justify-content-center align-items-center mb-3">

              {(NETWORKS)?.length > 0 ? (
                (NETWORKS).filter((value: any) => value.name?.toLowerCase() !== "solana").map(
                  (value: any, index: number) => {

                    const isChecked = store.getState().user.chainValues.currency == value.currency;

                    return (
                      <li key={index + 1} className="list-item my-auto">
                        <button
                          className={`${isChecked ? "active" : "in-active"}`}
                          onClick={() => { handleSwitchNetwork(value) }}
                          disabled={isChecked}
                        >
                          <div className="d-flex">
                            <span className="my-auto">
                              <img src={value?.icon} alt="" onError={(e) => {
                                e.currentTarget.onerror = null; // prevent infinite loop
                                e.currentTarget.src = NotFoundIcon; // your fallback image URL
                              }}
                              />
                            </span>
                            <div className="d-grid ">
                              {value?.name}

                            </div>
                          </div>
                        </button>

                      </li>
                    );
                  }
                )
              ) : (
                <p className="no_token_found">No token found.</p>
              )}
            </ul>

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

              {(isSearchedTriggered ? filteredTokenList : tokensList)?.length > 0 ? (
                (isSearchedTriggered ? filteredTokenList : tokensList).map(
                  (value: any, index: number) => {

                    const isChecked = (field === "Field1" && tokenTwo?.name === value?.name) ||
                      (field === "Field2" && tokenOne?.name === value?.name);

                    return (
                      <li key={index} className="list-item mt-2">
                        <button
                          className={`${isChecked ? "active" : "in-active"}`}
                          onClick={() => handleTokenSelect(value)}
                          disabled={field === "Field1" ? tokenTwo?.name === value?.name : tokenOne?.name === value?.name}
                        >
                          <div className="d-flex">
                            <span className="my-auto">
                              <img src={value?.icon} alt="" onError={(e) => {
                                e.currentTarget.onerror = null; // prevent infinite loop
                                e.currentTarget.src = NotFoundIcon; // your fallback image URL
                              }}
                              />
                            </span>
                            <div className="d-grid ">
                              {value?.name}
                              <span className="checkbtn">
                                {isChecked && <CheckIcon />}
                              </span>
                              <div className="fs-5">{value?.chain}</div>
                            </div>
                          </div>
                        </button>
                        {!isChecked && (
                          <span
                            className="info-icon"
                            onClick={() => handleInfoIconClick(value.symbol, value.address)}

                          >
                            <AiOutlineInfoCircle fontSize={20} />
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


          </CommonModal> */}
            {showToken && !showModel && (
              <>

                <div className="fade modal-backdrop show"></div>

                <div className="fade custom_modal tokens_modal_custom modal show d-block" role="dialog" aria-modal="true" style={{ display: 'block', paddingLeft: '5px' }}>
                  <div className="modal-dialog modal-lg modal-dialog-centered d-grid d-md-flex gap-2">



                    {/* select token modal  */}
                    <div className="modal-content tokenModalContent">
                      <div className="modal-header">
                        <h5 className="modal-title h4">Select Token</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                          setIsSearchedTriggered(false);
                          setShowToken(false);
                          field === "Field1" ? setTokenOneChain(evmChains.filter((data: any) => data.id == tokenOne.chainId)?.[0]?.name) : setTokenTwoChain(evmChains.filter((data: any) => data.id == tokenTwo.chainId)?.[0]?.name);
                        }}></button>
                      </div>
                      <div className="modal-body">

                        <ul className="d-flex d-md-none justify-content-center align-items-center mb-3 gap-3">

                          {/* set first index as selected index  */}

                          {(evmChains)?.length > 0 ? (
                            (evmChains).filter((value: any) => (field === "Field1" && firstCheck == value.id) || (field === "Field2" && secondCheck == value.id)).map(
                              (value: any, index: number) => {
                                // const isChecked = store.getState().user.chainValues.currency == value.currency;
                                // var isChecked = (field === "Field1" && tokenOne.chainId == value.chainId) || (field === "Field2" && tokenTwo.chainId == value.chainId);
                                var isChecked = (field === "Field1" && firstCheck == value.id) || (field === "Field2" && secondCheck == value.id);

                                return (
                                  <li key={index + 1} className="list-item bg-dark my-auto list-small">
                                    <button
                                      className={`small_btn ${isChecked ? "active border border-dark" : "in-active"}`}
                                      // className={`"in-active"`}
                                      onClick={async () => {
                                        getTokens(value); if (field === 'Field1') { handleSwitchNetwork(value); }
                                        field === "Field1" ? setTokenOneChain(value.name) : setTokenTwoChain(value.name);
                                      }}

                                    >
                                      <div className="d-flex">
                                        <span className="my-auto">
                                          <img src={value?.logoURI} alt="" onError={(e) => {
                                            e.currentTarget.onerror = null; // prevent infinite loop
                                            e.currentTarget.src = NotFoundIcon; // your fallback image URL
                                          }}
                                          />
                                        </span>
                                        <div className="my-auto ">
                                          {value?.name}

                                        </div>
                                        {isChecked ? <CheckIcon /> : <></>}
                                      </div>
                                    </button>

                                  </li>
                                );
                              }
                            )
                          ) : (
                            <p className="no_token_found">No token found.</p>
                          )}


                          {/* second index as chains first index   */}
                          {/* {(evmChains)?.length > 0 ? (
                            (evmChains).filter((value: any) =>  (field === "Field1" && firstCheck != value.id) || (field === "Field2" && secondCheck != value.id)).slice(0, 1).map(
                              (value: any, index: number) => {
                                // const isChecked = store.getState().user.chainValues.currency == value.currency;
                                // var isChecked = (field === "Field1" && tokenOne.chainId == value.chainId) || (field === "Field2" && tokenTwo.chainId == value.chainId);
                                var isChecked = (field === "Field1" && firstCheck == value.id) || (field === "Field2" && secondCheck == value.id);

                                return (
                                  <li key={index + 1} className="list-item bg-light my-auto list-small">
                                    <button
                                      className={`small_btn ${isChecked ? "active border border-dark" : "in-active"}`}
                                      // className={`"in-active"`}
                                      onClick={async() => {
                                        getTokens(value); if (field === 'Field1') { handleSwitchNetwork(value); }
                                        field === "Field1" ? setTokenOneChain(value.name) : setTokenTwoChain(value.name);
                                      }}

                                    >
                                      <div className="d-flex">
                                        <span className="my-auto">
                                          <img src={value?.logoURI} alt="" onError={(e) => {
                                            e.currentTarget.onerror = null; // prevent infinite loop
                                            e.currentTarget.src = NotFoundIcon; // your fallback image URL
                                          }}
                                          />
                                        </span>
                                        <div className="my-auto ">
                                          {value?.name}

                                        </div>
                                        {isChecked ? <CheckIcon /> : <></>}
                                      </div>
                                    </button>

                                  </li>
                                );
                              }
                            )
                          ) : (
                            <p className="no_token_found">No token found.</p>
                          )}

                    

                          {evmChains.length > 0 && (
                            <li className="list-item bg-light my-auto list-small ">
                              <button
                                className=" small_btn in-active  "
                                onClick={() => setShowMoreModal(true)}
                              >
                                 <AiOutlineCaretDown className="token_drop" />
                             
                              </button>
                            </li>
                          )} */}

                          {evmChains.length > 0 && (
                            <li className="list-item bg-dark my-auto list-small d-md-none d-block">
                              <button
                                className=" small_btn in-active my-2  "
                                onClick={() => setShowMoreModal(true)}
                              >
                                {/* <AiOutlineCaretDown className="token_drop" /> */}
                                Select Network
                              </button>
                            </li>
                          )}

                        </ul>



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
                        {isLoading && (<Lottie
                          animationData={loader}
                          className={`lottie_animation loading d-flex mx-auto my-auto w-25`}
                          loop={true}
                        />
                        )}
                        <ul className="mt-2 mx-4">

                          {(isSearchedTriggered ? filteredTokenList : tokensList)?.length > 0 ? (
                            (isSearchedTriggered ? filteredTokenList : tokensList).map(
                              (value: any, index: number) => {



                                const isChecked = (field === "Field1" && tokenTwo?.address === value?.address) ||
                                  (field === "Field2" && tokenOne?.address === value?.address);


                                var icon: any = value?.icon ? value?.icon : NotFoundIcon;
                                return (
                                  <li key={index + 1} className="list-item bg-dark mt-2 list-small">
                                    <button
                                      className={`small_btn ${isChecked ? "active" : "in-active"}`}
                                      onClick={() => handleTokenSelect(value)}
                                    // disabled={field === "Field1" ? tokenTwo?.address === value?.address : tokenOne?.address === value?.address}
                                    // disabled={isChecked}
                                    >
                                      <div className="d-flex">
                                        <span className="my-auto">
                                          <img src={icon} alt="" onError={(e) => {
                                            e.currentTarget.onerror = null; // prevent infinite loop
                                            e.currentTarget.src = NotFoundIcon; // your fallback image URL
                                          }}
                                          />
                                        </span>
                                        <div className="d-grid ">
                                          {value?.name}
                                          <span className="checkbtn">
                                            {isChecked && <CheckIcon />}
                                          </span>
                                          <div className="fs-5">{field == "Field1" ? tokenOneChain : tokenTwoChain}</div>
                                        </div>
                                      </div>
                                    </button>
                                    {/* {!isChecked && ( */}
                                    <span
                                      className="info-icon"
                                      onClick={() => handleInfoIconClick(value.chainId, value.address)}

                                    >
                                      <AiOutlineInfoCircle fontSize={20} />
                                    </span>
                                    {/* )} */}
                                  </li>
                                );
                              }
                            )
                          ) : (
                            <>
                              {!isLoading && (<p className="no_token_found">No token found.</p>)}
                            </>
                          )}
                        </ul>
                      </div>
                      <div className="modal-footer d-flex justify-content-center">
                        <div className="import-tokens">
                          <Button className="tokenBtn text-primary" onClick={() => setShowModel(true)}>Import Token</Button>
                        </div>
                      </div>
                    </div>
                    {/* select network modal for desktop  */}
                    <div className="modal-content w-50 d-none d-md-block">
                      <div className="modal-header justify-content-center">
                        <h5 className="modal-title h4">Select Network</h5>
                      </div>
                      <div className="modal-body">
                        <div className="modal_input">

                          <div className="search_icon">
                            <SearchIcon />
                          </div>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          ></input>
                        </div>
                        <ul style={{ overflowX: 'hidden', minHeight: '31rem' }} className="mt-3 mx-4">
                          {filteredNetworks.length > 0 ? (
                            filteredNetworks.filter((data) => data?.key === "pol" || data.key === 'bas' || data.key === "bsc" || data.key === 'eth')
                              .map((value: any, index: number) => {
                                // const isChecked =
                                //   store.getState().user.chainValues.currency ==
                                //   value.currency;
                                // const isChecked = tokenOne.chainId == value.id;
                                // const isChecked = (field === "Field1" && tokenOne.chainId == value.chainId) || (field === "Field2" && tokenTwo.chainId == value.chainId);


                                var isChecked = (field === "Field1" && firstCheck == value.id) || (field === "Field2" && secondCheck == value.id);


                                return (
                                  <li key={index} className="list-item bg-dark mt-2 list-small">
                                    <button
                                      className={`w-100 small_btn ${isChecked ? "active border border-dark" : "in-active"
                                        }`}
                                      onClick={() => {
                                        getTokens(value)
                                        setShowMoreModal(false);
                                        if (field === 'Field1') { handleSwitchNetwork(value); }
                                        field === "Field1" ? setTokenOneChain(value.name) : setTokenTwoChain(value.name);

                                      }}
                                    // disabled={isChecked}
                                    >
                                      <div className="d-flex align-items-center gap-2">
                                        <img
                                          src={value?.logoURI}
                                          alt=""
                                          className="me-2 rounded-circle"
                                        />
                                        <span>{value?.name}</span>
                                        {isChecked ? <CheckIcon /> : <></>}
                                      </div>
                                    </button>
                                  </li>
                                );
                              })
                          ) : (
                            <p className="text-center text-muted">
                              No networks found.
                            </p>
                          )}
                        </ul>
                      </div>
                    </div>
                    {/* <div className="modal-content w-75 h-49">
                  <div className="modal-header">
                    <h5 className="modal-title h4">Select Network</h5>
                  </div>
                  <div className="modal-body">
                   
                    <ul>

                      {(NETWORKS)?.length > 0 ? (
                        (NETWORKS).filter((value: any) => value.name?.toLowerCase() !== "solana").map(
                          (value: any, index: number) => {
                              
                            const isChecked = store.getState().user.chainValues.currency == value.currency;
                            
                            return (
                              <li key={index+1} className="list-item mt-2">
                                <button
                                  className={`${isChecked ? "active" : "in-active"}`}
                                  onClick={() => {handleSwitchNetwork(value)}}
                                  disabled={isChecked}
                                >
                                  <div className="d-flex">
                                    <span className="my-auto">
                                      <img src={value?.icon} alt="" onError={(e) => {
                                        e.currentTarget.onerror = null; // prevent infinite loop
                                        e.currentTarget.src = NotFoundIcon; // your fallback image URL
                                      }}
                                      />
                                    </span>
                                    <div className="d-grid ">
                                      {value?.name}
                                     
                                    </div>
                                  </div>
                                </button>
                    
                              </li>
                            );
                          }
                        )
                      ) : (
                        <p className="no_token_found">No token found.</p>
                      )}
                    </ul>
                  </div>
                </div> */}
                  </div>


                </div>
              </>
            )}
          </>
        ) : null}



        {showMoreModal && (
          <div className="fade custom_modal tokens_modal_custom modal show" role="dialog" aria-modal="true" style={{ display: 'block', paddingLeft: '5px' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title h4">Select Network</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowMoreModal(false)}
                  ></button>
                </div>
                <div className="modal-body">

                  <div className="modal_input">
                    <div className="search_icon">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Search network..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    ></input>
                  </div>

                  <ul style={{ overflowX: 'hidden', minHeight: '40rem' }} className="mt-3 mx-4">
                    {filteredNetworks.length > 0 ? (
                      filteredNetworks.filter((data) => data?.key === "pol" || data.key === 'bas'  || data.key === "bsc" || data.key === 'eth' )
                        .map((value: any, index: number) => {
                          // const isChecked =
                          //   store.getState().user.chainValues.currency ==
                          //   value.currency;
                          // const isChecked = tokenOne.chainId == value.id;
                          // const isChecked = (field === "Field1" && tokenOne.chainId == value.chainId) || (field === "Field2" && tokenTwo.chainId == value.chainId);


                          var isChecked = (field === "Field1" && firstCheck == value.id) || (field === "Field2" && secondCheck == value.id);


                          return (
                            <li key={index} className="list-item bg-dark mt-2 list-small">
                              <button
                                className={`w-100 small_btn ${isChecked ? "active border border-dark" : "in-active"
                                  }`}
                                onClick={() => {
                                  getTokens(value)
                                  setShowMoreModal(false);
                                  if (field === 'Field1') { handleSwitchNetwork(value); }
                                  field === "Field1" ? setTokenOneChain(value.name) : setTokenTwoChain(value.name);

                                }}
                              // disabled={isChecked}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={value?.logoURI}
                                    alt=""
                                    className="me-2 rounded-circle"
                                  />
                                  <span>{value?.name}</span>
                                  {isChecked ? <CheckIcon /> : <></>}
                                </div>
                              </button>
                            </li>
                          );
                        })
                    ) : (
                      <p className="text-center text-muted">
                        No networks found.
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  });

export default TokensModal;
