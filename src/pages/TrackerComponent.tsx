import React, { useEffect, useRef, useReducer } from "react";
import SmoothScrollUI from "../Components/SmoothScroll";
import { ClickIntBadge } from "../Components/ClickIntBadge";

// Define state structure and interfaces

interface DapiData {
    clickLiveData?: string[];
    intLiveData?: string[];
    intLiveDynamicData?: string[];
    lineBreaksOpenUrl?: string;
    dapiContent?: string;
    isDesiParsed?: boolean;
}


interface State {
    videoPCliveTrackers: string[];
    impTrackers: string[];
    clickTrackers: string[];
    dapiData: DapiData;
}

// Define action types 
type Action = 
    | { type: "PCLIVE_REQUEST"; payload: string }
    | { type: "IMP_REQUEST"; payload: string }
    | { type: "CLICK_REQUEST"; payload: string }
    | { type: "DAPI_DATA"; payload: DapiData | {} };

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
        case "DAPI_DATA":
            return { ...state, dapiData: (action.payload as DapiData) || {} };
            default:
            return state;
    }
}

export default function TrackerComponent() {
    const [state, dispatch] = useReducer(reducer, { 
        videoPCliveTrackers: [], 
        impTrackers: [], 
        clickTrackers: [],  
        dapiData: {} 
    });

    const portRef = useRef<chrome.runtime.Port | null>(null);
    const impScrollRef = useRef<HTMLDivElement | null>(null);
    const clickScrollRef = useRef<HTMLDivElement | null>(null);
    const vidScrollRef = useRef<HTMLDivElement | null>(null);
    const tabIdRef = useRef<number | null>(null);
 
    const deleteDataRef = useRef<((type: "PCLIVE_REQUEST" | "IMP_REQUEST" | "CLICK_REQUEST" | "DAPI_DATA") => void) | null>(null);




    useEffect(() => {
        if (!chrome.runtime?.connect) {
            console.warn("⚠️ chrome.runtime.connect is not available.");
            return;
        }
    
        const tabId = chrome.devtools.inspectedWindow.tabId; // Get the current tab ID
        tabIdRef.current = tabId; // Store it in ref
        console.log("🆔 DevTools tabId:", tabId);
    
        try {
            portRef.current = chrome.runtime.connect({ name: "devtools" });
            portRef.current.postMessage({ type: "INIT", tabId }); // Send tabId to background
            console.log(`✅ DevTools connected to background with tabId: ${tabId}`);
        } catch (error) {
            console.error("❌ Failed to connect to background script:", error);
            return;
        }
    
        const messageListener = (message: { type: string; data: any }) => {
            console.log("📩 Received message:", message);
    
            switch (message.type) {
                case "IMP_REQUEST":
                    dispatch({ type: "IMP_REQUEST", payload: message.data });
                    break;
                case "CLICK_REQUEST":
                    dispatch({ type: "CLICK_REQUEST", payload: message.data });
                    break;
                case "PCLIVE_REQUEST":
                    dispatch({ type: "PCLIVE_REQUEST", payload: message.data });
                    break;
                case "DAPI_DATA":
                    dispatch({ type: "DAPI_DATA", payload: message.data as DapiData });
                    break;
                default:
                    console.warn(`⚠️ Unhandled message type in background,js : ${message.data}`);
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

    //function deleteData(type: "PCLIVE_REQUEST" | "IMP_REQUEST" | "CLICK_REQUEST"): void;
    //function deleteData(type: "DAPI_DATA"): void;
    function deleteData(type: "PCLIVE_REQUEST" | "IMP_REQUEST" | "CLICK_REQUEST" | "DAPI_DATA") {
        if (type === "DAPI_DATA") {
            dispatch({ type: "DAPI_DATA", payload: {} as DapiData });
        } else {
            dispatch({ type, payload: "" });
        }
    }
    
     

    // Store deleteData function inside ref
    useEffect(() => {
        deleteDataRef.current = deleteData;
    }, []);

    useEffect(() => {
        const handleTabUpdate = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            console.info("handleTabUpdate", tabId, tabIdRef.current, changeInfo.status, tab.active);

            if (tabId === tabIdRef.current && changeInfo.status === "loading" && tab.active) {
                if (deleteDataRef.current) {
                    deleteDataRef.current("PCLIVE_REQUEST");
                    deleteDataRef.current("IMP_REQUEST");
                    deleteDataRef.current("CLICK_REQUEST");
                    deleteDataRef.current("DAPI_DATA");  // Clear dapiData

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
            <SmoothScrollUI 
                name="Video" 
                onDelete={() => deleteData("PCLIVE_REQUEST")} 
                data={state.videoPCliveTrackers} 
                scrollRef={vidScrollRef} 
            />

            <SmoothScrollUI 
                name="Impression" 
                onDelete={() => deleteData("IMP_REQUEST")} 
                data={state.impTrackers} 
                scrollRef={impScrollRef} 
            >

             

                {/* SHOWING Badge for intLive length */}
                {state.dapiData?.intLiveData?.length ? (
                       <ClickIntBadge label={String(state.dapiData.intLiveData.length)} />
                ) : null}


                  
                  
            
            </SmoothScrollUI>

            <SmoothScrollUI 
                name="Clicks" 
                onDelete={() => deleteData("CLICK_REQUEST")} 
                data={state.clickTrackers} 
                scrollRef={clickScrollRef} 
            >
              {/* SHOWING Badge for clickLive length */}
              {state.dapiData?.clickLiveData?.length ? (
                    <ClickIntBadge label={String(state.dapiData.clickLiveData.length)} />
                ) : null}
                
            </SmoothScrollUI> 
        </>
    );
}
