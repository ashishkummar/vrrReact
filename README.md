# 🚀 vrrReact

A pixel tracker Chrome extension. This can track click and impression trackers.

---

## 🚀 Manifest V3 Chrome Extension Boilerplate  

A minimal and production-ready boilerplate for building Chrome extensions using **React + TypeScript + Webpack** with **Manifest V3**.

---

## ✨ Features  

- ✅ **Manifest V3** - The latest standard for Chrome extensions  
- ✅ **React + TypeScript** - Modern development stack  
- ✅ **Webpack** - Bundling and optimizing assets  
- ✅ **Auto-reload during development** (optional)  
- ✅ **Pre-configured for future projects**  

---

## 📂 Project Structure  

```plaintext
vrrReact/
│── dist/                     # Compiled extension output
│── node_modules/              # Dependencies
│── public/                    # Static assets
│   │── icons/                 # Extension icons
│   │── devtools.html          # DevTools panel HTML
│   │── panel.html             # Panel page HTML
│   │── template.html          # Base template HTML
│   └── manifest.json          # Chrome extension manifest
│
│── src/                       # Source code
│   │── background/            # Background scripts
│   │   │── content/           # Content scripts within background
│   │   └── background.ts      # Background script
│   │── Components/            # Shared React components
│   │   │── Header.tsx         # Header component
│   │   └── SmoothScroll.tsx   # Smooth scrolling component
│   │── content/               # Content scripts
│   │   └── content.ts         # Main content script
│   │── pages/                 # Extension pages
│   │   │── Devtools.tsx       # DevTools panel React component
│   │   │── Panel.tsx          # Main panel React component
│   │   └── TrackerComponent.tsx  # Tracking component
│   │── popup/                 # Popup UI (empty for now)
│   │── styles/                # CSS/SCSS styles
│   │── utils/                 # Utility functions
│   │   │── filter.ts          # Filter utility
│   │   └── helpers.ts         # Helper functions
│   │── App.tsx                # Main App component
│   └── index.tsx              # Entry point
│
│── .gitignore                 # Git ignore file
│── package.json               # Dependencies and scripts
│── package-lock.json          # Dependency lockfile
│── README.md                  # Project documentation
│── tsconfig.json              # TypeScript configuration
└── webpack.config.js          # Webpack configuration


🚀 Getting Started

1️⃣ Clone the repository 

git clone https://github.com/ashishkummar/Manif3.ChromeExt.BoilerPlate.git
cd Manif3.ChromeExt.BoilerPlate

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
Modify the manifest.json file to configure your extension settings.

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
}, RELOAD_TIME);

⚠️ Remove this before publishing!

Logging Debug Messages:
Use console.log() inside background scripts or content scripts and check the Chrome DevTools Console.

Handling CORS Issues:
If your extension needs to make API calls, update host_permissions in manifest.json.

📜 License
This project is open-source and licensed under the MIT License.

🎯 Future Enhancements

 Add example API calls
 Improve UI with Tailwind CSS
 Include unit tests
 Add Redux support

💡 Contributing

Feel free to open issues and submit pull requests. Contributions are welcome! 🎉

 
This Markdown file includes everything—installation steps, configurations, development tips, 
and future enhancements. 🚀

Thanks!



 



