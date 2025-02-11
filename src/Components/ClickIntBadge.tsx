import React from "react"
import "../styles/badge.css";

interface CBtype {
    label:string
}

export const ClickIntBadge:React.FC<CBtype> =({ label}) => {
    return (<div className="Badge-Outer noselect"> {label} </div>)
}