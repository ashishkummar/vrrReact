import React from "react";
import { createRoot } from "react-dom/client";

const Panel = () => {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>My DevTools Panel</h2>
            <p>Welcome to your custom DevTools panel.</p>
            <button onClick={() => alert("Button Clicked!")}>Click Me</button>
        </div>
    );
};

// Mount the component
const root = document.getElementById("root");
if (root) {
    createRoot(root).render(<Panel />);
}
