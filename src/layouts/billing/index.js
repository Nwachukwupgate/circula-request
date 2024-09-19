import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Button from '@mui/material/Button';
// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import { FaPen } from "react-icons/fa";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

import CreateRequest from "./components/Create"
import MDButton from "components/MDButton";

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
    <CreateRequest  open={open} handleClose={handleClose} />
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
        <div className="pb-6">
        <MDBox mt={8} >
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

        <MDButton variant="contained" color="info" onClick={handleClickOpen}>
          Click to Make Request
        </MDButton>
      </MDBox>
        </div>
      <Footer />
      <div className="fixed bottom-9 left-4">
        <button
          className="bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-700"
          onClick={handleClickOpen}
        >
          <FaPen className="text-white" size={20} />
        </button>
      </div>
    </DashboardLayout>
    </>
  );
}

export default Billing;
