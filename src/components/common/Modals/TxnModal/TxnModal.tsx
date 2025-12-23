import Lottie from "lottie-react";
import { Link, useLocation } from "react-router-dom";
import cross from "../../../../assets/animations/error.json";
import loading from "../../../../assets/animations/loading.json";
import loader from "../../../../assets/animations/rs_loader_.json";
import tick from "../../../../assets/animations/tick.json";
import CommonModal from "../CommonModal/CommonModal";
import "./TxnModal.scss";
import { useAppSelector } from "../../../../app/hooks";

interface propTypes {
  show?: boolean;
  handleClose?: () => void;
  data?: {
    title?: string;
    bodyText?: string;
    status?: "success" | "failed" | "in-progress" | ""; 
    txHash?: string | null;
    type?:undefined
  };
}

const TxnModal = (props: propTypes) => {
  const {
  chainValues,
}: {
  chainValues: any;
} = useAppSelector((state) => state?.user);

// console.log(props,"props");


  // var chainDetails = useAppSelector((state) => state?.user?.chainValues);
   var {pathname} = useLocation();
  // const chainDetails = pathname === "/liquidity" ? rezorchainValues : chainValues;

  var explorerUrl = pathname === "/swap" ? chainValues.metamask?.blockExplorerUrls[0]:pathname ==="/solana" ? "https://solscan.io/" : "https://bscscan.com/";

  
  
  

  return (
    <>
      <CommonModal
        className="txn_modal"
        show={props.show}
        handleClose={props.handleClose}
        heading={props?.data?.title}
        status={props?.data?.status}
      >
        <Lottie
          animationData={
            props.data?.status === "failed"
              ? cross
              : props.data?.status === "success"
              ? tick
              : loader
          }
          className={`lottie_animation ${
            props.data?.status === "failed"
              ? "failed"
              : props.data?.status === "success"
              ? "success"
              : "loading"
          }`}
          loop={props.data?.status === "in-progress"}
        />
        <h3>{props.data?.bodyText}</h3>
        {props.data?.status === "success" && (
          <>
          {props.data.type && props?.data?.type === "lifi" ? (
          <Link
            className="view_btn text_gradient"
            target="_blank"
            to={`${props.data.txHash}`}
          >
            View on Explorer
          </Link>
          ):(
          <Link
            className="view_btn text_gradient"
            target="_blank"
            to={`${explorerUrl}tx/${props?.data?.txHash}`}
          >
            View on Explorer
          </Link>
          )}
          </>
        )}
        
      </CommonModal>
    </>
  );
};

export default TxnModal;
