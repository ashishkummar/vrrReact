 import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {VDXshowcaseManager} from "../Components/VDXshocaseManager/VDXshowcaseManager"



import { createRoot } from "react-dom/client";
import { Header } from "../Components/Header";
 
import  TrackerComponent from "./TrackerComponent"
import { useEffect, useState } from 'react';

 

const Panel = () => {
 


    return (
        <div>
              <Header />
              <TrackerComponent />
 
       </div>
    );
};

// Mount the component
const root = document.getElementById("root");
if (root) {
    createRoot(root).render(<Panel />);
}
