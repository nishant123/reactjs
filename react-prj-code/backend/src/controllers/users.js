const bcrypt = require("bcrypt");
const sqlOp = require("sequelize").Op;
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const dbHelpers = require("../utils/dbhelpers");
const models = require("../models");

const FetchAll = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageUsersAccess) {
			throw "Access Denied.";
		}
		//Pagination
		//const { offset, limit } = req.query;
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);

		//Search filters
		const condition = {};

		const results = await models.Users.findAndCountAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["id", "DESC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All Users.",
			items: results.rows,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetched All Users.",
			error: ex,
		});
	}
};

const FetchOne = (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageUsersAccess) {
			throw "Access Denied.";
		}
		models.Users.findOne({
			where: { Email: req.params.UserEmail },
			attributes: { exclude: ["Password"] },
		})

			.then((result) => {
				if (result) {
					res.status(200).json({
						message: "SUCCESS: Fetched User record for " + req.params.UserEmail,
						projects: result,
					});
				} else {
					res.status(404).json({
						message: "INFO: No User Found for this Email Address.",
						EmailAddress: req.params.UserEmail,
					});
				}
			})
			.catch((err) => {
				res.status(500).json({
					message: "ERROR: Something Went Wrong While Fetching One User.",
					error: err.toString(),
				});
			});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching One User.",
			error: ex.toString(),
		});
	}
};

const Trash = (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageUsersAccess) {
			throw "Access Denied.";
		}
		models.Users.destroy({ where: { Email: req.params.UserEmail } })
			.then((result) => {
				console.log(result);
				if (result > 0) {
					res.status(200).json({
						message: "SUCCESS: Deleted User.",
						Email: req.params.UserEmail,
					});
				} else {
					res.status(404).json({
						message: "Error: User Record Not Found.",
						Email: req.params.UserEmail,
					});
				}
			})
			.catch((err) => {
				res.status(500).json({
					message: "ERROR: Something Went Wrong While Deleting User.",
					error: err,
				});
			});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting User.",
			error: ex,
		});
	}
};

const Create = (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageUsersAccess) {
			throw "Access Denied.";
		}
		const user = req.body;
		//At a minimum, we need email address and password

		if (!user.Email) {
			res.status(400).json({
				message: "ERROR: Email Address is required.",
			});
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
					models.Users.create(user, {
						userEmail: req.tokenData.Email,
					})
						.then((result) => {
							result.Password = null;
							res.status(201).json({
								message: "SUCCESS: User Created.",
								user: result,
							});
						})
						.catch((err) => {
							res.status(500).json({
								message: "ERROR: User Creation Failed.",
								error: err.toString(),
							});
						});
				}
			})
			.catch((err) => {
				res.status(500).json({
					message: "ERROR: Existing User Check Failed.",
					error: err.toString(),
				});
			});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: User Creation Failed.",
			error: ex.toString(),
		});
	}
};

const Update = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageUsersAccess) {
			throw "Access Denied.";
		}
		const updatedUserData = req.body;

		await models.sequelize.transaction(async (t) => {
			const updatedRecordCount = await models.Users.update(updatedUserData, {
				where: { Email: req.params.UserEmail },
				transaction: t,
			});
			if (updatedRecordCount[0] == 0) {
				throw "No user record found for email: " + req.params.UserEmail;
			}
		});
		res.status(200).json({ message: "SUCCESS: User Updated." });
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating the User.",
			error: ex.toString(),
		});
	}
};
const searchUsers = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageUsersAccess) {
			throw "Access Denied.";
		}
		//Pagination
		//const { offset, limit } = req.query;
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);
		const objectJson = req.body;
		const allowedCountries = objectJson.countries || [];
		const allowedBusinessUnits = objectJson.businessUnits || [];
		const allowedVerticals = objectJson.verticals || [];
		let firstName = objectJson.firstName ||"";
		let lastName = objectJson.lastName||"";
		let email = objectJson.email||"";
		let comments = objectJson.comments||"";
		let condition = {
			[sqlOp.and]: {
			},
		};
		if(email.length>0)
		{
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
					Email: {
						[sqlOp.like]: "%" + email + "%",
					},				
				},
			};
		}
		if(lastName.length>0)
		{
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
				LastName: {
					[sqlOp.like]: "%" + lastName + "%",
				},				
				},
			};
		}
		if(firstName.length>0)
		{
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
					FirstName: {
						[sqlOp.like]: "%" + firstName + "%",
					},
				},
			};
		}
		if(comments.length>0)
		{
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
						Comments: {
					[sqlOp.like]: "%" + comments + "%",
				},
			}
		}
		}
		if (allowedCountries.length > 0) {
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
					Countries: allowedCountries.join(","),
				},
			};
		}
		if (allowedBusinessUnits.length > 0) {
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
					BusinessUnits: allowedBusinessUnits.join(","),
				},
			};
		}
		if (allowedVerticals.length > 0) {
			condition = {
				...condition,
				[sqlOp.and]: {
					...condition[sqlOp.and],
					Verticals: allowedVerticals.join(","),
				},
			};
		}
		const results = await models.Users.findAndCountAll({
		    where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All the filtered Users.",
			items: results.rows,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While searching the Users.",
			error: ex,
		});
	}
};

//TO COMBINE FUNCTIONS BELOW LATER
const FetchSpTeamLeads = async (req, res) => {
	try {
		//reduce content to just id, email, firstname, lastname
		const condition = { IsProgrammingTeamLeader: true };

		const results = await models.Users.findAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All SP Team Leaders.",
			users: results,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetched All SP Team Leaders.",
			error: ex,
		});
	}
};

const FetchProgrammers = async (req, res) => {
	try {
		//reduce content to just id, email, firstname, lastname
		const condition = { IsProgrammer: true };

		const results = await models.Users.findAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All Programmers",
			users: results,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetched All Programmers.",
			error: ex,
		});
	}
};

const FetchCostingSPOCs = async (req, res) => {
	try {
		//reduce content to just id, email, firstname, lastname
		const condition = { IsCostingSPOC: true };

		const results = await models.Users.findAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All Costing SPOCs",
			users: results,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetched All Costing SPOCs.",
			error: ex,
		});
	}
};

const FetchOpsPMs = async (req, res) => {
	try {
		//reduce content to just id, email, firstname, lastname
		const condition = { IsOpsProjectManager: true };

		const results = await models.Users.findAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All Ops PMs",
			users: results,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetched All Ops PMs.",
			error: ex,
		});
	}
};

const FetchCS = async (req, res) => {
	try {
		//reduce content to just id, email, firstname, lastname
		const condition = { IsClientService: true };

		const results = await models.Users.findAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All Client Service Users.",
			users: results,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetched All Client Service Users.",
			error: ex,
		});
	}
};

const FetchInternalUsers = async (req, res) => {
	try {
		//reduce content to just id, email, firstname, lastname
		const condition = { IsInternalUser: true };

		const results = await models.Users.findAll({
			where: condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["email", "ASC"]],
		});
		res.status(200).json({
			message: "SUCCESS: Fetched All Client Service Users.",
			users: results,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetched All Client Service Users.",
			error: ex,
		});
	}
};

const FetchAllSp = async (req, res) => {
	try {
		//Pagination
		//const { offset, limit } = req.query;
		const userData = req.tokenData;
		const clientUser = await models.Users.findByPk(userData.UserId);
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);
		let condition = {
	
		}
		if(clientUser.SpRole === "Country-Admin"){
			condition["CountryAdmin"] = clientUser.Email
		}
		const results = await models.Users.findAndCountAll({
			where:condition,
			attributes: { exclude: ["Password"] },
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["id", "DESC"]],
		});
		console.log(results);
		res.status(200).json({
			message: "SUCCESS: Fetched All Users.",
			items: results.rows,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetched All Users.",
			error: ex,
		});
	}
};

const TrashSp = (req, res) => {
	models.Users.destroy({ where: { Email: req.params.UserEmail } })
		.then((result) => {
			console.log(result);
			if (result > 0) {
				res.status(200).json({
					message: "SUCCESS: Deleted User.",
					Email: req.params.UserEmail,
				});
			} else {
				res.status(404).json({
					message: "Error: User Record Not Found.",
					Email: req.params.UserEmail,
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: "ERROR: Something Went Wrong While Deleting User.",
				error: err,
			});
		});
};

const RegisterSpUser = async(req, res) => {
	try {
		const user = req.body;
		const userData = req.tokenData;
		console.log("userData: "+JSON.stringify(userData))
		const clientUser = await models.Users.findByPk(userData.UserId);
		//At a minimum, we need email address and password

		if (!user.Email) {
			res.status(400).json({
				message: "ERROR: Email Address is required.",
			});
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
					models.Users.create(user, {
						userEmail: clientUser.Email,
					})
						.then((result) => {
							res.status(201).json({
								message: "SUCCESS: User Created.",
								user: result,
							});
						})
						.catch((err) => {
							res.status(500).json({
								message: "ERROR: User Creation Failed.",
								error: err.toString(),
							});
						});
				}
			})
			.catch((err) => {
				res.status(500).json({
					message: "ERROR: Existing User Check Failed.",
					error: err.toString(),
				});
			});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: User Creation Failed.",
			error: ex.toString(),
		});
	}
};
module.exports = {
	Create: Create,
	FetchAll: FetchAll,
	FetchOne: FetchOne,
	Trash: Trash,
	Update: Update,
	searchUsers: searchUsers,
	FetchSpTeamLeads: FetchSpTeamLeads,
	FetchProgrammers: FetchProgrammers,
	FetchCostingSPOCs: FetchCostingSPOCs,
	FetchOpsPMs: FetchOpsPMs,
	FetchCS: FetchCS,
	FetchInternalUsers: FetchInternalUsers,
	FetchAllSp: FetchAllSp,
	TrashSp: TrashSp,
	RegisterSpUser:RegisterSpUser
};
