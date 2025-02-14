import React from "react"
import "../styles/badge.css";

interface CBtype {
    label:string;
    onClick?: (r:any) => void;
}

export const ClickIntBadge: React.FC<CBtype> = ({ label, onClick }) => {
    return (
        <div className="Badge-Outer noselect" onClick={() => onClick?.("top") }> 
            {label} 
        </div>
    );
};
