import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import * as userActions from "../../redux/actions/userActions";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";

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

import AuthLayout from "../../layouts/Auth";

const ResetPassword = (props) => {
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
	const loading = useSelector(({ app }) => app.recordloading);

	const [resetData, setResetData] = useState({
		ResetToken: "",
		Password: "",
		ConfirmPassword: "",
	});

	const onSubmitHandler = (e) => {
		e.preventDefault();
		props.onResetPassword(resetData);
	};

	const onResetChange = (field, value) => {
		setResetData((prevState) => {
			return {
				...prevState,
				[field]: value,
			};
		});
	};

	const loc = useLocation();
	//console.log("location", loc.hash);
	useEffect(() => {
		onResetChange("ResetToken", loc.hash.substring(1));
	}, []);
	const [validData, setValidData] = useState({
		Valid: false,
		Errors: [],
	});

	const validatePassword = () => {
		if (resetData.Password !== "") {
			let errors = [];
			let valid = true;

			// confirm password check
			if (resetData.Password !== resetData.ConfirmPassword) {
				errors.push("Passwords do not match.");
				valid = false;
			}
			if (resetData.Password.length < 8) {
				errors.push("Password is too short.");
				valid = false;
			}
			var re = {
				// capital: /[A-Z]/,
				digit: /[0-9]/,
				// except: /[aeiou]/,
				alpha: /[A-Za-z]/,
				symbol: /[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/,
			};

			//console.log(re.digit.test(resetData.Password));
			//console.log(re.alpha.test(resetData.Password));
			// console.log(re.symbol.test(resetData.Password));
			if (
				!(
					re.digit.test(resetData.Password) &&
					re.alpha.test(resetData.Password) &&
					re.symbol.test(resetData.Password)
				)
			) {
				errors.push("Password does not satisfy character criteria.");
				valid = false;
			}
			// console.log("valid?", valid);
			setValidData({ Valid: valid, Errors: errors });
		}
	};

	useEffect(() => {
		validatePassword();
		//console.log("resetData", resetData);
	}, [resetData.Password, resetData.ConfirmPassword]);

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
						<h1 className="h3">Reset CI Central v2 Password</h1>
					</CardTitle>
					<div className="m-sm-4">
						<CardText>
							Your new password must meet the minimum complexity requirements.
						</CardText>
						<Form autoComplete="off" onSubmit={(e) => onSubmitHandler(e)}>
							<FormGroup>
								<Label>New Password*</Label>
								<Input
									id="Password"
									type="password"
									name="password"
									placeholder="Enter a complex password"
									required
									autoComplete="off"
									value={resetData.Password}
									onChange={(e) => onResetChange("Password", e.target.value)}
								/>
							</FormGroup>
							<FormGroup>
								<Label>Confirm New Password*</Label>
								<Input
									id="ConfirmPassword"
									type="password"
									name="confirmpassword"
									placeholder="Repeat your new password"
									required
									autoComplete="off"
									value={resetData.ConfirmPassword}
									onChange={(e) =>
										onResetChange("ConfirmPassword", e.target.value)
									}
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
									<Row>
										<Col>
											<Link to="/auth/login">Back to Login</Link>
										</Col>
									</Row>
								</Col>
								<Col>
									<Button
										style={{ float: "right" }}
										disabled={!validData.Valid || loading}
										color="primary"
										size="lg"
									>
										Save New Password{loading ? <Spinner size="small" /> : null}
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
				target="Password"
				toggle={toggleTooltip}
			>
				Must be at least 8 alphanumeric characters long, including at least one
				special character, one letter and one number.
			</Tooltip>
		</AuthLayout>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		onResetPassword: (resetData) => {
			dispatch(userActions.resetPassword(resetData));
		},
	};
};

export default connect(null, mapDispatchToProps)(ResetPassword);
