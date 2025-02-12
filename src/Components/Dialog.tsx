import React from "react";
import { Dialog } from 'primereact/dialog';

interface DapiData {
    clickLiveData?: string[];
    intLiveData?: string[];
    intLiveDynamicData?: string[];
    lineBreaksOpenUrl?: string;
    dapiContent?: string;
    isDesiParsed?: boolean;
}

export function DialogBox({ visible, onHide, data }: { visible: boolean; onHide: () => void; data: DapiData }) {
    return (
        <div className="card flex justify-content-center">
            <Dialog 
                header="Pixels" 
                visible={visible} 
                style={{ width: '95vw', maxHeight: '100vh' }}
                onHide={onHide}
                contentStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
            >
                {/* Two-column layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: "12px", gap: "10px" }}>
                    
                    {/* Left Column: intLiveData */}
                    <div style={{ borderRight: "1px solid #ddd", paddingRight: "10px" }}>
                        <h4 style={{ textAlign: "center", marginBottom: "5px" }}>
                              IntLive - {data.intLiveData?.length || 0} 
                        </h4>
                        {data.intLiveData?.map((item, index) => (
                            <div key={`int-${index}`} style={{ padding: "5px", border: "1px solid #ddd", borderRadius: "5px" }}>
                                {item}
                            </div>
                        ))}
                    </div>

                    {/* Right Column: clickLiveData */}
                    <div style={{ paddingLeft: "10px" }}>
                        <h4 style={{ textAlign: "center", marginBottom: "5px" }}>
                               ClickLive - {data.clickLiveData?.length || 0} 
                        </h4>
                        {data.clickLiveData?.map((item, index) => (
                            <div key={`click-${index}`} style={{ padding: "5px", border: "1px solid #ddd", borderRadius: "5px" }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
