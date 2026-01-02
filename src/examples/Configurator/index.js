import { useState, useEffect } from "react";

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Custom styles for the Configurator
import ConfiguratorRoot from "examples/Configurator/ConfiguratorRoot";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
  setFixedNavbar,
  setSidenavColor,
  setDarkMode,
} from "context";

function Configurator() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    openConfigurator,
    fixedNavbar,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [disabled, setDisabled] = useState(false);
  const sidenavColors = ["primary", "dark", "info", "success", "warning", "error"];

  // Use the useEffect hook to change the button state for the sidenav type based on window size.
  useEffect(() => {
    // A function that sets the disabled state of the buttons for the sidenav type.
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }

    // The event listener that's calling the handleDisabled function when resizing the window.
    window.addEventListener("resize", handleDisabled);

    // Call the handleDisabled function to set the state with the initial value.
    handleDisabled();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  const handleTransparentSidenav = () => {
    setTransparentSidenav(dispatch, true);
    setWhiteSidenav(dispatch, false);
  };
  const handleWhiteSidenav = () => {
    setWhiteSidenav(dispatch, true);
    setTransparentSidenav(dispatch, false);
  };
  const handleDarkSidenav = () => {
    setWhiteSidenav(dispatch, false);
    setTransparentSidenav(dispatch, false);
  };
  const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);
  const handleDarkMode = () => setDarkMode(dispatch, !darkMode);

  // sidenav type buttons styles
  const sidenavTypeButtonsStyles = ({
    functions: { pxToRem },
    palette: { white, dark, background },
    borders: { borderWidth },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? background.sidenav : white.main,
    color: darkMode ? white.main : dark.main,
    border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,

    "&:hover, &:focus, &:focus:not(:hover)": {
      background: darkMode ? background.sidenav : white.main,
      color: darkMode ? white.main : dark.main,
      border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
    },
  });

  // sidenav type active button styles
  const sidenavTypeActiveButtonStyles = ({
    functions: { pxToRem, linearGradient },
    palette: { white, gradients, background },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
    color: darkMode ? background.sidenav : white.main,

    "&:hover, &:focus, &:focus:not(:hover)": {
      background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
      color: darkMode ? background.sidenav : white.main,
    },
  });

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Settings</MDTypography>
          <MDTypography variant="body2" color="text">
            Customize your dashboard experience
          </MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
            transform: "translateY(5px)",
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      {/* Settings Saved Indicator */}
      <MDBox px={3} pb={1}>
        <Alert 
          severity="success" 
          icon={<Icon fontSize="small">check_circle</Icon>}
          sx={{ 
            py: 0.5, 
            fontSize: '0.75rem',
            '& .MuiAlert-icon': { fontSize: '1rem' }
          }}
        >
          Your preferences are saved automatically
        </Alert>
      </MDBox>

      <Divider />

      <MDBox pt={0.5} pb={3} px={3}>
        {/* Sidenav Colors */}
        <MDBox>
          <Tooltip title="Choose an accent color for your sidebar navigation" placement="top" arrow>
            <MDTypography variant="h6" sx={{ cursor: 'help' }}>
              Sidenav Colors
            </MDTypography>
          </Tooltip>

          <MDBox mb={0.5}>
            {sidenavColors.map((color) => (
              <Tooltip key={color} title={`${color.charAt(0).toUpperCase() + color.slice(1)} theme`} arrow>
                <IconButton
                  sx={({
                    borders: { borderWidth },
                    palette: { white, dark, background },
                    transitions,
                  }) => ({
                    width: "24px",
                    height: "24px",
                    padding: 0,
                    border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
                    borderColor: () => {
                      let borderColorValue = sidenavColor === color && dark.main;

                      if (darkMode && sidenavColor === color) {
                        borderColorValue = white.main;
                      }

                      return borderColorValue;
                    },
                    transition: transitions.create("border-color", {
                      easing: transitions.easing.sharp,
                      duration: transitions.duration.shorter,
                    }),
                    backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                      linearGradient(gradients[color].main, gradients[color].state),

                    "&:not(:last-child)": {
                      mr: 1,
                    },

                    "&:hover, &:focus, &:active": {
                      borderColor: darkMode ? white.main : dark.main,
                    },
                  })}
                  onClick={() => setSidenavColor(dispatch, color)}
                />
              </Tooltip>
            ))}
          </MDBox>
        </MDBox>

        {/* Sidenav Type */}
        <MDBox mt={3} lineHeight={1}>
          <Tooltip title="Change the appearance of your sidebar" placement="top" arrow>
            <MDTypography variant="h6" sx={{ cursor: 'help' }}>
              Sidenav Type
            </MDTypography>
          </Tooltip>
          <MDTypography variant="button" color="text">
            Choose between different sidenav styles
          </MDTypography>

          <MDBox
            sx={{
              display: "flex",
              mt: 2,
              mr: 1,
            }}
          >
            <Tooltip title="Solid dark sidebar background" arrow>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleDarkSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  !transparentSidenav && !whiteSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                Dark
              </MDButton>
            </Tooltip>
            <MDBox sx={{ mx: 1, width: "8rem", minWidth: "8rem" }}>
              <Tooltip title="See-through sidebar that shows background" arrow>
                <MDButton
                  color="dark"
                  variant="gradient"
                  onClick={handleTransparentSidenav}
                  disabled={disabled}
                  fullWidth
                  sx={
                    transparentSidenav && !whiteSidenav
                      ? sidenavTypeActiveButtonStyles
                      : sidenavTypeButtonsStyles
                  }
                >
                  Transparent
                </MDButton>
              </Tooltip>
            </MDBox>
            <Tooltip title="Clean white sidebar background" arrow>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleWhiteSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  whiteSidenav && !transparentSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                White
              </MDButton>
            </Tooltip>
          </MDBox>
        </MDBox>

        {/* Navbar Fixed Toggle */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          lineHeight={1}
        >
          <Tooltip 
            title="When enabled, the top navigation bar stays visible as you scroll down the page. This gives you quick access to search, notifications, and your profile without scrolling back up." 
            placement="left" 
            arrow
          >
            <MDBox sx={{ cursor: 'help' }}>
              <MDTypography variant="h6">Navbar Fixed</MDTypography>
              <MDTypography variant="caption" color="text">
                {fixedNavbar ? "Navbar stays at top while scrolling" : "Navbar scrolls with page content"}
              </MDTypography>
            </MDBox>
          </Tooltip>

          <Switch checked={fixedNavbar} onChange={handleFixedNavbar} />
        </MDBox>
        <Divider />

        {/* Dark Mode Toggle */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <Tooltip 
            title="Switch between light and dark color schemes. Dark mode is easier on the eyes in low-light environments and can reduce screen glare." 
            placement="left" 
            arrow
          >
            <MDBox sx={{ cursor: 'help' }}>
              <MDTypography variant="h6">Light / Dark</MDTypography>
              <MDTypography variant="caption" color="text">
                {darkMode ? "Dark mode active" : "Light mode active"}
              </MDTypography>
            </MDBox>
          </Tooltip>

          <Switch checked={darkMode} onChange={handleDarkMode} />
        </MDBox>
        <Divider />
        {/* <MDBox mt={3} mb={2}>
          <MDButton
            component={Link}
            href="https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/"
            target="_blank"
            rel="noreferrer"
            color={darkMode ? "light" : "dark"}
            variant="outlined"
            fullWidth
          >
            view documentation
          </MDButton>
        </MDBox> */}
        {/* <MDBox display="flex" justifyContent="center">
          <GitHubButton
            href="https://github.com/creativetimofficial/material-dashboard-react"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star creativetimofficial/material-dashboard-react on GitHub"
          >
            Star
          </GitHubButton>
        </MDBox> */}
        {/* <MDBox mt={2} textAlign="center">
          <MDBox mb={0.5}>
            <MDTypography variant="h6">Thank you for sharing!</MDTypography>
          </MDBox>

          <MDBox display="flex" justifyContent="center">
            <MDBox mr={1.5}>
              <MDButton
                component={Link}
                href="//twitter.com/intent/tweet?text=Check%20Material%20Dashboard%20React%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23react%20%mui&url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fmaterial-dashboard-react"
                target="_blank"
                rel="noreferrer"
                color="dark"
              >
                <TwitterIcon />
                &nbsp; Tweet
              </MDButton>
            </MDBox>
            <MDButton
              component={Link}
              href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/material-dashboard-react"
              target="_blank"
              rel="noreferrer"
              color="dark"
            >
              <FacebookIcon />
              &nbsp; Share
            </MDButton>
          </MDBox>
        </MDBox> */}
      </MDBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
