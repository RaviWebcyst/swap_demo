import { useState } from "react";
import accountIcon from "../../../../../assets/icons/accountIcon.svg";
import metamask from "../../../../../assets/icons/metamask.svg";
import {
  ArrowdownIcon,
  ArrowUpIcon,
} from "../../../../../assets/icons/svgicons";
import "./ViewWallet.scss";

const TabListdata = () => {
  const transactiondetails = [
    {
      Imgaccount: accountIcon,
      ImgWallet: metamask,
      titleTrans: "Rps League",
      vauleTrans: "8.90RPS",
      amountTitle: "0.06",
      amountPerce: "1.11",
    },
    {
      Imgaccount: accountIcon,
      ImgWallet: metamask,
      titleTrans: "Rps League",
      vauleTrans: "8.90RPS",
      amountTitle: "0.06",
      amountPerce: "1.11",
    },
    {
      Imgaccount: accountIcon,
      ImgWallet: metamask,
      titleTrans: "Rps League",
      vauleTrans: "8.90RPS",
      amountTitle: "0.06",
      amountPerce: "1.11",
    },
    {
      Imgaccount: accountIcon,
      ImgWallet: metamask,
      titleTrans: "Rps League",
      vauleTrans: "8.90RPS",
      amountTitle: "0.06",
      amountPerce: "1.11",
    },
  ];
  return (
    <>
      <div className="tabList">
        <ul className="listingdetails">
          {transactiondetails.map((data: any) => (
            <li key={data.Imgaccount}>
              <div className="connectIcon">
                <img src={data.Imgaccount} alt="accountIcon" />
                <span className="walletIcon">
                  <img src={data.ImgWallet} alt="wallet" />
                </span>
                <div className="transactionstatus">
                  <h6>{data.titleTrans}</h6>
                  <p>{data.vauleTrans}</p>
                </div>
              </div>
              <div className="amountstatus">
                <h6>${data.amountTitle}</h6>
                <p>
                  <ArrowdownIcon />
                  {data.amountPerce}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TabListdata;
