import async from "../components/Async";

import { Sliders as SlidersIcon } from "react-feather";
import { clearCurrentProject } from "../redux/actions/currentProjectActions";
import RequestsBoard from "../pages/requestsBoard/RequestsBoard";
import { setRequests } from "../redux/actions/requestsActions";
import {
  getFullMarkets,
  getMarkets,
} from "../redux/actions/marketDefaultsActions";

const SignIn = async(() => import("../pages/auth/SignIn"));
const ProjectDashboard = async(() =>
  import("../pages/dashboard/Projects/Dashboard")
);
const Proposal = async(() => import("../pages/proposal/Proposal"));
const ManageUsers = async(() => import("../pages/manageUsers/ManageUsers"));
const MarketDefaults = async(() =>
  import("../pages/marketDefault/MarketDefault")
);
const DeliveryDashboard = async(() =>
  import("../pages/deliveryDasboard/DeliveryDashboard")
);
const Summary = async(() => import("../pages/summary/Summary"));
const Finance = async(() => import("../pages/finance/Finance"));
const DeliveryReport = async(() =>
  import("../pages/deliveryReport/DeliveryReport")
);

// Routes
// const authRoutes = {
//   path: "/auth",
//   name: "Auth",
//   badgeColor: "primary",
//   icon: SlidersIcon,
//   containsHome: true,
//   component: SignIn,
//   hidden: true,
// };
// const landingRoutes = {
//   path: "/",
//   name: "Dashboard",
//   badgeColor: "primary",
//   icon: SlidersIcon,
//   containsHome: true,
//   component: BigPage,
// };

const proposal = {
  path: "/proposal",
  name: "New Proposal",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: Proposal,
  onRedirection: clearCurrentProject,
  access: "CanCreateNewProposal",
};

const dashboardRoutes = {
  path: "/",
  name: "Dashboard",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: ProjectDashboard,
  access: "InternalDashBoardAccess",
};

const manageUsersRoutes = {
  path: "/users",
  name: "User Management",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: ManageUsers,
  access: "ManageUsersAccess",
};

const marketDefaults = {
  path: "/marketsettings",
  name: "Market Settings",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: MarketDefaults,
  onRedirection: getFullMarkets,
  access: "ManageMarketAccess",
};

const deliveryDashboardRoutes = {
  path: "/deliveries",
  name: "Setup and Delivery",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: DeliveryDashboard,
  access: "DeliveryDashboardAccess",
};

const deliveryReportRoutes = {
  path: "/deliveryReport",
  name: "Delivery Report",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: DeliveryReport,
  access: "DeliveryDashboardAccess",
};
const requestsBoardRoutes = {
  path: "/requests",
  name: "Requests Board",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: RequestsBoard,
  onRedirection: setRequests,
  access: "RequestsBoardAccess",
};

const financeRoutes = {
  path: "/finance",
  name: "Finance Reports",
  badgeColor: "primary",
  icon: SlidersIcon,
  containsHome: true,
  component: Finance,
  access: "FinanceAccess",
};
export const dashboard = [
  dashboardRoutes,
  proposal,
  manageUsersRoutes,
  marketDefaults,
  financeRoutes,
];
export const landing = [];
// export const auth = [authRoutes];

export default [
  proposal,
  dashboardRoutes,
  deliveryDashboardRoutes,
  deliveryReportRoutes,
  requestsBoardRoutes,
  financeRoutes,
  marketDefaults,
  manageUsersRoutes,
];
