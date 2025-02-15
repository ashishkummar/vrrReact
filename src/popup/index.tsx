import React, { useState, useEffect } from "react";
import { logEvent } from  "../utils/firebase/firebase-config";
import EventList from "../Components/Stats/Eventlist";  


import { createRoot } from "react-dom/client";
import "./popup.css";

const Popup = () => {
  const [count, setCount] = useState(0);



  useEffect(() => {
    console.log("popup_opened")
    logEvent("popup_opened", { source: "ChromeExtension" });
 
}, []);

  return (
    <div className="popup-container">
      <h2>VDX Testing Tool </h2>
      <p> Built with React.js and Chrome Extension API (Manifest Version 3)</p>
       <h6> <a href="https://stash.exponential.com/profile" target="_blank"> Developed By ashish.kumar@vdx.tv  </a></h6>
   {/* Render the EventList component */}
   <EventList />
    </div>

  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Popup />);
}
