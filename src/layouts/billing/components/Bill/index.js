import { DateTime } from 'luxon';

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

import team2 from "assets/images/team-2.jpg";

function Bill({ name, description, user, amount, status, noGutter, userLastname, requestDepartment, requestRole, accountStatus, comment, onClick, cfoApprovalStatus, hodApprovalStatus, cooApprovalStatus, mdApprovalStatus, dateNeeded, createdAt }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const dt = DateTime.fromISO(dateNeeded);
  const createdAtDt = DateTime.fromISO(createdAt);

  // Separate date and time
  const date = dt.toFormat('yyyy-MM-dd');
  const time = createdAtDt.toFormat('HH:mm');

  const renderStatus = (label, status) => {
  const lowerStatus = status.toLowerCase();

  let bgClass = "";
  let textClass = "";

  if (lowerStatus === "pending") {
    bgClass = "bg-[#FDF3DD]";
    textClass = "text-[#EEBF50]";
  } else if (lowerStatus === "rejected") {
    bgClass = "bg-red-100";
    textClass = "text-red-600";
  } else if (lowerStatus === "approved") {
    bgClass = "bg-green-100";
    textClass = "text-green-600";
  }

  return (
    <MDBox mb={2} lineHeight={0}>
      <MDTypography variant="caption" color="text">
        {label}&nbsp;&nbsp;&nbsp;
        <div
          className={`text-base inline-flex items-center justify-center rounded-lg px-2 py-1 ${bgClass}`}
        >
          <p className={`${textClass} text-sm font-medium`}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </p>
        </div>
      </MDTypography>
    </MDBox>
  );
};


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
              {/* <MDBox mr={1}>
                <MDButton variant="text" color="error">
                  <Icon>delete</Icon>&nbsp;delete
                </MDButton>
              </MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"}>
                <Icon>edit</Icon>&nbsp;edit
              </MDButton> */}

              <MDBox>
                <div
                  className={`text-base flex items-center justify-center rounded-lg px-2 py-1
                    ${
                      status === 'pending'
                        ? 'bg-[#FDF3DD] text-[#EEBF50]'
                        : status === 'rejected'
                        ? 'bg-red-100 text-red-600'
                        : status === 'approved'
                        ? 'bg-green-100 text-green-600'
                        : ''
                    }`}
                >
                  <p>
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </p>
                </div>
              </MDBox>

            </MDBox>
          </MDBox>

          <MDBox mb={2} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              User:&nbsp;&nbsp;&nbsp;
              <MDBox className="mt-1">
                <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                  <img src={team2} alt="User" className="inline-block mr-1 w-6 h-6 rounded-full" /> 
                  <span className="text-base">{user} {userLastname}</span>
                </MDTypography>
              </MDBox>
            </MDTypography>
          </MDBox>

          <MDBox mb={2} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Description:&nbsp;&nbsp;&nbsp;
              <MDBox className="mt-1">
                <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                  <span className="text-base">{description}</span>
                </MDTypography>
              </MDBox>
            </MDTypography>
          </MDBox>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 border-b-2 border-[#E2E2E2]">

            <MDBox mb={2} lineHeight={0} className="border-r-2 border-[#E2E2E2] pr-2">
              <MDTypography variant="caption" color="text">
                Request Department:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                    <span className="text-base">{requestDepartment}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>

            <MDBox mb={2} lineHeight={0} className="border-r-2 border-[#E2E2E2] pr-2">
              <MDTypography variant="caption" color="text">
                Request Role:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                    <span className="text-base">{requestRole}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>

            <MDBox mb={2} lineHeight={0}>
              <MDTypography variant="caption" color="text">
                Amount:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                    <span className="text-base">{amount}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>

            <MDBox mb={2} lineHeight={0} className="border-r-2 border-[#E2E2E2] pr-2">
              <MDTypography variant="caption" color="text">
                Date Needed:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                    <span className="text-base">{date}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>

            <MDBox mb={2} lineHeight={0}>
              <MDTypography variant="caption" color="text">
                Time:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                    <span className="text-base">{time}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>

          </div>

          <div>
            <MDBox mb={2} lineHeight={0} className="mt-2 text-[#000000] font-bold">
              <p className="text-base">
                Approval Status&nbsp;&nbsp;&nbsp;
              </p>
            </MDBox>
          </div>

          {renderStatus("HOD Approval", hodApprovalStatus)}
          {renderStatus("CFO Approval", cfoApprovalStatus)}
          {renderStatus("COO Approval", cooApprovalStatus)}
          {renderStatus("MD Approval", mdApprovalStatus)}
          {renderStatus("Account Status", accountStatus)}

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
