const models = require("../models");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const sfConfig = require("../config/salesforce");
const dbHelpers = require("../utils/dbhelpers");
const axios = require("axios");
const querystring = require("querystring");
var fs = require("fs");
const path = require("path");
const dirPathToKey = path.join(__dirname, "../config/sfkey.pem");
const privateKey = fs.readFileSync(dirPathToKey);
const sqlOp = require("sequelize").Op;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const emailing = require("../utils/sendMail");
const ejs = require("ejs");

const Login = async (req, res) => {
	//first check if user exists.
	try {
		const userEmail = req.body.Email;

		if (typeof userEmail !== "string") {
			throw "Invalid Email Format.";
		}
		const userPassword = req.body.Password;

		const foundUser = await models.Users.findOne({
			where: { Email: userEmail },
		});

		if (!foundUser) {
			throw "No User Record Found.";
		}

		if (foundUser && !foundUser.IsDisabled) {
			//if user found then compare stored vs submitted password.
			const success = await bcrypt.compare(userPassword, foundUser.Password);
			if (success) {
				//if passwords match then generate JWT token.
				let jwtToken = jwt.sign(
					{
						Email: foundUser.Email,
						UserId: foundUser.id,
						BusinessUnits: foundUser.BusinessUnits,
						Verticals: foundUser.Verticals,
						Countries: foundUser.Countries,
						DeliveryDashboardAccess: foundUser.DeliveryDashboardAccess,
						InternalDashBoardAccess: foundUser.InternalDashBoardAccess,
						RequestsBoardAccess: foundUser.RequestsBoardAccess,
						ManageUsersAccess: foundUser.ManageUsersAccess,
						ManageMarketAccess: foundUser.ManageMarketAccess,
						FinanceAccess: foundUser.FinanceAccess,
					},
					jwtConfig.secret,
					{
						expiresIn: jwtConfig.expiresIn,
						notBefore: jwtConfig.notBefore,
						algorithm: jwtConfig.algorithm,
					}
				);
				//Store last login timestamp
				foundUser.LastLoginDate = new Date();
				foundUser.FailedLoginAttempts = null;
				foundUser.save({
					fields: ["LastLoginDate", "FailedLoginAttempts"],
				});

				//removing sensitive info
				delete foundUser.dataValues.FailedLoginAttempts;
				delete foundUser.dataValues.Password;
				delete foundUser.dataValues.LastPasswordResetDate;
				delete foundUser.dataValues.ResetToken;
				delete foundUser.dataValues.createdAt;
				delete foundUser.dataValues.updatedAt;
				delete foundUser.dataValues.CreatedBy;
				delete foundUser.dataValues.UpdatedBy;
				delete foundUser.dataValues.ResetToken;
				delete foundUser.dataValues.LastLoginDate;
				delete foundUser.dataValues.Comments;

				res.status(200).json({
					message: "SUCCESS: User Logged In.",
					user: foundUser,
					token: jwtToken,
				});
			} else {
				let failedLoginAttempts = foundUser.FailedLoginAttempts;
				if (!failedLoginAttempts) {
					foundUser.FailedLoginAttempts = 1;
					foundUser.IsDisabled = false;
				} else {
					foundUser.FailedLoginAttempts = failedLoginAttempts + 1;
				}
				if (foundUser.FailedLoginAttempts >= process.env.MAX_FAILED_LOGIN_ATTEMPTS) {
					foundUser.IsDisabled = true;
				}

				foundUser.save({ fields: ["FailedLoginAttempts", "IsDisabled"] });

				res.status(401).json({
					message: "ERROR: Invalid Login Credentials.",
				});
			}
		} else if (foundUser.IsDisabled) {
			res.status(401).json({ message: "ERROR: User Account Disabled." });
		} else {
			res.status(404).json({
				message: "ERROR: User Not Found.",
			});
		}
	} catch (ex) {
		res.status(500).json({ message: "ERROR: Login Failed.", error: ex.toString() });
	}
};

const ValidateToken = (req, res, next) => {
	try {
		let tokenValue = req.headers["auth-token"];

		if (tokenValue) {
			jwt.verify(tokenValue, jwtConfig.secret, (error, data) => {
				if (error) {
					return res.status(401).json({ message: "ERROR: Invalid Auth Token." });
				} else {
					req.tokenData = data;
					next();
				}
			});
		} else {
			return res.status(401).json({ message: "ERROR: 'auth-token' missing from request header." });
		}
	} catch (ex) {
		return res.status(401).json({
			message: "ERROR: Cannot Validate auth-token",
			error: ex.toString(),
		});
	}
};

const SFAuth = async (req, res, next) => {
	const jwtparams = {
		iss: sfConfig.client_id,
		sub: sfConfig.username,
		aud: sfConfig.audience_url,
		exp: Date.now() + 18000,
	};

	const token = jwt.sign(jwtparams, privateKey, { algorithm: "RS256" });

	const params = {
		grant_type: sfConfig.grant_type,
		assertion: token,
	};

	let output = "";
	await axios
		.post(sfConfig.oauth_url, querystring.stringify(params))
		.then((result) => {
			output = result.data;
		})

		.catch((err) => {
			throw err;
		});

	return output;
};

const SelfRegister = (req, res) => {
	try {
		const user = req.body;
		user.IsDisabled = true;
		//At a minimum, we need email address and password

		if (!user.Email || !user.Password) {
			res.status(400).json({
				message: "ERROR: Email Address and Password are required.",
			});
		}

		const newPassword = user.Password;
		const confirmPassword = user.ConfirmPassword;

		if (newPassword < 8) {
			throw "Password does not satisfy minimum complexity requirements.";
		}

		if (newPassword !== confirmPassword) {
			throw "Password confirmation failed.";
		}
		let re = {
			// capital: /[A-Z]/,
			digit: /[0-9]/,
			// except: /[aeiou]/,
			alpha: /[A-Za-z]/,
			symbol: /[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/,
		};

		if (!(re.digit.test(newPassword) && re.alpha.test(newPassword) && re.symbol.test(newPassword))) {
			throw "New password does not satisfy minimum complexity requirements.";
		}

		//first checking if user already exists or not
		dbHelpers
			.CheckIfExistsUnique(models.Users, "Email", user.Email)
			.then((result) => {
				if (result) {
					//if exists then do not create
					res.status(409).json({
						message: "ERROR: User Already Exists. Request Aborted.",
					});
				} else {
					//creating user if email not found
					//hashing password first
					bcrypt
						.hash(user.Password, Number(process.env.PASSWORD_SALTROUNDS))
						.then((hash) => {
							//assigning hashed password back to origin.
							user.Password = hash;
							models.Users.create(user, {
								userEmail: user.Email,
							})
								.then((result) => {
									res.status(201).json({
										message: "SUCCESS: User Self Registration Complete.",
									});
								})
								.catch((err) => {
									res.status(500).json({
										message: "ERROR: User Creation Failed.",
										error: err,
									});
								});
						})
						.catch((err) => {
							res.status(500).json({
								message: "ERROR: Password Encryption Failed.",
								error: err.toString(),
							});
						});
				}
			})
			.catch((err) => {
				res.status(500).json({
					message: "ERROR: Existing User Check Failed.",
					error: err,
				});
			});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: New User Registration Failed.",
			error: ex.toString(),
		});
	}
};
//send email with the reset token and integarte in the frontend(change the iurl and fetch from there)
const ResetPasswordTrigger = async (req, res) => {
	try {
		const token = crypto.randomBytes(64).toString("hex");
		const foundUser = await models.Users.findOne({
			where: { Email: req.body.Email },
		});
		if (!foundUser) {
			return res.status(200).json({
				message: `An email has been sent to ${req.body.Email} with further instructions.`,
				email: req.body.Email,
			});
		}
		foundUser.ResetToken = token;
		foundUser.ResetTokenExpiryDate = Date.now() + 3600000; //1hour
		let resetUrl = process.env.PROD_URL + "auth/reset-password#" + token;
		await foundUser.save();
		ejs
			.renderFile(path.join("src", "views/passwordResetTokenTemplate.ejs"), {
				resetLink: resetUrl,
			})
			.then((result) => {
				emailing.SendEmail(result, req.body.Email, "CI Central v2 Password Reset");
			})
			.catch((err) => {
				res.status(400).json({
					message: "ERROR: Reset Link Email Failed.",
					error: err,
				});
			});
		//send email password reset email here.
		res.status(200).json({
			message: `An email has been sent to ${req.body.Email} with further instructions.`,
		});
	} catch (ex) {
		return res.status(500).json({
			message: "ERROR: Could not send reset email. Please contact your local admin.",
			error: ex.toString(),
		});
	}
};

const SaveNewPassword = async (req, res) => {
	try {
		const token = req.body.ResetToken;
		const newPassword = req.body.Password;
		const confirmPassword = req.body.ConfirmPassword;

		if (!token || !newPassword) {
			return res.status(400).json({
				message: "ERROR: Invalid Information Provided.",
			});
		}

		if (newPassword < 8) {
			throw "New password does not satisfy minimum complexity requirements.";
		}

		if (newPassword !== confirmPassword) {
			throw "New password confirmation failed.";
		}
		let re = {
			// capital: /[A-Z]/,
			digit: /[0-9]/,
			// except: /[aeiou]/,
			alpha: /[A-Za-z]/,
			symbol: /[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/,
		};

		if (!(re.digit.test(newPassword) && re.alpha.test(newPassword) && re.symbol.test(newPassword))) {
			throw "New password does not satisfy minimum complexity requirements.";
		}

		const resetUser = await models.Users.findOne({
			where: {
				ResetToken: token,
				ResetTokenExpiryDate: { [sqlOp.gt]: Date.now() },
			},
		});

		if (!resetUser) {
			return res.status(404).json({
				message: "ERROR: Password Reset Token Invalid or Expired.",
			});
		}

		const hash = await bcrypt.hash(req.body.Password, Number(process.env.PASSWORD_SALTROUNDS));

		resetUser.Password = hash;
		resetUser.ResetToken = null;
		resetUser.ResetTokenExpiryDate = null;
		resetUser.LastPasswordResetDate = new Date();
		await resetUser.save();
		ejs
			.renderFile(path.join("src", "views/passwordResetConfirmEmailTemplate.ejs"), {})
			.then((result) => {
				emailing.SendEmail(result, req.body.Email, "Password Successfully Reset - CI Central v2");
			})
			.catch((err) => {
				res.status(400).json({
					message: "ERROR: Could Not Send Password Reset Email Confirmation.",
					error: err,
				});
			});

		return res.status(200).json({ message: "SUCCESS: Password Changed." });
	} catch (ex) {
		return res.status(500).json({
			message: "ERROR: Could Not Save New Password.",
			error: ex.toString(),
		});
	}
};

const GoogleAuth = async (req, res) => {
	const token = req.headers["auth-token"];
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		return GoogleLogin(payload, res);
	} catch (e) {
		res.status(500).json({
			message: "Invalid Token.",
			error: e.toString(),
		});
	}
};

const GoogleLogin = async (payload, res) => {
	//first check if user exists.
	
	dbHelpers
		.CheckIfExistsUnique(models.Users, "Email", payload.email)
		.then((foundUser) => {
			console.log(foundUser)
			if (foundUser) {
				if(foundUser.GoogleSub){
					//if user found then compare stored vs submitted password.
					bcrypt
						.compare(payload.sub, foundUser.GoogleSub)
						.then((match) => {
							if (!foundUser.IsDisabled) {
								return processLogin(match, foundUser, res);
							} else {
								res.status(500).json({
									message: "Sorry, you don't have access to login",
									error: "Sorry, you don't have access to login",
								});
							}
						})
						.catch((err) => {
							res.status(500).json({
								message: "ERROR: Password Check Failed.",
								error: err.toString(),
							});
						});
				}else{
					bcrypt
					.hash(payload.sub, Number(process.env.PASSWORD_SALTROUNDS))
					.then(async (hash) => {
						await models.sequelize.transaction(async (t) => {
							const user = await models.Users.update({GoogleSub: hash}, {
								where: { Email: foundUser.Email },
								transaction: t,
							})
							if(user[0] === 1){
								dbHelpers
								.CheckIfExistsUnique(models.Users, "Email",foundUser.Email)
								.then((userData) => {
									bcrypt
									.compare(payload.sub, userData.GoogleSub)
									.then((match) => {
										return processLogin(match, userData, res);
									})
									.catch((err) => {
										res.status(500).json({
											message: "ERROR: Password Check Failed.",
											error: err.toString(),
										});
									});
								})
							}else{
								res.status(500).json({
									message: "ERROR: Password Update Failed.",
									error: "ERROR: Password Update Failed.",
								});
							}
						});
					});
				}
			} else {
				bcrypt
					.hash(payload.sub, Number(process.env.PASSWORD_SALTROUNDS))
					.then((hash) => {
						//assigning hashed password back to origin.
						const user = {
							Email: payload.email,
							GoogleSub: hash,
							FirstName: payload.given_name,
							LastName: payload.family_name,
							IsDisabled: false,
							SpRole: null,
							BusinessUnits: "CI,MA,NS",
							Permissions: "AU,NZ,JP,AE",
							Verticals: "V1,V2,V3,V0",
							Countries: "AU,NZ,JP,AE",

							Language: "en",
						};
						models.Users.create(user, {
							userEmail: user.Email,
						})
							.then((user) => {
								bcrypt
									.compare(payload.sub, user.GoogleSub)
									.then((match) => {
										return processLogin(match, user, res);
									})
									.catch((err) => {
										res.status(500).json({
											message: "ERROR: Password Check Failed.",
											error: err.toString(),
										});
									});
							})
							.catch((err) => {
								res.status(500).json({
									message: "ERROR: User Creation Failed.",
									error: err,
								});
							});
					})
					.catch((err) => {
						res.status(500).json({
							message: "ERROR: Password Encryption Failed.",
							error: err.toString(),
						});
					});
			}
		})
		.catch((err) => {
			res
				.status(500)
				.json({ message: "ERROR: User Check Failed.", error: err.toString() });
		});
};

const processLogin = (match, foundUser, res) => {
	if (match) {
		//if passwords match then generate JWT token.

		let jwtToken = jwt.sign(
			{
				Email: foundUser.Email,
				UserId: foundUser.id,
			},
			jwtConfig.secret,
			{
				expiresIn: jwtConfig.expiresIn,
				notBefore: jwtConfig.notBefore,
				algorithm: jwtConfig.algorithm,
			}
		);
		//Store last login timestamp
		foundUser.LastLoginDate = new Date();
		foundUser.FailedLoginAttempts = null;
		foundUser.save({
			fields: ["LastLoginDate", "FailedLoginAttempts"],
		});
		res.status(200).json({
			message: "SUCCESS: User Logged In.",
			user: foundUser,
			token: jwtToken,
		});
	} else {
		let failedLoginAttempts = foundUser.FailedLoginAttempts;
		if (!failedLoginAttempts) {
			foundUser.FailedLoginAttempts = 1;
		} else {
			foundUser.FailedLoginAttempts = failedLoginAttempts + 1;
		}
		if (foundUser.FailedLoginAttempts >= process.env.MAX_FAILED_LOGIN_ATTEMPTS) {
			foundUser.IsDisabled = true;
		}
		foundUser.save({ fields: ["FailedLoginAttempts", "IsDisabled"] });
		res.status(401).json({
			message: "ERROR: Invalid Login Credentials.",
		});
	}
};

const UpdateUser = async (req, res) => {
	let updatedUserData = {};
	if ("Teams" in req.body) {
		updatedUserData["SpRole"] = req.body.Teams;
	}
	if ("AccessCountryScope" in req.body) {
		updatedUserData["Countries"] = req.body.AccessCountryScope;
	}
	if ("UseLocalCurrency" in req.body) {
		updatedUserData["DisplayinLocalCurrency"] = req.body.UseLocalCurrency;
	}
	try {
		await models.sequelize.transaction(async (t) => {
			const updatedRecordCount = await models.Users.update(updatedUserData, {
				where: { Email: req.body.Email },
				transaction: t,
			});
			if (updatedRecordCount[0] == 0) {
				throw "No user record found for email: " + req.body.Email;
			}
		});
		await res.status(200).json({ message: "SUCCESS: User Updated." });
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating the User.",
			error: ex.toString(),
		});
	}
};

module.exports = {
	ValidateToken: ValidateToken,
	Login: Login,
	SFAuth: SFAuth,
	SelfRegister: SelfRegister,
	ResetPasswordTrigger: ResetPasswordTrigger,
	SaveNewPassword: SaveNewPassword,
	GoogleAuth: GoogleAuth,
	UpdateUser: UpdateUser,
};
