export const trackEvent = (eventName: string, eventParams = {}) => {
    chrome.runtime.sendMessage({
        action: "trackEvent",
        eventName,
        eventParams: {
            ...eventParams,
            debug_mode: 1   // ✅ Ensures the event appears in DebugView
        }
    }, response => {
        if (chrome.runtime.lastError) {
            console.error("Tracking failed:", chrome.runtime.lastError.message);
        } else {
            console.log("Event tracked:", response);
        }
    });
};
