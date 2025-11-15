import { useEffect } from "react";
import Application from "./Application";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { networks, NETWORKS, projectId, wagmiAdapter } from "./utils/constants";
import { metadata } from "./utils/constants";
import { setTokenOne, setTokenTwo} from "./features/theme/token.slice";
import useIsWrongNetwork from "./CustomHook/useisWrongNetwork";
import { store } from "../src/app/store";
import { useLocation } from "react-router-dom";

import { useAppKit, useAppKitNetwork, useDisconnect,createAppKit, useAppKitAccount } from "@reown/appkit/react";




const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
    features: {
    analytics: true ,
    email:false,
    socials:[]
  },
  enableReconnect:false

})

// createWeb3Modal({
//   featuredWalletIds: [
//     "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
//     "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
//     "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
//     "b248559bff6b18d0d776a23698990641f8d7704c35faa7de60865cc8429818b9"
//   ],
//   includeWalletIds: [
//     "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
//     "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
//     "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
//     "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
//     "b248559bff6b18d0d776a23698990641f8d7704c35faa7de60865cc8429818b9"
//   ],
  
//   ethersConfig: defaultConfig({
//     metadata,
//     // debug: true,
//     enableEIP6963: true,
//     enableInjected: false,
//     enableCoinbase: true,
//     // rpcUrl: "...",
//     defaultChainId: Number(NETWORKS[0].chainId),
    
//   }),
//   chains: NETWORKS,
//   projectId,
// });



function App() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  const { chainValues } = useAppSelector((state: any) => state?.user);
  const { tokenList } = useAppSelector((store: any) => store?.token);
  const isWrongNetwork = useIsWrongNetwork();
  // const { chainId } = useWalletConnect();
  // const { switchNetwork, walletProviderType } = useWalletConnect();

  const { switchNetwork } = useAppKitNetwork();



  useEffect(() => {
    document.body.className = `${theme}-theme`;
   
  }, [theme]);

  var {pathname} = window.location;

  useEffect(() => {
    if(pathname != "/liquidity"){
    dispatch(setTokenOne(tokenList[0]));
    dispatch(setTokenTwo(tokenList[1]));
    }
   
  
  }, [chainValues]);

  const changeDefaultNetwork = async () => {
    if (isWrongNetwork && window?.location?.pathname != "/cross-chain") {
      if(pathname != "/liquidity"){
       switchNetwork(chainValues?.chainId || NETWORKS[0]);
    }
  }
      
  };

  useEffect(() => {
    console.log('build version v1');
    changeDefaultNetwork();
  }, [isWrongNetwork]);
  return (
    <>
      {isWrongNetwork && window?.location?.pathname != "/cross-chain" ? (
        <div className="warningNetwork">
          <h3>
            App network doesn't match to network selected in wallet. Please
            Switch the network in wallet.
          </h3>
        </div>
      ) : (
        ""
      )}
      <Application />
    </>
  );
}

export default App;
export const storeReduxInstance = store;
