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
    | {type:"PCLIVE_REQUEST"; payload: string }
    | { type: "IMP_REQUEST"; payload: string } 
    | { type: "CLICK_REQUEST"; payload: string };

// Reducer function
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "PCLIVE_REQUEST":
            return { ...state, videoPCliveTrackers: [...state.videoPCliveTrackers, action.payload] };
        case "IMP_REQUEST":
            return { ...state, impTrackers: [...state.impTrackers, action.payload] };
        case "CLICK_REQUEST":
            return { ...state, clickTrackers: [...state.clickTrackers, action.payload] };
        default:
            return state;
    }
}

export default function TrackerComponent() {
    const [state, dispatch] = useReducer(reducer, { videoPCliveTrackers:[],impTrackers: [], clickTrackers: [] });

    const portRef = useRef<chrome.runtime.Port | null>(null);
    const impScrollRef = useRef<HTMLDivElement | null>(null);
    const clickScrollRef = useRef<HTMLDivElement | null>(null);
    const vidScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chrome.runtime?.connect) {
            console.warn("⚠️ chrome.runtime.connect is not available.");
            return;
        }

        try {
            portRef.current = chrome.runtime.connect({ name: "devtools" });
            console.log(`✅ Connected to background script`);
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
            } else {
                console.warn("⚠️ Unknown message type received:", message);
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
        if (impScrollRef.current) {
            impScrollRef.current.scrollTo({ top: impScrollRef.current.scrollHeight, behavior: "smooth" });
        }
        if (clickScrollRef.current) {
            clickScrollRef.current.scrollTo({ top: clickScrollRef.current.scrollHeight, behavior: "smooth" });
        }
        if (vidScrollRef.current) {
            vidScrollRef.current.scrollTo({ top: vidScrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [state]);

    useEffect(() => {
        if (state.videoPCliveTrackers.length > 0 || state.clickTrackers.length > 0) {
            console.log("🆕 Updated State:", state);
        }
    }, [state]);

    return (
        <>
            <SmoothScrollUI name="Video" urls={state.videoPCliveTrackers} scrollRef={vidScrollRef} />
            <SmoothScrollUI name="Impression" urls={state.impTrackers} scrollRef={impScrollRef} />
            <SmoothScrollUI name="Clicks" urls={state.clickTrackers} scrollRef={clickScrollRef} />
            
            
        </>
    );
}
