

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/billing/components/Bill";

import { useGetRequestQuery } from "api/apiSlice";

function BillingInformation() {
  const {data} = useGetRequestQuery()
  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Request Information
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {data && data.map(request => (
            <Bill
              name={request?.itemName}
              description={request?.itemDescription}
              user={request?.userId}
              amount={request?.amount}
              status={request?.status}
            />
          ))}
          
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
