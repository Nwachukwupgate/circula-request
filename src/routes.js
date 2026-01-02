import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import Circular from "layouts/circular";
import Profile from "layouts/profile";
import Employee from "layouts/employee"
import PerformanceHubPage from "layouts/kpi";
import PerformanceDashboard from "layouts/kpi/pages/TeamDashboard";
import GrowthLibrary from "layouts/kpi/pages/GrowthLibrary";
import HelpCenter from "layouts/help-center";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  //   protected: true,
  // },
  {
    type: "collapse",
    name: "Request",
    key: "request",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/request",
    component: <Billing />,
    protected: true,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  //   protected: true,
  // },
  {
    type: "collapse",
    name: "Circular",
    key: "circular",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/notifications",
    component: <Circular />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Create",
    key: "create",
    icon: <Icon fontSize="small">create</Icon>,
    route: "/create",
    component: <Employee />,
    protected: true,
  },
  {
    type: "collapse",
    name: "KPI",
    key: "kpi",
    icon: <Icon fontSize="small">assessment</Icon>,
    route: "/kpi",
    component: <PerformanceHubPage />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Team KPI",
    key: "team",
    icon: <Icon fontSize="small">workspaces</Icon>,
    route: "/team",
    component: <PerformanceDashboard />,
    protected: true,
  },
  {
    type: "collapse",
    name: "My Resources",
    key: "resources",
    icon: <Icon fontSize="small">bookmark</Icon>,
    route: "/resources",
    component: <GrowthLibrary />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Help Center",
    key: "help",
    icon: <Icon fontSize="small">help_outline</Icon>,
    route: "/help-center",
    component: <HelpCenter />,
    protected: true,
  },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

export default routes;
