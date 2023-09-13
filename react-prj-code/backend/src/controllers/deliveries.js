const models = require("../models");
const dbHelpers = require("../utils/dbhelpers");
const Op = require("sequelize").Op;

const contractDetailsInclusions = [
	"AccountName",
	"Industry",
	"OpportunityNumber",
	"id",
];
const opportunityLineItemDetailsInclusions = ["id", "WBSNumber"];

const costingProfileInclusions = [
	"id",
	"ProfileName",
	"ProfileNumber",
	"IsTracker",
	"NumberOfWaves",
	"FieldingCountries",
	"Methodology",
];

const waveSpecsInclusions = [
	"id",
	"WaveNumber",
	"WaveName",
	"WaveStatus",
	"WaveFolderId",
	"ProjectBoxId",
	"DateWaveCommissioned",
	"DateFinalQuestionnaire",
	"DateFinalQuestionnaireActual",
	"DateTranslations",
	"DateTranslationsActual",
	"DateFieldStart",
	"DateFieldStartActual",
	"DateFieldEnd",
	"DateFieldEndActual",
	"DateDataProcessing",
	"DateDataProcessingActual",
	"DateVerbatimCoding",
	"DateCharts",
	"DateChartsActual",
	"DateDashboards",
	"DateDashboardsActual",
	"DateFinalReport",
	"DateFinalReportActual",
	"DateProgrammingStartActual",
	"DateFirstTestLinkActual",
	"DateLiveLinkActual",
	"DateDeliveryToGOActual",
	"NotesFinalQuestionnaire",
	"NotesTranslations",
	"NotesFieldwork",
	"NotesVerbatimCoding",
	"NotesDataProcessing",
	"NotesCharts",
	"NotesDashboards",
	"NotesFinalReport",
	"NotesPM",
	"NotesDataScience",
	"NotesOther",
];

const projectsInclusions = [
	"id",
	"ProjectId",
	"ProjectName",
	"BusinessUnit",
	"IndustryVertical",
	"CommissioningCountry",
	"CommissioningOffice",
	"IsSyndicated",
	"ProjectStatus",
	"ProjectResourcesFolderId",
	"ProjectManagerEmail",
	"ProposalOwnerEmail",
	"OtherProjectTeamContacts",
	"IsGdriveActionActive",
	"IsSFContactSyncPaused",
	"LeadCostingSPOC",
];

const FetchAll = async (req, res) => {
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

		const results = await models.DeliverySpecs.findAndCountAll({
			// where: condition,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["id", "DESC"]],
			include: [
				{
					model: models.WaveSpecs,
					attributes: waveSpecsInclusions,
					include: [
						{
							model: models.CostingProfiles,
							attributes: costingProfileInclusions,
							include: [
								{
									model: models.Projects,
									attributes: projectsInclusions,
									include: [
										{
											model: models.ContractDetails,
											attributes: contractDetailsInclusions,
											include: [
												{
													model: models.OpportunityLineItemDetails,
													as: "opportunityLineItemDetails",
													attributes: opportunityLineItemDetailsInclusions,
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		});

		res.status(200).json({
			message: "SUCCESS: Fetched Setup and Delivery Projects.",
			items: results.rows, //filteredProjects,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetching Setup and Delivery Projects.",
			error: ex.toString(),
		});
	}
};
const FetchDeliveries = async (req, res) => {
	// Auth middleware ValidateToken() puts tokenData in request obj
	const userData = req.tokenData;
	const objectJson = req.body;
	//Using tokendata to find full user record
	const clientUser = await models.Users.findByPk(userData.UserId)
		.then((user) => {
			return user;
		})
		.catch((err) =>
			res.status(500).json({
				error: err.toString(),
				Message: "ERROR: Fetch All Projects Failed On User Scope.",
			})
		);
		console.log("kk")
	//find all access limiters
	const allowedBusinessUnits =
		objectJson.businessUnits || clientUser.BusinessUnits.split(",");
	const allowedCountries =
		objectJson.countries || clientUser.Countries.split(",");
	let deliveryStatus = objectJson.deliveryStatus;
	let projectId = objectJson.projectId || "";
	let projectName = objectJson.projectName || "";
	let waveName = objectJson.waveName || "";
	let programmer = objectJson.programmer || "";
	let isInternal = objectJson.isInternal;
	let projectmanager = objectJson.projectmanager || "";
	let proposalOwner = objectJson.proposalOwner || "";
	//Pagination
	//const { offset, limit } = req.query;
	const { limit, offset } = dbHelpers.GetPagination(
		req.query.limit,
		req.query.offset
	);
	console.log("pp")
	//Access restricted
	let condition = {
		[Op.and]: {
			ProgrammerAssigned: {
				[Op.like]: "%" + programmer + "%",
			},
		},
	};
	if (deliveryStatus && deliveryStatus.length > 0) {
		condition = {
			...condition,
			[Op.and]: {
				...condition[Op.and],
				DeliveryStatus: deliveryStatus,
			},
		};
	}
	if (typeof isInternal === "boolean") {
		condition = {
			...condition,
			[Op.and]: {
				...condition[Op.and],
				IsInternalDelivery: isInternal,
			},
		};
	}
	let projectRequired = false;
	if (objectJson.projectmanager === null)
		projectmanager = null
	if ( proposalOwner.length>0 || projectmanager.length > 0 || projectName.length > 0 || projectId.length > 0 || (objectJson.countries && objectJson.countries.length > 0) || (objectJson.businessUnits && objectJson.businessUnits.length > 0))
		projectRequired = true
	let projectCondition = {
		[Op.and]: {
			CommissioningCountry: allowedCountries,
			BusinessUnit: allowedBusinessUnits,
			ProjectId: {
				[Op.like]: "%" + projectId + "%",
			},
			projectName: {
				[Op.like]: "%" + projectName + "%",
			},
			ProposalOwnerEmail: {
				[Op.like]: "%" + proposalOwner + "%",
			},
		},
	};
	if (projectmanager === null) {
		projectCondition = {
			...projectCondition,
			[Op.and]: {
				...projectCondition[Op.and],
				ProjectManagerEmail: null
			},
		};
	}
	if (projectmanager && projectmanager.length !== 0) {
		projectCondition = {
			...projectCondition,
			[Op.and]: {
				...projectCondition[Op.and],
				ProjectManagerEmail: {
					[Op.like]: "%" + projectmanager + "%",
				},
			},
		};
	}
	let waveCondition = {}
	if (waveName.length > 0) {
		waveCondition = {
			WaveName: {
				[Op.like]: "%" + waveName + "%",
			}
		}
	}
	try {
		const results = await models.DeliverySpecs.findAndCountAll({
			where: condition,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["id", "DESC"]],
			include: [
				{	
					required: waveName.length > 0 ||projectRequired,
					model: models.WaveSpecs,
					attributes: waveSpecsInclusions,
					where: waveCondition,
					include: [
						{
							required: projectRequired,
							model: models.CostingProfiles,
							attributes: costingProfileInclusions,
							include: [
								{
									required: projectRequired,
									model: models.Projects,
									attributes: projectsInclusions,
									where: projectCondition,
									include: [
										{
											model: models.ContractDetails,
											attributes: contractDetailsInclusions,
											include: [
												{
													model: models.OpportunityLineItemDetails,
													as: "opportunityLineItemDetails",
													attributes: opportunityLineItemDetailsInclusions,
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		});

		res.status(200).json({
			message: "SUCCESS: Fetched Setup and Delivery Projects.",
			items: results.rows, //filteredProjects,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetching Setup and Delivery Projects.",
			error: ex.toString(),
		});
	}
};

const FetchOne = (req, res) => {
	models.DeliverySpecs.findOne({
		where: {
			id: req.params.DeliverySpecId,
		},
		order: [["id", "DESC"]],
		include: [
			{
				model: models.WaveSpecs,
				attributes: waveSpecsInclusions,
				include: [
					{
						model: models.CostingProfiles,
						attributes: costingProfileInclusions,
						include: [
							{
								model: models.Projects,
								attributes: projectsInclusions,
								include: [
									{
										model: models.ContractDetails,
										attributes: contractDetailsInclusions,
										include: [
											{
												model: models.OpportunityLineItemDetails,
												as: "opportunityLineItemDetails",
												attributes: opportunityLineItemDetailsInclusions,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	})
		.then((result) => {
			if (result) {
				res.status(200).json({
					message:
						"SUCCESS: Fetched Delivery Project " + req.params.DeliverySpecId,
					project: result,
				});
			} else {
				res.status(404).json({
					message: "INFO: No Projects Found for this ID.",
					ProjectId: req.params.DeliverySpecId,
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: "ERROR: Something Went Wrong While Fetching One Project.",
				error: err.toString(),
			});
		});
};

const Update = async (req, res) => {
	try {
		const updatedDeliveryData = req.body;
		const updatedDeliverySpecs = updatedDeliveryData;
		const updatedWaveSpecs = updatedDeliveryData.WaveSpec;
		delete updatedWaveSpecs.CostingProfile;

		// updatedWaveSpecs.OpsResourcesSchema = updatedWaveSpecs.OpsResourcesSchema
		// 	? JSON.stringify(updatedWaveSpecs.OpsResourcesSchema)
		// 	: null;
		// updatedWaveSpecs.OpsResourcesData = updatedWaveSpecs.OpsResourcesData
		// 	? JSON.stringify(updatedWaveSpecs.OpsResourcesData)
		// 	: null;
		const param = req.params.DeliverySpecId;

		if (isNaN(Number(param))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			let deferred = [];

			deferred.push(
				new Promise((resolve, reject) =>
					models.DeliverySpecs.update(updatedDeliveryData, {
						where: {
							id: param,
						},
						transaction: t,
						userEmail: req.tokenData.Email,
					})
						.then((res) => {
							resolve(res);
						})
						.catch((e) => {
							console.log("issue with delivery spec update");
							reject(e);
						})
				)
			);

			deferred.push(
				new Promise((resolve, reject) =>
					models.WaveSpecs.update(updatedWaveSpecs, {
						//fields: waveSpecsInclusions,
						where: { id: updatedWaveSpecs.id },
						transaction: t,
					})
						.then((res) => resolve(res))
						.catch((e) => {
							console.log("issue with wave spec update");
							reject(e);
						})
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

		res.status(200).json({ message: "SUCCESS: Delivery Data Updated." });
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Delivery Data.",
			error: ex.toString(),
		});
	}
};

const Create = async (req, res) => {
	let deliverySpec;
	try {
		const waveSpec = await models.WaveSpecs.findByPk(req.params.WaveId, {
			attributes: ["id", "WaveNumber"],
			include: [
				{
					model: models.CostingProfiles,
					attributes: ["id"],
					include: [
						{ model: models.Projects, attributes: ["id", "ProjectId"] },
					],
				},
				{ model: models.DeliverySpecs },
			],
		});
		if (waveSpec.DeliverySpec) {
			deliverySpec = waveSpec.DeliverySpec;
			return res.status(200).json({
				message: "Info: Delivery Spec Already Exists For this Wave.",
				DeliverySpec: deliverySpec,
			});
		}
		deliverySpec = {
			WaveSpecId: req.params.WaveId,
			DeliveryStatus: "1", //allocation status by default
			ProjectDeliveryNumber: dbHelpers.CreateProjectDeliveryNumber(
				waveSpec.WaveNumber,
				waveSpec.CostingProfile.Project.ProjectId
			),
		};
		const result = await models.sequelize.transaction(async (t) => {
			const createdRecord = await models.DeliverySpecs.create(deliverySpec, {
				transaction: t,
				userEmail: req.tokenData.Email,
			});
			deliverySpec = createdRecord;
			return deliverySpec;
		});

		res.status(201).json({
			message: "SUCCESS: Wave Delivery Spec Created.",
			DeliverySpec: deliverySpec,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Wave Delivery Spec.",
			error: err.toString(),
			DeliverySpec: deliverySpec,
		});
	}
};

module.exports = {
	FetchOne: FetchOne,
	Update: Update,
	FetchDeliveries: FetchDeliveries,
	FetchAll: FetchAll,
	Create: Create,
};
11