const models = require("../models");
const dbHelpers = require("../utils/dbhelpers");
const Op = require("sequelize").Op;

const costingProfileInclusions = [
	"id",
	"ProfileNumber",
	"ProfileName",
	"Methodology",
	"SubMethodology",
];

const projectInclusions = [
	"id",
	"ProjectId",
	"ProjectName",
	"CommissioningCountry",
	"CommissioningOffice",
	"BusinessUnit",
	"IndustryVertical",
	"ProposalOwnerEmail",
	"ProjectResourcesFolderId",
	"CostingsFolderId",
];

const CreateRequest = async (req, res) => {
	let newRequest;

	try {
		try {
			newRequest = JSON.parse(JSON.stringify(req.body));
		} catch (e) {
			throw "Invalid Body Content."; //only to satisfy checkmarx validation
		}

		const result = await models.sequelize.transaction(async (t) => {
			const createdRequest = await models.Requests.create(newRequest, {
				transaction: t,
			});
			return createdRequest;
		});
		//send "Request Created "email here
		res.status(201).json({
			message: "SUCCESS: Request Created.",
			Request: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Request.",
			error: err.toString(),
		});
	}
};

const FetchAllRequests = async (req, res) => {
	try {
		//No need to delete this function. Will be useful for reporting related endpoints. Once React side is using FetchProjects, remove all "where" conditions.

		// Auth middleware ValidateToken() puts tokenData in request obj
		const userData = req.tokenData;

		//Using tokendata to find full user record
		const clientUser = await models.Users.findByPk(userData.UserId);

		//find all access limiters
		const allowedBusinessUnits = clientUser.BusinessUnits.split(",");
		const allowedVerticals = clientUser.Verticals.split(",");
		const allowedCountries = clientUser.Countries.split(",");
		//Pagination
		//const { offset, limit } = req.query;
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);

		//Access restricted
		const condition = {
			[Op.and]: {
				CommissioningCountry: allowedCountries,
				BusinessUnit: allowedBusinessUnits,
				IndustryVertical: allowedVerticals,
			},
		};

		const results = await models.Requests.findAndCountAll({
			// where: condition,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["id", "DESC"]],
			include: [
				{
					model: models.CostingProfiles,
					attributes: costingProfileInclusions,
					include: [
						{
							model: models.Projects,
							where: condition,
							attributes: projectInclusions,
						},
					],
				},
				{ model: models.RequestLogs },
			],
		});

		res.status(200).json({
			message: "SUCCESS: Fetched All Requests.",
			items: results.rows, //filteredProjects,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching All Requests.",
			error: ex.toString(),
		});
	}
};

const FetchRequests = async (req, res) => {
	const objectJson = req.body;
	let requestorEmail = objectJson.RequestorEmail || "";
	let agentEmail = objectJson.agentEmail || "";
	if(objectJson.agentEmail===null)
	agentEmail=null
	let isClosed = objectJson.isClosed;
	let requestType = objectJson.requestType;
	const userData = req.tokenData;
	//Using tokendata to find full user record
	const clientUser = await models.Users.findByPk(userData.UserId)
		.then((user) => {
			return user;
		})
		.catch((err) =>
			res.status(500).json({
				error: err.toString(),
				Message: "ERROR: Fetch requests failed.",
			})
		);
	const countryCode =
		objectJson.countryCode || clientUser.Countries.split(",");

	const { limit, offset } = dbHelpers.GetPagination(
		req.query.limit,
		req.query.offset
	);
	// if(typeof isClosed !==Boolean ||  isClosed !==undefined )
	// {
	// 	throw "IsClosed supposed to be boolean type"
	// }
	let condition = {
		[Op.and]: {
			RequestorEmail: {
				[Op.like]: "%" + requestorEmail + "%",
			},
			AgentEmail: {
				[Op.like]: "%" + agentEmail + "%",
			},
		},
	};
	if(agentEmail===null)
	{	
		condition = {
			...condition,
			[Op.and]: {
				...condition[Op.and],
				AgentEmail: null
		}
	}
	}
	if(requestorEmail===null)
	{	
		condition = {
			...condition,
			[Op.and]: {
				...condition[Op.and],
				RequestorEmail: null
		}
	}
	}
	if (objectJson.isClosed !== undefined) {
		condition = {
			...condition,
			[Op.and]: {
				...condition[Op.and],
				IsClosed: isClosed,
			},
		};
	}
	if (objectJson.requestType !== undefined) {
		condition = {
			...condition,
			[Op.and]: {
				...condition[Op.and],
				RequestType: requestType,
			},
		};
	}

	try {
		const results = await models.Requests.findAndCountAll({
			// where: condition,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["id", "DESC"]],
			where: condition,
			include: [
				{
					required: objectJson.countryCode && objectJson.countryCode.length>0?true:false,
					model: models.CostingProfiles,
					attributes: costingProfileInclusions,
					include: [
						{
							model: models.Projects,
							attributes: projectInclusions,
							where: {
								CommissioningCountry: countryCode
							}
						},
					],
				},
				{ model: models.RequestLogs },
			],
		});

		res.status(200).json({
			message: "SUCCESS: Fetched  Requests data.",
			items: results.rows,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetching Setup and Delivery Requests.",
			error: ex.toString(),
		});
	}
};

const FetchRequest = (req, res) => {
	let RequestId = req.params.RequestId;
	if (isNaN(Number(RequestId))) {
		//use when integer expected
		throw "Invalid Parameter.";
	}
	models.Requests.findOne({
		where: {
			id: RequestId,
		},
		order: [["id", "DESC"]],
		include: [
			{
				model: models.CostingProfiles,
				attributes: costingProfileInclusions,
				include: [
					{
						model: models.Projects,
						attributes: projectInclusions,
					},
				],
			},
			{ model: models.RequestLogs },
		],
	})
		.then((result) => {
			if (result) {
				res.status(200).json({
					message: "SUCCESS: Fetched Request ID: " + req.params.RequestId,
					project: result,
				});
			} else {
				res.status(404).json({
					message: "INFO: No Request Found for this ID.",
					RequestID: req.params.RequestId,
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: "ERROR: Something Went Wrong While Fetching One Request.",
				error: err.toString(),
			});
		});
};

const UpdateRequest = async (req, res) => {
	try {
		const updatedRequestData = req.body;
		delete updatedRequestData.CostingProfile;
		delete updatedRequestData.Methodology;
		let RequestId = req.params.RequestId;
		if (isNaN(Number(RequestId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			let deferred = [];

			deferred.push(
				new Promise((resolve, reject) =>
					models.Requests.update(updatedRequestData, {
						where: {
							id: RequestId,
						},
						transaction: t,
					})
						.then((res) => resolve(res))
						.catch((e) => reject(e))
				)
			);

			return await Promise.all(deferred)
				.then((res) => {
					return res;
				})
				.catch((e) => {
					throw e;
				});
		});
		res.status(200).json({ message: "SUCCESS: Request Data Updated." });
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Request Data.",
			error: ex.toString(),
		});
	}
};

const FetchRequestLogs = async (req, res) => {
	try {
		let RequestId = req.params.RequestId;
		if (isNaN(Number(RequestId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const results = await models.RequestLogs.findAll({
			// where: condition,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			order: [["id", "DESC"]],
			where: { RequestId: RequestId },
		});

		res.status(200).json({
			message:
				"SUCCESS: Fetched All Request Logs for Request ID: " +
				req.params.RequestId,
			items: results, //filteredProjects,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching All Request Logs.",
			error: ex.toString(),
		});
	}
};

const CreateRequestLog = async (req, res) => {
	const newRequestLog = req.body;
	newRequestLog.RequestId = req.params.RequestId;
	try {
		const result = await models.sequelize.transaction(async (t) => {
			await models.RequestLogs.create(newRequestLog, {
				transaction: t,
			});
		});

		res.status(201).json({
			message: "SUCCESS: Request Log Created.",
			RequestLog: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Request Log.",
			error: err.toString(),
		});
	}
};

module.exports = {
	CreateRequest: CreateRequest,
	FetchRequest: FetchRequest,
	UpdateRequest: UpdateRequest,
	FetchRequests: FetchRequests,
	FetchAllRequests: FetchAllRequests,
	FetchRequestLogs: FetchRequestLogs,
	CreateRequestLog: CreateRequestLog,
};
