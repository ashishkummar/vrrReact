import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

export function Dashboard() {
    const [visible, setVisible] = useState(false);

    return (
        <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 9999 }}>
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog 
                header="Header" 
                visible={visible} 
                style={{ width: '50vw' }} 
                onHide={() => setVisible(false)}
            >
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </p>
            </Dialog>
        </div>
    );
}


