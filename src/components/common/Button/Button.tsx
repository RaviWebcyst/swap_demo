import { MouseEvent, ReactNode } from 'react';
import "./Button.scss";

type propTypes = {
    className?: string,
    title?: string,
    children?: ReactNode,
    text?: string,
    disabled?: boolean,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    type?: "submit" | "reset",
    fluid?: boolean,
}

const Button = (props: propTypes) => {
    return (
        <>
            <button
                className={`common_btn ${props.fluid ? "w-100" : ""} ${props.className || ""}`}
                disabled={props.disabled}
                title={props.title}
                onClick={props.onClick}
                type={props.type || "button"}
            >
                {props.text || props.children}
            </button>
        </>
    )
}

export default Button