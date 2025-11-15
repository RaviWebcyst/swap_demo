import { Nav, Tab } from "react-bootstrap";
import CommonModal from "../CommonModal/CommonModal";
import "./UserStakingInfo.scss";
import CommonTable from "../../CommonTable/CommonTable";
import { cryptoDecimals } from "../../../../utils/helpers";
import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";

type TProps = {
  show?: boolean;
  handleClose?: () => void;
  stakingInfo: any;
};

const UserStakingInfo = (props: TProps) => {
  const ref = useRef([]);
  const fields = [
    { label: "No." },
    { label: "Token Staked" },
    { label: "Current Earnings" },
    { label: "Final Earnings" },
    { label: "Timer" },
    { label: "Status" },
  ];

  return (
    <CommonModal
      show={props.show}
      handleClose={props.handleClose}
      className="user_stake_info_modal"
      heading={`User Stakes Info`}
    >
      <CommonTable fields={fields}>
        {props?.stakingInfo?.stakeData?.map((item: any, key: number) => {
          return (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>
                {cryptoDecimals(
                  item[0] / 10 ** props?.stakingInfo?.originalData?.tokenDecimal
                )}
              </td>
              
              <td>
                {
                
                cryptoDecimals(
                  item?.rewardCalculated /
                    10 ** props?.stakingInfo?.originalData?.tokenDecimal
                )}
              </td>
              <td>
                {cryptoDecimals(
                  item.finalReward /
                    10 ** props?.stakingInfo?.originalData?.tokenDecimal
                )}
              </td>
              <Countdown
                date={item[2] * 1000}
                intervalDelay={0}
                key={item[2] * 1000}
                renderer={({ days, hours, minutes, seconds, completed }:any) => {

                  return (
                    <>
                      <td>
                        {days || "00"}:{hours || "00"}:{minutes || "00"}:
                        {seconds || "00"}
                      </td>

                      <td className={`status_txt ${item.status}`}>
                        {completed ? "UnLock" : "Lock"}
                      </td>
                    </>
                  );
                }}
              />
            </tr>
          );
        })}
      </CommonTable>
    </CommonModal>
  );
};

export default UserStakingInfo;
