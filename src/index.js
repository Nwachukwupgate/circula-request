
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import App from "App";
import Store from './api/store'

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={Store}>
    <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </Provider>
  </BrowserRouter>
);
