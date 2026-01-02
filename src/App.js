/* eslint-disable */
import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";


// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import ProtectedRoute from "ProtectedRoute";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { SaveUser } from "api/userSlice";
import SignIn from "./layouts/authentication/sign-in"  
import ResetPassword from "./layouts/authentication/reset-password"
import ChangePassword from "./layouts/authentication/change-password"
import CircularDetails from './layouts/circular/pages/CircularDetails'
import SubmitKPIForm from "layouts/kpi/pages/SubmitKpiform";
import PerformanceFeedbackPage from "layouts/kpi/pages/KpiFeedback";
import KPIAssignmentForm from "layouts/kpi/pages/AssignmentForm";
import GrowthLibrary from "layouts/kpi/pages/GrowthLibrary";
import KPIDetailsView from "layouts/kpi/pages/KpiDetails";
import ViewKpis from "layouts/kpi/pages/ViewKpis";
import KPIDetailPage from "layouts/kpi/pages/lineManager/KpiDetail";
import CreateKpis from "layouts/kpi/pages/lineManager/CreateKpi";
import ManagerKPIDetailsView from "layouts/kpi/pages/lineManager/ViewDetail";
import PerformanceFeedback from "layouts/kpi/pages/lineManager/PerformanceFeedback";
import NotificationsPage from "layouts/notifications";
import HelpCenter from "layouts/help-center";


// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { useGetProfileQuery } from "api/apiSlice";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast configuration for better UX
const toastConfig = {
  position: "bottom-center",      // More visible, near user's focus
  autoClose: 5000,                // 5 seconds instead of default 3
  hideProgressBar: false,         // Show progress so users know when it will dismiss
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,         // Pause when user leaves tab
  draggable: true,
  pauseOnHover: true,             // Pause on hover so users can read
  transition: Slide,
  limit: 3,                       // Max 3 toasts at once to avoid clutter
};
import './index.css'
import { useFilteredRoutes } from "hooks/useFilteredRoutes";

// Images
// import brandWhite from "assets/images/logo-ct.png";
// import brandDark from "assets/images/logo-ct-dark.png";

const brandDark = "https://www.internalops.pro/_next/image?url=%2Fimages%2Flogo%2Flogo-transparent.jpg&w=256&q=75"
const brandWhite = "https://www.internalops.pro/_next/image?url=%2Fimages%2Flogo%2Flogo-transparent.jpg&w=256&q=75"

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const dispatchUser = useDispatch();
  const token = useSelector((state) => state.user.token);
  const {data} = useGetProfileQuery()
  const { routes: filteredRoutes, isLoading } = useFilteredRoutes();

  useEffect(() => {
    if(data) {
      dispatchUser(SaveUser(data?.role?.name));
    }     
  }, [data]);
  

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.protected) {
          return (
            <Route
              exact
              path={route.route}
              element={<ProtectedRoute element={route.component} />}
              key={route.key}
            />
          );
        }

        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });


  // const getRoutes = (allRoutes) =>
  //   allRoutes.map((route) => {
  //     if (route.collapse) {
  //       return getRoutes(route.collapse);
  //     }

  //     if (route.route) {
  //       return <Route exact path={route.route} element={route.component} key={route.key} />;
  //     }

  //     return null;
  //   });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    
    <CacheProvider value={rtlCache}>
      <ToastContainer {...toastConfig} />
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName=""
              routes={filteredRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route path="/authentication/sign-in" element={<SignIn />} />
          <Route path="/authentication/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {getRoutes(routes)}
          <Route path="/notification" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/authentication/sign-in"} />} />
          <Route path="/circulars/:id" element={<CircularDetails />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <ToastContainer {...toastConfig} />
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName=""
            routes={filteredRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/circulars/:id" element={<CircularDetails />} />
        <Route path="/kpi/submitkpi" element={<SubmitKPIForm />} />
        <Route path="/kpi/feedback/:kpiId" element={<PerformanceFeedbackPage />} />
        {/* <Route path="/teamkpi/team" element={<PerformanceDashboard />} /> */}
        <Route path="/team/assignment" element={<KPIAssignmentForm />} />
        <Route path="/resources" element={<GrowthLibrary />} />
        <Route path="/kpi/details/:id" element={<KPIDetailsView />} />
        <Route path="/kpi/view" element={<KPIDetailsView />} />
        <Route path="/team/viewTeam/:id" element={<ViewKpis />} />
        <Route path="/team/viewDetails/:id" element={<KPIDetailPage />} />
        <Route path="/team/createkpi" element={<CreateKpis />} />
        <Route path="/team/viewTeam/:kpiId/details/:userId" element={<ManagerKPIDetailsView />} />
        <Route path="/team/viewTeam/:kpiId/feedback/:userId" element={<PerformanceFeedback />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="/help-center" element={<HelpCenter />} />
          {getRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/authentication/sign-in"} />} />
        </Routes>
    </ThemeProvider>
  );
}
