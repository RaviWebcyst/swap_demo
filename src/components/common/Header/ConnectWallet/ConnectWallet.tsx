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

import ViewWallet from "./ViewWallet/ViewWallet";
import { useAppKit, useAppKitAccount,useDisconnect } from "@reown/appkit/react";



type propTypes = {
  show?: boolean;
  handleClose: () => void;
};

const ConnectWallet = (props: propTypes) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const {
  
    walletAddress,
  }: {walletAddress:any } = useAppSelector(
    (store: any) => store?.user);




  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  

  const handleWalletConnect = async () => {
    if (walletAddress) {
      await disconnect({ namespace: 'eip155' });
    } else {
      await open({view:'Connect',namespace: 'eip155'});
      handleClose();
    }
  };
  const { theme } = useAppSelector((state) => state.theme);
  return (
    <>
      <Offcanvas
        className={`connect_wallet ${walletAddress  ? 'heightBoth' :  walletAddress ?'wallet_heights' : ''}`}
        show={props.show}
        placement="end"
        onHide={props.handleClose}
      >
        {!walletAddress  ? (
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
           
          </>
        ) : (
          <>
            <ViewWallet
              logoutOnCick={() => {
                props?.handleClose();
              }}
              justClose={props?.handleClose}
              address={walletAddress}
            />
          </>
        )}
      </Offcanvas>
    </>
  );
};

export default ConnectWallet;
