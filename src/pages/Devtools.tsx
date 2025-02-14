(() => {
  "use strict";

  chrome.devtools.panels.create(
      "[VTT React]",
      "icons/icon.png",
      "panel.html",
      (panel) => console.log("Custom DevTools panel created!")
  );
})();
 