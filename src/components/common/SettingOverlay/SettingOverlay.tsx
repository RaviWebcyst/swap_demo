import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { CloseIcon, SettingIcon } from "../../../assets/icons/svgicons";
import Button from "../Button/Button";
import Input from "../Input/Input";
import "./SettingOverlay.scss";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setDeadline, setSlippage } from "../../../features/theme/user.slice";

const SettingOverlay = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const { slippage, deadline } = useAppSelector((state) => state.user);
  const [userSlippage, setUserSlippage] = useState<number | string>(slippage);
  const [userDeadline, setUserDeadline] = useState<number | string>(deadline);

  const handleClose = (
    userslippage?: string | number,
    userdeadline?: string | number
  ) => {
    ref.current?.click();
    if (userslippage && userdeadline) {
      setUserSlippage(userslippage);
      setUserDeadline(userdeadline);
    } else {
      setUserSlippage(slippage);
      setUserDeadline(deadline);
    }
  };
  const handleSlippage = (e: any) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(e) || e === "") {
      if (Number(e) >= 49) {
        setUserSlippage(49);
      } else if (e == "") {
        setUserSlippage("");
      } else {
        setUserSlippage(e);
      }
    }
  };
  const handleDeadline = (e: any) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(e) || e === "") {
      if (Number(e) >= 4000) {
        setUserDeadline(4000);
      } else if (e == "") {
        setUserDeadline("");
      } else {
        setUserDeadline(e);
      }
    }
  };
  const confirmSettings = (e: any) => {
    e.preventDefault();
    if (userSlippage && userDeadline) {
      dispatch(setSlippage(Number(userSlippage)));
      dispatch(setDeadline(Number(userDeadline)));
    }
    handleClose(userSlippage, userDeadline);
  };
  return (
    <>
      <Dropdown className="settingOverlay" autoClose="inside">
        <Dropdown.Toggle ref={ref} className="settingBtn without_bg_border">
          <SettingIcon />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div className="settingOverlayHeading">
            <h3>Settings</h3>
            <button onClick={() => handleClose()} className="closeBtn">
              <CloseIcon />
            </button>
          </div>
          <div className="settingOverlayBody">
            <form>
              <Input
                label="Slippage Tolerance (%)"
                placeholder="enter "
                className="inputOver"
                rightIcon="%"
                type="number"
                value={userSlippage}
                onChange={(e: any) => handleSlippage(e.target.value)}
              />
              <p className="input-helper">
                Input should be less than or equal to 49.
              </p>
              <br/>
              <Input
                label="Transactional Timeout"
                placeholder="enter "
                className="inputOver txn_timeout"
                type="number"
                rightIcon="Minutes"
                value={userDeadline}
                onChange={(e: any) => handleDeadline(e.target.value)}
              />
              <Button
                type="submit"
                fluid
                className={
                  Number(userDeadline) <= 0 || Number(userSlippage) <= 0
                    ? "grayBorder"
                    : "confirmBtn"
                }
                onClick={(e) => confirmSettings(e)}
                disabled={
                  Number(userDeadline) <= 0 || Number(userSlippage) <= 0
                }
              >
                Confirm
              </Button>
            </form>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default SettingOverlay;
