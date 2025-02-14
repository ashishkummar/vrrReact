(() => {
  "use strict";

  chrome.devtools.panels.create(
      "[VTT React]",
      "icons/icon.png",
      "panel.html",
      (panel) => {
          console.log("Custom DevTools panel created!");

          panel.onShown.addListener(() => {
              console.log("DevTools panel is now OPEN");

              // Reload the active tab when the panel is opened
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                  if (tabs.length > 0 && tabs[0].id) {
                      chrome.tabs.reload(tabs[0].id);
                      console.log("Active tab reloaded.");
                  }
              });
          });

          panel.onHidden.addListener(() => {
              console.log("DevTools panel is now CLOSED");
          });
      }
  );
})();
