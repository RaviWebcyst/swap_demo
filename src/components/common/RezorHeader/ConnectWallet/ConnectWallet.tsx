import { Offcanvas } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  CloseIcon,
  GoogleIcon,
  WalletIcon,
} from "../../../../assets/icons/svgicons";
import Button from "../../Button/Button";
import "./ConnectWallet.scss";
import { useEffect, useState } from "react";
import { setWalletAddress } from "../../../../features/theme/user.slice";
import ViewWallet from "./ViewWallet/ViewWallet";
import store from "../../../../app/store";
import { useAppKit, useAppKitAccount,useDisconnect } from "@reown/appkit/react";


type propTypes = {
  show?: boolean;
  handleClose: () => void;
};

const ConnectWallet = (props: propTypes) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);


  // const dispatch = useAppDispatch();

  const {  open } = useAppKit();
  const {address} = useAppKitAccount();
  const {disconnect} = useDisconnect();
  

  const handleWalletConnect = async () => {
    if (address) {
      disconnect();
    } else {
      await open();
      handleClose();
    }
  };
  const { theme } = useAppSelector((state) => state.theme);
  return (
    <>
      <Offcanvas
        className={`connect_wallet ${address?'wallet_height':''}`}
        show={props.show}
        placement="end"
        onHide={props.handleClose}
      >
        {!address ? (
          <>
            <div className="action_btn">
              <button className="croseBtn" onClick={() => props?.handleClose()}>
                <CloseIcon />
              </button>
              {/* <WalletIcon /> */}
              <button className="common_btn my-3 " type="button"
              onClick={() => {
                  props?.handleClose();
                  handleWalletConnect();
                }} >Connect Wallet</button>
            </div>
            {/* <p className="or_line">
            </p>
            <p className="footer_txt">
              You consent to the Terms of Service and Privacy Policy of
              RezorSwap by connecting a wallet. <br />
              (Latest revision: 6.7.23)
            </p> */}
          </>
        ) : (
          <>
            <ViewWallet
              logoutOnCick={() => {
                props?.handleClose();
                handleWalletConnect();
              }}
              justClose={props?.handleClose}
              address={address}
            />
          </>
        )}
      </Offcanvas>
    </>
  );
};

export default ConnectWallet;
