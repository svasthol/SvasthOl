import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SvasthOlWebsite from "../svasthol_website_react.jsx";
import TermsAndConditions from "./Legal/TermsConditions.jsx";
import PrivacyPolicy from "./Legal/PrivacyPolicy.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";  // ✅ Import Admin Panel
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main website */}
        <Route path="/" element={<SvasthOlWebsite />} />

        {/* Legal pages */}
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* ✅ Admin route */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
