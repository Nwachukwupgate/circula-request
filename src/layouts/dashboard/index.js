import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useNavigate } from "react-router-dom";
import { 
  useGetDataQuery, 
  useGetProfileQuery, 
  useGetRequestQuery,
  useGetMyCircularQuery,
  useGetNotificationsQuery,
  useGetMyKpisQuery
} from "api/apiSlice";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Bell, 
  Clock,
  Target,
  BookOpen,
  PlusCircle,
  ArrowRight,
  Award
} from "lucide-react";
import moment from "moment";
import OnboardingWizard, { useOnboarding } from "components/Onboarding/OnboardingWizard";

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, onClick, color = "info" }) => (
  <Card 
    sx={{ 
      cursor: 'pointer', 
      transition: 'all 0.3s ease',
      '&:hover': { 
        transform: 'translateY(-4px)', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
      }
    }}
    onClick={onClick}
  >
    <MDBox p={2} display="flex" alignItems="center">
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3rem"
        height="3rem"
        borderRadius="lg"
        bgColor={color}
        color="white"
        mr={2}
      >
        {icon}
      </MDBox>
      <MDBox>
        <MDTypography variant="button" fontWeight="medium" color="text">
          {title}
        </MDTypography>
        <MDTypography variant="caption" color="text" display="block">
          {description}
        </MDTypography>
      </MDBox>
    </MDBox>
  </Card>
);

// Activity Item Component
const ActivityItem = ({ icon, title, description, time, color = "info" }) => (
  <MDBox display="flex" alignItems="flex-start" py={1.5}>
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="2.5rem"
      height="2.5rem"
      borderRadius="lg"
      bgColor={color}
      color="white"
      mr={2}
      flexShrink={0}
    >
      {icon}
    </MDBox>
    <MDBox flex={1}>
      <MDTypography variant="button" fontWeight="medium" color="text">
        {title}
      </MDTypography>
      <MDTypography variant="caption" color="text" display="block">
        {description}
      </MDTypography>
      <MDTypography variant="caption" color="secondary" display="block" mt={0.5}>
        {time}
      </MDTypography>
    </MDBox>
  </MDBox>
);

// Request Item Component
const RequestItem = ({ request, onClick }) => {
  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  };
  
  return (
    <MDBox 
      display="flex" 
      alignItems="center" 
      py={1.5}
      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' }, borderRadius: 1, px: 1 }}
      onClick={onClick}
    >
      <MDBox flex={1}>
        <MDTypography variant="button" fontWeight="medium" color="text">
          {request?.requestTitle || request?.itemName || 'Request'}
        </MDTypography>
        <MDTypography variant="caption" color="text" display="block">
          {moment(request?.createdAt).fromNow()}
        </MDTypography>
      </MDBox>
      <MDBadge 
        badgeContent={request?.finalStatus || 'pending'} 
        color={statusColors[request?.finalStatus] || 'warning'} 
        variant="gradient" 
        size="sm" 
      />
    </MDBox>
  );
};

// Circular Item Component
const CircularItem = ({ circular, onClick }) => (
  <MDBox 
    display="flex" 
    alignItems="center" 
    py={1.5}
    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' }, borderRadius: 1, px: 1 }}
    onClick={onClick}
  >
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="2.5rem"
      height="2.5rem"
      borderRadius="lg"
      bgColor="info"
      color="white"
      mr={2}
      flexShrink={0}
    >
      <FileText size={16} />
    </MDBox>
    <MDBox flex={1}>
      <MDTypography variant="button" fontWeight="medium" color="text" sx={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        maxWidth: '200px',
        display: 'block'
      }}>
        {circular?.title}
      </MDTypography>
      <MDTypography variant="caption" color="text" display="block">
        {moment(circular?.createdAt).fromNow()}
      </MDTypography>
    </MDBox>
  </MDBox>
);

// KPI Summary Card
const KPISummaryCard = ({ kpis }) => {
  if (!kpis || kpis.length === 0) return null;
  
  const activeKpis = kpis.filter(k => k.status === 'in_progress' || k.status === 'pending');
  const completedKpis = kpis.filter(k => k.status === 'completed');
  const avgProgress = kpis.length > 0 
    ? Math.round(kpis.reduce((sum, k) => sum + (k.progress || 0), 0) / kpis.length)
    : 0;

  return (
    <Card sx={{ height: '100%' }}>
      <MDBox p={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            KPI Overview
          </MDTypography>
          <Target size={20} color="#1976d2" />
        </MDBox>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <MDBox textAlign="center" p={1} bgcolor="info.main" borderRadius="lg" color="white">
              <MDTypography variant="h4" color="white" fontWeight="bold">
                {activeKpis.length}
              </MDTypography>
              <MDTypography variant="caption" color="white">
                Active
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={4}>
            <MDBox textAlign="center" p={1} bgcolor="success.main" borderRadius="lg" color="white">
              <MDTypography variant="h4" color="white" fontWeight="bold">
                {completedKpis.length}
              </MDTypography>
              <MDTypography variant="caption" color="white">
                Completed
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={4}>
            <MDBox textAlign="center" p={1} bgcolor="warning.main" borderRadius="lg" color="white">
              <MDTypography variant="h4" color="white" fontWeight="bold">
                {avgProgress}%
              </MDTypography>
              <MDTypography variant="caption" color="white">
                Avg Progress
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: statsData, isLoading: statsLoading, error } = useGetDataQuery();
  const { data: requestsData } = useGetRequestQuery();
  const { data: circularsData } = useGetMyCircularQuery();
  const { data: notificationsData } = useGetNotificationsQuery({ limit: 5 });
  const { data: kpisData } = useGetMyKpisQuery();
  
  // Onboarding wizard state
  const { showOnboarding, setShowOnboarding } = useOnboarding();

  const requests = requestsData?.requests || requestsData || [];
  const circulars = Array.isArray(circularsData) ? circularsData : circularsData?.circulars || [];
  const notifications = notificationsData?.notifications || [];
  const kpis = kpisData?.kpis || kpisData || [];

  // Calculate request statistics
  const pendingRequests = Array.isArray(requests) 
    ? requests.filter(r => r.finalStatus === 'pending').length 
    : 0;

  // Calculate weekly request data for chart
  const getWeeklyRequestData = () => {
    const today = new Date();
    const weekData = [0, 0, 0, 0, 0, 0, 0];
    
    if (Array.isArray(requests)) {
      requests.forEach(request => {
        const requestDate = new Date(request.createdAt);
        const daysDiff = Math.floor((today - requestDate) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
          const dayIndex = requestDate.getDay();
          weekData[dayIndex]++;
        }
      });
    }
    
    // Reorder to start from Monday
    const reordered = [...weekData.slice(1), weekData[0]];
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: reordered
    };
  };

  // Calculate monthly approval data for chart
  const getMonthlyApprovalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyData = {};
    
    // Initialize last 6 months
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(months[monthIndex]);
      monthlyData[months[monthIndex]] = 0;
    }
    
    if (Array.isArray(requests)) {
      requests.forEach(request => {
        if (request.finalStatus === 'approved') {
          const requestDate = new Date(request.createdAt);
          const monthName = months[requestDate.getMonth()];
          if (monthlyData.hasOwnProperty(monthName)) {
            monthlyData[monthName]++;
          }
        }
      });
    }
    
    return {
      labels,
      data: labels.map(label => monthlyData[label] || 0)
    };
  };

  // Calculate request status distribution
  const getRequestStatusData = () => {
    if (!Array.isArray(requests) || requests.length === 0) {
      return { approved: 0, rejected: 0, pending: 0 };
    }
    
    return {
      approved: requests.filter(r => r.finalStatus === 'approved').length,
      rejected: requests.filter(r => r.finalStatus === 'rejected').length,
      pending: requests.filter(r => r.finalStatus === 'pending').length
    };
  };

  const weeklyData = getWeeklyRequestData();
  const monthlyApprovalData = getMonthlyApprovalData();
  const statusData = getRequestStatusData();

  useEffect(() => {
    if (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }, [error]);

  if (statsLoading && profileLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      {/* Onboarding Wizard for new users */}
      <OnboardingWizard 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        userName={profile?.firstName || 'User'}
      />
      
      <MDBox py={3}>
        {/* Welcome Section */}
        <MDBox mb={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <MDBox p={3}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={8}>
                  <MDTypography variant="h4" color="white" fontWeight="bold">
                    {getGreeting()}, {profile?.firstName || 'User'}! 👋
                  </MDTypography>
                  <MDTypography variant="body2" color="white" opacity={0.9} mt={1}>
                    Welcome back to your dashboard. Here's what's happening today.
                  </MDTypography>
                  <MDBox mt={2} display="flex" gap={1} flexWrap="wrap">
                    <MDButton 
                      variant="contained" 
                      color="white" 
                      size="small"
                      onClick={() => navigate('/request')}
                    >
                      <PlusCircle size={16} style={{ marginRight: 8 }} />
                      New Request
                    </MDButton>
                    <MDButton 
                      variant="outlined" 
                      color="white" 
                      size="small"
                      onClick={() => navigate('/kpi')}
                    >
                      <Target size={16} style={{ marginRight: 8 }} />
                      View KPIs
                    </MDButton>
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={4}>
                  <MDBox textAlign="right" display={{ xs: 'none', md: 'block' }}>
                    <MDTypography variant="h6" color="white" opacity={0.8}>
                      {moment().format('dddd, MMMM D, YYYY')}
                    </MDTypography>
                    <MDTypography variant="body2" color="white" opacity={0.7}>
                      {profile?.department?.name || 'Department'} • {profile?.role?.name || 'Role'}
                    </MDTypography>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </MDBox>

        {/* Statistics Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="check_circle"
                title="Approved Requests"
                count={statsData?.totalApprovedRequests || 0}
                percentage={{
                  color: statsData?.approvedRequestsIncrease >= 0 ? "success" : "error",
                  amount: `${Math.abs(statsData?.approvedRequestsIncrease ?? 0).toFixed(1)}%`,
                  label: statsData?.approvedRequestsIncrease >= 0 ? "increase" : "decrease",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="people"
                title="Total Employees"
                count={statsData?.totalEmployees || 0}
                percentage={{
                  color: "success",
                  amount: `${statsData?.employeeIncrease ?? 0}%`,
                  label: "growth",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="cancel"
                title="Outstanding Requests"
                count={statsData?.totalRejectedRequests || 0}
                percentage={{
                  color: statsData?.rejectedRequestsIncrease <= 0 ? "success" : "warning",
                  amount: `${Math.abs(statsData?.rejectedRequestsIncrease ?? 0).toFixed(1)}%`,
                  label: statsData?.rejectedRequestsIncrease <= 0 ? "decrease" : "increase",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="article"
                title="Total Circulars"
                count={statsData?.totalCirculars || 0}
                percentage={{
                  color: "success",
                  amount: `${statsData?.circularsIncrease ?? 0}%`,
                  label: "this month",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <MDBox mt={3} mb={4}>
          <MDTypography variant="h6" fontWeight="medium" mb={2}>
            Quick Actions
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <QuickActionCard 
                icon={<PlusCircle size={20} />}
                title="New Request"
                description="Submit a request"
                onClick={() => navigate('/request')}
                color="info"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <QuickActionCard 
                icon={<FileText size={20} />}
                title="View Circulars"
                description="Read latest circulars"
                onClick={() => navigate('/circulars')}
                color="success"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <QuickActionCard 
                icon={<Target size={20} />}
                title="My KPIs"
                description="Track your progress"
                onClick={() => navigate('/kpi')}
                color="warning"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <QuickActionCard 
                icon={<BookOpen size={20} />}
                title="Growth Library"
                description="Learning resources"
                onClick={() => navigate('/resources')}
                color="primary"
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Main Content Area */}
        <Grid container spacing={3}>
          {/* Recent Requests */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%' }}>
              <MDBox p={2}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Recent Requests
                  </MDTypography>
                  <MDBox display="flex" alignItems="center">
                    {pendingRequests > 0 && (
                      <MDBadge badgeContent={`${pendingRequests} pending`} color="warning" size="sm" />
                    )}
                  </MDBox>
                </MDBox>
                <Divider />
                <MDBox mt={2}>
                  {Array.isArray(requests) && requests.length > 0 ? (
                    requests.slice(0, 5).map((request, index) => (
                      <RequestItem 
                        key={request.id || index} 
                        request={request}
                        onClick={() => navigate(`/requests/details/${request.id}`)}
                      />
                    ))
                  ) : (
                    <MDBox textAlign="center" py={3}>
                      <Clock size={40} color="#9e9e9e" />
                      <MDTypography variant="body2" color="text" mt={1}>
                        No recent requests
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
                {Array.isArray(requests) && requests.length > 0 && (
                  <MDBox mt={2} textAlign="center">
                    <MDButton 
                      variant="text" 
                      color="info" 
                      size="small"
                      onClick={() => navigate('/request')}
                    >
                      View All Requests <ArrowRight size={16} style={{ marginLeft: 4 }} />
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>

          {/* Recent Circulars */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%' }}>
              <MDBox p={2}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Recent Circulars
                  </MDTypography>
                  <FileText size={20} color="#1976d2" />
                </MDBox>
                <Divider />
                <MDBox mt={2}>
                  {circulars.length > 0 ? (
                    circulars.slice(0, 5).map((circular, index) => (
                      <CircularItem 
                        key={circular.id || index} 
                        circular={circular}
                        onClick={() => navigate(`/circulars/${circular.id}`)}
                      />
                    ))
                  ) : (
                    <MDBox textAlign="center" py={3}>
                      <FileText size={40} color="#9e9e9e" />
                      <MDTypography variant="body2" color="text" mt={1}>
                        No circulars available
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
                {circulars.length > 0 && (
                  <MDBox mt={2} textAlign="center">
                    <MDButton 
                      variant="text" 
                      color="info" 
                      size="small"
                      onClick={() => navigate('/circulars')}
                    >
                      View All Circulars <ArrowRight size={16} style={{ marginLeft: 4 }} />
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>

          {/* Recent Activity / Notifications */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%' }}>
              <MDBox p={2}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Recent Activity
                  </MDTypography>
                  <Bell size={20} color="#1976d2" />
                </MDBox>
                <Divider />
                <MDBox mt={2}>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification, index) => {
                      const iconMap = {
                        'request_approved': <CheckCircle size={16} />,
                        'request_rejected': <XCircle size={16} />,
                        'circular_published': <FileText size={16} />,
                        'kpi_assigned': <Target size={16} />,
                        'kpi_feedback_received': <Award size={16} />,
                      };
                      const colorMap = {
                        'request_approved': 'success',
                        'request_rejected': 'error',
                        'circular_published': 'info',
                        'kpi_assigned': 'warning',
                        'kpi_feedback_received': 'primary',
                      };
                      return (
                        <ActivityItem
                          key={notification.id || index}
                          icon={iconMap[notification.type] || <Bell size={16} />}
                          title={notification.title}
                          description={notification.message?.substring(0, 50) + '...'}
                          time={moment(notification.createdAt).fromNow()}
                          color={colorMap[notification.type] || 'info'}
                        />
                      );
                    })
                  ) : (
                    <MDBox textAlign="center" py={3}>
                      <Bell size={40} color="#9e9e9e" />
                      <MDTypography variant="body2" color="text" mt={1}>
                        No recent activity
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
                {notifications.length > 0 && (
                  <MDBox mt={2} textAlign="center">
                    <MDButton 
                      variant="text" 
                      color="info" 
                      size="small"
                      onClick={() => navigate('/notification')}
                    >
                      View All Activity <ArrowRight size={16} style={{ marginLeft: 4 }} />
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* KPI Section (if user has KPIs) */}
        {Array.isArray(kpis) && kpis.length > 0 && (
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <KPISummaryCard kpis={kpis} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Card>
                  <MDBox p={2}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <MDTypography variant="h6" fontWeight="medium">
                        Active KPIs
                      </MDTypography>
                      <MDButton 
                        variant="text" 
                        color="info" 
                        size="small"
                        onClick={() => navigate('/kpi/my-kpis')}
                      >
                        View All
                      </MDButton>
                    </MDBox>
                    <Divider />
                    <MDBox mt={2}>
                      {kpis.slice(0, 3).map((kpi, index) => (
                        <MDBox 
                          key={kpi.id || index} 
                          display="flex" 
                          alignItems="center" 
                          py={1.5}
                          sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' }, borderRadius: 1, px: 1 }}
                          onClick={() => navigate(`/kpi/details/${kpi.id}`)}
                        >
                          <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="2.5rem"
                            height="2.5rem"
                            borderRadius="lg"
                            bgColor="warning"
                            color="white"
                            mr={2}
                          >
                            <Target size={16} />
                          </MDBox>
                          <MDBox flex={1}>
                            <MDTypography variant="button" fontWeight="medium" color="text">
                              {kpi.KPITemplate?.title || kpi.title || 'KPI'}
                            </MDTypography>
                            <MDTypography variant="caption" color="text" display="block">
                              Due: {moment(kpi.dueDate).format('MMM D, YYYY')}
                            </MDTypography>
                          </MDBox>
                          <MDBox width="80px">
                            <MDBox 
                              sx={{ 
                                height: 6, 
                                borderRadius: 3, 
                                bgcolor: 'grey.200',
                                overflow: 'hidden'
                              }}
                            >
                              <MDBox 
                                sx={{ 
                                  height: '100%', 
                                  width: `${Math.min(kpi.progress || 0, 100)}%`,
                                  bgcolor: kpi.progress >= 100 ? 'success.main' : 'info.main',
                                  borderRadius: 3
                                }}
                              />
                            </MDBox>
                            <MDTypography variant="caption" color="text" textAlign="center" display="block">
                              {Math.round(kpi.progress || 0)}%
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ))}
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        )}

        {/* Charts Section */}
        <MDBox mt={4}>
          <MDTypography variant="h6" fontWeight="medium" mb={4}>
            Analytics Overview
          </MDTypography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Weekly Requests"
                  description={`${weeklyData.data.reduce((a, b) => a + b, 0)} requests this week`}
                  date="updated just now"
                  chart={{
                    labels: weeklyData.labels,
                    datasets: { label: "Requests", data: weeklyData.data },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Monthly Approvals"
                  description={
                    <>
                      <strong>{statusData.approved}</strong> approved total
                    </>
                  }
                  date="last 6 months"
                  chart={{
                    labels: monthlyApprovalData.labels,
                    datasets: { label: "Approved", data: monthlyApprovalData.data },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="dark"
                  title="Request Status"
                  description={`${Array.isArray(requests) ? requests.length : 0} total requests`}
                  date="all time"
                  chart={{
                    labels: ["Approved", "Pending", "Rejected"],
                    datasets: { 
                      label: "Requests", 
                      data: [statusData.approved, statusData.pending, statusData.rejected] 
                    },
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
