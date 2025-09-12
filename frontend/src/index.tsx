import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // <-- must match exactly the filename
// import Appa from "./Appa"; 
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
