import React, { useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import "../styles/badge.css";
 

interface DapiData {
    clickLiveData?: string[];
    intLiveData?: string[];
    intLiveDynamicData?: string[];
    lineBreaksOpenUrl?: string;
    dapiContent?: string;
    isDesiParsed?: boolean;
    intClickFire?: {
        I?: string[];
        C?: string[];
    };
}

export function DialogBox({ visible, onHide, data }: { visible: boolean; onHide: () => void; data: DapiData }) {
    useEffect(() => {
        console.log("intClickFire:", data.intClickFire);
    }, [data.intClickFire]);

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Pixels"
                visible={visible}
                style={{ width: '95vw', maxHeight: '400vh' }}
                onHide={onHide}
                contentStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
            >
                {/* Two-column layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: "10px", gap: "5px" }}>

                    {/* Left Column: intLiveData */}
                    <div style={{ borderRight: "1px solid #ddd", paddingRight: "5px" }}>
                        <h4 style={{ textAlign: "center", marginBottom: "5px" }}>
                            IntLive - {data.intLiveData?.length || 0}
                        </h4>
                        {data.intLiveData?.map((item, index) => {
                            const isMatched = data.intClickFire?.I?.includes(item);
                            return (
                                <div
                                    key={`int-${index}`}
                                    className={isMatched ? "paintFiredPixel" : ""}

                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: clickLiveData */}
                    <div style={{ paddingLeft: "5px" }}>
                        <h4 style={{ textAlign: "center", marginBottom: "5px" }}>
                            ClickLive - {data.clickLiveData?.length || 0}
                        </h4>
                        {data.clickLiveData?.map((item, index) => {
                            const isMatched = data.intClickFire?.C?.includes(item);
                            return (
                                <div
                                    key={`click-${index}`}
                                    className={isMatched ? "paintFiredPixel" : ""}

                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
