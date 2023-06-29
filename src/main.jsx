import React from "react";
import "./assets/tailwind/index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StateProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <StateProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StateProvider>,
  //</React.StrictMode>,
);
