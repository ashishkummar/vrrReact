 
  import React, { useState, useEffect, useRef } from "react";
  import { Menubar } from "primereact/menubar";
  import { Button } from "primereact/button";
  import { Menu } from "primereact/menu";
  import { Updater } from "./Updater"; 
   
  
  export const Header: React.FC = () => {
  const menuRef = React.useRef<Menu>(null);
  const currentVersion="8.1.0"; // Current version of this component

    //chrome.runtime.sendMessage({ action: "sendToContent", data: "Hello from DevTools!" });
    const tabIdRef = useRef<number | null>(null);
    const portRef = useRef<chrome.runtime.Port | null>(null);
    
    
      // Create a connection with the background script
     useEffect(() => {
        if (!chrome.runtime?.connect) {
            console.warn("⚠️ chrome.runtime.connect is not available.");
            return;
        }
    
        const tabId = chrome.devtools.inspectedWindow.tabId; // Get the current tab ID
        tabIdRef.current = tabId; // Store it in ref
        console.log("🆔 DevTools tabId inside header:", tabId);
    
        try {
            portRef.current = chrome.runtime.connect({ name: "devtools" });
            portRef.current.postMessage({ type: "INIT", tabId }); // Send tabId to background
            console.log(`✅ DevTools connected to background with tabId from header: ${tabId}`);
        } catch (error) {
            console.error("❌ Failed to connect to background script from heasder:", error);
            return;
        }
        //to listen
        const messageListener = (message: { type: string; data: any }) => {
          console.log("📩 Received message in header:", message);
       };
         
    
        portRef.current?.onMessage.addListener(messageListener);
    
        return () => {
            if (portRef.current) {
                portRef.current.onMessage.removeListener(messageListener);
                portRef.current.disconnect();
                portRef.current = null;
            }
        };
    }, []);

///
      function openDashBoard(){
             if (portRef.current) {
              portRef.current.postMessage({ type: "sendToContent", tabId: tabIdRef.current, data: "Hello from DevTools!" });
           } else {
              console.warn("⚠️ No active connection to background script from HEADER.");
          }
      }

    // Menu Items
    const menuItems = [
      { label: "Dashboard", icon: "pi pi-home", command:  openDashBoard },
      { label: "Settings", icon: "pi pi-cog", command: () => console.log("Open Settings") },
      { label: "Version "+currentVersion, icon: "pi pi-sign-out", command: () => console.log("Logging out") },
    ];
  
    // Left section: Icon + Text (Vertically Centered)
    const start = (
        <div style={{display:"flex", alignItems: "center", gap: "8px" }} className="flex items-center space-x-2 h-10">
        <img alt="Logo" width="30" height="30" src="icons/icon16.png"/>
        <span className="text-lg font-semibold"> VTT</span>
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
  
  
 