import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

import CreateCircular from "./components/Create";
import MDButton from "components/MDButton";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { useGetMyCircularQuery } from "api/apiSlice";

// Images
import Role from "assets/images/Role.png";
import Dept from "assets/images/Dept.png";
import General from "assets/images/General.png";
import hod from "assets/images/hod.png";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Circular() {
    const [open, setOpen] = useState(false);
    const { data: circulars } = useGetMyCircularQuery();
    console.log(circulars);

    const imageMap = {
        role: Role,
        department: Dept,
        company: General,
    };
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
  return (
    <>    
        <CreateCircular  open={open} handleClose={handleClose} />
        
        <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
            <div className="hidden lg:flex lg:justify-end my-2">
                <MDButton variant="contained" color="info" onClick={handleClickOpen}>
                    Create Circular
                </MDButton>
            </div>
            <MDBox p={2}>
            <Grid container spacing={6}>
                {circulars?.circulars?.map((circular) => (
                    <Grid item xs={12} md={6} xl={3} key={circular.id}>
                        <DefaultProjectCard
                            image={imageMap[circular.targetType] || General}
                            label={circular.targetType}
                            title={circular.title}
                            description={circular.body.replace(/<[^>]+>/g, "").substring(0, 20)}
                            action={{
                            type: "internal",
                            route: `/circulars/${circular.id}`,
                            color: "info",
                            label: "view details",
                            }}
                            authors={[
                            { image: team1, name: "Elena Morison" },
                            { image: team2, name: "Ryan Milly" },
                            { image: team3, name: "Nick Daniel" },
                            { image: team4, name: "Peterson" },
                            ]}
                        />
                    </Grid>
                ))}
            </Grid>
            </MDBox>
        <Footer />
        </DashboardLayout>
    </>
  );
}

export default Circular;
