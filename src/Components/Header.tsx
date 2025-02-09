 
  import React, { useState } from "react";
  import { Menubar } from "primereact/menubar";
  import { Button } from "primereact/button";
  import { Menu } from "primereact/menu";
  import { Updater } from "./Updater"; 
   
  
  export const Header: React.FC = () => {
    const menuRef = React.useRef<Menu>(null);
    const currentVersion="8.1.0"
  
    // Menu Items
    const menuItems = [
      { label: "Dashboard", icon: "pi pi-home", command: () => console.log("Go to Dashboard") },
      { label: "Settings", icon: "pi pi-cog", command: () => console.log("Open Settings") },
      { label: "About", icon: "pi pi-sign-out", command: () => console.log("Logging out") },
    ];
  
    // Left section: Icon + Text (Vertically Centered)
    const start = (
        <div style={{display:"flex", alignItems: "center", gap: "8px" }} className="flex items-center space-x-2 h-10">
        <img alt="Logo" width="30" height="30" src="icons/icon16.png"/>
        <span className="text-lg font-semibold"> VTT {currentVersion}</span>
        <Updater />
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
  
  
 