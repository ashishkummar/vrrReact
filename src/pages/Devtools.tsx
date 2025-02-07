chrome.devtools.panels.create(
    "My Extension",
    "icons/icon48.png",
    "panel.html", // Links to your custom DevTools panel
    function (panel) {
      console.log("DevTools panel created:", panel);
    }
  );
  