chrome.runtime.onMessage.addListener((message) => {
    if (message === "reload-extension") {
        chrome.runtime.reload();
    }
});
