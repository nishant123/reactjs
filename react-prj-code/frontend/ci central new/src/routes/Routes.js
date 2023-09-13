import React, { useEffect } from "react";
import
{
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    useLocation,
} from "react-router-dom";
// import {
//   landing as landingRoutes,
//   dashboard as dashboardRoutes,
//   page as pageRoutes
// } from "./index";

import { connect, useSelector } from "react-redux";
import _, { replace } from "lodash";
import * as appActions from "../redux/actions/appActions";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import Spinner from "../components/Spinner";
import ScrollToTop from "../components/ScrollToTop";
import SignIn from "../pages/auth/SignIn";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
// import BigPage from "../pages/BigPage";
import Dashboard from "../pages/dashboard/Projects/Dashboard";
import Proposal from "../pages/proposal/Proposal";
import ProposalNew from "../pages/proposalNew/Proposal";
import TestMapping from "../pages/proposalNew/TestMapping";
import Costing from "../pages/costingProfile/Costing";
import ManageUsers from "../pages/manageUsers/ManageUsers";
import MarketDefaults from "../pages/marketDefault/MarketDefault";
import DeliveryDashboard from "../pages/deliveryDasboard/DeliveryDashboard";
import DeliveryReport from "../pages/deliveryReport/DeliveryReport";
import SurveyInformation from "../pages/deliveryDasboard/SurveyInformation";
import Summary from "../pages/summary/Summary";
import RequestsBoard from "../pages/requestsBoard/RequestsBoard";
import ProjectSchedule from "../pages/projectSchedule/ProjectSchedule";
import Finance from "../pages/finance/Finance";
import OverrideCosts from "../pages/summary/OverrideCosts";
import Page403 from "../pages/auth/Page403";

const AccessLookup = {
    deliveries: "DeliveryDashboardAccess",
    requests: "RequestsBoardAccess",
    finance: "FinanceAccess",
    marketsettings: "ManageMarketAccess",
    users: "ManageUsersAccess",
};

//sets home page in case internal dashboard is not accessible for the loggedin user
//if it's TCS user navigates to delivery dashboard, in case if have access for it
//for non-TCS user, it will navigate to next available route as per priority
const setHomePage = (actualPath, userRecord) =>
{
    let isTCSUser = userRecord.IsTCSUser;

    if (!actualPath && !userRecord.InternalDashBoardAccess)
    {
        if (isTCSUser && userRecord.DeliveryDashboardAccess)
        {
            return (
                <Redirect
                    to={{
                        pathname: "/deliveries",
                    }}
                />
            );
        } else
        {
            let firstRoute = Object.keys(AccessLookup).filter(
                (al) => userRecord[AccessLookup[al]]
            );
            if (firstRoute.length)
                return (
                    <Redirect
                        to={{
                            pathname: `/${_.head(firstRoute)}`,
                        }}
                    />
                );
        }
    }
    return (
        <AuthLayout>
            <Page403 />
        </AuthLayout>
    );
};

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) =>
{
    let location = useLocation();
    const userRecord = useSelector(({ user }) => user.userRecord);
    let actualPath = _.head(location.pathname ?.replace("/", "").split("/"));

    return (
        <Route
            {...rest}
            render={(props) =>
            {
                return isAuthenticated === true ? (
                    (!actualPath && userRecord.InternalDashBoardAccess) ||
                        (actualPath &&
                            AccessLookup[actualPath] &&
                            userRecord[AccessLookup[actualPath]]) ||
                        (actualPath && !AccessLookup[actualPath]) ? (
                            <Component {...props} />
                        ) : (
                            setHomePage(actualPath, userRecord)
                        )
                ) : (
                        <Redirect
                            to={{
                                pathname: "/auth/login",
                                state: { from: location },
                            }}
                        />
                    );
            }}
        />
    );
};

// const layoutWrapper = (Layout, routes, isAuthenticated) => {
//   return routes.map(({ path, component: Component }, index) => {
//     console.log("component", Component);
//     return (
//       <PrivateRoute
//         key={index}
//         path={path}
//         isAuthenticated={isAuthenticated}
//         exact
//         component={
//           <Layout>
//             <Component />
//           </Layout>
//         }
//       />
//     );
//   });
// };

const Routes = (props) =>
{
    useEffect(() =>
    {
        props.init();
    }, []);

    return (
        <>
            {props.apploaded ? (
                <Router>
                    <ScrollToTop>
                        <Switch>
                            <PrivateRoute
                                path="/"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={Dashboard}
                            />
                            <PrivateRoute
                                path="/proposal"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={Proposal}
                            />
                            <PrivateRoute
                                path="/proposal-new"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={ProposalNew}
                            />
                            <PrivateRoute
                                path="/rfq-mapping"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={TestMapping}
                            />
                            <PrivateRoute
                                path="/costing"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={Costing}
                            />
                            <PrivateRoute
                                path="/users"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={ManageUsers}
                            />
                            <PrivateRoute
                                path="/marketsettings"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={MarketDefaults}
                            />
                            <PrivateRoute
                                path="/deliveries"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={DeliveryDashboard}
                            />
                            <PrivateRoute
                                path="/deliveryReport"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={DeliveryReport}
                            />
                            <PrivateRoute
                                path="/finance"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={Finance}
                            />
                            <PrivateRoute
                                path="/summary/:profileId"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={Summary}
                            />
                            <PrivateRoute
                                path="/overridecosts"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={OverrideCosts}
                            />
                            <PrivateRoute
                                path="/schedule"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={ProjectSchedule}
                            />
                            {/* <PrivateRoute
                path="/survey"
                isAuthenticated={props.isAuthenticated}
                exact
                component={SurveyInformation}
              />
            /> */}
                            <PrivateRoute
                                path="/requests/:requestId?"
                                isAuthenticated={props.isAuthenticated}
                                exact
                                component={RequestsBoard}
                            />
                            {/* <Route
                path="/requests/:requestId?"
                isAuthenticated={props.isAuthenticated}
                exact
                component={RequestsBoard}
              /> */}

                            <Route path="/auth/login" exact component={SignIn} />
                            <Route path="/auth/register" exact component={Register} />
                            <Route
                                path="/auth/forgot-password"
                                exact
                                component={ForgotPassword}
                            />
                            <Route
                                path="/auth/reset-password"
                                exact
                                component={ResetPassword}
                            />
                            <Route path="unauthorised" exact component={Page403} />
                            <Route
                                render={() => (
                                    <AuthLayout>
                                        <Page404 />
                                    </AuthLayout>
                                )}
                            />
                        </Switch>
                    </ScrollToTop>
                </Router>
            ) : (
                    <Spinner />
                )}
        </>
    );
};

const mapStateToProps = (state) =>
{
    return {
        isAuthenticated:
            state.user.authToken !== null &&
            state.user.authToken !== "undefined" &&
            state.user.authToken !== "",
        apploaded: state.app.apploaded,
    };
};

const mapDispatchToProps = (dispatch) =>
{
    return {
        init: () => dispatch(appActions.init()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Routes);
