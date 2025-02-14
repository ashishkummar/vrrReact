chrome.devtools.panels.create(
    "My Panel",  // Name in DevTools
    "icons/icon.png",  // Icon path (optional)
    "panel.html",  // The UI of the panel
    function(panel) {
        console.log("Custom DevTools panel created!");
    }
);
