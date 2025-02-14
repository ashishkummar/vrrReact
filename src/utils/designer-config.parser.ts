
interface desiData {
    desiURL?: any;
}

export function parseDesigerConfig(details: chrome.webRequest.WebResponseHeadersDetails, devToolsPort: chrome.runtime.Port | null){
       
     if (details.url.indexOf("designer-config.js") != -1) {
        if (details.url.indexOf("designerConfig=") != -1)   return;
   
        console.log("Parsing Desi Config.. 🛩️ ", details.url);
        
        
        parseDesignerConfigData(details.url)
            .then((parsedData) => {
                //console.log("Parsed Data:", parsedData); // ✅ Now logs all expected data

                if (devToolsPort) {
                    devToolsPort.postMessage({ type: "DAPI_DATA", data: parsedData });
                }
            })
            .catch((err) => console.error("Error parsing designer config:", err));


        //const desiData: desiData = {
          //  desiURL: {
            //            desi: details.url || undefined,
              //       }
              //  };
          
      }

    
}


/////////////

/*
// Define global variables with proper types
let _clickLiveData: string[] = [];
let _intLiveData: string[] = [];
let _intLiveDynamicData: string[] = [];
let lineBreaksOpenUrl: string = "";
let dapiContent: string = "";
let isDesiParsed: boolean = false;


   // ✅   Tab Update Listener  This will be called when page will load or reload...
   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
           _clickLiveData  = [];
           _intLiveData= [];
          _intLiveDynamicData  = [];
          lineBreaksOpenUrl  = "";
          dapiContent  = "";
          isDesiParsed  = false;

    }
  });
*/
function parseDesignerConfigData(url: string): Promise<{
    clickLiveData: string[];
    intLiveData: string[];
    intLiveDynamicData: string[];
    lineBreaksOpenUrl: string;
    dapiContent: string;
    isDesiParsed: boolean;
}> {
    return fetch(url)
        .then((response: Response) => response.text())
        .then((contents: string) => {
            let dapiContent: string = contents; // ✅ Ensure full content is stored
            let clickLiveData: string[] = [];
            let intLiveData: string[] = [];
            let intLiveDynamicData: string[] = [];
            let lineBreaksOpenUrl: string = "";
            let isDesiParsed: boolean = false; // Parsing status

            contents.split("\n").forEach((line: string) => {
                line = line.trim();

                // Extract clickLive data
                if (line.includes("clickLive")) {
                    let _t1: string = line.replace(/\s/g, "");

                    if (_t1.includes("firePixel")) {
                        _t1 = _t1.substring(_t1.indexOf("(") + 1, _t1.indexOf(",")).trim().replace(/['"]/g, "");
                    }

                    if (!(_t1.includes(":") || _t1.includes("\""))) {
                        clickLiveData.push(_t1);
                    }
                }

                // Extract intLive data (Fixed Logic)
                if (line.includes("intLive")) {
                    let _t2: string = line.replace(/\s/g, "");

                    if (_t2.includes("firePixel") && _t2.includes("(") && _t2.includes(",")) {
                        _t2 = _t2.substring(_t2.indexOf("(") + 1, _t2.indexOf(",")).trim().replace(/['"]/g, "");
                    }

                    // Ensure only valid event names are pushed
                    if (_t2 && !_t2.includes(":") && !_t2.includes("=") && !_t2.includes("{") && !_t2.includes("}")) {
                        intLiveData.push(_t2);
                    }
                }

                // Extract intLiveDynamic data
                if (line.includes("Expo.designerAPI.fireDynamicPixel")) {
                    let _t3: string = line.replace(/\s/g, "");

                    _t3 = _t3.substring(_t3.indexOf("(") + 1, _t3.indexOf(",")).trim().replace(/['"]/g, "");
                    intLiveDynamicData.push(_t3);
                }

                // Extract Open URL from lineBreaks
                if (line.includes("openUrl")) {
                    lineBreaksOpenUrl = line.split('"')[1] || "";
                }
            });

            isDesiParsed = true; // Mark parsing as successful

            // ✅ Log results for debugging
            //console.log("Parsed clickLiveData:", clickLiveData);
            //console.log("Parsed intLiveData:", intLiveData);
            console.log("Parsed intLiveDynamicData:", intLiveDynamicData);
            console.log("Parsed lineBreaksOpenUrl:", lineBreaksOpenUrl);
            console.log("dapiContent length:", dapiContent.length); // ✅ Confirming dapiContent is captured
            //console.log("isDesiParsed:", isDesiParsed);

            return {
                clickLiveData: clickLiveData.filter(Boolean),
                intLiveData: intLiveData.filter(Boolean),
                intLiveDynamicData: intLiveDynamicData.filter(Boolean),
                lineBreaksOpenUrl,
                dapiContent, // ✅ Ensuring `dapiContent` is returned
                isDesiParsed
            };
        })
        .catch((error) => {
            console.error("Error fetching designer-config:", error);
            return {
                clickLiveData: [],
                intLiveData: [],
                intLiveDynamicData: [],
                lineBreaksOpenUrl: "",
                dapiContent: "", // ✅ Returning an empty string instead of missing `dapiContent`
                isDesiParsed: false
            };
        });
}






/*
function parseDesignerConfigData(url: string): void {
    fetch(url)
        .then((response: Response) => response.text())
        .then((contents: string) => {
            dapiContent = contents; // Store the contents
            
            contents.split("\n").forEach((line: string, i: number, arr: string[]) => {
                line = line.trim();
                
                // Process 'clickLive' data
                if (line.includes("clickLive")) {
                    let _t1: string = line.replace(/\s/g, "");
                    
                    if (_t1.includes("firePixel")) {
                        _t1 = _t1.substring(_t1.indexOf("(") + 1, _t1.indexOf(",")).trim().replace(/['"]/g, "");
                    }
                    
                    if (_t1.includes("eventName")) {
                        _t1 = _t1.slice(_t1.indexOf("firePixel") + 11, _t1.indexOf("eventName") - 7);
                    }
                    
                    if (_t1.includes("fireDynamicPixel")) {
                        _t1 = _t1.slice(_t1.indexOf("fireDynamicPixel") + 18);
                    }
                    
                    if (!(_t1.includes(":") || _t1.includes("\""))) {
                        _clickLiveData.push(_t1);
                    }
                }

                // Check for 'openUrl' line breaks
                if (line.includes("openUrl") && !line.includes(")")) {
                    console.log("OpenUrl should NOT have a line break. See Line No.", i + 1, "in designer-config.js");
                    lineBreaksOpenUrl += (i + 1).toString() + ", ";

                    console.log("lineBreaksOpenUrl ", lineBreaksOpenUrl)

                    //document.getElementById("alertMsgDconfig")!.innerHTML +=
                      //  `<li><a href='https://tinyurl.com/fukjchsy' target='_blank'>Avoid Line Break with OpenUrl at line No. ${lineBreaksOpenUrl} in designer-config.js </a></li>`;
                }

                // Process 'intLive' data
                if (line.includes("intLive")) {
                    let _t2: string = line.replace(/\s/g, "");
                    
                    if (!_t2.includes("Expo.designerAPI.fireDynamicPixel")) {
                        _t2 = _t2.substring(_t2.indexOf("(") + 1, _t2.indexOf(",")).trim().replace(/['"]/g, "");
                    }
                    
                    if (_t2.includes("eventName") && !_t2.includes("fireDynamicPixel")) {
                        _t2 = _t2.slice(_t2.indexOf("firePixel") + 11, _t2.indexOf("eventName") - 7);
                    }
                    
                    if (_t2.includes("fireDynamicPixel")) {
                        _t2 = _t2.slice(_t2.indexOf("fireDynamicPixel") + 17, _t2.indexOf("eventName") - 12);
                        _intLiveDynamicData.push(_t2);
                        return;
                    }
                    
                    _intLiveData.push(_t2);
                }
            });

            // Display collected data
            _intLiveData.forEach((item: string) => {
                if (item.length !== 0) {

                    console.log("intNorm ", item)

                    //document.getElementById("ctaGrid")!.innerHTML += `<span class='text-intNorm'> ${item} </span> <br>`;
                }
            });

            _clickLiveData.forEach((item: string) => {
                if (item.length !== 0) {
                    console.log("ctaGrid ", item)
                    // document.getElementById("ctaGrid")!.innerHTML += `<span class='text-ctaNorm'> ${item} </span> <br>`;
                }
            });

            // Display dynamic pixel alerts
            if (_intLiveDynamicData.length > 0) {
                
               // document.getElementById("alertMsgDconfig")!.innerHTML += `<li>Check all dynamic pixels firing on parent window.<br>`;
                
                
                _intLiveDynamicData.forEach((item: string) => {
                    console.log("alertMsgDconfig ", item)
                    //document.getElementById("alertMsgDconfig")!.innerHTML += `<span class='text-intDyna'> ${item} </span> , `;
                });
            }

            // Filter out empty values
            _intLiveData = _intLiveData.filter((item: string) => item.trim() !== "");
            _clickLiveData = _clickLiveData.filter((item: string) => item.trim() !== "");

            // Update UI
            console.log("_intLiveData length ",_intLiveData.length.toString());
            console.log("_clickLiveData length ",_clickLiveData.length.toString());

            return {intLive:_intLiveData, clickLive:_clickLiveData}
            
            ///(document.querySelector("span#span1") as HTMLElement).textContent = _intLiveData.length.toString();
            ///(document.querySelector("span#span2") as HTMLElement).textContent = _clickLiveData.length.toString();
            ///(document.getElementById("compWithET") as HTMLElement).style.display = "none";


        })
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
    
    isDesiParsed = false;
}
*/