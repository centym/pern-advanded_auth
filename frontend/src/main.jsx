import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import React, { Suspense } from 'react';
import './utils//i18n'; // Importez la configuration i18next

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <Suspense fallback={<div>Loading translations...</div>}>
          <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
