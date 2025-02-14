import eventBus from "./eventBus";  

let storedCreativeRequests: any[] | null = null;

let the_LANDING_URL="";
 

export function createContextMenu() {
    //   the parent menu
    chrome.contextMenus.create({
      id: "vdxViewer",
      title: "VDX Viewer",
      contexts: ["page"]
    });
  
    //   child menu
    chrome.contextMenus.create({
      id: "customVDXView",
      title: "Custom VDX View",
      parentId: "vdxViewer",
      contexts: ["page"]
    });
  
    console.log("Context menus created successfully!");
  
    // Handle right-click menu click
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "customVDXView") {
        if (tab?.url?.includes("vdx.tv") || tab?.url?.includes("creative.vdx.tv")) {
          const customURL = "https://creative.exponential.com/creative/devshowcase/VVT/customView1.html";
         } else {
            chrome.notifications.create(new Date().getTime().toString(), {
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "Showcase Page Alert",
                message: "This feature is available for VDX Showcase pages only."
              });
              
        }
        /////

 
 
    //   let _tempDeskInf=   buildLPurl( adUnits);
      
      // console.info(adUnits);
      
          console.log("the_LANDING_URL :: 🌐 ",the_LANDING_URL)
          chrome.tabs.create({ url: the_LANDING_URL });

        
        // chrome.tabs.create({ url: _tempDeskInf });

         ///////
      }
    });
  }
 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  const _classicURL="https://expotask-showcase.exponential.com/service/demopages";
  const _moderURL = "https://creative.vdx.tv/vdxstudio/projects/";

   // ✅   Tab Update Listener  This will be called when page will load or reload...
   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      console.log("Tab Refreshed");
     // resetVarsNmore();
      getAllAdsInfo(tab);
     // checkWebAddress(tab);
    }
  });


// ✅ Optimized Function to Get All Information for VDX Viewer Tool
async function getAllAdsInfo(tab: chrome.tabs.Tab) {
    if (!tab.url) return;

    the_LANDING_URL="";
    
    const isVVT = tab.url.includes("/VVT/customView");
    const isCreativeVDX = tab.url.includes("creative.vdx.tv/") || tab.url.includes("vdx.exponential.com");
  
    // Dynamically Muting Tab Sound for VVT page::
    if (isVVT) {
      chrome.tabs.query({ lastFocusedWindow: true, active: true }, (tabs) => {
        tabs.forEach((t) => t.mutedInfo && chrome.tabs.update(t.id!, { muted: true }));
      });
    }
  
    if (!isCreativeVDX) return;

    console.log("Loading... demo pages", tab.url);
  
    if (!tab.url.includes("#")) return;
     
    const _theHashID = tab.url.split("#")[1].split("/")[0];

   
    try {
      const response = await fetch(_classicURL, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ method_name: "getdata_bundle_showcase", hash: _theHashID }), // ◀️ passing id here
      });
      
       const data = await response.json();
       if (!data.status) {

        console.log("No data found from classic url with ", _theHashID, ` will use /projects/",${_theHashID},"/demopages?published=true`);

        extractAdUnitInfoDataForSE(_theHashID); // ◀️ passing id here for another method

       } else {
        console.log("Data Extrected for from demo pages ", _theHashID, data);
       }
    } catch (error: any) {
      console.info(null, error?.message ?? error);
    }
  }

  /////////
 




  async function extractAdUnitInfoDataForSE(_id: string) {
    try {
     
    console.info(`Fetching data from modern URL 👍 ${_moderURL} ${_id}`);
    const response = await fetch(`${_moderURL}${_id}/demopages?published=true`);
    const data = await response.json();
     
    the_LANDING_URL = ExtractLandingURL(data);
    
    console.log("data from demo pages 🧏‍♀️ ",  data.data.urls[0].creativeRequestId);

    console.log( data, ":::: " , the_LANDING_URL )
    
      /*****/
      storedCreativeRequests = data.data.urls; // Store the data
      eventBus.emit("dataAvailable", storedCreativeRequests); // Emit event when data is ready



 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


 
// Function to get stored data (returns a Promise)
export function getAllcreativeRequestId(): Promise<any[]> {
  return new Promise((resolve) => {
    if (storedCreativeRequests) {
      console.log("✅ Returning Cached Data:", storedCreativeRequests);
      resolve(storedCreativeRequests);
    } else {
      console.log("⏳ Waiting for event...");
      eventBus.on("dataAvailable", (data) => {
        //console.log("🔥 Resolving Data:", data);
        resolve(data);
      });
    }
  });
}

//::// the_LANDING_URL creation ---------------------------------------

  interface Media {
    src: string;
    duration: string;
}

interface UrlObject {
    mockid: number;
    product: string;
    platform: string;
    format: string;
    solution: string;
    ad_size: string;
    creativeRequestId: number;
    media?: Media;
    QRCodeExperience?: string;
}

interface Data {
    latestRevision?: string;
    latestVariation?: number;
    isCCRV?: boolean;
    urls?: UrlObject[];
}

interface ResponseData {
    status: boolean;
    data: Data;
}

function ExtractLandingURL(data: ResponseData): string {
    let baseURL = "https://creative.exponential.com/creative/devshowcase/VVT/customView1.html";

    if (data?.data?.isCCRV ) {
        baseURL = "https://creative.exponential.com/creative/devshowcase/VVT/customView1.1.html";
    }

    const urls = data?.data?.urls || [];
    const DExp = urls.length > 0 ? `${urls[0].mockid}_${urls[0].ad_size}` : "";
    const DInf = urls.map(u => `${u.mockid}_${u.ad_size}`).join(",");
    const VCmi = urls.find(u => u.format === "inframe" && u.platform === "mobile");
    const VCme = urls.find(u => u.format === "expandable" && u.platform === "mobile");
    const CTV = urls.some(u => u.platform === "TV") ? 1 : 0;
    const isCCRV = data?.data?.isCCRV || false;
    const latestRevision = data?.data?.latestRevision || "";
    const latestVariation = data?.data?.latestVariation || 0;

    return `${baseURL}?DExp=${DExp}&DInf=${DInf}&VCmi=${VCmi ? VCmi.mockid + "_" + VCmi.ad_size : ""}&VCme=${VCme ? VCme.mockid + "_" + VCme.ad_size : ""}&CTV=${CTV}&isCCRV=${isCCRV}&latestRevision=${latestRevision}&latestVariation=${latestVariation}`;
}


