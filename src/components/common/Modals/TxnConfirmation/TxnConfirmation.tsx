import CommonModal from "../CommonModal/CommonModal";
import animation from "../../../../assets/animations/error.json";
import eth from "../../../../assets/icons/EthIcon.svg";
import "./TxnConfirmation.scss";
import Lottie from "lottie-react";
import { useAppSelector } from "../../../../app/hooks";
import { useEffect, useState } from "react";
import { BlockExploreUrl } from "../../../../utils/helpers";

type TProps = {
  show?: boolean;
  handleClose?: () => void;
  transactionData?: any;
};

const TxnConfirmation = (props: TProps) => {

  const [progress, setProgress] = useState<any>(0);

  useEffect(() => {
    setTimeout(() => {
      if (progress <= 75) {
        const interval = setInterval(() => {
          // Simulating progress for demonstration purposes
          setProgress((prevProgress: any) =>
            prevProgress < 75 && !props?.transactionData?.status
              ? prevProgress + 25
              : props?.transactionData?.status
              ? 100
              : 75
          );
        }, 1000); // Adjust the interval as needed

        return () => clearInterval(interval); // Cleanup on component unmount
      }
    }, 2000);
  }, []);
  return (
    <CommonModal
      show={props.show}
      handleClose={props.handleClose}
      heading="Transaction Confirmation"
      className="txn_confirmation"
    >
      <ul className="from_to_box">
        <li>
          <div>
            <p>From</p>
            {/* <img src={selectedFrom?.icon} alt="ethereum" /> */}
          </div>
        </li>
        <li>
          <div>
            <p>To</p>
            {/* <img src={selectedTo?.icon} alt="binance" /> */}
          </div>
        </li>
      </ul>
      {!props?.transactionData?.status &&
      progress !== 100 &&
      !props?.transactionData?.code ? (
        <div className="txn_progress">
          <p>{progress}%</p>
          <div style={{ width: `${progress}%` }}></div>
        </div>
      ) : props?.transactionData?.code ? (
        <Lottie
          animationData={animation}
          loop={false}
          className="txn_rejected"
        />
      ) : (
        <>
          <p className="balance_show_txt">
            Your balance will be shown after some time!
          </p>
          <a
            href={`${BlockExploreUrl[56]}${
               props?.transactionData?.txnHash
            }`}
            target="_blank"
            rel="noreferrer"
            className="explorer_link"
          >
            View on {"explorer"}
          </a>
        </>
      )}
      <p className="txn_txt">
        {props?.transactionData?.code && !props?.transactionData?.status
          ? "Transaction is Rejected!"
          : !props?.transactionData?.code && props?.transactionData?.status
          ? "Transaction is Successful!"
          : "Transaction is Pending!"}
      </p>
    </CommonModal>
  );
};

export default TxnConfirmation;
