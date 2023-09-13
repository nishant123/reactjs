import React, { useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";

import {
	Button,
	Card,
	CardText,
	CardImg,
	CardBody,
	CardTitle,
	Form,
	FormGroup,
	Label,
	Input,
	Row,
	Col,
} from "reactstrap";

import banner from "../../assets/img/avatars/nielsen-logo-header-3x1.png";

import * as userActions from "../../redux/actions/userActions";
import { connect } from "react-redux";

import AuthLayout from "../../layouts/Auth";

const SignIn = (props) => {
	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

	let location = useLocation();

	const onSubmitHandler = (e) => {
		e.preventDefault();
		let data = loginData;
		data.email = data.email.trim().toLowerCase();
		props.onAuth(data, props.isLogIn);
	};

	const onLoginChange = (field, value) => {
		setLoginData((prevState) => {
			return {
				...prevState,
				[field]: value,
			};
		});
	};

	let errorMessage = null;
	if (props.error) {
		errorMessage = props.error;
	}

	let authRedirect = null;
	let { from } = location.state || { from: { pathname: "/" } };

	if (props.isAuthenticated) {
		authRedirect = <Redirect to={from} />;
	}

	const loginpage = () => {
		return (
			<AuthLayout>
				{authRedirect}
				<Card>
					<CardImg
						variant="top"
						src={banner}
						className="mx-auto img-responsive"
					/>
					<CardBody>
						<CardTitle className="text-center mt-4">
							<h1 className="h3">Welcome to NielsenIQ CI Central v2</h1>
						</CardTitle>

						<div className="m-sm-4">
							<CardText>
								<p>
									Please note your CI Central account is{" "}
									<b>
										<em>not linked</em>
									</b>{" "}
									to your NielsenIQ Google account at the moment. Single sign-on
									capabilities will be added in near future. Meanwhile, please
									follow the instructions below:
								</p>
								<p>
									<em>
										First time CI Central users who did not have access to v1
										will need to{" "}
										<Link to="/auth/register">request a new account</Link>.
									</em>
								</p>{" "}
								<p>
									<em>
										If you already had access to CI Central v1, then you are
										required to reset your password instead before logging in
										for the first time in v2.
									</em>
								</p>
							</CardText>
							<Form autoComplete="off" onSubmit={(e) => onSubmitHandler(e)}>
								<FormGroup>
									<Label>Email</Label>
									<Input
										id="LoginEmail"
										type="email"
										name="email"
										placeholder="Enter your NielsenIQ email..."
										value={loginData.email}
										onChange={(e) => onLoginChange("email", e.target.value)}
									/>
								</FormGroup>
								<FormGroup>
									<Label>Password</Label>
									<Input
										id="LoginPassword"
										autoComplete="off"
										type="password"
										name="password"
										placeholder="Enter your password..."
										value={loginData.password}
										onChange={(e) => onLoginChange("password", e.target.value)}
									/>
								</FormGroup>

								<Row>
									<Col>
										<Row>
											<Col>
												<Link to="/auth/register">Request Account</Link>
											</Col>
										</Row>
										<Row>
											<Col>
												<Link to="/auth/forgot-password">Reset Password</Link>
											</Col>
										</Row>
									</Col>
									<Col>
										<Button
											style={{ float: "right" }}
											color="primary"
											size="lg"
										>
											Login
										</Button>
									</Col>
								</Row>
							</Form>
						</div>
					</CardBody>
				</Card>
			</AuthLayout>
		);
	};

	if (props.loading) {
		return (
			<AuthLayout>
				<Spinner />
			</AuthLayout>
		);
	} else {
		return loginpage();
	}
};

const mapStateToProps = (state) => {
	return {
		isLogIn: state.user.isLogIn,
		loading: state.user.loading,
		error: state.user.error,
		isAuthenticated: state.user.authToken !== null,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isLogIn) =>
			dispatch(userActions.auth(email, password, isLogIn)),
		toggleLogIn: () => dispatch({ type: userActions.TOGGLE_LOGIN }),
		updateAuth: (field, value) =>
			dispatch({ type: userActions.UPDATE_AUTH, field: field, value: value }),
		onRegister: (registerData) => {
			dispatch(userActions.register(registerData));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
