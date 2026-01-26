
/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Local storage key for persisting settings
const SETTINGS_STORAGE_KEY = "circula_ui_settings";

// Helper function to get saved settings from localStorage
const getSavedSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("Failed to load saved settings:", error);
  }
  return null;
};

// Helper function to save settings to localStorage
const saveSettings = (settings) => {
  try {
    // Only save the customizable settings, not transient ones
    const settingsToSave = {
      transparentSidenav: settings.transparentSidenav,
      whiteSidenav: settings.whiteSidenav,
      sidenavColor: settings.sidenavColor,
      fixedNavbar: settings.fixedNavbar,
      darkMode: settings.darkMode,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.warn("Failed to save settings:", error);
  }
};

// Material Dashboard 2 React main context
const MaterialUI = createContext();

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  let newState;
  
  switch (action.type) {
    case "MINI_SIDENAV": {
      newState = { ...state, miniSidenav: action.value };
      break;
    }
    case "TRANSPARENT_SIDENAV": {
      newState = { ...state, transparentSidenav: action.value };
      saveSettings(newState); // Persist
      break;
    }
    case "WHITE_SIDENAV": {
      newState = { ...state, whiteSidenav: action.value };
      saveSettings(newState); // Persist
      break;
    }
    case "SIDENAV_COLOR": {
      newState = { ...state, sidenavColor: action.value };
      saveSettings(newState); // Persist
      break;
    }
    case "TRANSPARENT_NAVBAR": {
      newState = { ...state, transparentNavbar: action.value };
      break;
    }
    case "FIXED_NAVBAR": {
      newState = { ...state, fixedNavbar: action.value };
      saveSettings(newState); // Persist
      break;
    }
    case "OPEN_CONFIGURATOR": {
      newState = { ...state, openConfigurator: action.value };
      break;
    }
    case "DIRECTION": {
      newState = { ...state, direction: action.value };
      break;
    }
    case "LAYOUT": {
      newState = { ...state, layout: action.value };
      break;
    }
    case "DARKMODE": {
      newState = { ...state, darkMode: action.value };
      saveSettings(newState); // Persist
      break;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  
  return newState;
}

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }) {
  // Load saved settings or use defaults
  const savedSettings = getSavedSettings();
  
  const initialState = {
    miniSidenav: false,
    transparentSidenav: savedSettings?.transparentSidenav ?? false,
    whiteSidenav: savedSettings?.whiteSidenav ?? false,
    sidenavColor: savedSettings?.sidenavColor ?? "info",
    transparentNavbar: true,
    fixedNavbar: savedSettings?.fixedNavbar ?? true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: savedSettings?.darkMode ?? false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};
