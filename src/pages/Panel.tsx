 import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';



import { createRoot } from "react-dom/client";
import { Header } from "../Components/Header";
import Footer from "../Components/Footer";  
 
import  TrackerComponent from "./TrackerComponent"

 

const Panel = () => {
    return (
        <div>
              <Header/>
              <TrackerComponent />
              <Footer />

         
      </div>
    );
};

// Mount the component
const root = document.getElementById("root");
if (root) {
    createRoot(root).render(<Panel />);
}
