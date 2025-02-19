import React, { useState, useEffect } from "react";
import "../styles/ETpixelWindow.css";
import { loadPixlFromET } from "../utils/expoTaskapi";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from 'primereact/progressbar';


import eventBus from "../utils/eventBus"; // Import the event bus
import { getAllcreativeRequestId } from "../utils/rightClick";

interface SmoothScrollUIProps {
    data: {
      firedC:  string[];
      firedI: string[];
    };
  }

export const ExpoTaskPixelsWindow: React.FC<SmoothScrollUIProps> = (  {data}  ) => {

  const [ETData, setETData] = useState<{ event_name: string; description: string }[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [cReqIds, setcReqIds] = useState<string>("");



  useEffect(()=>{
    console.log("fired ", data)
   },[data])


      //
      
  useEffect(() => {


    async function fetchCreativeRequestIds() {
      try {
        const creativeRequestIds = await getAllcreativeRequestId();
        if (creativeRequestIds.length > 0) {
          console.log("✅ Creative Request IDs (Fetched):", creativeRequestIds[0].creativeRequestId);
         }
      } catch (error) {
        console.error("Error fetching creative request IDs:", error);
      }
    }

    fetchCreativeRequestIds();
  }, []);

      // Listen for event when data is available
      useEffect(() => {
        const listener = eventBus.on("dataAvailable", (data) => {
          console.log("Creative Request IDs ⭐ (from event) event emitted:", data[0].creativeRequestId);
          setcReqIds(data[0].creativeRequestId);
          loadAllPixelsFroET(data[0].creativeRequestId)
           
        });
    
        return () => {
          eventBus.off("dataAvailable", listener);
        };
      }, []);


      function loadAllPixelsFroET(_id:string){
        console.log("🍎🍎🍎  ",_id)
         async function fetchData(adUnitId:string) {
            try {
              const fetchedData = await loadPixlFromET(adUnitId);
              const defaultData = [{"event_name":"Click", "description":"Not Available"},{"event_name":"Impression", "description":"Not Available"}]
              console.log(adUnitId, " 🍎 -> ", fetchedData, (!fetchedData))
              fetchedData ?  setETData(fetchedData) : setETData(defaultData)
              console.log(ETData)
               // setETData(fetchedData);
             } catch (error) {
               console.error("Error loading tracking pixels:", error);
             }
          }
          fetchData(_id);


      }

 


  // Separate Click & Impression events
  const clickEvents = ETData.filter((item) => item.event_name === "Click").map((item) => item.description);
  const impressionEvents = ETData.filter((item) => item.event_name === "Impression").map((item) => item.description);
  const maxRows = Math.max(clickEvents.length, impressionEvents.length);

// Filter divs that have text
const validClickEvents = clickEvents.filter(event => event && event.trim() !== "");
const validImpressionEvents = impressionEvents.filter(event => event && event.trim() !== "");

const totalTextDivs = validClickEvents.length + validImpressionEvents.length;

// Count green divs
const greenClickDivs = validClickEvents.filter(event => data.firedC.includes(event)).length;
const greenImpressionDivs = validImpressionEvents.filter(event => data.firedI.includes(event)).length;

const greenDivs = greenClickDivs + greenImpressionDivs;

// Calculate progress percentage
const progress = totalTextDivs > 0 ? Math.round( (greenDivs / totalTextDivs) * 100) : 0;



  function clickcheckET() {
     
      if(!cReqIds) return;
       let lpURL="https://expotask.exponential.com/request/info/";
        chrome.tabs.create({ url: lpURL+cReqIds });
   }

  return (
    <>
     <div style={{resize:'both'}} className="card flex justify-content-center">
        <Button style={{ width: "100%" }} className="dark-button" onClick={() => setVisible(true)}>
          &nbsp; Pixels on &nbsp;
          <img style={{ width: "20%" }} src="./icons/expotask-logo.png" />
        </Button>
         
        <Dialog 
        header={
          
            <div style={{ display: "flex", alignItems: "center" }}>

              <span>Pixels on</span>
              <img onClick={clickcheckET}
                src="./icons/expotask-logo.png"
                alt="ExpoTask Logo"
                style={{ cursor:"pointer", height: "15px", marginLeft: "10px" }}
              />
            </div>
          }
        
        visible={visible} maximizable style={{ width: "95vw" }} onHide={() => setVisible(false)}>
          {/* Progress Bar inside the Dialog */}
          <ProgressBar style={{ height: '7px', fontSize: "6px" }} value={progress} />

          <div className="spacerV"> verify ExpoTask's pixel firing</div>
          <div className="spacerV"></div>

           <div className="grid-container">
            <div className="grid-row header">                      

              <div className="grid-cell">Click </div>
              <div className="grid-cell">Impression</div>
            </div>
            {Array.from({ length: maxRows }).map((_, index) => (
              <div className="grid-row" key={index}>
{/*
     <div className={`grid-cell ${data.firedC.includes(clickEvents[index]) ? "paintFiredPixel" : ""}`} > {clickEvents[index] || ""}</div> 
     <div className={`grid-cell ${data.firedI.includes(impressionEvents[index]) ? "paintFiredPixel" : ""}`} > {impressionEvents[index] || ""}</div>
*/}

<div className={`grid-cell ${
  data.firedC.some(event => {
    console.log("Comparing:", event, "with", clickEvents[index], (event===clickEvents[index]));
    return event === clickEvents[index];
  }) ? "paintFiredPixel" : ""
}`}>
  {clickEvents[index] || ""}
</div> 

<div className={`grid-cell ${
  data.firedI.some(event => {
    console.log("Comparing:", event, "with", impressionEvents[index], (event===impressionEvents[index]));
    return event === impressionEvents[index];
  }) ? "paintFiredPixel" : ""
}`}>
  {impressionEvents[index] || ""}
</div>



              </div>
            ))}
            {ETData.length === 0 && (
              <div className="grid-row no-data">
                <div className="grid-cell full-width">...</div>
              </div>
            )}
          </div>
          
          {/*Tracking Mismatched Pixels, :~: Kept for later use. */}
           {/* 
          {(data.firedC.some(event => !clickEvents.includes(event)) || 
           data.firedI.some(event => !impressionEvents.includes(event))) && (
          <div className="missMatchedPixels"> 
            {data.firedC.filter(event => !clickEvents.includes(event)).join(", ")} 
            {data.firedI.filter(event => !impressionEvents.includes(event)).join(", ")}
          </div>
          )}
           */}


        </Dialog>
      </div>
    </>
  );
};
