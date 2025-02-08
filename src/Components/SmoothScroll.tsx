import React, { ForwardedRef } from "react";
import "../styles/SmoothScroll.css";

interface SmoothScrollUIProps {
    name:string,
    urls: string[];
    scrollRef: ForwardedRef<HTMLDivElement>;
}

const SmoothScrollUI: React.FC<SmoothScrollUIProps> = ({ name, urls, scrollRef }) => {
    return (
        <div className="smoothscroll-container">
            <span className="smoothscroll-title"> {name}</span>
            <div ref={scrollRef} className="smoothscroll-list">
                {urls.map((url, index) => (
                    <div key={index} className="smoothscroll-item">
                        <span>{url}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmoothScrollUI;
