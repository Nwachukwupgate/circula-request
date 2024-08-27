

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function CardText({ date, id, price, noGutter }) {
  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <MDBox lineHeight={1.125}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {date}
        </MDTypography>
        <MDTypography variant="caption" fontWeight="regular" color="text">
          {id}
        </MDTypography>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDBox display="flex" alignItems="center" lineHeight={1} ml={3} sx={{ cursor: "pointer" }}>
          <Icon fontSize="small">delete</Icon>
          <MDTypography variant="button" fontWeight="bold">
            &nbsp;Delete
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center" lineHeight={1} ml={3} sx={{ cursor: "pointer" }}>
          <Icon fontSize="small">edit</Icon>
          <MDTypography variant="button" fontWeight="bold">
            &nbsp;Edit
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Invoice
CardText.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Invoice
CardText.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default CardText;
