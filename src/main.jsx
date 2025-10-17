import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SvasthOlWebsite from "../svasthol_website_react.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SvasthOlWebsite />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
