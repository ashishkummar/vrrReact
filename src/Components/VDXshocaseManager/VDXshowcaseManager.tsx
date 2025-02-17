import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface VDXshowcaseManagerProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

  

export const VDXshowcaseManager: React.FC<VDXshowcaseManagerProps> = ({ visible, setVisible }) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const onDialogShow = () => {
        // Maximize the dialog on show (if necessary)
        const maximizeButton = document.querySelector('.p-dialog-header-icon.p-dialog-header-maximize.p-link') as HTMLElement;
        if (maximizeButton && maximizeButton.getAttribute('data-pc-section') === 'maximizablebutton') {
           // maximizeButton.click();
        }

        // Zoom out the iframe by scaling the iframe itself
        if (iframeRef.current) {
            iframeRef.current.style.transform = 'scale(0.32)'; // Adjust the scale factor as needed
            iframeRef.current.style.transformOrigin = '0 0'; // Set origin to top-left corner
            iframeRef.current.style.width = '350%'; // Increase width to prevent clipping
            iframeRef.current.style.height = '150%'
            iframeRef.current.style.marginLeft='-18px'
        }
    };

    function openInNewWin() {
        // Create the new window
        chrome.windows.create({
          url: "https://creative.exponential.com/creative/creative_dev/showcase/index.html", // The URL to open
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
      

    return (
        <>
            <Dialog
                header=""
                visible={visible}
                 
                style={{ width: '99vw', height: '99vh' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
                onShow={onDialogShow}
            >
                <div style={{ width: '100%', height: '100%' }}>
                <i onClick={openInNewWin} className="pi pi-window-maximize" style={{ fontSize: '1rem' }}></i>

                    <iframe
                        ref={iframeRef}
                        src="https://creative.exponential.com/creative/creative_dev/showcase/index.html"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            display: 'block',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            </Dialog>
        </>
    );
};


const VDXshowcase: React.FC = () => {
    const matchHeightRefs = useRef<HTMLDivElement[]>([]);
  
    useEffect(() => {
      if (matchHeightRefs.current.length) {
        const maxHeight = Math.max(
          ...matchHeightRefs.current.map((el) => el?.offsetHeight || 0)
        );
        matchHeightRefs.current.forEach((el) => {
          if (el) el.style.height = `${maxHeight}px`;
        });
      }
    }, []);
  
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Checkbox clicked:", event.target.value);
    };
  
    return (
      <div className="global_container_">
        <div className="group-1">
          <p className="text">VDX Showcase Size Hider</p>
          <p className="par1">Uncheck the Size to exclude from showcase ↓</p>
          <p style={{ textAlign: "center", color: "green" }} id="message"></p>
  
          <div className="wrapper-2">
            <div className="display">
              <div className="rectangle-1-holder">
                <div className="text-2">
                  <p>Display Expandable</p>
                </div>
              </div>
              <div className="rectangle-2-holder">
                <div className="sizes match-height group">
                  {["970x250", "300x600", "300x250", "160x600", "728x90"].map((size, index) => (
                    <div key={size} className="group" ref={(el) => {
                      if (el) matchHeightRefs.current[index] = el;
                    }}>
                      <input
                        type="checkbox"
                        data-platform-value="desktop"
                        data-format-value="expandable"
                        value={size}
                        className="Display_Expandable"
                        onChange={handleCheckboxChange}
                      />
                      <span className="checkboxText">{size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default VDXshowcase;
 