import { handleImageRequest, parseVideoRequest, parseImpRequest, parseClickRequest } from "../utils/filter";

let devToolsPorts: { [key: number]: chrome.runtime.Port } = {}; // Stores connected DevTools ports
let activeTabs: { [key: number]: boolean } = {}; // Tracks which tabs have DevTools open
let currentActiveTabId: number | null = null;
let tabPorts: { [key: number]: chrome.runtime.Port } = {}; // Stores ports per tab
 
 
// Function to log DevTools connections
function logTabConnections() {
    console.log("📊 Current DevTools & Tab Status:");

    if (Object.keys(activeTabs).length === 0) {
        console.log("No active DevTools panels.");
         
        //😢 will check it later 
        //chrome.action.setIcon({ path: "icons/icon.png" });
        //chrome.action.setIcon({ path: chrome.runtime.getURL("icons/disconnect.png") });


        return;
    }

    const tabStatus = Object.keys(activeTabs).map((tabId) => ({
        "Tab Id": tabId,
        Status: devToolsPorts[+tabId]
            ? tabId === String(currentActiveTabId)
                ? "Connected ✅ (Active)"
                : "Connected ⚠ (Inactive)"
            : "Disconnected ❌",
    }));

    //console.table(tabStatus); 
}

// Handle DevTools connection
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "devtools") {
        port.onMessage.addListener((message) => {
            if (message.type === "INIT" && message.tabId) {
                const tabId = message.tabId;

                // Mark DevTools as active for this tab
                activeTabs[tabId] = true;

                // Store new DevTools connection
                devToolsPorts[tabId] = port;
                currentActiveTabId = tabId;

                console.log(`✅ DevTools connected to background with Tab ID: ${tabId}`);
                logTabConnections();
            }
        });

        port.onDisconnect.addListener(() => {
            let disconnectedTabId = null;
            //@ts-ignore
            for (const [tabId, p] of Object.entries(devToolsPorts)) {
                if (p === port) {
                    disconnectedTabId = parseInt(tabId);
                    break;
                }
            }

            if (disconnectedTabId !== null) {
                console.log(`❌ DevTools panel closed for Tab ID: ${disconnectedTabId}`);
                delete devToolsPorts[disconnectedTabId];
                delete activeTabs[disconnectedTabId];

                // If the closed panel was the active one, reset currentActiveTabId
                if (disconnectedTabId === currentActiveTabId) {
                    currentActiveTabId = null;
                }

                logTabConnections();
            }
        });
    }
});

// Handle tab switch
chrome.tabs.onActivated.addListener((activeInfo) => {
    const newActiveTabId = activeInfo.tabId;

    if (newActiveTabId !== currentActiveTabId) {
        console.log(`🔄 Switched to Tab ID: ${newActiveTabId}`);

        // Reconnect if DevTools was already open for this tab
        if (activeTabs[newActiveTabId] && devToolsPorts[newActiveTabId]) {
            console.log(`🔄 Reconnecting DevTools to already open panel for Tab ID: ${newActiveTabId}`);
            currentActiveTabId = newActiveTabId;
        }

        logTabConnections();
    }
});

// Handle tab closing
chrome.tabs.onRemoved.addListener((tabId) => {
    console.log(`❌ Tab Closed: ${tabId}`);

    // Remove tracking data for this tab
    delete activeTabs[tabId];
    delete devToolsPorts[tabId];

    if (tabId === currentActiveTabId) {
        currentActiveTabId = null;
    }

    logTabConnections();
});


chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (details.tabId && details.tabId !== -1) {  // Ensure tabId is valid
            const devToolsPort = devToolsPorts[details.tabId];  // Use devToolsPorts instead
 
            if (devToolsPort) {
                parseVideoRequest(details, devToolsPort);
                parseImpRequest(details, devToolsPort);
                parseClickRequest(details, devToolsPort);
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

