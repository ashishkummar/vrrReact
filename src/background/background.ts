
import { handleImageRequest, handleVideoRequest, parseImpRequest, parseClickRequest } from "../utils/filter";


let devToolsPort: chrome.runtime.Port | null = null; // Explicitly define the type
 
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "devtools") {
        console.log("✅ DevTools connected");

        devToolsPort = port;

        port.onDisconnect.addListener(() => {
            console.log("❌ DevTools disconnected");
            devToolsPort = null;
        });

        // Send a test message immediately
        port.postMessage({ type: "TEST_MESSAGE", message: "Hello from background.js!" });
    }
});


chrome.webRequest.onHeadersReceived.addListener(
    // Capture image URLs
    (details) => {
        // handleImageRequest(details, devToolsPort);
        // handleVideoRequest(details, devToolsPort);

        
         parseImpRequest(details, devToolsPort);
         parseClickRequest(details, devToolsPort)
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

