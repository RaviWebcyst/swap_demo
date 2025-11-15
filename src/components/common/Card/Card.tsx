import React, { ReactNode } from 'react'
import "./Card.scss";

type propTypes = {
    title?: string,
    children?: ReactNode,
    filters?: ReactNode,
    className?: string,
}

const Card = (props: propTypes) => {
    return (
        <>
            <div className={`table_card ${props.className || ""}`}>
                <div className="table_card_head">
                    <h3>{props.title}</h3>
                    {
                        props.filters &&
                        <div className="table_card_filters">
                            {props.filters}
                        </div>}
                </div>
                <div className={"table_card_body"}>
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default Card
