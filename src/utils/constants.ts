import { bscTestnet, mainnet } from "viem/chains";
import EthIcon from "../../src/assets/icons/tokens/EthIcon.svg";
import bnbIcon from "../assets/icons/tokens/bnb.svg";

import {
  BSC_CONTRACT_LIST,
  BSC_TOKEN_LIST,
  ETHEREUM_CONTRACT_LIST,
  ETHEREUM_TOKEN_LIST,
  PANCAKE_TOKEN_LIST,
} from "../assets/tokens&ContractInfo/info";
import { DAYS_TO_VALUE_MAP, NetworkTypes } from "../interfaces/common";
import { AppKitNetwork,bsc } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";



export const EVENTS = {
  LOGIN_SUCCESS: "login_success",
};

export const ROUTES: { [key: string]: string } = {
  HOME: "/",
  SWAP: "/swap",
  SWAP_CARD: "/", 
  LIQUIDITY: "/liquidity",
  TRADE: "/trade",
  LIQUIDITYFORM: "/liquidity/liquidity-form",
  REVIEWSWAP: "review-swap",
  TOKEN_ID: "/token/:symbol/:address",
  EXPLORER:"/explorer",
//  EXPLORER_ID: "/explorer/:explorerId"
};

export const SOCIAL_LINK: { [key: string]: string } = {
  MAIL: "",
  INSTAGRAM: "",
  WEBSITE: "",
  TWITTER: "",
  PHONE: "",
  TELEGRAM: "",
};
export const envType: string = process.env.REACT_APP_ENV_TYPE || "production";
// export const envType: string = process.env.REACT_APP_ENV_TYPE || "stage";
export const daysToValueMap: DAYS_TO_VALUE_MAP = {
  30: 0,
  60: 1,
  90: 2,
  120: 3,
};
export const zeroAddress: string = "0x0000000000000000000000000000000000000000";

export const NETWORKS: NetworkTypes[] =
  envType !== "production"
    ? [
       
        {
          name: "Binance",
          currency: "tBNB",
          chainId: 97,
          label: "tBNB",
          chainIdHex: "0x61",
          symbol: "BSC",
          icon: bnbIcon,
          decimals: 18,
          explorerUrl: "https://testnet.bscscan.com",
          rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
     
      ]
    : [
        {
          name: "Binance",
          currency: "BSC",
          chainId: 56,
          label: "BSC",
          chainIdHex: "0x38",
          symbol: "BSC",
          icon: bnbIcon,
          decimals: 18,
          explorerUrl: "https://bscscan.com",
          // rpcUrl:
          //   "https://bsc.nodes.fastnode.io/mainnet/fn-dedic-43b2-ba81-8c3f3d4fd5db/",
          rpcUrl: "https://bsc.publicnode.com",
        },
       
      ];

      
    

export const networkConfig = (chainId: number = NETWORKS[0].chainId) => {
  const network = NETWORKS.find((network) => network.chainId === chainId);
  if (network) {
    if (network.symbol === "BSC") {
      return {
        network: network,
        contractList: BSC_CONTRACT_LIST,
        tokenList: PANCAKE_TOKEN_LIST,
      };
    } else if (network.symbol === "ETH") {
      return {
        network: network,
        contractList: ETHEREUM_CONTRACT_LIST,
        tokenList: ETHEREUM_TOKEN_LIST,
      };
    }
  } else {
    return {
      network: NETWORKS[0],
      contractList: BSC_CONTRACT_LIST,
      tokenList: PANCAKE_TOKEN_LIST,
    };
  }
};


export const metadata = {
  name: " swap",
  description: " swap WalletConnect",
  url: "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};


export const APIURL = {
  GET_DOLLAR_PRICE: "/dollarPrice",
  GET_STAKE_DATA: "/userStakedDetails",
  GET_FARM_DATA: "/farmPoolDetails",
  SYMBOL: "/querySymbol",
  CHECKSWAP: "/checkswap",
  FINDDESIREDTOKEN: "/findDesiredToken",
  FINDTOKENFORCURRENCY: "/findTokenForCurrency",
  SWAP: "/swap",
  FETCHCHAIN: "/fetchChain",
  FETCHFEE: "/fetchFee",
  GETFAVORITY: "/getFavorites",
  SETFAVORITY: "/setFavourite",
  REMOVEFAVORITY: "/removeFromFavourites",
  SWAP_TOKENS_GET: "token/getTokens",
  CROSS_CHAIN_ROUTES: "getCrossChainSwapRoutes",
  CROSS_CHAIN_SWAP: "crossChainSwap",
  CROSS_CHAIN_TXN_STATUS: "crossChainTxnStatus",
};



///TODO
export const SITE_URL ="";
 

// export const projectId: string = "f71492b62c17fee4f9bd300208c408ad";
export const projectId: string = "a9d7c8d07b81ba50fa96d6670edc1afb";
// export const projectId: string = "0fee233b7ebb41dd859e4e8cf7f23207";

// export const networks = [bscTestnet] as [AppKitNetwork, ...AppKitNetwork[]]
export const networks = [bsc] as [AppKitNetwork, ...AppKitNetwork[]]



export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

