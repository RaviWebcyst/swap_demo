import { useEffect, useState } from "react";
import { store } from "../app/store";
import { useWalletConnect } from "./useWalletConnect";
import {
  getNativeBalance,
  getTokenBalance,
} from "../services/contractServices/contractCallServices";
import { NETWORKS } from "../utils/constants";
import { TOKEN_DETAILS } from "../interfaces/common";

import { useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";

const useFetchTokenBalance = ({
  dispatch,
  tokenDetails,
}: {
  dispatch: any;
  tokenDetails: TOKEN_DETAILS;
}) => {
  const { walletAddress }: { walletAddress: string } = store?.getState()?.user;
  // const { walletProvider } = useWeb3ModalProvider();
  
  // var { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useAppKitProvider<any>("eip155");
 let { address, chainId, isConnected }:any = useAppKitNetwork();
  
  const [tokenBalance, setTokenBalance] = useState({
    token1Balance: 0,
    token1BalanceConverted: 0,
    token2Balance: 0,
    token2BalanceConverted: 0,
  });

  // if(window.location.pathname == '/liquidity'){
  //   chainId =97;
  // }

  const fetchData = async () => {
    if (walletAddress) {
      const { isTokenOneNative, isTokenTwoNative, tokenOneData, tokenTwoData } =
        tokenDetails;
      let res1: any;
      let res2: any;
      if (isTokenOneNative) {
        res1 = await getNativeBalance(walletAddress, walletProvider);
      } else {
        res1 = await getTokenBalance({
          tokenData: tokenOneData,
          dispatch,
          walletAddress: walletAddress,
          walletProvider,
        });
      }
      if (isTokenTwoNative) {
        res2 = await getNativeBalance(walletAddress, walletProvider);
      } else {
        res2 = await getTokenBalance({
          tokenData: tokenTwoData,
          dispatch,
          walletAddress: walletAddress,
          walletProvider,
        });
      }
      if (res1 && res2) {
        setTokenBalance({
          token1Balance: res1?.calculatedBalance || "0",
          token2Balance: res2?.calculatedBalance || "0",
          token1BalanceConverted: res1?.res,
          token2BalanceConverted: res2?.res,
        });
      }
    }
  };

  useEffect(() => {
    let inter: any;
    inter = setTimeout(() => {
      if (walletAddress && tokenDetails && chainId && walletProvider) {
        var findNetwork = NETWORKS.find(
          (network) => network.chainId === chainId
        );
        
        if (findNetwork || !findNetwork) {
          fetchData();
        }
      }
    }, 1000);

    if (!walletAddress) {
      setTokenBalance({
        token1Balance: 0,
        token1BalanceConverted: 0,
        token2Balance: 0,
        token2BalanceConverted: 0,
      });
    }
    return () => clearTimeout(inter);
  }, [walletAddress, tokenDetails, chainId, walletProvider]);

  return { tokenBalance, fetchData };
};

export default useFetchTokenBalance;
