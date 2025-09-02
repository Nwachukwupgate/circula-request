

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import { useGetProfileQuery } from "api/apiSlice";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

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

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Overview() {
  const {data, isLoading } = useGetProfileQuery()

  if (isLoading) {
      return (
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile data...</p>
          </div>
        </div>
      );
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header data={data}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="profile information"
                description={
                  data?.role?.name === 'md'
                    ? `Hi, I’m ${data?.surname} ${data?.firstName}, the Managing Director of Internalops Pro. As the MD, I oversee all operations within the company, ensuring strategic alignment and efficient management of resources to meet our long-term goals.`
                    : data?.role?.name === 'coo'
                    ? `Hi, I’m ${data?.surname} ${data?.firstName}, the Chief Operating Officer at Internalops Pro. I focus on optimizing our day-to-day operations and ensuring that all our departments are running efficiently to support the company's objectives.`
                    : data?.role?.name === 'cto'
                    ? `Hi, I’m ${data?.surname} ${data?.firstName}, the Chief Technology Officer at Internalops Pro. I am responsible for the company's technological direction, ensuring we leverage cutting-edge technology to enhance our services and operations.`
                    : data?.role?.name === 'ict'
                    ? `Hi, I’m ${data?.surname} ${data?.firstName}, part of the ICT team at Internalops Pro. My role involves managing and supporting the company's IT infrastructure, ensuring seamless communication and secure data management across the organization.`
                    : `Hi, I’m ${data?.surname} ${data?.firstName}, a dedicated staff member at Internalops Pro, working to contribute to the success and smooth operation of our company every day.`
                }
                info={{
                  fullName: `${data?.surname} ${data?.firstName}`,
                  country: "NGA",
                  email: data?.email,
                  location: "Lagos",
                }}
                social={[
                  {
                    link: "https://www.facebook.com/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid>
          </Grid>
        </MDBox>

      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
