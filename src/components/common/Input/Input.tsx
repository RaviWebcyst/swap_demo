import { ReactNode } from "react";
import "./Input.scss";
import { symbolsArr } from "../../../utils/helpers";

type propTypes = {
  className?: string;
  label?: ReactNode;
  type?: string;
  placeholder?: string;
  onChange?: any;
  value?: string | number;
  rightIcon?: string | ReactNode;
  name?: string;
  disabled?: boolean;
};

const Input = (props: propTypes) => {
  const onKeyDown = (evt: any) => {
    return symbolsArr.includes(evt.key) && evt.preventDefault();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Regex pattern to validate input length
    const regex = /^\d{0,150}(\.\d{0,18})?$/;

    if (regex.test(inputValue) || inputValue === "") {
      props.onChange?.(e); // Call the onChange handler if provided
    }
  };
  return (
    <>
      <div className={`common_input  ${props.className || ""}`}>
        {props.label && <label htmlFor={props.name}>{props.label}</label>}
        <div
          className={`common_input_inner ${
            props.rightIcon ? "rightIconInput" : ""
          }`}
        >
          <input
            type={props.type || "text"}
            placeholder={props.placeholder}
            onChange={handleChange}
            id={props.name}
            name={props.name}
            value={props.value}
            onKeyDown={onKeyDown}
            disabled={props?.disabled}
          />

          {props.rightIcon && (
            <span className={`rightIcon`}>{props.rightIcon}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Input;
