chrome.devtools.panels.create(
  "My Panel",
  "icons/icon128.png",
  "panel.html",
  function (panel) {
      console.log("Custom panel created!");
  }
);
