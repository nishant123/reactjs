import React from "react";
import { connect } from "react-redux";
import Spinner from "../components/Spinner";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import ProjectNavbar from "../components/ProjectNavbar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Cart from "../components/Cart/Cart";
// import Settings from "../components/Settings";

const Project = (props) => (
  <React.Fragment>
    <Wrapper>
      <Sidebar />

      <Main>
        <ProjectNavbar {...props} />
        {props.pageloaded ? (
          <>
            <Content>{props.children}</Content>
            <Footer />
          </>
        ) : (
          <Spinner />
        )}
      </Main>
      {props.showCart ? <Cart /> : null}
    </Wrapper>
    {/* <Settings /> */}
  </React.Fragment>
);

const mapStateToProps = (state) => {
  return {
    pageloaded: state.app.pageloaded,
  };
};

export default connect(mapStateToProps)(Project);
