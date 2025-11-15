



import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  CheckIcon,
  CurrencyEthereum,
  Menu,
  LightMenu,
  MoonIcon,
  SunIcon,
} from "../../../assets/icons/svgicons";
import lightLogo from "../../../assets/logo/light-logo.svg";
import logo from "../../../assets/logo/logo.svg";
import smallLogo from "../../../assets/logo/small-logo.svg";
import { useWalletConnect } from "../../../CustomHook/useWalletConnect";
import { setTheme } from "../../../features/theme/theme.slice";
import { ROUTES, NETWORKS, networks, projectId, metadata, wagmiAdapter } from "../../../utils/constants";
import { customizeAddress } from "../../../utils/helpers";
import Button from "../Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import ConnectWallet from "./ConnectWallet/ConnectWallet";
import "./Header.scss";
import { NetworkTypes } from "../../../interfaces/common";
import { setImportedLps } from "../../../features/theme/user.slice";

import { toast } from "../Toasts/Toast";
import { useAppKit, useAppKitNetwork, useDisconnect,createAppKit, useAppKitAccount } from "@reown/appkit/react";




// const generalConfig = {
//   projectId,
//   networks,
//   metadata,
//   themeMode: 'light' as const,
//   themeVariables: {
//     '--w3m-accent': '#000000',
//   }
// }

// // Create modal
// createAppKit({
//   adapters: [wagmiAdapter],
//   ...generalConfig,
//   features: {
//     analytics: true // Optional - defaults to your Cloud configuration
//   },
//   enableReconnect: false,

// })



type propTypes = {
  active?: boolean;
  handleActive?: () => void;
};

const Header = (props: propTypes) => {

  // const { open } = useAppKit();
  
  const [isComponentRendered, setIsComponentRendered] = useState(false);
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const location = useLocation();
  // Access the current path
  const currentPath = location.pathname;
  const path = "/token/BlueSparrow";
  const segments = currentPath.split("/");
  const extractedToken = segments[1];
  // console.log("currentPath:", currentPath);

  // const { switchNetwork, setNetworkInReduxState } = useWalletConnect();
  const { setNetworkInReduxState } = useWalletConnect();
  const { switchNetwork } = useAppKitNetwork();


  const walletAddress = useSelector((state: any) => state?.user?.walletAddress);
  const selectedChain: NetworkTypes = useSelector(
    (state: any) => state?.user?.chainValues
  );
  // console.log(selectedChain, "valuessss")
  //console.log(NETWORKS[0], "Network")

  const [show, setShow] = useState(false);
  const [isNetworkSwitched, setIsSwitchedNetwork] = useState(false);
  const [routeDetail, setRouteDetail] = useState<string>(
    window?.location?.pathname
  );
  

  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
  const { disconnect } = useDisconnect()

  // const {address, isConnected ,isConnecting} = useAccount();
  //   const { connect, connectors} = useConnect()

  // const {disconnect} = useDisconnect();

  //   const walletConnect = connectors.find((c) => c.name === 'WalletConnect')

  const { open } = useAppKit();

  const handleChange = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (isNetworkSwitched) {
      dispatch(setImportedLps([]));
      setIsSwitchedNetwork(false);
    }
  }, [selectedChain, isNetworkSwitched]);

  useEffect(() => {
    setIsComponentRendered(true);
  }, []);


  const handleSwitchNetwork = async (e: any) => {
    try {
      if (e.chainId == selectedChain?.chainId) return;
      else {
        const response =  switchNetwork(e.chainId);
        // if (response) {
        //   setIsSwitchedNetwork(true);
        //   setNetworkInReduxState(e.chainId);
        // }

        // if (!response) return;
      }
    } catch (error: any) {
      return;
    }
  };
  

 

  // const { address, disconnect,open } = useWalletConnect();
  //   const { disconnect } = useDisconnect();
  // let { address, chainId, isConnected }:any = useAppKitNetwork();

  
  const handleWalletConnect = async () => {

    console.log(isConnected,"isconnected");
    
    if (isConnected) {
      disconnect();
    } else {
       open({ view: "Connect" });
    }
  };

  return (
    <>
      <header className="header">
        <Container fluid className="px-40">
          <div className="header_in">
            <Link to={ROUTES.HOME} className={"header_logo"}>
            <h1>Swap</h1>
              {/* <img
                className="d-sm-block d-none"
                src=""
                alt="logo"
              />
              <img src="" alt="logo" className="d-sm-none" /> */}
            </Link>
            <Sidebar
              handleActive={props.handleActive}
              active={props.active}
              setRouteDetail={setRouteDetail}
            />
            <div className="header_action">
                    <div className="natwork_btn">
                      <Select
                        isDisabled={ false}
                        options={NETWORKS}
                        defaultValue={selectedChain || NETWORKS[0]}
                        value={selectedChain}
                        classNamePrefix={"select"}
                        isSearchable={false}
                        placeholder={<CurrencyEthereum />}
                        onChange={(e) => {
                          if (!isConnected) {
                            toast.info("Please connect your wallet first!");
                          }
                          handleSwitchNetwork(e);
                        }}
                        className="header_select"
                        formatOptionLabel={(options: NetworkTypes) => {
                          return (
                            <>
                              <img
                                src={
                                   options?.icon
                                }
                                alt={options.label}
                              />
                              <span>{options.label}</span>
                              {options?.chainId == selectedChain?.chainId ? (
                                <CheckIcon />
                              ) : (
                                ""
                              )}
                            </>
                          );
                        }}
                      />
                    </div>

                  {/* </>
                ) : (
                  ""
                ))} */}
              {/* {currentPath !== "/" ? (
                <> */}
              <div className="vertical-line"></div>
                  {/* <div><appkit-button /></div> */}
                  
                  <div className="connect_btn">
                    {isConnected ? (
                      <Button onClick={() => setShow(true)}>
                       {customizeAddress(address || '')}
                      </Button>
                    ) : (

                      <Button
                        onClick={() => {
                          handleWalletConnect();
                          // open({view:'Connect'});
                        }}
                      >
                        {isConnected 
                          ? customizeAddress(address || '')
                          : "Connect"}
                      </Button>
                      

                    )}
                  </div>
                  <div className="vertical-line"></div>
                {/* </>
              ) : ""} */}

              <div className="d-sm-block d-none">
                {/* <button
                  className={`theme_btn ${theme === "dark" ? "active" : ""}`}
                  onClick={handleChange}
                >
                  <motion.div layout>
                    <AnimatePresence mode="popLayout">
                      {theme === "dark" ? (
                        <motion.div
                          key={1}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <SunIcon />
                        </motion.div>
                      ) : (
                        <motion.div
                          key={2}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <MoonIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button> */}
                {/* <button
                  className={`theme_btn ${theme === "dark" ? "active" : ""}`}
                  onClick={handleChange}
                >
                  <motion.div layout>
                    <AnimatePresence mode="popLayout">
                      {theme === "dark" ? (
                        <motion.div
                          key={1}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <MoonIcon />
                        </motion.div>
                      ) : (
                        <motion.div
                          key={2}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <SunIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button> */}
              </div>

              <button
                className={`${props.active ? "active" : ""} toggler d-xl-none`}
                onClick={props.handleActive}
              >
                {theme === 'light'? <LightMenu /> : <Menu /> }
               
              
              </button>
            </div>
          </div>
        </Container>
      </header>
      <ConnectWallet show={show} handleClose={() => setShow(false)} />
    </>
  );
};

export default Header;

