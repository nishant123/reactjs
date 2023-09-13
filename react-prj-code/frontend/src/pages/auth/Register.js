import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
	Tooltip,
} from "reactstrap";

import banner from "../../assets/img/avatars/nielsen-logo-header-3x1.png";

import * as userActions from "../../redux/actions/userActions";
import { connect } from "react-redux";

import AuthLayout from "../../layouts/Auth";

const Register = (props) => {
	const [registerData, setRegisterData] = useState({
		FirstName: "",
		LastName: "",
		Email: "",
		Password: "",
		ConfirmPassword: "",
		Comments: "",
	});
	const [validData, setValidData] = useState({
		Valid: false,
		Errors: [],
	});

	const onRegisterSubmitHandler = (e) => {
		e.preventDefault();
		let data = registerData;
		data.Email = data.Email.trim().toLowerCase();
		props.onRegister(data);
	};

	const onRegisterChange = (obj) => {
		setRegisterData((prevState) => {
			return {
				...prevState,
				...obj,
			};
		});
	};

	const [tooltipOpen, setTooltipOpen] = useState(false);

	const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

	useEffect(() => {
		validatePassword();
		//console.log("registerData", registerData);
	}, [registerData.Password, registerData.ConfirmPassword]);

	const validatePassword = () => {
		if (registerData.Password !== "") {
			let errors = [];
			let valid = true;

			// confirm password check
			if (registerData.Password !== registerData.ConfirmPassword) {
				errors.push("Passwords do not match.");
				valid = false;
			}
			if (registerData.Password.length < 8) {
				errors.push("Password is too short.");
				valid = false;
			}
			var re = {
				digit: /[0-9]/,
				alpha: /[A-Za-z]/,
				symbol: /[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/,
			};

			if (
				!(
					re.digit.test(registerData.Password) &&
					re.alpha.test(registerData.Password) &&
					re.symbol.test(registerData.Password)
				)
			) {
				errors.push("Password does not satisfy character criteria.");
				valid = false;
			}

			setValidData({ Valid: valid, Errors: errors });
		}
	};

	if (!props.pageloaded) {
		return (
			<AuthLayout>
				<Spinner />
			</AuthLayout>
		);
	}
	return (
		<AuthLayout>
			<Card>
				<CardImg
					variant="top"
					src={banner}
					className="mx-auto img-responsive"
				/>
				<CardBody>
					<CardTitle className="text-center mt-4">
						<h1 className="h3">CI Central v2 Account Registration</h1>
					</CardTitle>
					<div className="m-sm-4">
						<CardText>
							Please provide your details below and tell us about your access
							needs.
							<br />
							An admin will review your request and notify you once your account
							is activated.
						</CardText>
						<Form
							autoComplete="off"
							onSubmit={(e) => onRegisterSubmitHandler(e)}
						>
							<Row>
								<Col>
									<FormGroup>
										<Label>First Name*</Label>
										<Input
											id="RegisterFirstName"
											type="text"
											name="FirstName"
											required
											value={registerData.FirstName}
											onChange={(e) =>
												onRegisterChange({ FirstName: e.target.value })
											}
										/>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label>Last Name*</Label>
										<Input
											id="RegisterLastName"
											type="text"
											name="LastName"
											required
											value={registerData.LastName}
											onChange={(e) =>
												onRegisterChange({ LastName: e.target.value })
											}
										/>
									</FormGroup>
								</Col>
							</Row>
							<FormGroup>
								<Label>Email*</Label>
								<Input
									id="RegisterEmail"
									type="email"
									name="email"
									required
									placeholder="Enter your email"
									value={registerData.Email}
									onChange={(e) => onRegisterChange({ Email: e.target.value })}
								/>
							</FormGroup>
							<Row>
								<Col>
									<FormGroup>
										<Label>Password*</Label>
										<Input
											id="RegisterPassword"
											type="password"
											name="password"
											required
											autoComplete="off"
											placeholder="Enter a complex password"
											value={registerData.Password}
											onChange={(e) => {
												onRegisterChange({ Password: e.target.value });
											}}
										/>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label>Confirm Password*</Label>
										<Input
											id="RegisterConfirmPassword"
											type="password"
											name="password"
											required
											autoComplete="off"
											placeholder="Repeat your password"
											value={registerData.ConfirmPassword}
											onChange={(e) => {
												onRegisterChange({ ConfirmPassword: e.target.value });
											}}
										/>
									</FormGroup>
								</Col>
							</Row>
							<FormGroup>
								<Label>Comments</Label>
								<Input
									type="textarea"
									name="RegisterComments"
									id="RegisterComments"
									placeholder="Tell us about your role and access needs..."
									value={registerData.Comments}
									onChange={(e) => {
										onRegisterChange({ Comments: e.target.value });
									}}
								/>
							</FormGroup>
							{validData.Errors.map((err) => {
								return (
									<h5 key={err} style={{ color: "red" }}>
										{err}
									</h5>
								);
							})}
							<Row>
								<Col>
									<Link to="/auth/login">Back to Login</Link>
								</Col>
								<Col>
									<Button
										style={{ float: "right" }}
										disabled={!validData.Valid}
										color="primary"
										size="lg"
									>
										Request Account
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
				</CardBody>
			</Card>
			<Tooltip
				placement="top"
				isOpen={tooltipOpen}
				target="RegisterPassword"
				toggle={toggleTooltip}
			>
				Must be at least 8 alphanumeric characters long, including at least one
				special character, one letter and one number.
			</Tooltip>
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	return {
		pageloaded: state.app.pageloaded,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onRegister: (registerData) => {
			dispatch(userActions.register(registerData));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
