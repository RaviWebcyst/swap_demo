
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setChainValues,
  setContractDetails,
  setUserConnected,
  setWalletAddress,
} from "../features/theme/user.slice";
import { networkConfig, NETWORKS } from "../utils/constants";

import {
  resetTokenSlice,
  setTokenList,
  setTokenTwo,
} from "../features/theme/token.slice";
import { BrowserProvider } from "ethers";
import { useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitProvider, useWalletInfo,useDisconnect } from "@reown/appkit/react";
// import { useDisconnect } from "wagmi";

export const useWalletConnect = () => {
  const dispatch = useDispatch();
  // const { open } = useWeb3Modal();
  // const { disconnect } = useDisconnect();
  // const { address, chainId, isConnected }:any = useWeb3ModalAccount();
  // const { walletProvider, walletProviderType }: any = useWeb3ModalProvider();

  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  let {chainId }:any = useAppKitNetwork();
    const { address, isConnected } = useAppKitAccount();


    

  // let { walletProvider, walletProviderType }: any = useWeb3ModalProvider();
  const { walletProvider } = useAppKitProvider<any>("eip155");
  
  const { walletInfo } = useWalletInfo();
  const { switchNetwork } = useAppKitNetwork();


  // const switchNetwork = async (chainIdProvided: any) => {
  //   try {
  //     let { network }: any = networkConfig(chainIdProvided);
  //     if (
  //       walletInfo?.name === "walletConnect" ||
  //       walletInfo?.name === "coinbaseWallet"
  //     ) {
        
  //       return true;
  //     }
  //     if (network) {
  //       await new Promise<any>((resolve, reject) => {
  //         walletProvider
  //           ?.request({
  //             method: "wallet_switchEthereumChain",
  //             params: [{ chainId: network.chainIdHex }],
  //           })
  //           .then((res: any) => {
  //             resolve(res);
  //           })
  //           .catch(async (err: any) => {
  //             console.log({ err });
  //             if (err.code == 4001) {
  //               return;
  //             }
  //             if (err.code === 4902) {
  //               await addNewNetwork(network);
  //             }
  //             reject(err);
  //           });
  //       });

  //       return true;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const addNewNetwork = async (network: any) => {
    await walletProvider?.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: network.chainIdHex,
          chainName: network.name,
          nativeCurrency: {
            name: network.name,
            symbol: network.symbol,
            decimals: network.decimals,
          },
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.explorerUrl],
        },
      ],
    });
  };

  const setNetworkInReduxState = (chainId: any) => {
    const netConfig: any = networkConfig(chainId);
    dispatch(setTokenList(netConfig.tokenList));
    dispatch(setChainValues(netConfig.network));
    dispatch(setContractDetails(netConfig.contractList));
  };

  

  useEffect(() => {

    
    let inter: any;
    inter = setTimeout(async() => {
    //   var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry|webOS/i.test(navigator.userAgent);
    //    if(window?.ethereum  && isMobile){
    //     const provider =  new BrowserProvider(window?.ethereum as any)
    //     const signer = await provider.getSigner()
    //      address = await signer.getAddress();
    //     walletProvider = window?.ethereum;
    //  }

      dispatch(setWalletAddress(address));
      if (address) {
        dispatch(setUserConnected(true));
      } else {
        dispatch(setUserConnected(false));
      }
    }, 1000);
    return () => clearInterval(inter);
  }, [address]);
  
// uncomment code for issue
  useEffect(() => {
    let inter: any;
    inter = setTimeout(() => {
      if (chainId) {
        const network = NETWORKS.find((network) => network.chainId === chainId);
        if (network) {
          setNetworkInReduxState(chainId);
        }
      }
    }, 1000);

    return () => clearTimeout(inter);
  }, [chainId]);

  return {
    open,
    disconnect,
    address,
    chainId,
    isConnected,
    walletProvider,
    // walletProviderType,
    walletProviderType:walletInfo?.name,
    switchNetwork,
    setNetworkInReduxState,
  };
};
