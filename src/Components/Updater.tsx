import React, { useState, useEffect } from "react";
import 'primeicons/primeicons.css';
import "../styles/global.css"

export const UpdateMessage = () => {
    return (
        <>
        <div className="messageWrapper">
        <i className="pi pi-cloud-download" title="Click to update!" style={{ fontSize: '1rem', cursor:"pointer" }} />
        <span className="tickerWrapper">

        <div style={{ overflow: "hidden", whiteSpace: "nowrap",  color: "black" }}>
            <div className="ticker">
            ❗You are using an older version. Click to update!
            </div>
        </div>
        </span>
        </div>
        </>
    );
};

export const Updater = ({ ver }:{ver:string}) => {
    const [configData, setConfigData] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateNow, setUpdateNow] = useState(false);

    const version = ver 
    const _confJson = "https://creative.exponential.com/creative/devshowcase/VTT/config.json?r=" + new Date().getTime();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(_confJson);
                if (!response.ok) throw new Error("Failed to fetch data");

                const data = await response.json();
                setConfigData(data);

                // Ensure string comparison
                const releasedVersion = String(data.releasedVersion);
                const currentVersion = String(version);

                setUpdateNow(releasedVersion !== currentVersion);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    function downlodNewVersion(){
        if (configData?.downloadLink) {
           window.open(configData.downloadLink, "_blank");
        }

    }

    return (
        <div >
                {updateNow && <span onClick={downlodNewVersion}><UpdateMessage  /></span>}
        </div>
    );
};
