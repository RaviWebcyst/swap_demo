import { Tab, Tabs } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import Button from "../../../Button/Button";
import {
  ATMCardIcon,
  CloseIcon,
  LogoutIcon,
  SettingSecIcon,
  WalletIcon,
} from "../../../../../assets/icons/svgicons";
import accountIcon from "../../../../../assets/icons/accountIcon.svg";

// import icon from "../../../../../assets/icons/favicon.png";

// import rezorIcon from "../../../../../assets/icons/rezorchain.svg";
import metamask from "../../../../../assets/icons/metamask.svg";
import "./ViewWallet.scss";
import TabListdata from "./TabListdata";
import { resetTokenSlice } from "../../../../../features/theme/token.slice";
import { resetUserSlice, setUserConnected } from "../../../../../features/theme/user.slice";
import { customizeAddress } from "../../../../../utils/helpers";

import { useAppKit, useAppKitNetwork, useDisconnect,createAppKit, useAppKitAccount } from "@reown/appkit/react";


const ViewWallet = ({ logoutOnCick, justClose, address }: any) => {
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    // var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry|webOS/i.test(navigator.userAgent);
    // if(window?.ethereum && isMobile){
    //   alert("working");
    //    dispatch(resetTokenSlice());
    //   dispatch(resetUserSlice());
    // }
    await disconnect();
    dispatch(resetTokenSlice());
    dispatch(resetUserSlice());
  };
  return (
    <>
      <section className="viewWallet">
        <button className="croseBtn" onClick={() => justClose()}>
          <CloseIcon />
        </button>
        <div className="viewWallet_tophead">
          <div className="viewWallet_tophead_connectIcon">
            {/* <img src={icon} alt="rezorIcon" /> */}
            {/* <span className="walletIcon">
              <img src={metamask} alt="wallet" />
            </span> */}
            <h6>{customizeAddress(address)}</h6>
          </div>
          <div className="viewWallet_tophead_rightBtn">
            <Button
              className="without_bg_border btnlogout"
              onClick={logoutOnCick}
            >
              <LogoutIcon />
              <span
                className="d-flex align-items-center"
                onClick={() => handleDisconnect()}
              >
                <LogoutIcon /> Disconnect
              </span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewWallet;
