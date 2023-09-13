import React from "react";
import { useSelector } from "react-redux";

import Spinner from "../components/Spinner";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Content from "../components/Content";
import Footer from "../components/Footer";

// import Settings from "../components/Settings";

const Dashboard = ({ navbar, button, children }) => {
  const pageloaded = useSelector(({ app }) => app.pageloaded);
  return (
    <React.Fragment>
      <Wrapper>
        <Sidebar />
        <Main>
          {navbar}
          {pageloaded ? (
            <>
              <Content>{children}</Content>
              <Footer />
            </>
          ) : (
            <Spinner />
          )}
        </Main>
      </Wrapper>
      {/* <Settings /> */}
      {button ?? null}
    </React.Fragment>
  );
};

export default Dashboard;
