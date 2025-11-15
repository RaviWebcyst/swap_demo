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
import { setTheme } from "../../../features/theme/theme.slice";
import { ROUTES, NETWORKS } from "../../../utils/constants";
import { customizeAddress } from "../../../utils/helpers";
import Button from "../Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import ConnectWallet from "./ConnectWallet/ConnectWallet";
import "./Header.scss";
import { NetworkTypes } from "../../../interfaces/common";
import { setImportedLps } from "../../../features/theme/user.slice";

import { toast } from "../Toasts/Toast";
import { useAppKit, useAppKitAccount, useAppKitNetwork,useDisconnect } from "@reown/appkit/react";




type propTypes = {
  active?: boolean;
  handleActive?: () => void;
};

const Header = (props: propTypes) => {
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

  const { switchNetwork } = useAppKitNetwork();

  const walletAddress = useSelector((state: any) => state?.user?.walletAddress);
  const selectedChain: NetworkTypes = useSelector(
    (state: any) => state?.user?.rezorchainValues
  );
  // console.log(selectedChain, "valuessss")
  //console.log(NETWORKS[0], "Network")

  const [show, setShow] = useState(false);
  const [isNetworkSwitched, setIsSwitchedNetwork] = useState(false);
  const [routeDetail, setRouteDetail] = useState<string>(
    window?.location?.pathname
  );
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
        const response = await switchNetwork(e.chainId);
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
  

  const { open } = useAppKit();

  const { disconnect } = useDisconnect();


  const {address}  = useAppKitAccount();
  const handleWalletConnect = async () => {
    if (address) {
      disconnect();
    } else {
      await open();
    }
  };

  return (
    <>
      <header className="header">
        <Container fluid className="px-40">
          <div className="header_in">
            <Link to={ROUTES.HOME} className={"header_logo"}>
              <img
                className="d-sm-block d-none"
                src={theme === "light" ? lightLogo : logo}
                alt="logo"
              />
              <img src={theme === "light" ? lightLogo : logo} alt="logo" className="d-sm-none" />
            </Link>
            <Sidebar
              handleActive={props.handleActive}
              active={props.active}
              setRouteDetail={setRouteDetail}
            />
            <div className="header_action">
                    <div className="natwork_btn">
                      <Select
                        isDisabled={false}
                        options={NETWORKS}
                        defaultValue={selectedChain || NETWORKS[0]}
                        value={selectedChain}
                        classNamePrefix={"select"}
                        isSearchable={false}
                        placeholder={<CurrencyEthereum />}
                        onChange={(e) => {
                          if (!walletAddress) {
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
                  <div className="connect_btn">
                    {walletAddress ? (
                      <Button onClick={() => setShow(true)}>
                        {walletAddress
                          ? customizeAddress(walletAddress)
                          : "Connect"}
                      </Button>
                    ) : (

                      <Button
                        onClick={() => {
                          handleWalletConnect();
                        }}
                      >
                        {walletAddress
                          ? customizeAddress(walletAddress)
                          : "Connect"}
                      </Button>

                    )}
                  </div>
                  <div className="vertical-line"></div>
                {/* </>
              ) : ""} */}

              <div className="d-sm-block d-none">
                <button
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
                </button>
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
               
                {/* <span></span>
                <span></span>
                <span></span> */}
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

