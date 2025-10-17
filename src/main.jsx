import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SvasthOlWebsite from './svasthol_website_react'
import TermsConditions from './Legal/TermsConditions'
import PrivacyPolicy from './Legal/PrivacyPolicy'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SvasthOlWebsite />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
