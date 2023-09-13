import React from "react";
import { connect, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Content from "../components/Content";
import Footer from "../components/Footer";
import { clearCurrentProject } from "../redux/actions/currentProjectActions";
// import Settings from "../components/Settings";

const Dashboard = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Wrapper>
        <Sidebar />
        <Main>
          {props.navbar}
            <>
              <Content>{props.children}</Content>
              <Footer />
            </>
        </Main>
      </Wrapper>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    pageloaded: state.app.pageloaded,
  };
};

export default connect(mapStateToProps)(Dashboard);
