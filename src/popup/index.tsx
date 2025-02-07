import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const Popup = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="popup-container">
      <h2>Welcome to My Chrome Extension!  <br/> Boilerplate Code 1.0 🚀</h2>
      <p>Click count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <h6> <a href="https://github.com/ashishkummar" target="_blank"> Developed By Ashishkummar  </a></h6>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Popup />);
}
