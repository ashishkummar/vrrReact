import React, { useEffect, useRef, useReducer } from "react";
import SmoothScrollUI from "../Components/SmoothScroll";

// Define state structure
interface State {
    videoPCliveTrackers: string[];
    impTrackers: string[];
    clickTrackers: string[];
}

// Define action types 
type Action = 
    | { type: "PCLIVE_REQUEST"; payload: string }
    | { type: "IMP_REQUEST"; payload: string }
    | { type: "CLICK_REQUEST"; payload: string };

// Reducer function
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "PCLIVE_REQUEST":
            return action.payload === "" 
                ? { ...state, videoPCliveTrackers: [] } 
                : { ...state, videoPCliveTrackers: [...state.videoPCliveTrackers, action.payload] };
        case "IMP_REQUEST":
            return action.payload === "" 
                ? { ...state, impTrackers: [] } 
                : { ...state, impTrackers: [...state.impTrackers, action.payload] };
        case "CLICK_REQUEST":
            return action.payload === "" 
                ? { ...state, clickTrackers: [] } 
                : { ...state, clickTrackers: [...state.clickTrackers, action.payload] };
        default:
            return state;
    }
}

export default function TrackerComponent() {
    const [state, dispatch] = useReducer(reducer, { videoPCliveTrackers: [], impTrackers: [], clickTrackers: [] });

    const portRef = useRef<chrome.runtime.Port | null>(null);
    const impScrollRef = useRef<HTMLDivElement | null>(null);
    const clickScrollRef = useRef<HTMLDivElement | null>(null);
    const vidScrollRef = useRef<HTMLDivElement | null>(null);
    const tabIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!chrome.runtime?.connect) {
            console.warn("⚠️ chrome.runtime.connect is not available.");
            return;
        }
    
        const tabId = chrome.devtools.inspectedWindow.tabId; // Get the current tab ID
        console.log("🆔 DevTools tabId:", tabId);
    
        try {
            portRef.current = chrome.runtime.connect({ name: "devtools" });
            portRef.current.postMessage({ type: "INIT", tabId }); // Send tabId to background
            console.log(`✅ DevTools connected to background with tabId: ${tabId}`);
        } catch (error) {
            console.error("❌ Failed to connect to background script:", error);
            return;
        }
    
        const messageListener = (message: { type: string; url: string }) => {
            console.log("📩 Received message:", message);
    
            if (message.type === "IMP_REQUEST") {
                dispatch({ type: "IMP_REQUEST", payload: message.url });
            } else if (message.type === "CLICK_REQUEST") {
                dispatch({ type: "CLICK_REQUEST", payload: message.url });
            } else if (message.type === "PCLIVE_REQUEST") {
                dispatch({ type: "PCLIVE_REQUEST", payload: message.url });
            }
        };
    
        portRef.current?.onMessage.addListener(messageListener);
    
        return () => {
            if (portRef.current) {
                portRef.current.onMessage.removeListener(messageListener);
                portRef.current.disconnect();
                portRef.current = null;
            }
        };
    }, []);
    

    useEffect(() => {
        [impScrollRef, clickScrollRef, vidScrollRef].forEach(ref => {
            if (ref.current) {
                ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
            }
        });
    }, [state]);

    useEffect(() => {
        if (state.videoPCliveTrackers.length > 0 || state.clickTrackers.length > 0) {
            console.log("🆕 Updated State:", state);
        }
    }, [state]);

    //
    const deleteDataRef = useRef<((type: "PCLIVE_REQUEST" | "IMP_REQUEST" | "CLICK_REQUEST") => void) | null>(null);


    function deleteData(type: "PCLIVE_REQUEST" | "IMP_REQUEST" | "CLICK_REQUEST") {
        dispatch({ type, payload: "" }); // Clearing data
    }

    // Store deleteData function inside ref
        useEffect(() => {
            deleteDataRef.current = deleteData;
        }, []);

        useEffect(() => {
            const currentTabId = chrome.devtools.inspectedWindow.tabId; // Get the active DevTools tab ID
         
            const handleTabUpdate = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
                if (tabId === currentTabId && changeInfo.status === "loading" && tab.active) {
         
                    if (deleteDataRef.current) {
                        deleteDataRef.current("PCLIVE_REQUEST");
                        deleteDataRef.current("IMP_REQUEST");
                        deleteDataRef.current("CLICK_REQUEST");
                    }
                }
            };
        
            chrome.tabs.onUpdated.addListener(handleTabUpdate);
        
            return () => {
                chrome.tabs.onUpdated.removeListener(handleTabUpdate);
            };
        }, []);
        
        
    



    return (
        <>
            <SmoothScrollUI name="Video" onDelete={() => deleteData("PCLIVE_REQUEST")} data={state.videoPCliveTrackers} scrollRef={vidScrollRef} />
            <SmoothScrollUI name="Impression" onDelete={() => deleteData("IMP_REQUEST")} data={state.impTrackers} scrollRef={impScrollRef} />
            <SmoothScrollUI name="Clicks" onDelete={() => deleteData("CLICK_REQUEST")} data={state.clickTrackers} scrollRef={clickScrollRef} />

  
        </>
    );
}
