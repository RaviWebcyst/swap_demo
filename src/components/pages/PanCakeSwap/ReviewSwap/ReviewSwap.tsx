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
import { createConfig, EVM, executeRoute, Solana } from "@lifi/sdk";
import { useWalletClient } from "wagmi";
import { modal, useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { Provider } from "ethers";
import { base, bsc, mainnet, polygon } from 'viem/chains'
import { createWalletClient, custom } from "viem";
import loader from '../../../../assets/animations/rs_loader_.json'
import tick from '../../../../assets/animations/tick.json'
import cross from '../../../../assets/animations/error.json';
import Lottie from "lottie-react";


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
    solanawalletAddress
  }: { walletAddress: string; chainValues: any,solanawalletAddress:any } = useAppSelector(
    (store: any) => store?.user
  );
  // const { state } = useLocation();
  const  state  = props?.state;

    const { data: walletClient } = useWalletClient() // Wagmi wallet client
    const { setNetworkInReduxState } = useWalletConnect();

    const { walletProvider: solanaProvider } = useAppKitProvider<Provider>("solana");
    const { walletProvider: evmProvider } = useAppKitProvider<Provider>("eip155");

    const [senderRes, setSenderRes] = useState<any>({
    status: '',
    bodyText: '',
    title: '',
    txHash: '',
  });
    const [resRespone, setResResponse] = useState<any>({
    status: '',
    bodyText: '',
    title: '',
    txHash: '',
  });

  const [swapResponse, setSwapResponse] = useState<any>({
    status: '',
    bodyText: '',
    title: '',
    txHash: '',
  });

  // console.log(state,"state");

   const chainMap: Record<number, any> = {
    1: mainnet,
    56: bsc,
    137: polygon,
    8453: base,

  }

  
  const { switchNetwork } = useAppKitNetwork();


  const createDynamicWalletClient = async (chainId: number) => {
    const chain = chainMap[chainId]

    if (!chain) throw new Error(`Unsupported chainId: ${chainId}`);

    const [address] = await (evmProvider as any).request({ method: 'eth_requestAccounts' });

    await switchNetwork(chain);

    //create wallet client

    const walletClient = createWalletClient({
      account: address as `0x${string}`,
      chain,
      transport: custom(evmProvider as any),
    })

    return walletClient
  }

  
  const [showBridge, setShowBridge] = useState<boolean>(false)

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


  console.log(state,"state");
  

  const handleSwap = async () => {
  

      if ((tokenOne.chainId != 1151111081099710 && !walletAddress) || (tokenOne.chainId == 1151111081099710 && !solanawalletAddress)) return; // not connected then return

      if (state.tokenDetails.tokenOneData.chainId !== state.tokenDetails.tokenTwoData.chainId) { // chain according set transaction loading modal
        setShowBridge(true)
        setSenderRes({
          title: '',
          bodyText: 'Preparing Transaction',
          status: 'PENDING',
          txHash: '',
        })
      } else {
        setShow(true)
      }

      if (!showBridge) {
        setModalData({
          title: 'Swap',
          bodyText: `Please confirm transaction to Swap ${tokenOne?.symbol} for ${tokenTwo?.symbol}`,
          status: 'pending',
          txHash: null,
        })
      }



      var inputOne = state?.inputOne

      if (state?.selectedField !== 'TK1') {
        const value = BigInt(10000)
        const per = BigInt(1000)
        const inpt = BigInt(state?.inputOne?.convertedValue)

        // Calculate with BigInt only
        inputOne.convertedValue = Number((inpt * (value + per)) / value)
      }

      var tokenonedecimals = tokenOne?.decimals
      var contract_address = state?.contAdd

    try {
          //create lifi configuration
          createConfig({
            integrator: 'Rezor-Swap-Defi',
            rpcUrls: {
              [8453]: ["https://mainnet.base.org"],
              [137]: ["https://polygon-bor-rpc.publicnode.com"],
              [1]: ['https://ethereum-rpc.publicnode.com'],
              [56]: ['https://bsc-dataseed.binance.org'],
              [1151111081099710]: ['https://solana-mainnet.g.alchemy.com/v2/9a-QjODy8s7aOykW9t83SGhzmB0CJeKq'],

            },
            providers: [
              EVM({
                getWalletClient: async () => walletClient as any,
              }),
              Solana({
                async getWalletAdapter() {
                  return solanaProvider as any;
                },
              }),
            ],
          })

          const routes = state.lifiRoute; //get route from api

          console.log(routes,"routes");
          

          var routeData = routes;

          let options: any = {

            executionSettings: { // execution setting for lifi sdk
              solana: {
                walletAdapter: solanaProvider
              },
              gasZip: {
                enabled: true,  // enable gaszip transaction
              },

            },



            updateRouteHook: (route: any) => {

              route.steps.forEach((step: any, index: any) => {
                // change ui using steps from lifi


                step.execution?.process?.forEach(async (process: any) => {
                  console.log(process,"process");
                  

                  //on chain swap using lifi

                  if (process.txHash && process.status === "DONE" && state.tokenDetails.tokenOneData.chainId === state.tokenDetails.tokenTwoData.chainId) {

                    setModalData({
                      title: "Swap",
                      bodyText: `Transaction successful for Swapping of ${state?.tokenDetails?.tokenOneData?.symbol} - ${state?.tokenDetails?.tokenTwoData?.symbol}`,
                      status: "success",
                      txHash: process.txLink,
                      type: "lifi"
                    });
                    await state.fetchData();
                  }
                  else {
                    //cross chain swap using lifi
                    if (process.type === 'CROSS_CHAIN' && process.status === 'STARTED') { // cross chain swap step
                      setSenderRes({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: '',
                      })
                    }
                    else if (process.type === 'CROSS_CHAIN' && process.status === 'PENDING') {
                      setSenderRes({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: '',
                      })
                    } else if (process.type === 'CROSS_CHAIN' && process.status === 'FAILED') {

                      var errorMessage = process?.error?.message;
                      const regex =
                        /This bundle id is unknown \/ has not been submitted/;

                      const hasExpectedLine =
                        regex.test(process?.error?.message ?? "");

                      if (hasExpectedLine) {
                        errorMessage = "Transaction Rejected By User";
                      }


                      setSenderRes({
                        title: process.type,
                        bodyText: errorMessage,
                        status: process.status,
                        txHash: '',
                      })
                    } else if (process.type === 'CROSS_CHAIN' && process.status === 'DONE') {
                      setSenderRes({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: process.txLink,
                      });
                    }

                    else if (process.type === 'RECEIVING_CHAIN' && process.status === 'STARTED') { //receiving side step start
                      setResResponse({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: '',
                      })
                    }
                    else if (process.type === 'RECEIVING_CHAIN' && process.status === 'PENDING') {
                      setResResponse({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: '',
                      })
                    } else if (process.type === 'RECEIVING_CHAIN' && process.status === 'DONE') {
                      setResResponse({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: process.txLink,
                      });

                    } else if (process.type === 'RECEIVING_CHAIN' && process.status === 'FAILED') {
                      setResResponse({
                        title: process.type,
                        bodyText: process?.error?.message,
                        status: process.status,
                        txHash: '',
                      })
                    }
                    else if (process.type === 'SWAP' && process.status === 'STARTED') { // swap on 3rd step 
                      setSwapResponse({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: '',
                      })
                    }
                    else if (process.type === 'SWAP' && process.status === 'PENDING') {
                      setSwapResponse({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: '',
                      })
                    } else if (process.type === 'SWAP' && process.status === 'DONE') {
                      setSwapResponse({
                        title: process.type,
                        bodyText: process.message,
                        status: process.status,
                        txHash: process.txLink,
                      });

                      if (tokenOne?.chainId != 1151111081099710) {
                        var chain = chainMap[tokenOne?.chainId as any];
                        await modal?.switchNetwork(chain);

                        await setNetworkInReduxState(tokenOne.chainId);
                      }

                    } else if (process.type === 'SWAP' && process.status === 'FAILED') {
                      var errorMessage = process?.error?.message;
                      const regex =
                        /This bundle id is unknown \/ has not been submitted/;

                      const hasExpectedLine =
                        regex.test(process?.error?.message ?? "");

                      if (hasExpectedLine) {
                        errorMessage = "Transaction Rejected By User";
                      }

                      setSwapResponse({
                        title: process.type,
                        bodyText: errorMessage,
                        status: process.status,
                        txHash: '',
                      });

                      if (tokenOne?.chainId !== tokenTwo.chainId && tokenOne?.chainId != 1151111081099710) { // switch chain back according to first token chain
                        var chain = chainMap[tokenOne?.chainId as any];
                        await modal?.switchNetwork(chain);

                        await setNetworkInReduxState(tokenOne.chainId);
                      }

                    }
                  }

                })
              })
            }
          };
          //if chainhook required in lifi swap
          if (routeData.containsSwitchChain) {
            options.switchChainHook = async (requiredChainId: number) => { //switch chain hook need on third step

              var chain = chainMap[requiredChainId];
              await modal?.switchNetwork(chain);
              await setNetworkInReduxState(requiredChainId);
              const newWalletClient = await createDynamicWalletClient(requiredChainId);
              await new Promise((r) => setTimeout(r, 300));



              // Return the wallet client - chain switching is handled by the wallet client in createConfig
              return newWalletClient as any;
            }

          }


          await executeRoute(routeData, options); // execute lifi swap
          await state.fetchData();

          dispatch(setTransactionCounter(true)); // set transaction in redux
          return;
        }
        catch (err) {
          console.log(err, 'err')


          // set failed modal on chain using lifi

          if (state.tokenDetails.tokenOneData.chainId === state.tokenDetails.tokenTwoData.chainId) {
            setModalData({
              title: 'Transaction Failed',
              bodyText: `Failed from Aggerator for ${state?.tokenDetails?.tokenOneData?.symbol} - ${state?.tokenDetails?.tokenTwoData?.symbol}`,
              status: 'failed',
              txHash: null,
            })
          }


          dispatch(setTransactionCounter(false)) // set transaction in redux
          return
        }
    // try {
    //   if (!walletAddress) return;
    //   setModalData({
    //     title: "Swap",
    //     bodyText: `Please confirm transaction to Swap ${tokenOne?.symbol} for ${tokenTwo?.symbol}`,
    //     status: "pending",
    //     txHash: null,
    //   });

    //   var inputOne = state?.inputOne;
      
    //   // console.log(inputOne,"inputonevaluedata");
    //   if(state?.selectedField !== 'TK1'){
        
    //      const value = BigInt(10000);
    //     const per = BigInt(1000);
    //     const inpt = BigInt( state?.inputOne?.convertedValue);

    //     // Calculate with BigInt only
    //      inputOne.convertedValue = Number((inpt * (value + per) / value));
    //   }

    //   var tokenonedecimals = tokenOne?.decimals;
    //   var contract_address = state?.contAdd;

  
      
    //   const swapResult: any = await swapHelperFunction(
    //     state?.tokenDetails,
    //     inputOne,
    //     state?.inputFixedTwo,
    //     state?.selectedField,
    //     walletProvider,
    //     dispatch,
    //     setModalData,
    //     tokenonedecimals,
    //     contract_address
    //   );

    //   // console.log(swapResult,"swapResult");
      
    //   if (swapResult == "SWAP DONE") {
    //     dispatch(setTransactionCounter(true));
    //   } else if (swapResult == "SWAP FAILED") {
    //     dispatch(setTransactionCounter(false));
    //   } else if (swapResult?.code == 4001) {
    //     dispatch(setTransactionCounter(false));
    //   }
    // } catch (error) {
    //   dispatch(setTransactionCounter(false));
    //   console.log("error", error);
    // }
  };

  return (
   <>
      {/* cross chain swap modal  */}
      {showBridge && state.tokenDetails.tokenOneData.chainId !== state.tokenDetails.tokenTwoData.chainId ? (
        <div className="addCardBox mb-0 ">
          <div>
            <div className="addCard_tokenvalues">
              <div className="token_mainSelected">
                <div className="token_mainSelected_leftSide">
                  <h6 className="mb-2">You Pay</h6>
                  <div className="amount d-grid gap-2">
                    <h1 className="d-flex align-items-center gap-4 squid_div">
                      <img src={`${state.tokenDetails?.tokenOneData?.icon || ''}`} width={40} />
                      <div className='h2'> {state?.inputOne?.inputValue} {state.tokenDetails.tokenOneData?.symbol}
                        <p className='h6 pt-1'> ~$ {state?.lifiRoute?.fromAmountUSD}</p>
                      </div>
                    </h1>
                  </div>
                </div>
              </div>
              <div className="my-2 ms-4">
                <h1 className="d-flex align-items-center gap-4 squid_div">
                  <img src={`${state.lifiRoute?.steps?.[0]?.toolDetails?.logoURI || ''}`} width={40} />
                  <span>{state.lifiRoute?.steps?.[0]?.toolDetails?.name} </span>{' '}
                </h1>
              </div>
              <div className="token_receive">
                <div className="token_receive_leftSide">
                  <h6 className="mb-2">You Receive</h6>
                  <div className="amount d-grid gap-2">
                    <h1 className="d-flex align-items-center gap-4 squid_div">
                      <img src={`${state.tokenDetails?.tokenTwoData?.icon || ''}`} width={40} />
                      <div className='h2'>{state?.inputTwo?.inputValue} {state.tokenDetails.tokenTwoData?.symbol}
                        <p className='h6 pt-1'>
                          ~$
                          {/* {state?.tk2DollarValue} */}
                          {state?.lifiRoute?.toAmountUSD}
                        </p>
                      </div>
                    </h1>

                  </div>
                </div>
              </div>
              {senderRes.status != '' && (
                <div className="d-flex justify-content-between align-items-center my-2 mx-4 ">
                  <div>
                    <Lottie
                      animationData={
                        senderRes?.status === 'DONE' ? tick : senderRes?.status === 'FAILED' ? cross : loader
                      }
                      className={`lottie_animation  ${senderRes?.status === 'DONE' ? 'success' : senderRes?.status === 'FAILED' ? 'failed' : 'loading'
                        }`}
                      loop={senderRes?.status === 'PENDING' || senderRes?.status === 'STARTED'}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </div>
                  <h3>{senderRes.bodyText}</h3>
                  <div>
                    {senderRes?.txHash && senderRes?.status === 'DONE' && (
                      <a href={senderRes?.txHash} target="_blank" rel="noreferrer">
                        View Txn
                      </a>
                    )}
                  </div>
                </div>
              )}
              {resRespone.status != '' && (
                <div className="d-flex justify-content-between align-items-center my-2 ms-4 ">
                  <div>
                    <Lottie
                      animationData={
                        resRespone?.status === 'DONE' ? tick : resRespone?.status === 'FAILED' ? cross : loader
                      }
                      className={`lottie_animation  ${resRespone?.status === 'DONE'
                        ? 'success'
                        : resRespone?.status === 'FAILED'
                          ? 'failed'
                          : 'loading'
                        }`}
                      loop={resRespone?.status === 'PENDING' || resRespone?.status === 'STARTED'}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </div>
                  <h3>{resRespone.bodyText}</h3>
                  <div>
                    {resRespone?.txHash && resRespone?.status === 'DONE' && (
                      <a href={resRespone?.txHash} target="_blank" rel="noreferrer">
                        View Txn
                      </a>
                    )}
                  </div>
                </div>
              )}
              {swapResponse.status != '' && (
                <div className="d-flex justify-content-between align-items-center my-2 ms-4 ">
                  <div>
                    <Lottie
                      animationData={
                        swapResponse?.status === 'DONE' ? tick : swapResponse?.status === 'FAILED' ? cross : loader
                      }
                      className={`lottie_animation  ${swapResponse?.status === 'DONE'
                        ? 'success'
                        : swapResponse?.status === 'FAILED'
                          ? 'failed'
                          : 'loading'
                        }`}
                      loop={swapResponse?.status === 'PENDING' || swapResponse?.status === 'STARTED'}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </div>
                  <h3>{swapResponse.bodyText}</h3>
                  <div>
                    {swapResponse?.txHash && swapResponse?.status === 'DONE' && (
                      <a href={swapResponse?.txHash} target="_blank" rel="noreferrer">
                        View Txn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        !show && (
          <div className="addCardBox mb-0 ">    {/* on chain swap modal  */}
            <div>
              <div className="addCard_tokenvalues">
                <div className="token_mainSelected">
                  <div className="token_mainSelected_leftSide">
                    <h6 className="mb-2">You Pay</h6>
                    <div className="amount d-grid gap-2">
                      <h1>
                        {state?.inputOne?.inputValue} {state.tokenDetails.tokenOneData?.symbol}
                      </h1>
                      <p>
                        ~$
                        {state?.tk1DollarValue}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="token_receive">
                  <div className="token_receive_leftSide">
                    <h6 className="mb-2">You Receive</h6>
                    <div className="amount d-grid gap-2">
                      <h1>
                        {state?.inputTwo?.inputValue} {state.tokenDetails.tokenTwoData?.symbol}
                      </h1>
                      <p>
                        ~$
                        {state?.tk2DollarValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                fluid
                className={`btnapprove mb-3 ${isWrongNetwork ? 'grayBorder' : 'fluid'}`}
                onClick={() => {
                  handleSwap()
                  // setShowBridge(true);
                  // setShow(true);
                }}
                disabled={isWrongNetwork}
              >
                Confirm Swap
              </Button>
            </div>
          </div>
        )
      )}

      {/* transaction modal  */}
      {show ? (
        <TxnModal
          show={show}
          handleClose={() => {
            props?.isShow(false)
            setShow(false)
          }}
          data={modalData}
        />
      ) : null}
    </>
  );
};

export default ReviewSwap;
