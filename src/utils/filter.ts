 

interface PixelData {
    intLive?: string;
    clickLive?: string;
    ver?: string;
    SE?: boolean;
}

interface MessageData {
    pixel?: PixelData;
}

export function handleImageRequest(details: chrome.webRequest.WebResponseHeadersDetails, devToolsPort: chrome.runtime.Port | null) {
    if (/\.(jpg|jpeg|png|gif|mp4)/i.test(details.url)) {
        console.log("📷 Image Request Captured:", details.url);

        chrome.runtime.connect({ name: "devtools" }).postMessage({ type: "TEST", message: "Hello" });

        if (devToolsPort) {
            console.log("🚀 Sending Image to DevTools:", details.url, devToolsPort);
            devToolsPort.postMessage({ type: "IMAGE_REQUEST", url: details.url });
        } else {
            console.warn("⚠️ DevTools port is null. Cannot send image URL.");
        }
    }
}

export function handleVideoRequest(details: chrome.webRequest.WebResponseHeadersDetails, devToolsPort: chrome.runtime.Port | null) {
    if (/\.mp4/i.test(details.url)) {
        console.log("🎥 Video Request Captured:", details.url);

        if (devToolsPort) {
            console.log("🚀 Sending Video to DevTools:", details.url, devToolsPort);
            devToolsPort.postMessage({ type: "VIDEO_REQUEST", url: details.url });
        } else {
            console.warn("⚠️ DevTools port is null. Cannot send video URL.");
        }
    }
}
/////////////////// IMP ...
export function parseImpRequest(details: chrome.webRequest.WebResponseHeadersDetails, devToolsPort: chrome.runtime.Port | null) {
    if (details.url.includes("intLive") && details.statusCode === 200) {
        if (devToolsPort) {
            const custom4Value = getParameterByName("custom4", details.url);
            const custom3Value = getParameterByName("custom3", details.url);
            const custom1Value = getParameterByName("custom1", details.url);

            if (custom4Value.includes("id:")) {
                const pixelData1: MessageData = {
                    pixel: {
                        intLive: custom4Value || undefined,
                        SE: true
                    }
                };
                if(getIMPname(pixelData1)){
                devToolsPort.postMessage({ type: "IMP_REQUEST", url: getIMPname(pixelData1) });
                }
            }

            // Framework version 3.12
            if (custom3Value.includes("fr:")) {
                const pixelData2: MessageData = {
                    pixel: {
                        intLive: custom3Value || undefined,
                        ver: "3.12"
                    }
                };
                if(getIMPname(pixelData2)){
                devToolsPort.postMessage({ type: "IMP_REQUEST", url: getIMPname(pixelData2) });
                }
            } else {
                console.info("NON SE");
                const pixelData3: MessageData = {
                    pixel: {
                        intLive: custom1Value || undefined,
                        SE: false
                    }
                };
                if(getIMPname(pixelData3)){
                  devToolsPort.postMessage({ type: "IMP_REQUEST", url: getIMPname(pixelData3) });
                }
            }
        } else {
            console.warn("⚠️ DevTools port is null. Cannot send imp URL.");
        }
    }
}

// imp end


// click Requests
export function parseClickRequest(details: chrome.webRequest.WebResponseHeadersDetails, devToolsPort: chrome.runtime.Port | null) {
  
    
    if (details.url.includes("clickLive") && details.statusCode === 200) {
        console.log("parseClickRequest ", details.url, devToolsPort)
        if (devToolsPort) {
            const custom4Value = getParameterByName("custom4", details.url);
            const custom3Value = getParameterByName("custom3", details.url);
            const custom1Value = getParameterByName("custom1", details.url);

            if (custom4Value.includes("id:")) {
                const pixelData1: MessageData = {
                    pixel: {
                        clickLive: custom4Value || undefined,
                        SE: true
                    }
                };
                if(getCLICKname(pixelData1)){
                  devToolsPort.postMessage({ type: "CLICK_REQUEST", url:getCLICKname(pixelData1)});
                }
            }


            if (custom3Value.includes("fr:")) {
                const pixelData2: MessageData = {
                    pixel: {
                        clickLive: custom3Value || undefined,
                        ver: "3.12"
                    }
                };
                if(getCLICKname(pixelData2)){
               devToolsPort.postMessage({ type: "CLICK_REQUEST", url:getCLICKname(pixelData2)});
                }
             
            }
            else{
                const pixelData1: MessageData = {
                    pixel: {
                        clickLive: custom1Value || undefined,
                        SE: true
                    }
                };
                if(getCLICKname(pixelData1)){
                devToolsPort.postMessage({ type: "CLICK_REQUEST", url:getCLICKname(pixelData1)});
                }

            }
        }else {
            console.warn("⚠️ DevTools port is null. Cannot send imp URL.");
        }

    }
}

 


// Utility function to extract name

export function getIMPname(msg: MessageData): string | undefined {
    
  
    let _intLiveInfo = "";

    if (msg.pixel?.intLive) {
        let _i = msg.pixel.intLive;
        let _ii: string | undefined;

        // If intLive is already empty, return undefined
        if (_i.trim() === "") {
            console.log("msg.pixel.intLive is empty. Returning undefined.");
            return undefined;
        }

        if (msg.pixel.ver === "3.12") {
            if (_i.includes("fr:")) {
                _ii = _i.slice(_i.indexOf("fr:") + 3).split(";")[0];
                console.log("Extracted _ii (ver 3.12, fr:):", _ii);
                _intLiveInfo += _ii;
            } else {
                console.log("No 'fr:' found in version 3.12.");
            }
        } else {
            if (!msg.pixel.SE) {
                if (_i.includes("fr:")) {
                    _ii = _i.slice(_i.indexOf("fr:") + 3).split(";")[0];
                    console.log("Extracted _ii (no SE, fr:):", _ii);
                    _intLiveInfo += _ii;
                } else if (!msg.pixel.ver) {
                    _ii = _i;
                    console.log("Extracted _ii (no version defined):", _ii);
                    _intLiveInfo += _ii;
                } else {
                    console.log("No 'fr:' found, and version exists.");
                }
            } else {
                if (_i.includes("id:")) {
                    _ii = _i.slice(_i.indexOf("id:") + 3).split(";")[0];
                    console.log("Extracted _ii (SE exists, id:):", _ii);
                } else {
                    _ii = _i;
                    console.log("Extracted _ii (SE exists, fallback to _i):", _ii);
                }
                _intLiveInfo += _ii;
            }
        }

        

        // 🔥 Fix: Ensure we never return an empty string
        return _intLiveInfo.trim() !== "" ? _intLiveInfo : undefined;
    }

    console.log("Returning undefined (empty _intLiveInfo or missing msg.pixel.intLive)");
    return undefined;
}



export function getCLICKname(msg: MessageData): string | undefined {
    let _clickLiveInfo = "";

    if (msg.pixel?.clickLive) {
        let _t = msg.pixel.clickLive;
        let _tt: string | undefined;

        if (msg.pixel.ver === "3.12") {
            console.info('Parsing for version 3.12');
            if (_t.includes("fr:")) {
                _tt = _t.slice(_t.indexOf("fr:") + 3).split(";")[0];
                _clickLiveInfo += _tt;
            }
        } else {
            if (!msg.pixel.SE) {
                console.info("NON Single Execution", msg.pixel.SE);
                if (_t.includes("fr:")) {
                    _tt = _t.slice(_t.indexOf("fr:") + 3).split(";")[0];
                    _clickLiveInfo += _tt;
                } else {
                    _tt = _t;
                    _clickLiveInfo += _t;
                }
            } else {
                console.info("SINGLE EXECUTION", msg.pixel.SE, _t);
                if (_t.includes("id:")) {
                    _tt = _t.slice(_t.indexOf("id:") + 3).split(";")[0];
                } else {
                    _tt = _t;
                    if (_t.includes("fr:")) {
                        _t = _t.slice(_t.indexOf("fr:") + 3).split(";")[0];
                    }
                    _tt = _t;
                    _clickLiveInfo += _t;
                }
            }
        }
 
           // 🔥 Fix: Ensure we never return an empty string
           return _clickLiveInfo.trim() !== "" ? _clickLiveInfo : undefined;
    }

    console.log("Returning undefined (empty _clickLiveInfo or missing msg.pixel.clickLive)");
    return undefined;
}


// Utility function to get query parameters from URL
function getParameterByName(name: string, url: string): string {
    if (!url) return "";
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return "";
    return decodeURIComponent(results[2]?.replace(/\+/g, " ") || "");
}
