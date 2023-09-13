import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import * as userActions from "../../redux/actions/userActions";
import {
	Button,
	Card,
	CardImg,
	CardBody,
	CardTitle,
	Form,
	FormGroup,
	Input,
	Row,
	Col,
	CardText,
} from "reactstrap";
import banner from "../../assets/img/avatars/nielsen-logo-header-3x1.png";
import AuthLayout from "../../layouts/Auth";
import Spinner from "../../components/Spinner";

const ForgotPassword = (props) => {
	const [forgotData, setForgotData] = useState({
		Email: "",
	});

	const onSubmitHandler = (e) => {
		e.preventDefault();
		let data = forgotData;
		data.Email = data.Email.trim().toLowerCase();
		props.onForgotPassword(data);
	};
	const loading = useSelector(({ app }) => app.recordloading);

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
						<h1 className="h3">Reset CI Central v2 Account Password</h1>
					</CardTitle>
					<div className="m-sm-4">
						<CardText>
							Please enter the email address used to create your Nielsen CI
							Central v2 Account.
							<br />A link will be sent to reset your password if the account
							exists.
						</CardText>
						<Form onSubmit={(e) => onSubmitHandler(e)}>
							<FormGroup>
								<Input
									type="email"
									name="email"
									placeholder="Enter your NielsenIQ email..."
									required
									value={forgotData.Email}
									onChange={(e) => setForgotData({ Email: e.target.value })}
								/>
							</FormGroup>
							<Row>
								<Col>
									<Link to="/auth/login">Back to Login</Link>
								</Col>
								<Col>
									<Button
										color="primary"
										size="lg"
										style={{ float: "right" }}
										disabled={loading}
									>
										Reset password
									</Button>
									{loading ? <Spinner size="small" /> : null}
								</Col>
							</Row>
						</Form>
					</div>
				</CardBody>
			</Card>
		</AuthLayout>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		onForgotPassword: (forgotData) => {
			dispatch(userActions.forgotPassword(forgotData));
		},
	};
};

export default connect(null, mapDispatchToProps)(ForgotPassword);
