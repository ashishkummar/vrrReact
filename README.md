 # 🚀 VTTReact
 
A Chrome extension to track VDX Ad unit's pixels.  

---
 
## ✨ Features

   
- ✅ **Manifest V3** - The latest standard for Chrome extensions

- ✅ **React + TypeScript** - Modern development stack

- ✅ **Webpack** - Bundling and optimizing assets

- ✅ **Auto-reload during development** (optional)
 
---
 
## 📂 Project Structure
  

```plaintext

vrrReact/

# Project Structure

📦 src  
 ┣ 📂 Components  
 ┃ ┣ 📜 ClickIntBadge.tsx  
 ┃ ┣ 📜 Dashboard.tsx  
 ┃ ┣ 📜 Dialog.tsx  
 ┃ ┣ 📜 ExpoTaskPixelsWindow.tsx  
 ┃ ┣ 📜 Footer.tsx  
 ┃ ┣ 📜 Header.tsx  
 ┃ ┣ 📜 SmoothScroll.tsx  
 ┃ ┗ 📜 Updater.tsx  
 ┣ 📂 assets  
 ┃ ┗ 📜 reactlogo.svg  
 ┣ 📂 background  
 ┃ ┗ 📜 background.ts  
 ┣ 📂 content  
 ┃ ┗ 📜 content.ts  
 ┣ 📂 options  
 ┃ ┗ 📜 options.tsx  
 ┣ 📂 pages  
 ┃ ┣ 📜 Devtools.tsx  
 ┃ ┣ 📜 Panel.tsx  
 ┃ ┗ 📜 TrackerComponent.tsx  
 ┣ 📂 popup  
 ┃ ┣ 📜 Popup.css  
 ┃ ┣ 📜 Popup.tsx  
 ┃ ┗ 📜 index.tsx  
 ┣ 📂 styles  
 ┃ ┣ 📜 ETpixelWindow.css  
 ┃ ┣ 📜 Footer.css  
 ┃ ┣ 📜 Header.css  
 ┃ ┣ 📜 SmoothScroll.css  
 ┃ ┣ 📜 badge.css  
 ┃ ┣ 📜 global.css  
 ┃ ┗ 📜 panel.css  
 ┣ 📂 utils  
 ┃ ┣ 📜 designer-config.parser.ts  
 ┃ ┣ 📜 eventBus.ts  
 ┃ ┣ 📜 expoTaskapi.ts  
 ┃ ┣ 📜 filter.ts  
 ┃ ┣ 📜 helpers.ts  
 ┃ ┗ 📜 rightClick.ts  
 ┣ 📜 .DS_Store  
 ┣ 📜 App.tsx  
 ┣ 📜 index.tsx  
 ┗ 📜 react-app-env.d.ts  

  

🚀 Getting Started
 
1️⃣ Clone the repository
 
https://stash.exponential.com/users/ashish.kumar/repos/react.vtt.mv3

 2️⃣ Install dependencies

npm install
 
3️⃣ Start development mode

npx webpack --watch (This will rebuild your extension whenever you make changes.)

   
4️⃣ Load the extension in Chrome

1. Open chrome://extensions/

2. Enable Developer mode

3. Click Load unpacked and select the dist/ folder
 
5️⃣ Build for production

npx webpack
 
⚙️ Configuration

manifest.json

You can modify the manifest.json file to configure your extension settings.
 
Example:

{
 "manifest_version": 3,
 "name": "My Chrome Extension",
 "version": "1.0.0",
 "background": {
 "service_worker": "background.js"
 },
 "action": {
 "default_popup": "popup.html"
 },
 "permissions": ["storage"],
 "host_permissions": ["https://*/*"]
 }
 
🔥 Development Tips
 Hot Reloading: (if you want )
 Add this inside background.js during development to auto-reload the extension:
 const RELOAD_TIME = 500; // Reload every 500ms

setInterval(() => {
 chrome.runtime.reload();
 , RELOAD_TIME);
 
⚠️ Remove this before publishing!

 Logging Debug Messages:
 Use console.log() inside background scripts or content scripts and check the Chrome DevTools Console.
 
 Handling CORS Issues:

If your extension needs to make API calls, update host_permissions in manifest.json.
  
💡 Contributing
 
Feel free to open issues and submit pull requests. Contributions are welcome! 🎉
This Markdown file includes everything—installation steps, configurations, development tips, and future enhancements. 🚀
 
Thanks!
ashish.kumar@vdx.tv