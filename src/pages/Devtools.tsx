(() => {
  "use strict";

  chrome.devtools.panels.create(
      "My Panel",
      "icons/icon.png",
      "panel.html",
      (panel) => console.log("Custom DevTools panel created!")
  );
})();
