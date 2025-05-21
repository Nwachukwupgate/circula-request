import React, { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import CardText from "./CardText";
import ViewDetails from "./modal/ViewDetails";

function NewCards({data, name, type, handleRoles}) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("roles");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
      <Card sx={{ height: "100%" }}>
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            {name}
          </MDTypography>
          <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDBox sx={{ mr: '1rem' }}>
                  <MDButton variant="contained" color="info" size="small" mr={4} onClick={handleClickOpen}>
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
              {data && data.slice(0, 6).map(data => (
                  <React.Fragment key={data?.id}>
                      <CardText date={data?.name} />
                  </React.Fragment>
              ))}
            {/* <Invoice date="March, 01, 2019" id="#AR-803481" price="$300" noGutter /> */}
          </MDBox>
        </MDBox>
      </Card>

      <ViewDetails 
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        data={data}
      />
    </>
  );
}

export default NewCards;
