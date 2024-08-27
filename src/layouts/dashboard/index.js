import { useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useGetDataQuery } from "api/apiSlice";


function Dashboard() {
  // const { sales, tasks } = reportsLineChartData;
  const { data, isLoading, isSuccess, error } = useGetDataQuery()
  

  useEffect(() => {
    if (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }, [error]);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Approved Requests"
                count={data?.totalApprovedRequests}
                percentage={{
                  color: "success",
                  amount: `${data?.approvedRequestsIncrease ?? 0}%`,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Employees"
                count={data?.totalEmployees}
                percentage={{
                  color: "success",
                  amount:`${data?.employeeIncrease ?? 0}%`,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Rejected Requests"
                count={data?.totalRejectedRequests}
                percentage={{
                  color: "success",
                  amount:`${data?.rejectedRequestsIncrease ?? 0}%`,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Circulars"
                count={data?.totalCirculars}
                percentage={{
                  color: "success",
                  amount: `${data?.circularsIncrease ?? 0}%`,
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Coming Soon"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={{
                    labels: ["M", "T", "W", "T", "F", "S", "S"],
                    datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Coming Soon"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={{
                    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: { label: "Mobile apps", data: [50, 40, 300, 320, 500, 350, 200, 230, 500] },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Coming Soon"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={{
                    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: { label: "Desktop apps", data: [50, 40, 300, 220, 500, 250, 400, 230, 500] },
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
