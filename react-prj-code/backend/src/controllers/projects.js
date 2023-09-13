const models = require("../models");
const dbHelpers = require("../utils/dbhelpers");
const Op = require("sequelize").Op;
const { QueryTypes } = require('sequelize');

//Exclusions for /filter API
const contractDetailsInclusions = [
	"id",
	"OpportunityName",
	"AccountName",
	"Industry",
	"OpportunityNumber",
	"Stage",
	"Probability",
	"Amount",
	"AmountCurrency",
	"StartofDelivery",
	"EndofDelivery",
	"CloseDate",
	"isSF",
	"updatedAt",
];
const opportunityLineItemDetailsInclusions = [
	"id",
	"WBSNumber",
	"MaterialID",
	"ProductDescription",
	"TotalPriceUSD",
	"OpportunityLineItemID",
	"ProfitCentre",
	"ProjectID",
	"SubBrand",
	"PracticeArea",
];

const costingProfileInclusions = [
	"id",
	"ProfileName",
	"ProfileNumber",
	"ProfileStatus",
	"IsTracker",
	"NumberOfWaves",
	"TrackingFrequency",
	"FieldingCountries",
	"Methodology",
	"ContributionMarginPercent",
	"TotalCostsRaw",
	"Overheads",
	"Markup",
	"NeedsApproval",
	"PriceToClient",
	"TotalInternalCosts",
	"TotalExternalCosts",
	"CostTotalExternalOperations",
	"CostTotalInternalOperations",
	"CostTotalExternalCommercial",
	"CostTotalInternalCommercial",
	"CostingsSheetId",
	"AdditionalSheetId",
	"IsMultiCountry",
	"SubMethodology",
	"ResearchType",
	"FieldType",
	"CostInputCurrency",
	"StudyType",
	"SubMethodology",
	"ResearchType",
	"CommissionedBy",
	"CommissionedDate",
	"IsImportedProfile",
];

const waveSpecsInclusions = [
	"id",
	"WaveNumber",
	"WaveName",
	"WaveStatus",
	"WaveFolderId",
	"ProjectBoxId",
	"WaveFolderId",
	"DateWaveCommissioned",
	"DateFinalQuestionnaire",
	"DateTranslations",
	"DateFieldStart",
	"DateFieldEnd",
	"DateVerbatimCoding",
	"DateDataProcessing",
	"DateCharts",
	"DateDashboards",
	"DateFinalReport",
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
	"NotesFinance",
];

const projectsInclusions = [
	"id",
	"CommissioningOffice",
	"BusinessUnit",
	"IndustryVertical",
	"IsSyndicated",
	"OtherProjectTeamContacts",
	"ProjectId",
	"ProjectName",
	"ProjectStatus",
	"ProposalOwnerEmail",
	"CommissioningCountry",
	"createdAt",
	"NotesProjectStatus",
	"CommissionedProfileId",
	"ProjectManagerEmail",
	"CommissionedBy",
	"ProjectResourcesFolderId",
	"CostingsFolderId",
	"IsImportedProject",
];

const Create = async (req, res) => {
	const project = req.body;
	try {
		const result = await models.sequelize.transaction(async (t) => {
			const createdProject = await models.Projects.create(project, {
				include: [
					{
						model: models.ContractDetails,
						include: [
							{
								model: models.OpportunityLineItemDetails,
								as: "opportunityLineItemDetails",
								include: [{ model: models.CharacteristicValues }],
							},
							{
								model: models.OpportunityContactTeamDetails,
								as: "opportunityContactTeamDetails",
							},
							{
								model: models.OpportunityTeamMemberDetails,
								as: "opportunityTeamMemberDetails",
							},
						],
					},
					// { model: models.CostingProfiles, userEmail: req.tokenData.Email },
				],
				transaction: t,
				userEmail: req.tokenData.Email,
			});

			createdProject.ProjectId = dbHelpers.CreateProjectId(
				createdProject.id,
				createdProject.CommissioningCountry
			);

			await createdProject.save({ fields: ["ProjectId"], transaction: t });

			return createdProject;
		});

		res.status(201).json({
			message: "SUCCESS: Project Created.",
			Project: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Project.",
			error: err.toString(),
		});
	}
};

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
				[Op.or]: {
					IsRestrictedProject: false,
					[Op.and]: {
						IsRestrictedProject: true,
						[Op.or]: {
							OtherProjectTeamContacts: {
								[Op.like]: "%" + clientUser.Email + "%",
							},
							ProposalOwnerEmail: clientUser.Email,
						},
					},
				},
			},
		};

		const results = await models.Projects.findAndCountAll({
			where: condition,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: models.ContractDetails,
					include: [
						{
							model: models.OpportunityLineItemDetails,
							as: "opportunityLineItemDetails",
						},
					],
				},
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.WaveSpecs,
							attributes: waveSpecsInclusions,
						},
					],
				},
			],
		});

		res.status(200).json({
			message: "SUCCESS: Fetched All Projects.",
			items: results.rows, //filteredProjects,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching All Projects.",
			error: ex.toString(),
		});
	}
};

const FetchAllSP = async (req, res) => {
	try {
		//No need to delete this function. Will be useful for reporting related endpoints. Once React side is using FetchProjects, remove all "where" conditions.

		// Auth middleware ValidateToken() puts tokenData in request obj
		const userData = req.tokenData;

		//Using tokendata to find full user record
		const clientUser = await models.Users.findByPk(userData.UserId);
		console.log(clientUser)

		//Pagination
		//const { offset, limit } = req.query;
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);

		let queryImported = "(SELECT DISTINCT p.id, p.ProjectId, p.CommissioningCountry FROM Projects p " +
			"JOIN CostingProfiles cp ON cp.ProjectId = p.id " +
			"JOIN WaveSpecs ws ON ws.CostingProfileId = cp.id " +
			"JOIN CountrySpecs cs ON cs.CostingProfileId = cp.id " +
			"JOIN MethodologySpecs ms ON ms.CountrySpecId = cs.id " +
			"LEFT JOIN SpBudgets sb ON sb.MethodologySpecId = ms.id " +
			"LEFT JOIN ProjectPlannerFolders ppf ON ppf.MethodologySpecId = ms.id " +
			"LEFT JOIN ProjectModuleDetails pmd ON pmd.MethodologySpecId = ms.id " +
			"LEFT JOIN SchedulerAssignees sa ON sa.MethodologySpecId = ms.id " +
			"LEFT JOIN ProjectPlanners pp ON pp.MethodologySpecId = ms.id " +
			"LEFT JOIN SpTasksAssignees sta ON sta.ProjectPlannerId = pp.id " +
			"LEFT JOIN ContractDetails cd ON cd.ProjectId = p.id " +
			"LEFT JOIN OpportunityLineItemDetails ol ON ol.ContractDetailId = cd.id " +
			"WHERE p.ProjectStatus IN (3,30) " +
			"AND p.IsRestrictedProject = false " +
			"AND ((cp.ProfileStatus = 6 AND p.CreatedBy = 'IMPORTED' AND EXISTS (SELECT * FROM SchedulerAssignees sca WHERE sca.MethodologySpecId = ms.id)) || cp.ProfileStatus = 6 AND p.CreatedBy != 'IMPORTED')"

		if (clientUser.SpRole === "CS" || clientUser.SpRole === "E2S" || clientUser.SpRole === "FM" || clientUser.SpRole === "FS" || clientUser.SpRole === "QC" || clientUser.SpRole === "SUD") {
			queryImported = queryImported + "AND (sa.Email = '" + clientUser.Email + "' && " + "sa.IsAccepted = true )"
		}
		else if (clientUser.SpRole === "CC" || clientUser.SpRole === "Country-Admin") {
			queryImported = queryImported + " AND p.CommissioningCountry IN ('" + clientUser.Countries.split(',').join("','").toString() + "')"
		}

		if (req.query.search) {
			if (req.query.type === "ID") {
				queryImported = queryImported + " AND p.ProjectId LIKE '%" + req.query.value + "%'"
			} else if (req.query.type === "NAME") {
				queryImported = queryImported + " AND p.ProjectName LIKE '%" + req.query.value + "%'"
			} else if (req.query.type === "COUNTRY") {
				queryImported = queryImported + " AND p.CommissioningCountry IN ('" + req.query.value.split(',').join("','").toString() + "')"
			}
			else if (req.query.type === "OPPORTUNITYNUMBER") {
				queryImported = queryImported + " AND cd.OpportunityNumber LIKE '%" + req.query.value + "%'"
			}
			else if (req.query.type === "PLANNERSTATUS") {
				queryImported = queryImported + " AND pp.Status LIKE '%" + req.query.value + "%'"
			}
			else if (req.query.type === "ASSIGNEES") {
				queryImported = queryImported + " AND sa.Email LIKE '%" + req.query.value + "%'"
			}
		}

		let countImportedProjects = "(SELECT count(DISTINCT p.id) FROM Projects p " +
			"JOIN CostingProfiles cp ON cp.ProjectId = p.id " +
			"JOIN WaveSpecs ws ON ws.CostingProfileId = cp.id " +
			"JOIN CountrySpecs cs ON cs.CostingProfileId = cp.id " +
			"JOIN MethodologySpecs ms ON ms.CountrySpecId = cs.id " +
			"LEFT JOIN SpBudgets sb ON sb.MethodologySpecId = ms.id " +
			"LEFT JOIN ProjectPlannerFolders ppf ON ppf.MethodologySpecId = ms.id " +
			"LEFT JOIN ProjectModuleDetails pmd ON pmd.MethodologySpecId = ms.id " +
			"LEFT JOIN SchedulerAssignees sa ON sa.MethodologySpecId = ms.id " +
			"LEFT JOIN ProjectPlanners pp ON pp.MethodologySpecId = ms.id " +
			"LEFT JOIN SpTasksAssignees sta ON sta.ProjectPlannerId = pp.id " +
			"LEFT JOIN ContractDetails cd ON cd.ProjectId = p.id " +
			"LEFT JOIN OpportunityLineItemDetails ol ON ol.ContractDetailId = cd.id " +
			"WHERE p.ProjectStatus IN (3,30) " +
			"AND p.IsRestrictedProject = false " +
			"AND ((cp.ProfileStatus = 6 AND p.CreatedBy = 'IMPORTED' AND EXISTS (SELECT * FROM SchedulerAssignees sca WHERE sca.MethodologySpecId = ms.id)) || cp.ProfileStatus = 6 AND p.CreatedBy != 'IMPORTED')"

		if (clientUser.SpRole === "CS" || clientUser.SpRole === "E2S" || clientUser.SpRole === "FM" || clientUser.SpRole === "FS" || clientUser.SpRole === "QC" || clientUser.SpRole === "SUD") {
			countImportedProjects = countImportedProjects + "AND (sa.Email = '" + clientUser.Email + "' && " + "sa.IsAccepted = true )"
		}
		if (clientUser.SpRole === "CC" || clientUser.SpRole === "Country-Admin") {
			countImportedProjects = countImportedProjects + " AND p.CommissioningCountry IN ('" + clientUser.Countries.split(',').join("','").toString() + "')"
		}

		if (req.query.search) {
			if (req.query.type === "ID") {
				countImportedProjects = countImportedProjects + " AND p.ProjectId LIKE '%" + req.query.value + "%')"
			} else if (req.query.type === "NAME") {
				countImportedProjects = countImportedProjects + " AND p.ProjectName LIKE '%" + req.query.value + "%')"
			} else if (req.query.type === "COUNTRY") {
				countImportedProjects = countImportedProjects + " AND p.CommissioningCountry IN ('" + req.query.value.split(',').join("','").toString() + "'))"
			}
			else if (req.query.type === "OPPORTUNITYNUMBER") {
				countImportedProjects = countImportedProjects + " AND cd.OpportunityNumber LIKE '%" + req.query.value + "%')"
			}
			else if (req.query.type === "PLANNERSTATUS") {
				countImportedProjects = countImportedProjects + " AND pp.Status LIKE '%" + req.query.value + "%')"
			}
			else if (req.query.type === "ASSIGNEES") {
				countImportedProjects = countImportedProjects + " AND sa.Email LIKE '%" + req.query.value + "%')"
			}
		} else {
			countImportedProjects = countImportedProjects + ")"
		}

		const projectsCountQuery = await models.sequelize.query(countImportedProjects,
			{ type: QueryTypes.SELECT })

		let projectsCount = projectsCountQuery.map((count) => count["count(DISTINCT p.id)"])

		queryImported = queryImported + " ORDER BY p.id desc LIMIT  " + offset + ",  " + limit + ")"
		const rawQuery = await models.sequelize.query(queryImported,
			{ type: QueryTypes.SELECT })
		const projectIds = rawQuery.map(result => result.id)

		const results = await models.Projects.findAll({
			where: {
				id: projectIds
			},
			as: "Projects",
			order: [["id", "DESC"]],
			include: [
				{
					model: models.CostingProfiles,
					as: "CostingProfiles",
					where: {
						ProfileStatus: 6,
					},
					include: [
						{
							model: models.WaveSpecs,
							separate: true,
						},
						{
							model: models.CountrySpecs,
							separate: true,
							include: [
								{
									model: models.MethodologySpecs,
									separate: true,
									include: [
										{
											model: models.SpBudget,
											separate: true,
										},
										{
											model: models.ProjectPlannerFolders,
											separate: true,
										},
										{
											model: models.ProjectModuleDetail,
											separate: true,
										},
										{
											model: models.ProjectPlanner,
											separate: true,
											include: [
												{
													model: models.SpTasksAssignees,
													separate: true,
												},
												{
													model: models.SpTasksDate,
													separate: true,
												},
											],
										},
										{
											model: models.SchedulerAssignees,
											// where: schedulerAssigneesCondition,
											separate: true,
										},
									],
								},
							],
						},
					],
				},
				{
					model: models.ContractDetails,
					// where: contractDetailsCondition,
					as: "ContractDetails",
					include: [
						{
							model: models.OpportunityLineItemDetails,
							as: "opportunityLineItemDetails",
						},
					],
				},
			],
		});
		let projects = {
			rows: results,
			count: projectsCount
		};

		// projects.rows = [...new Set(projects.rows)]
		// console.log("projects length: " + projects.rows.length);
		// console.log("projects count: " + projects.count);
		res.status(200).json({
			message: "SUCCESS: Fetched All Projects.",
			items: projects.rows, //filteredProjects,
			totalItems: projects.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		console.log("Error While Trying SpBudget", ex);
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching All Projects.",
			error: ex.toString(),
		});
	}
};

const FetchAllForProjectPlanners = async (req, res) => {
	try {
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);
		const { projectId, countrySpecId, methodologySpecId } = req.query;
		let condition = {};
		if (projectId) {
			condition['ProjectId'] = { [Op.eq]: projectId }
		}
		let countryCondition = {}
		if (countrySpecId) {
			countryCondition['id'] = countrySpecId
		}
		let methodologyCondition = {}
		if (methodologySpecId) {
			methodologyCondition['id'] = methodologySpecId
		}

		const results = await models.Projects.findAndCountAll({
			where: condition,
			distinct: true,
			order: [["id", "DESC"]],
			include: [
				{
					model: models.CostingProfiles,
					as: "CostingProfiles",
					where: {
						ProfileStatus: 6,
					},
					include: [
						{
							model: models.WaveSpecs,
							separate: true,
						},
						{
							model: models.CountrySpecs,
							where: countryCondition,
							separate: true,
							include: [
								{
									model: models.MethodologySpecs,
									where: methodologyCondition,
									separate: true,
									include: [
										{
											model: models.SpBudget,
											separate: true,
										},
										{
											model: models.ProjectPlannerFolders,
											separate: true,
										},
										{
											model: models.ProjectModuleDetail,
											separate: true,
										},
										{
											model: models.ProjectPlanner,
											separate: true,
											include: [
												{
													model: models.SpTasksAssignees,
													separate: true,
												},
												{
													model: models.SpTasksDate,
													separate: true,
												},
											],
										},
										{
											model: models.SchedulerAssignees,
											separate: true,
										},
									],
								},
							],
						},
					],
				},
				{
					model: models.ContractDetails,
					include: [
						{
							model: models.OpportunityLineItemDetails,
							as: "opportunityLineItemDetails",
						},
					],
				},
			],
		});

		console.log("projects length: " + results.rows.length);
		console.log("projects count: " + results.count);
		res.status(200).json({
			message: "Successfully fetched projects.",
			items: results.rows,
			totalItems: results.count,
			offset: offset,
			limit: limit,
		});
	} catch (ex) {
		console.log("Error While Trying SpBudget", ex);
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching All Projects.",
			error: ex.toString(),
		});
	}
};

const FetchProjects = async (req, res) => {
	try {
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
		//find all access limiters
		const allowedBusinessUnits =
			objectJson.businessUnits || clientUser.BusinessUnits.split(",");
		const allowedVerticals =
			objectJson.verticals || clientUser.Verticals.split(",");
		const allowedCountries =
			objectJson.countries || clientUser.Countries.split(",");
		let projectId = objectJson.projectId || "";
		let projectName = objectJson.projectName || "";
		let accountName = objectJson.accountName || "";
		let opNumber = objectJson.opNumber || "";
		let projectStatus = objectJson.projectStatus || [];
		let myProject = objectJson.myProject ? true : false;
		let teamProject = objectJson.teamProject ? true : false;
		let projectmanager = objectJson.projectmanager || "";
		let proposalOwner = objectJson.proposalOwner || "";
		if (objectJson.projectmanager === null)
			projectmanager = null

		//Pagination
		//const { offset, limit } = req.query;
		const { limit, offset } = dbHelpers.GetPagination(
			req.query.limit,
			req.query.offset
		);
		//Access restricted
		let condition = {
			[Op.and]: {
				CommissioningCountry: allowedCountries,
				BusinessUnit: allowedBusinessUnits,
				// IndustryVertical: allowedVerticals,
				ProjectId: {
					[Op.like]: "%" + projectId + "%",
				},
				projectName: {
					[Op.like]: "%" + projectName + "%",
				},
				ProposalOwnerEmail: {
					[Op.like]: "%" + proposalOwner + "%",
				},
				[Op.or]: {

					IsRestrictedProject: false,
					[Op.and]: {
						IsRestrictedProject: true,
						[Op.or]: {
							OtherProjectTeamContacts: {
								[Op.like]: "%" + clientUser.Email + "%",
							},
							ProposalOwnerEmail: clientUser.Email,
						},
					},
				},
			},
		};
		if (projectmanager === null) {
			condition = {
				...condition,
				[Op.and]: {
					...condition[Op.and],
					ProjectManagerEmail: null
				},
			};
		}
		if (projectmanager && projectmanager.length !== 0) {
			condition = {
				...condition,
				[Op.and]: {
					...condition[Op.and],
					ProjectManagerEmail: {
						[Op.like]: "%" + projectmanager + "%",
					},
				},
			};
		}

		if (projectStatus.length > 0) {
			condition = {
				...condition,
				[Op.and]: {
					...condition[Op.and],
					projectStatus: projectStatus,
				},
			};
		}
		if (myProject) {
			condition = {
				...condition,
				[Op.and]: {
					...condition[Op.and],
					ProposalOwnerEmail: clientUser.Email,
				},
			};
		}
		if (teamProject) {
			condition = {
				...condition,
				[Op.and]: {
					...condition[Op.and],
					OtherProjectTeamContacts: {
						[Op.like]: "%" + clientUser.Email + "%",
					},
				},
			};
		}
		await models.Projects.findAndCountAll({
			where: condition,
			attributes: projectsInclusions,
			distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			include: [
				{
					required: accountName.length > 0 || opNumber.length > 0 ? true : false,
					model: models.ContractDetails,
					attributes: contractDetailsInclusions,
					where: {
						[Op.and]: {
							AccountName: {
								[Op.like]: "%" + accountName + "%",
							},
							OpportunityNumber: {
								[Op.like]: "%" + opNumber + "%",
							},
						},
					},
					include: [
						{
							model: models.OpportunityLineItemDetails,
							as: "opportunityLineItemDetails",
							attributes: opportunityLineItemDetailsInclusions,
						},
					],
				},
				{
					model: models.CostingProfiles,
					attributes: costingProfileInclusions,
					include: [
						{
							model: models.WaveSpecs,
							attributes: waveSpecsInclusions,
						},
					],
				},
			],
		})
			.then((results) => {
				res.status(200).json({
					message: "SUCCESS: Fetched the Projects.",
					items: results.rows, //filteredProjects,
					totalItems: results.count,
					offset: offset,
					limit: limit,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "ERROR: Something Went Wrong While Fetching the Projects.",
					error: err.toString(),
				});
			});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching the Projects.",
			error: ex.toString(),
		});
	}
};

const FetchOne = (req, res) => {
	let projectId = req.params.ProjectId;

	if (projectId.length != 12) {
		//project id string is always 12 chars
		throw "Invalid Parameter.";
	}
	models.Projects.findOne({
		where: {
			ProjectId: projectId,
		},
		include: [
			{
				model: models.ContractDetails,
				include: [
					{
						model: models.OpportunityLineItemDetails,
						as: "opportunityLineItemDetails",
						include: [{ model: models.CharacteristicValues }],
					},
					{
						model: models.OpportunityContactTeamDetails,
						as: "opportunityContactTeamDetails",
					},
					{
						model: models.OpportunityTeamMemberDetails,
						as: "opportunityTeamMemberDetails",
					},
				],
			},
			{
				model: models.CostingProfiles,
				include: [
					{
						model: models.ProfileSettings,
						attributes: ["CurrenciesData", "id"],
					},
					{
						model: models.CountrySpecs,
						separate: true,
						include: [
							{
								model: models.MethodologySpecs,
								separate: true,
							},
						],
					},
					{
						model: models.WaveSpecs,
					},
				]
			},
		],
	})

		.then((result) => {
			if (result) {
				res.status(200).json({
					message: "SUCCESS: Fetched Project " + req.params.ProjectId,
					project: result,
				});
			} else {
				res.status(404).json({
					message: "INFO: No Projects Found for this ID.",
					ProjectId: req.params.ProjectId,
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

const FetchOneSP = (req, res) => {
	let projectId = req.params.ProjectId;
	if (projectId.length != 12) {
		//project id string is always 12 chars
		throw "Invalid Parameter.";
	}
	models.Projects.findOne({
		where: {
			ProjectId: projectId,
		},
		include: [
			{
				model: models.CostingProfiles,
				include: [
					{
						model: models.CountrySpecs,
						separate: true,
						include: [
							{
								model: models.MethodologySpecs,
								separate: true,
							},
						],
					},
				],
			},
			{
				model: models.ContractDetails,
				include: [
					{
						model: models.OpportunityLineItemDetails,
						as: "opportunityLineItemDetails",
					},
				],
			},
		],
	})

		.then((result) => {
			if (result) {
				res.status(200).json({
					message: "SUCCESS: Fetched Project " + req.params.ProjectId,
					project: result,
				});
			} else {
				res.status(404).json({
					message: "INFO: No Projects Found for this ID.",
					ProjectId: req.params.ProjectId,
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

const TrashOne = async (req, res) => {
	try {
		let projectId = req.params.projectId;
		if (isNaN(Number(projectId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.Projects.destroy({
				where: { id: projectId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Project Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Project.",
			error: err.toString(),
		});
	}
};

const TrashOpportunity = async (req, res) => {
	try {
		let contractId = req.params.contractId;
		if (isNaN(Number(contractId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.ContractDetails.destroy({
				where: { id: contractId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Opportuntiy Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Opportunity.",
			error: err.toString(),
		});
	}
};

const SpUpdate = (req, res) => {
	const updatedProjectData = req.body;
	let projectId = req.params.ProjectId;
	if (projectId.length != 12) {
		//project id string is always 12 chars
		throw "Invalid Parameter.";
	}
	models.Projects.update(updatedProjectData, {
		where: {
			ProjectId: projectId,
		},
	})
		.then((results) => {
			res.status(200).json({
				message: "SUCCESS: Project Schedule Status Updated.",
				items: results,
			});
		})
		.catch((ex) => {
			res.status(500).json({
				message:
					"ERROR: Something Went Wrong While Updating Schedule Status Of Project.",
				error: ex.toString(),
			});
		});
};

const Update = async (req, res) => {
	const updatedProjectData = req.body;

	try {
		let projectId = req.params.ProjectId;

		if (projectId.length != 12) {
			//project id string is always 12 chars
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			//console.log("Transaction");
			await models.Projects.update(updatedProjectData, {
				where: {
					ProjectId: projectId,
				},
				transaction: t,
				userEmail: req.tokenData.Email,
			}).catch((ex) => {
				console.log("F1");
				//console.log("Error is: " + ex);
				throw ex;
			});

			if (updatedProjectData.ContractDetails) {
				for (const contract of updatedProjectData.ContractDetails) {
					//Look for new contracts (looking for null contract Ids)
					if (!contract.id) {
						//console.log("new contract", contract);
						contract.ProjectId = updatedProjectData.id;
						await models.ContractDetails.create(contract, {
							transaction: t,
							userEmail: req.tokenData.Email,
							include: [
								{
									model: models.OpportunityLineItemDetails,
									as: "opportunityLineItemDetails",
									include: [{ model: models.CharacteristicValues }],
								},
								{
									model: models.OpportunityContactTeamDetails,
									as: "opportunityContactTeamDetails",
								},
								{
									model: models.OpportunityTeamMemberDetails,
									as: "opportunityTeamMemberDetails",
								},
							],
						}).catch((ex) => {
							console.log("F2");
							throw ex;
						});
					} else {
						await models.ContractDetails.update(contract, {
							where: { id: contract.id },
							transaction: t,
							userEmail: req.tokenData.Email,
						}).catch((ex) => {
							console.log("F3");
							throw ex;
						});
					}
				}
			}

			if (updatedProjectData.CostingProfiles) {
				//Ensure Costing Profile Methodology,Submethodology and Fielding Countries are not in the payload object.
				for (const profile of updatedProjectData.CostingProfiles) {
					const reducedProfileContent = { ProfileName: profile.ProfileName };
					await models.CostingProfiles.update(reducedProfileContent, {
						where: { id: profile.id },
						transaction: t,
						userEmail: req.tokenData.Email,
					}).catch((ex) => {
						console.log("F4");
						throw ex;
					});
				}
			}
		});

		await res.status(200).json({ message: "SUCCESS: Project Updated." });
	} catch (ex) {
		console.log("Error is: " + ex);
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Project.",
			error: ex.toString(),
		});
	}
};

const UpdateName = async (req, res) => {
	//TODO: attach Gdrive related renaming.
	const updatedProjectName = req.params.NewProjectName;
	try {
		let projectId = req.params.ProjectId;
		if (projectId.length != 12) {
			//project id string is always 12 chars
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			//console.log("Transaction");
			await models.Projects.update(
				{ ProjectName: updatedProjectName },
				{
					where: {
						ProjectId: projectId,
					},
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			).catch((ex) => {
				// console.log("F1");
				//console.log("Error is: " + ex);
				throw ex;
			});
		});

		await res.status(200).json({ message: "SUCCESS: Project Name Updated." });
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Project Name.",
			error: ex.toString(),
		});
	}
};

module.exports = {
	Create: Create,
	FetchOne: FetchOne,
	SpUpdate: SpUpdate,
	Update: Update,
	UpdateName: UpdateName,
	FetchProjects: FetchProjects,
	FetchAll: FetchAll,
	FetchAllSP: FetchAllSP,
	FetchOneSP: FetchOneSP,
	TrashOne: TrashOne,
	FetchAllForProjectPlanners: FetchAllForProjectPlanners,
	TrashOpportunity:TrashOpportunity
};
