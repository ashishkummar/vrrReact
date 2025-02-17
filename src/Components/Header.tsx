 
  import React, { useState } from "react";
  import { Menubar } from "primereact/menubar";
  import { Button } from "primereact/button";
  import { Menu } from "primereact/menu";
  import { Updater } from "./Updater"; 
  import { Dialog } from 'primereact/dialog';


   import "../styles/Header.css"; // Import CSS for styling
   
  
 
  

  export const Header: React.FC  = ( ) => {
    const menuRef = React.useRef<Menu>(null);
    const currentVersion="9.0.0"; // Current version of this component

 

  // This is open VDX Showcase Manager 
  function openShowCaseManager(url:string) {
    // Create the new window
    chrome.windows.create({
      url: url, // The URL to open
      type: "popup", // This creates a popup window
      width: 900, // Set the width of the window
      height: 700, // Set the height of the window
    }, (newWindow) => {
      if (newWindow) {
        // newWindow contains the information about the newly created window
        console.log("New window opened with ID:", newWindow.id);
  
        // Listen for the window close event
        chrome.windows.onRemoved.addListener(function(windowId) {
          if (windowId === newWindow.id) {
            console.log("The window was closed.");
          }
        });
      } else {
        console.error("Failed to create a new window.");
      }
    });
  }

  // 
  const showCaseManager  = "https://creative.exponential.com/creative/creative_dev/showcase/index.html";
  const slimPic =  "https://creative.exponential.com/creative/devshowcase/slimPic/";
  const iabBuilder ="https://creative.exponential.com/creative/iab_builder/app/index.html";
  
    // Menu Items
    const menuItems = [
      //{ label: "Dashboard", icon: "pi pi-home", command: () => console.log("Go to Dashboard") },
       
       { label: "Showcase Manager", icon: "pi pi-desktop", command:  ()=>openShowCaseManager(showCaseManager) },
       { label: "IAB Builder", icon: "pi pi-wrench", command:  ()=>openShowCaseManager(iabBuilder) },
       { label: "Slim Pic", icon: "pi pi-images", command:  ()=>openShowCaseManager(slimPic)  },
       { label: "Version "+currentVersion, icon: "pi pi-sign-out", command: () => console.log("Logging out") },
    ];
  
    // Left section: Icon + Text (Vertically Centered)
    const start = (
        <div style={{display:"flex", alignItems: "center", gap: "8px" }} className="flex items-center space-x-2 h-10">
        <img alt="Logo" width="30" height="30" src="icons/icon16.png"/>
        <div className="logoTextHolder">
        <span className="text-lg font-semibold"> VDX Testing Tool  </span>
        <span className="logoTextHolderSlogan">Build on React.js     </span>
        </div>
        <Updater ver ={currentVersion} />
    </div>
    
    );
  
    // Right section: Burger Menu
    const end = (
      <div>
        <Button
          icon="pi pi-bars"
          className="p-button-rounded p-button-text p-button-secondary"
          onClick={(event) => menuRef.current?.toggle(event)}
        />
        <Menu model={menuItems} popup ref={menuRef} />
      </div>
    );
  
    return <Menubar start={start} end={end} model={[]} />;
  };
  
  