import React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

import Spinner from "../components/Spinner";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Content from "../components/Content";
import Footer from "../components/Footer";
// import Settings from "../components/Settings";

const DeliveryDashboard = (props) => {
    const history = useHistory();
    return (
        <React.Fragment>
            <Wrapper>
                <Sidebar />
                <Main>
                    {props.navbar}
                    {props.pageloaded ? (
                        <>
                            <Content>{props.children}</Content>
                            <Footer />
                        </>
                    ) : (
                            <Spinner />
                        )}
                </Main>
            </Wrapper>
            {/* <Settings /> */}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        pageloaded: state.app.pageloaded,
    };
};

export default connect(mapStateToProps)(DeliveryDashboard);
