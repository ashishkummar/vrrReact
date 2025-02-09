import React, { ForwardedRef } from "react";
import { PrimeIcons } from 'primereact/api';

import "../styles/SmoothScroll.css";

interface SmoothScrollUIProps {
    name:string,
    data: string[];
    scrollRef: ForwardedRef<HTMLDivElement>;
    onDelete: () => void;  

}

const SmoothScrollUI: React.FC<SmoothScrollUIProps> = ({ name, data, scrollRef, onDelete }) => {

function flushData(){
    data=[]
}


    return (
        <div className="smoothscroll-container">
            <div className="smoothscroll-titleHolder">
                <span className="smoothscroll-title"> {name}</span>
                <span  onClick={onDelete}><i className="pi pi-trash" title="Delete" style={{ fontSize: '12px', cursor:"pointer" }}></i>
                </span>
            </div>
            <div ref={scrollRef} className="smoothscroll-list">
                {data.map((url, index) => (
                    <div key={index} className="smoothscroll-item">
                        <span>{url}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmoothScrollUI;
