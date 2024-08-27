import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"
import Footer from "examples/Footer"

import EmployeeTable from "./components/EmployeeTable";

import Cards from "./components/cards";
import { useGetDepartmentQuery, useGetRoleQuery, useGetEmployeeQuery } from "api/apiSlice";


import DataTable from "examples/Tables/DataTable";
import EmployeesTable from "./components/data/EmployeesTable"
import CreateModal from "./components/modal/CreateModal";
import NewCards from "./components/newcard";
import CreateDepartment from "./components/modal/CreateUser/CreateDepartment";
import CreateRole from "./components/modal/CreateUser/CreateRole";

const Employee = () => {
    const currentPage = 1; // State for current page
    const rowsPerPage = 10; // Number of employees to show per page
    const offset = (currentPage - 1) * rowsPerPage;

    const { data: department, isLoading } = useGetDepartmentQuery();
    const { data } = useGetRoleQuery();
    const { data:employees } = useGetEmployeeQuery({ limit: rowsPerPage, offset })

    const [open, setOpen] = useState(false);
    const [openRoles, setOpenRoles] = useState(false);
    const [openDepts, setOpenDepts] = useState(false);
    const [modalType, setModalType] = useState(null);
    console.log("openRoles", openRoles);
    console.log("openDepts", openDepts);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleRoles = () => {
        setOpenRoles(true);
    };

    const rolesClose = () => {
        setOpenRoles(false);
    };

    const handleDept = (type) => {
        setOpenDepts(true);
    };

    const deptClose = () => {
        setOpenDepts(false); // Correcting this as well; it was setting `setOpenRoles(false)`
    };
    
    const { columns, rows } = EmployeesTable({employees} ?? [])
  return (
    <>
    <DashboardLayout>
        <DashboardNavbar absolute isMini /> 
            <MDBox mt={8}>
                <MDBox mb={3}>
                    <Grid item xs={12} lg={12}> 
                        <Grid container spacing={3}> 
                            <Grid item xs={12} lg={6}>                           
                                <Cards data={department} name="Departments" type="department" handleDept={handleDept}  />                               
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <NewCards data={data} name="Roles" type="role" handleRoles={handleRoles} />
                            </Grid>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>

            <MDBox mb={3} mt={10}>              
                <MDBox>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                    <MDTypography variant="h6" fontWeight="medium" color="white">
                                        Employees Table
                                    </MDTypography>
                                    <MDBox  display="flex" justifyContent="space-between" alignItems="center">
                                        <MDBox sx={{ mr: '1rem' }}>
                                            <MDButton variant="contained" color="info" size="small" mr={4} sx={{ zIndex: 1300}}>
                                                view all
                                            </MDButton>
                                        </MDBox>

                                        <MDButton variant="outlined" size="small" sx={{ zIndex: 1300}} onClick={handleOpen}>
                                            Create
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                                </MDBox>
                                <MDBox pt={3}>
                                    {
                                        (columns && rows) &&  
                                        <DataTable
                                        table={{ columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                        />
                                    }
                            </MDBox>
                        </Card>
                    </Grid>
                </MDBox>
            </MDBox>
        <Footer />
    </DashboardLayout>
    {openRoles ? <CreateRole rolesClose={rolesClose} openRoles={openRoles}/> : null}
    {open ? <CreateModal handleClose={handleClose} type={modalType} /> : null}
    {openDepts ? <CreateDepartment deptClose={deptClose} openDepts={openDepts} /> : null}
    
    </>
  )
}

export default Employee