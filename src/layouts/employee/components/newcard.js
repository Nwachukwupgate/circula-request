

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import CardText from "./CardText";
import React from "react";

function NewCards({data, name, type, handleRoles}) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          {name}
        </MDTypography>
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox sx={{ mr: '1rem' }}>
                <MDButton variant="contained" color="info" size="small" mr={4}>
                    view all
                </MDButton>
            </MDBox>

            <MDButton variant="outlined" color="info" size="small" onClick={handleRoles}>
                Create
            </MDButton>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" pt={4} p={0} m={0}>
            {data && data.map(data => (
                <React.Fragment key={data?.id}>
                    <CardText date={data?.name} />
                </React.Fragment>
            ))}
          {/* <Invoice date="March, 01, 2019" id="#AR-803481" price="$300" noGutter /> */}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default NewCards;
