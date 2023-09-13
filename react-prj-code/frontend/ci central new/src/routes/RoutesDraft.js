import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// import {
//   landing as landingRoutes,
//   dashboard as dashboardRoutes,
//   page as pageRoutes
// } from "./index";

import {
  dashboard as dashboardRoutes,
  landing as landingRoutes,
  auth as authRoutes,
} from "./index";

import { connect } from "react-redux";

import DashboardLayout from "../layouts/Dashboard";
import LandingLayout from "../layouts/Landing";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";

import ScrollToTop from "../components/ScrollToTop";

function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated === true ? (
          // <Component {...props} />
          { Component }
        ) : (
          <Redirect
            to={{ pathname: "/auth", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

const childRoutes = (appProps, Layout, routes) => {
  return routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => (
        <PrivateRoute
          key={index}
          path={path}
          exact
          isAuthenticated={appProps.isAuthenticated}
          component={
            <Layout>
              <Component />
            </Layout>
          }
        />
      ))
    ) : (
      // Route item without children
      <PrivateRoute
        key={index}
        path={path}
        exact
        isAuthenticated={appProps.isAuthenticated}
        component={
          <Layout>
            <Component />
          </Layout>
        }
      />
    )
  );
};

const Routes = (props) => (
  <Router>
    <ScrollToTop>
      <Switch>
        {childRoutes(props, AuthLayout, authRoutes)}
        {childRoutes(props, LandingLayout, landingRoutes)}
        {childRoutes(props, DashboardLayout, dashboardRoutes)}
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
);

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.user.authToken !== null,
  };
};

export default connect(mapStateToProps)(Routes);
