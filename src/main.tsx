import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// import setupLocatorUI from "@locator/runtime";
import { BrowserRouter } from "react-router-dom";

// if (process.env.NODE_ENV === "development") {
//   setupLocatorUI();
// }
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
