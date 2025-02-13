import React, { useState, useEffect } from "react";
import "../styles/ETpixelWindow.css";
import { loadPixlFromET } from "../utils/expoTaskapi";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface SmoothScrollUIProps {
  data: string;
}

export const ExpoTaskPixelsWindow: React.FC<SmoothScrollUIProps> = ({ data }) => {
  const [ETData, setETData] = useState<{ event_name: string; description: string }[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await loadPixlFromET("202751");
        console.log("Data From ExpoTask 🍏", fetchedData);
        setETData(fetchedData);
      } catch (error) {
        console.error("Error loading tracking pixels:", error);
      }
    }

    fetchData();
  }, []);

  // Separate Click & Impression events
  const clickEvents = ETData.filter((item) => item.event_name === "Click").map((item) => item.description);
  const impressionEvents = ETData.filter((item) => item.event_name === "Impression").map((item) => item.description);
  
  // Determine max rows needed
  const maxRows = Math.max(clickEvents.length, impressionEvents.length);

  return (
    <>
      <br />
      <div className="card flex justify-content-center">
        <Button
          style={{ width: "100%" }}
          className="dark-button"
          icon="pi pi-external-link"
          onClick={() => setVisible(true)}
        >
          &nbsp; Pixels on &nbsp;
          <img
            style={{ width: "20%" }}
            src={"https://expotask.exponential.com/img/expotask-logo.png"}
          />
        </Button>

        <Dialog
          header="Pixels on Expotask"
          visible={visible}
          maximizable
          style={{ width: "95vw" }}
          onHide={() => setVisible(false)}
        >
          <div className="grid-container">
            {/* Table Header */}
            <div className="grid-row header">
              <div className="grid-cell">Click</div>
              <div className="grid-cell">Impression</div>
            </div>

            {/* Data Rows - Ensuring both columns align */}
            {Array.from({ length: maxRows }).map((_, index) => (
              <div className="grid-row" key={index}>
                <div className="grid-cell">{clickEvents[index] || ""}</div>
                <div className="grid-cell">{impressionEvents[index] || ""}</div>
              </div>
            ))}

            {/* Show message if no data is available */}
            {ETData.length === 0 && (
                <div className="grid-row no-data">
                    <div className="grid-cell full-width">No data available</div>
                </div>
                )}

          </div>
        </Dialog>
      </div>
    </>
  );
};
