import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import GenericTable from "components/GenericTable";
import team2 from "assets/images/team-2.jpg";

const EmployeeTable = ({employees,loading:isLoading}) => {

  if (isLoading) return <div>Loading...</div>; // Replace this with a loader if you prefer

  // Define columns specific to the employee table
  const columns = [
    { Header: "Author", accessor: "author", width: "45%", align: "left" },
    { Header: "Function", accessor: "function", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Employed", accessor: "employed", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  // Transform the employee data to match the table structure
  const rows = employees && employees?.employees?.map((employee) => ({
    author: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={team2} name={employee?.surname} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {employee?.firstName}
          </MDTypography>
          <MDTypography variant="caption">{employee?.email}</MDTypography>
        </MDBox>
      </MDBox>
    ),
    function: (
      <MDBox lineHeight={1} textAlign="left">
        <MDTypography display="block" variant="button" color="text" fontWeight="medium">
          {employee?.department?.name || "No Department"}
        </MDTypography>
        <MDTypography variant="caption">{employee?.role?.name || "No Role"}</MDTypography>
      </MDBox>
    ),
    status: (
      <MDBox ml={-1}>
        <MDBadge
          badgeContent={employee?.status === "online" ? "online" : "offline"}
          color={employee?.status === "online" ? "success" : "dark"}
          variant="gradient"
          size="sm"
        />
      </MDBox>
    ),
    employed: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {employee?.employeeType}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        Edit
      </MDTypography>
    ),
  }));


  return (   
    <GenericTable columns={columns} rows={rows} />    
  );
};

export default EmployeeTable;
