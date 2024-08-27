

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

function Transactions() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Your Circular&#40;Coming soon&#41;
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            23 - 30 March 2020
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            newest
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="error"
            icon="expand_more"
            name="Inspection Day"
            description="27 March 2020, at 12:30 PM"
            value="Outing"
          />
          <Transaction
            color="success"
            icon="expand_less"
            name="Public Holiday"
            description="27 March 2020, at 04:30 AM"
            value="Christmas"
          />
        </MDBox>
        <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            yesterday
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="success"
            icon="expand_less"
            name="Meeting by 4am"
            description="26 March 2020, at 13:45 PM"
            value="Meeting Type"
          />
          <Transaction
            color="success"
            icon="expand_less"
            name="Presentation for Staffs"
            description="26 March 2020, at 12:30 PM"
            value="Presentation Day"
          />
          <Transaction
            color="success"
            icon="expand_less"
            name="HOD Engagement"
            description="26 March 2020, at 08:30 AM"
            value="meeting day"
          />
          <Transaction
            color="dark"
            icon="priority_high"
            name="Closing Event day"
            description="26 March 2020, at 05:00 AM"
            value="Pending"
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Transactions;
