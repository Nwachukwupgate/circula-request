import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { keyframes } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

import CreateRequest from "./components/Create"

// Animation for floating button
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

function Billing() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <CreateRequest open={open} handleClose={handleClose} />
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
        <div className="pb-6">
          <MDBox mt={8}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <BillingInformation />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Transactions />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </div>
      <Footer />
      
      {/* Single Floating Action Button for creating requests */}
      <Tooltip title="Create New Request" placement="left">
        <Fab
          color="primary"
          aria-label="create request"
          onClick={handleClickOpen}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            animation: `${floatAnimation} 2s ease-in-out infinite`,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
              animation: 'none', // Stop animation on hover
            },
            transition: 'all 0.2s ease-in-out',
            width: 60,
            height: 60,
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>
    </DashboardLayout>
    </>
  );
}

export default Billing;
