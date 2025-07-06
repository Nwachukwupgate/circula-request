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

function Bill({ name, description, user, amount, status, noGutter, userLastname, requestDepartment, requestRole, accountStatus, comment, onClick, cfoApprovalStatus, hodApprovalStatus, cooApprovalStatus, mdApprovalStatus, dateNeeded, createdAt,requestType,
quantity, preferredVendor, justification, expectedDeliveryDate, paymentMethod, urgencyLevel, location, leaveType, startDate, endDate, employeeName, supervisorName, deviceName, issueTitle, reason, approvers = []
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Helper function to check if a value exists and is not empty
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== "" && value !== "null";
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!hasValue(dateString)) return null;
    const dt = DateTime.fromISO(dateString);
    return dt.isValid ? dt.toFormat('yyyy-MM-dd') : null;
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    if (!hasValue(dateString)) return null;
    const dt = DateTime.fromISO(dateString);
    return dt.isValid ? dt.toFormat('HH:mm') : null;
  };

  const dateNeededFormatted = formatDate(dateNeeded);
  const timeFormatted = formatTime(createdAt);
  const expectedDeliveryFormatted = formatDate(expectedDeliveryDate);
  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDate);

  const renderStatus = (label, status) => {
    if (!hasValue(status)) return null;
    
    const lowerStatus = status?.toLowerCase();

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
              {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
            </p>
          </div>
        </MDTypography>
      </MDBox>
    );
  };

  // Helper function to render a field conditionally
  const renderField = (label, value, className = "") => {
    if (!hasValue(value)) return null;
    
    return (
      <MDBox mb={2} lineHeight={0} className={className}>
        <MDTypography variant="caption" color="text">
          {label}:&nbsp;&nbsp;&nbsp;
          <MDBox className="mt-1">
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
              <span className="text-base">{value}</span>
            </MDTypography>
          </MDBox>
        </MDTypography>
      </MDBox>
    );
  };

  const renderDynamicApprovals = () => {
    if (!approvers || !Array.isArray(approvers) || approvers.length === 0) {
      return null;
    }

    return approvers.map((approver, index) => {
      const roleName = approver.Role?.name || approver.role?.name;
      const approvalStatus = approver.approvalStatus;
      
      if (hasValue(roleName) && hasValue(approvalStatus)) {
        return renderStatus(`${roleName} Approval`, approvalStatus);
      }
      return null;
    });
  };

  const shouldShowApprovalSection = () => {
    if (approvers && Array.isArray(approvers) && approvers.length > 0) {
      return approvers.some(approver => 
        hasValue(approver.Role?.name || approver.role?.name) && 
        hasValue(approver.approvalStatus)
      );
    }
    
    return hasValue(hodApprovalStatus) || 
           hasValue(cfoApprovalStatus) || 
           hasValue(cooApprovalStatus) || 
           hasValue(mdApprovalStatus) || 
           hasValue(accountStatus);
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

          {/* User Information - Only show if user exists */}
          {hasValue(user) && (
            <MDBox mb={2} lineHeight={0}>
              <MDTypography variant="caption" color="text">
                User:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
                    <img src={team2} alt="User" className="inline-block mr-1 w-6 h-6 rounded-full" /> 
                    <span className="text-base">{user} {hasValue(userLastname) ? userLastname : ''}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>
          )}

          {/* Description - Only show if exists */}
          {hasValue(description) && (
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
          )}

          {/* Dynamic grid based on available fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b-2 border-[#E2E2E2] pb-4">
            {renderField("Request Department", requestDepartment, "border-r-2 border-[#E2E2E2] pr-2")}
            {renderField("Request Role", requestRole, "border-r-2 border-[#E2E2E2] pr-2")}
            {renderField("Request Type", requestType)}
            {hasValue(amount) && renderField("Amount", amount)}
            {hasValue(quantity) && renderField("Quantity", quantity)}
            {renderField("Preferred Vendor", preferredVendor)}
            {renderField("Payment Method", paymentMethod)}
            {renderField("Urgency Level", urgencyLevel)}
            {renderField("Location", location)}
            {renderField("Leave Type", leaveType)}
            {renderField("Employee Name", employeeName)}
            {renderField("Supervisor Name", supervisorName)}
            {renderField("Device Name", deviceName)}
            {renderField("Issue Title", issueTitle)}
            {renderField("Reason", reason)}
            {dateNeededFormatted && renderField("Date Needed", dateNeededFormatted)}
            {timeFormatted && renderField("Time", timeFormatted)}
            {expectedDeliveryFormatted && renderField("Expected Delivery", expectedDeliveryFormatted)}
            {startDateFormatted && renderField("Start Date", startDateFormatted)}
            {endDateFormatted && renderField("End Date", endDateFormatted)}
          </div>

          {/* Justification - Only show if exists */}
          {hasValue(justification) && (
            <MDBox mb={2} lineHeight={0} className="mt-4">
              <MDTypography variant="caption" color="text">
                Justification:&nbsp;&nbsp;&nbsp;
                <MDBox className="mt-1">
                  <MDTypography variant="caption" fontWeight="medium" className="text-base">
                    <span className="text-base">{justification}</span>
                  </MDTypography>
                </MDBox>
              </MDTypography>
            </MDBox>
          )}

          {/* Approval Status Section - Only show if any approval status exists */}
          {(hasValue(hodApprovalStatus) || hasValue(cfoApprovalStatus) || hasValue(cooApprovalStatus) || hasValue(mdApprovalStatus) || hasValue(accountStatus)) && (
            <div>
              <MDBox mb={2} lineHeight={0} className="mt-2 text-[#000000] font-bold">
                <p className="text-base">
                  Approval Status&nbsp;&nbsp;&nbsp;
                </p>
              </MDBox>
              {renderStatus("HOD Approval", hodApprovalStatus)}
              {renderStatus("CFO Approval", cfoApprovalStatus)}
              {renderStatus("COO Approval", cooApprovalStatus)}
              {renderStatus("MD Approval", mdApprovalStatus)}
              {renderStatus("Account Status", accountStatus)}
            </div>
          )}

          {shouldShowApprovalSection() && (
            <div>
              <MDBox mb={2} lineHeight={0} className="mt-2 text-[#000000] font-bold">
                <p className="text-base">
                  Approval Status&nbsp;&nbsp;&nbsp;
                </p>
              </MDBox>
              
              {/* Render dynamic approvals from approvers array */}
              {renderDynamicApprovals()}
              
              {/* Fallback to legacy approval statuses if no approvers */}
              {(!approvers || approvers.length === 0) && (
                <>
                  {renderStatus("HOD Approval", hodApprovalStatus)}
                  {renderStatus("CFO Approval", cfoApprovalStatus)}
                  {renderStatus("COO Approval", cooApprovalStatus)}
                  {renderStatus("MD Approval", mdApprovalStatus)}
                </>
              )}
              
              {/* Account Status - always show if available */}
              {renderStatus("Account Status", accountStatus)}
            </div>
          )}

          {/* Comment - Only show if exists */}
          {hasValue(comment) && (
            <MDBox mb={2} lineHeight={0}>
              <MDTypography variant="caption" color="text">
                Comment:&nbsp;&nbsp;&nbsp;
                <MDTypography variant="caption" fontWeight="medium">
                  {comment}
                </MDTypography>
              </MDTypography>
            </MDBox>
          )}
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
  description: PropTypes.string,
  user: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
  userLastname: PropTypes.string,
  requestDepartment: PropTypes.string,
  requestRole: PropTypes.string,
  accountStatus: PropTypes.string,
  comment: PropTypes.string,
  onClick: PropTypes.func,
  cfoApprovalStatus: PropTypes.string,
  hodApprovalStatus: PropTypes.string,
  cooApprovalStatus: PropTypes.string,
  mdApprovalStatus: PropTypes.string,
  dateNeeded: PropTypes.string,
  createdAt: PropTypes.string,
  requestType: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  preferredVendor: PropTypes.string,
  justification: PropTypes.string,
  expectedDeliveryDate: PropTypes.string,
  paymentMethod: PropTypes.string,
  urgencyLevel: PropTypes.string,
  location: PropTypes.string,
  leaveType: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  employeeName: PropTypes.string,
  supervisorName: PropTypes.string,
  deviceName: PropTypes.string,
  issueTitle: PropTypes.string,
  reason: PropTypes.string,
};

export default Bill;


// import { DateTime } from 'luxon';

// // prop-types is a library for typechecking of props
// import PropTypes from "prop-types";

// // @mui material components
// import Icon from "@mui/material/Icon";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";

// // Material Dashboard 2 React context
// import { useMaterialUIController } from "context";

// import team2 from "assets/images/team-2.jpg";

// function Bill({ name, description, user, amount, status, noGutter, userLastname, requestDepartment, requestRole, accountStatus, comment, onClick, cfoApprovalStatus, hodApprovalStatus, cooApprovalStatus, mdApprovalStatus, dateNeeded, createdAt, requestType,quantity, preferredVendor, justification, expectedDeliveryDate, paymentMethod, urgencyLevel, location, leaveType, startDate, endDate,employeeName, supervisorName, deviceName, issueTitle, reason }) {
//   const [controller] = useMaterialUIController();
//   const { darkMode } = controller;

//   // Helper function to check if a value exists and is not empty
//   const hasValue = (value) => {
//     return value !== null && value !== undefined && value !== "" && value !== "null";
//   };

//   const formatDate = (dateString) => {
//     if (!hasValue(dateString)) return null;
//     const dt = DateTime.fromISO(dateString);
//     return dt.isValid ? dt.toFormat('yyyy-MM-dd') : null;
//   };

//   // Helper function to format time
//   const formatTime = (dateString) => {
//     if (!hasValue(dateString)) return null;
//     const dt = DateTime.fromISO(dateString);
//     return dt.isValid ? dt.toFormat('HH:mm') : null;
//   };

//   const dateNeededFormatted = formatDate(dateNeeded);
//   const timeFormatted = formatTime(createdAt);
//   const expectedDeliveryFormatted = formatDate(expectedDeliveryDate);
//   const startDateFormatted = formatDate(startDate);
//   const endDateFormatted = formatDate(endDate);

//   const renderStatus = (label, status) => {
//     if (!hasValue(status)) return null;
    
//     const lowerStatus = status?.toLowerCase();

//     let bgClass = "";
//     let textClass = "";

//     if (lowerStatus === "pending") {
//       bgClass = "bg-[#FDF3DD]";
//       textClass = "text-[#EEBF50]";
//     } else if (lowerStatus === "rejected") {
//       bgClass = "bg-red-100";
//       textClass = "text-red-600";
//     } else if (lowerStatus === "approved") {
//       bgClass = "bg-green-100";
//       textClass = "text-green-600";
//     }

//     return (
//       <MDBox mb={2} lineHeight={0}>
//         <MDTypography variant="caption" color="text">
//           {label}&nbsp;&nbsp;&nbsp;
//           <div
//             className={`text-base inline-flex items-center justify-center rounded-lg px-2 py-1 ${bgClass}`}
//           >
//             <p className={`${textClass} text-sm font-medium`}>
//               {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
//             </p>
//           </div>
//         </MDTypography>
//       </MDBox>
//     );
//   };

//   const dt = DateTime.fromISO(dateNeeded);
//   const createdAtDt = DateTime.fromISO(createdAt);

//   // Separate date and time
//   const date = dt.toFormat('yyyy-MM-dd');
//   const time = createdAtDt.toFormat('HH:mm');

//   const renderField = (label, value, className = "") => {
//     if (!hasValue(value)) return null;
    
//     return (
//       <MDBox mb={2} lineHeight={0} className={className}>
//         <MDTypography variant="caption" color="text">
//           {label}:&nbsp;&nbsp;&nbsp;
//           <MDBox className="mt-1">
//             <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//               <span className="text-base">{value}</span>
//             </MDTypography>
//           </MDBox>
//         </MDTypography>
//       </MDBox>
//     );
//   };


//   return (
//     <>
//       <MDBox
//         component="li"
//         display="flex"
//         justifyContent="space-between"
//         alignItems="flex-start"
//         bgColor={darkMode ? "transparent" : "grey-100"}
//         borderRadius="lg"
//         p={3}
//         mb={noGutter ? 0 : 1}
//         mt={2}
//         onClick={onClick}
//       >
//         <MDBox width="100%" display="flex" flexDirection="column">
//           <MDBox
//             display="flex"
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             flexDirection={{ xs: "column", sm: "row" }}
//             mb={2}
//           >
//             <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
//               {name}
//             </MDTypography>

//             <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
//               {/* <MDBox mr={1}>
//                 <MDButton variant="text" color="error">
//                   <Icon>delete</Icon>&nbsp;delete
//                 </MDButton>
//               </MDBox>
//               <MDButton variant="text" color={darkMode ? "white" : "dark"}>
//                 <Icon>edit</Icon>&nbsp;edit
//               </MDButton> */}

//               <MDBox>
//                 <div
//                   className={`text-base flex items-center justify-center rounded-lg px-2 py-1
//                     ${
//                       status === 'pending'
//                         ? 'bg-[#FDF3DD] text-[#EEBF50]'
//                         : status === 'rejected'
//                         ? 'bg-red-100 text-red-600'
//                         : status === 'approved'
//                         ? 'bg-green-100 text-green-600'
//                         : ''
//                     }`}
//                 >
//                   <p>
//                     {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
//                   </p>
//                 </div>
//               </MDBox>

//             </MDBox>
//           </MDBox>

//           <MDBox mb={2} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               User:&nbsp;&nbsp;&nbsp;
//               <MDBox className="mt-1">
//                 <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                   <img src={team2} alt="User" className="inline-block mr-1 w-6 h-6 rounded-full" /> 
//                   <span className="text-base">{user} {userLastname}</span>
//                 </MDTypography>
//               </MDBox>
//             </MDTypography>
//           </MDBox>

//           <MDBox mb={2} lineHeight={0}>
//             <MDTypography variant="caption" color="text">
//               Description:&nbsp;&nbsp;&nbsp;
//               <MDBox className="mt-1">
//                 <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                   <span className="text-base">{description}</span>
//                 </MDTypography>
//               </MDBox>
//             </MDTypography>
//           </MDBox>

//           <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 border-b-2 border-[#E2E2E2]">

//             <MDBox mb={2} lineHeight={0} className="border-r-2 border-[#E2E2E2] pr-2">
//               <MDTypography variant="caption" color="text">
//                 Request Department:&nbsp;&nbsp;&nbsp;
//                 <MDBox className="mt-1">
//                   <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                     <span className="text-base">{requestDepartment}</span>
//                   </MDTypography>
//                 </MDBox>
//               </MDTypography>
//             </MDBox>

//             <MDBox mb={2} lineHeight={0} className="border-r-2 border-[#E2E2E2] pr-2">
//               <MDTypography variant="caption" color="text">
//                 Request Role:&nbsp;&nbsp;&nbsp;
//                 <MDBox className="mt-1">
//                   <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                     <span className="text-base">{requestRole}</span>
//                   </MDTypography>
//                 </MDBox>
//               </MDTypography>
//             </MDBox>

//             <MDBox mb={2} lineHeight={0}>
//               <MDTypography variant="caption" color="text">
//                 Amount:&nbsp;&nbsp;&nbsp;
//                 <MDBox className="mt-1">
//                   <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                     <span className="text-base">{amount}</span>
//                   </MDTypography>
//                 </MDBox>
//               </MDTypography>
//             </MDBox>

//             <MDBox mb={2} lineHeight={0} className="border-r-2 border-[#E2E2E2] pr-2">
//               <MDTypography variant="caption" color="text">
//                 Date Needed:&nbsp;&nbsp;&nbsp;
//                 <MDBox className="mt-1">
//                   <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                     <span className="text-base">{date}</span>
//                   </MDTypography>
//                 </MDBox>
//               </MDTypography>
//             </MDBox>

//             <MDBox mb={2} lineHeight={0}>
//               <MDTypography variant="caption" color="text">
//                 Time:&nbsp;&nbsp;&nbsp;
//                 <MDBox className="mt-1">
//                   <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize" className="text-base">
//                     <span className="text-base">{time}</span>
//                   </MDTypography>
//                 </MDBox>
//               </MDTypography>
//             </MDBox>

//           </div>

//           <div>
//             <MDBox mb={2} lineHeight={0} className="mt-2 text-[#000000] font-bold">
//               <p className="text-base">
//                 Approval Status&nbsp;&nbsp;&nbsp;
//               </p>
//             </MDBox>
//           </div>

//           {renderStatus("HOD Approval", hodApprovalStatus)}
//           {renderStatus("CFO Approval", cfoApprovalStatus)}
//           {renderStatus("COO Approval", cooApprovalStatus)}
//           {renderStatus("MD Approval", mdApprovalStatus)}
//           {renderStatus("Account Status", accountStatus)}

//           <MDBox mb={2} lineHeight={0}>
//           <MDTypography variant="caption" color="text">
//             Comment:&nbsp;&nbsp;&nbsp;
//             <MDTypography variant="caption" fontWeight="medium">
//               {comment}
//             </MDTypography>
//           </MDTypography>
//           </MDBox>
//         </MDBox>
//       </MDBox>
//     </>
//   );
// }

// // Setting default values for the props of Bill
// Bill.defaultProps = {
//   noGutter: false,
// };

// // Typechecking props for the Bill
// Bill.propTypes = {
//   name: PropTypes.string.isRequired,
//   company: PropTypes.string.isRequired,
//   email: PropTypes.string.isRequired,
//   vat: PropTypes.string.isRequired,
//   noGutter: PropTypes.bool,
// };

// export default Bill;
