import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function Bill({ name, description, user, amount, status, noGutter, userLastname, requestDepartment, requestRole, accountStatus, comment, onClick }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <>
      <MDBox
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={darkMode ? "transparent" : "grey-100"}
        borderRadius="lg"
        p={3}
        mb={noGutter ? 0 : 1}
        mt={2}
        onClick={onClick}
      >
        <MDBox width="100%" display="flex" flexDirection="column">
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            mb={2}
          >
            <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
              {name}
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
              <MDBox mr={1}>
                <MDButton variant="text" color="error">
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"}>
                <Icon>edit</Icon>&nbsp;edit
              </MDButton>
            </MDBox>
          </MDBox>
          <MDBox mb={2} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Item Description:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {description}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={2} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              User:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {user} {userLastname}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={2} lineHeight={0}>
            <MDTypography variant="caption" color="text">
            Request Department:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {requestDepartment}
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mb={2} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Request Role:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {requestRole}
              </MDTypography>
            </MDTypography>
          </MDBox>

          <MDBox mb={2} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Amount:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {amount}
            </MDTypography>
          </MDTypography>
          </MDBox>

          <MDBox mb={2} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Status:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {status}
            </MDTypography>
          </MDTypography>
          </MDBox>

          <MDBox mb={2} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Account Status:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {accountStatus}
            </MDTypography>
          </MDTypography>
          </MDBox>

          <MDBox mb={2} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Comment:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {comment}
            </MDTypography>
          </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
