import { useState, useEffect } from "react";

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

import Cards from "./components/cards";
import { useGetDepartmentQuery, useGetRoleQuery, useGetEmployeeQuery, useGetProfileQuery } from "api/apiSlice";
import { useNavigate } from "react-router-dom";

import DataTable from "examples/Tables/DataTable";
import EmployeesTable from "./components/data/EmployeesTable"
import CreateModal from "./components/modal/CreateModal";
import NewCards from "./components/newcard";
import CreateDepartment from "./components/modal/CreateUser/CreateDepartment";
import CreateRole from "./components/modal/CreateUser/CreateRole";
import TablePagination from "./components/TablePagination";

const Employee = () => {
    const rowsPerPage = 10; // Number of employees to show per page
    const [page, setPage] = useState(0);
    const offset = page * rowsPerPage;
    const navigate = useNavigate()

    const { data: department } = useGetDepartmentQuery();
    const { data } = useGetRoleQuery();
    const { data:employees, isLoading: employeeLoading } = useGetEmployeeQuery({ limit: rowsPerPage, offset });

    const {data: profile} = useGetProfileQuery()

    useEffect(() => {
        if(profile){
            if(profile?.department?.name !== "ICT"){
                navigate('/dashboard');
            }
        }
    }, [profile, navigate]);

    const [open, setOpen] = useState(false);
    const [openRoles, setOpenRoles] = useState(false);
    const [openDepts, setOpenDepts] = useState(false);
    const [modalType, setModalType] = useState(null);

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
                                        {/* <MDBox sx={{ mr: '1rem' }}>
                                            <MDButton variant="contained" color="info" size="small" mr={4} sx={{ zIndex: 1300}}>
                                                view all
                                            </MDButton>
                                        </MDBox> */}

                                        <MDButton variant="outlined" size="small" sx={{ zIndex: 1300}} onClick={handleOpen}>
                                            Create
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                                </MDBox>
                                <MDBox pt={3} pb={2}>
                                    {(columns && rows) && (
                                        <>
                                        <DataTable
                                            table={{ columns, rows }}
                                            isSorted={true}
                                            entriesPerPage={false}
                                            showTotalEntries={true}
                                            loading={employeeLoading}
                                            noEndBorder
                                        />

                                        <TablePagination
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            count={employees?.count || 0}
                                            onPageChange={setPage}
                                        />
                                        </>
                                    )}
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