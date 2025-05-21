import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

import CreateCircular from "./components/Create";
import MDButton from "components/MDButton";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { useGetMyCircularQuery } from "api/apiSlice";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

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
                {/* <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                    image={Dept}
                    label="project #1"
                    title="scandinavian"
                    description="Music is something that everyone has their own specific opinion about."
                    action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                    }}
                    authors={[
                    { image: team3, name: "Nick Daniel" },
                    { image: team4, name: "Peterson" },
                    { image: team1, name: "Elena Morison" },
                    { image: team2, name: "Ryan Milly" },
                    ]}
                />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                    image={General}
                    label="project #3"
                    title="minimalist"
                    description="Different people have different taste, and various types of music."
                    action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                    }}
                    authors={[
                    { image: team4, name: "Peterson" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team1, name: "Elena Morison" },
                    ]}
                />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                    image={hod}
                    label="project #4"
                    title="gothic"
                    description="Why would anyone pick blue over pink? Pink is obviously a better color."
                    action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                    }}
                    authors={[
                    { image: team4, name: "Peterson" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team1, name: "Elena Morison" },
                    ]}
                />
                </Grid> */}
            </Grid>
            </MDBox>
        <Footer />
        </DashboardLayout>
    </>
  );
}

export default Circular;
