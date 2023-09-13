const models = require("../models");
const dbHelpers = require("../utils/dbhelpers");
const googleDrive = require("../utils/googleDrive");
const path = require("path");
const Op = require("sequelize").Op;
const emailing = require("../utils/sendMail");
const ejs = require("ejs");
var pdf = require("html-pdf");
const fs = require("fs");
const _ = require("lodash");
const dirPathToKey = path.join(__dirname, "../config/formSchemas/default/taskslistSchema/default.json");

const FetchCurrencies = async (req, res) => {
	try {
		const result = await models.Countries.findAll({
			where: {
				ConversionRateToLocal: {
					[Op.ne]: null,
				},
			},
			attributes: ["id", "Code", "Label", "CurrencyUnit", "ConversionRateToLocal"],
		});

		if (result) {
			res.status(200).json({
				message: "SUCCESS: Fetched All Available Currencies",
				currencies: result,
			});
		} else {
			res.status(404).json({
				message: "INFO: No Currencies Found.",
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching currencies.",
			error: err.toString(),
		});
	}
};

const CreateProjectFolders = async (req, res) => {
	const projectId = req.params.ProjectId;
	try {
		const project = await models.Projects.findByPk(projectId, {
			attributes: ["ProjectId", "id", "ProjectName", "VerticalId", "CostingsFolderId", "ProjectResourcesFolderId"],
		});

		if (!project) {
			throw "Could Not Locate Project.";
		}
		if (project.ProjectResourcesFolderId && project.CostingsFolderId) {
			throw "Folders Already Exist For This Project.";
		}

		const verticalId = project.VerticalId;
		const vertical = await models.Verticals.findByPk(verticalId, {
			attributes: ["Id", "CostingsFolderId", "ProjectResourcesFolderId"],
		});

		if (!vertical) {
			throw "Could Not Locate Root Folder Location.";
		}
		const resourceFolderId = vertical.ProjectResourcesFolderId;
		const costingFolderId = vertical.CostingsFolderId;
		const folderName = project.ProjectId + " " + project.ProjectName;
		//if nulll throw error
		const CostingFileMetadataInProject = {
			name: folderName,
			mimeType: "application/vnd.google-apps.folder",
			parents: [costingFolderId],
		};
		const ResourceFileMetadataInProject = {
			name: folderName,
			mimeType: "application/vnd.google-apps.folder",
			parents: [resourceFolderId],
		};
		const deferred = [];
		deferred.push(
			new Promise((resolve, reject) =>
				googleDrive
					.createFolder(CostingFileMetadataInProject)
					.then((res) => resolve(res))
					.catch((e) => reject(e))
			)
		);
		deferred.push(
			new Promise((resolve, reject) =>
				googleDrive
					.createFolder(ResourceFileMetadataInProject)
					.then((res) => resolve(res))
					.catch((e) => reject(e))
			)
		);
		await Promise.all(deferred)
			.then((folderIds) => {
				project.CostingsFolderId = folderIds[0];
				project.ProjectResourcesFolderId = folderIds[1];
			})
			.catch((e) => {
				throw e;
			});
		await project.save();
		res.status(201).json({
			message: "SUCCESS: Project Folders Created.",
			ProjectResourcesFolderId: project.ProjectResourcesFolderId,
			CostingsFolderId: project.CostingsFolderId,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Project Folders.",
			error: ex.toString(),
		});
	}
};
const CreateWaveFolderAndPbox = async (req, res) => {
	const waveId = req.params.WaveId;
	try {
		const waveSpecs = await models.WaveSpecs.findByPk(waveId, {
			attributes: ["WaveFolderId", "ProjectBoxId", "id", "WaveName", "WaveNumber"],
			include: [
				{
					model: models.CostingProfiles,
					attributes: ["id", "ProfileName", "ProfileNumber", "AdditionalSheetId", "CostingsSheetId"],
					include: [
						{
							model: models.Projects,
							attributes: ["ProjectId", "id", "ProjectName", "VerticalId", "CostingsFolderId", "ProjectResourcesFolderId"],
						},
					],
				},
			],
		});
		if (!waveSpecs) {
			throw "Could Not Locate Wave Record.";
		}
		if (waveSpecs.WaveFolderId) {
			throw "Wave Folder Already Exists.";
		}

		const project = waveSpecs.CostingProfile.Project.dataValues;
		if (!project) {
			throw "Could Not Locate Project.";
		}

		if (!project.ProjectResourcesFolderId) {
			throw "Could Not Locate Project Resources Folder.";
		}

		const verticalId = project.VerticalId;
		const vertical = await models.Verticals.findByPk(verticalId, {
			attributes: ["id", "ProjectResourcesFolderTemplateId", "ProjectBoxTemplateId"],
		});

		if (!vertical.ProjectResourcesFolderTemplateId) {
			throw "Could Not Locate Folder Template.";
		}

		if (!vertical.ProjectBoxTemplateId) {
			throw "Could Not Locate ProjectBox Template.";
		}

		const waveFolderName = `${" #"}${waveSpecs.WaveNumber}${" "}${waveSpecs.WaveName ? waveSpecs.WaveName : ""}`;
		const WaveInProjectResourceFolder = {
			name: waveFolderName,
			mimeType: "application/vnd.google-apps.folder",
			parents: [project.ProjectResourcesFolderId],
		};
		const createdFolderId = await googleDrive.createFolder(WaveInProjectResourceFolder);

		waveSpecs.WaveFolderId = createdFolderId;
		//TODO: once wave folder is created, then we need to grab vertical.ProjectResourcesFolderTemplateId and copy it's content into created wave folder.
		//TODO: renaming of Project folder, Costing Folder, Costing Sheet, Additional Sheet, Wave Folder, Pbox or any other generated docs on project/profile/wave renaming client-side

		//source, //target TODO: revisit recursive folder creation
		//await googleDrive.copyFolder(vertical.ProjectResourcesFolderTemplateId, createdFolderId);
		const sheetName = `ProjectBox - ${project.ProjectId}${" "}${project.ProjectName}${" #"}${waveSpecs.WaveNumber}${" "}${waveSpecs.WaveName ? waveSpecs.WaveName : ""}`;
		const createdPboxId = await googleDrive.copySheet(sheetName, waveSpecs.WaveFolderId, vertical.ProjectBoxTemplateId);
		waveSpecs.ProjectBoxId = createdPboxId;
		await waveSpecs.save();
		res.status(201).json({
			message: "SUCCESS: Wave Folder and ProjectBox Created.",
			WaveFolderId: createdFolderId,
			ProjectBoxId: createdPboxId,
		});
	} catch (ex) {
		return res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Wave Folder.",
			error: ex.toString(),
		});
	}
};
// const CCS = async (req, res) => {
// 	try {
// 		const ResourceFileMetadataInProject = {
// 			name: "lll",
// 			mimeType: "application/vnd.google-apps.folder",
// 			parents: ["1cPBbAxkswJiBetABggr8dgJaz48YbRVY"],
// 		};

// 		const res1 = googleDrive.createFolder(ResourceFileMetadataInProject);
// 		console.log(res1, "ppp");
// 		const res = await googleDrive.copyFolder("1cPBbAxkswJiBetABggr8dgJaz48YbRVY", "1cGeUWMLyVSrP-oYlj8Vx4sqQ34JnJi0u");
// 		console.log(res);
// 	} catch (ex) {
// 		return res.status(500).json({
// 			message: "ERROR: Something Went Wrong While Creating Wave Folder.",
// 			error: ex.toString(),
// 		});
// 	}
// };

const CreateDriveFolders = async (req) => {
	try {
		const CountryYearFolder = {
			name: req.CommissioningCountry + "_" + new Date().getFullYear(),
			mimeType: "application/vnd.google-apps.folder",
		};

		const createCountryYearFolderId = await googleDrive.createSpFolder(CountryYearFolder, req.Assignees);

		const MonthFolder = {
			name: "M" + new Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(new Date()),
			mimeType: "application/vnd.google-apps.folder",
			parents: [createCountryYearFolderId],
		};

		const createMonthFolderId = await googleDrive.createSpFolder(MonthFolder);

		const FunctionFolder = {
			name: req.Function,
			mimeType: "application/vnd.google-apps.folder",
			parents: [createMonthFolderId],
		};

		const createFunctionFolderId = await googleDrive.createSpFolder(FunctionFolder);

		const ClientNameFolder = {
			name: req.IndustryVertical,
			mimeType: "application/vnd.google-apps.folder",
			parents: [createFunctionFolderId],
		};

		const creatClientNameFolderId = await googleDrive.createSpFolder(ClientNameFolder);

		const ProjectNameNumberFolder = {
			name: req.ProjectNameNumber,
			mimeType: "application/vnd.google-apps.folder",
			parents: [creatClientNameFolderId],
		};

		const creatProjectNameNumberFolderId = await googleDrive.createSpFolder(ProjectNameNumberFolder);

		const countryYearData = {
			MethodologySpecId: req.MethodologySpecId,
			FolderId: createCountryYearFolderId,
		};

		const monthData = {
			MethodologySpecId: req.MethodologySpecId,
			ParentFolderId: createCountryYearFolderId,
			FolderId: createMonthFolderId,
		};

		const functionData = {
			MethodologySpecId: req.MethodologySpecId,
			ParentFolderId: createMonthFolderId,
			FolderId: createFunctionFolderId,
		};

		const clientNameData = {
			MethodologySpecId: req.MethodologySpecId,
			ParentFolderId: createFunctionFolderId,
			FolderId: creatClientNameFolderId,
		};

		const projectNameNumberData = {
			MethodologySpecId: req.MethodologySpecId,
			ParentFolderId: creatClientNameFolderId,
			FolderId: creatProjectNameNumberFolderId,
		};

		const data = [countryYearData, monthData, functionData, clientNameData, projectNameNumberData];

		await models.ProjectPlannerFolders.bulkCreate(data);
	} catch (err) {
		console.log(err);
	}
};

const CreateCostingSheet = async (req, res) => {
	const costingProfileId = req.params.CostingProfileId;
	try {
		const costingProfile = await models.CostingProfiles.findByPk(costingProfileId, {
			attributes: ["id", "ProfileName", "ProfileNumber", "AdditionalSheetId", "CostingsSheetId", "IsMultiCountry"],
			include: [
				{
					model: models.Projects,
					attributes: ["ProjectId", "id", "ProjectName", "VerticalId", "CostingsFolderId", "ProjectResourcesFolderId"],
				},
				{
					model: models.CountrySpecs,
					include: [
						{ model: models.MethodologySpecs }
					]
				}
			],
		});

		if (!costingProfile) {
			throw "Could Not Locate Costing Profile.";
		}
		if (costingProfile.CostingsSheetId) {
			throw "Costings Sheet Already Exists For This Profile.";
		}
		const project = costingProfile.Project.dataValues;

		if (!project.CostingsFolderId) {
			throw "Costings Folder Missing For This Project.";
		}

		const verticalId = project.VerticalId;
		const vertical = await models.Verticals.findByPk(verticalId, {
			attributes: ["id", "GlobalCostingSheetTemplateId", "AdditionalSheetTemplateId"],
		});

		if (!vertical.GlobalCostingSheetTemplateId) {
			throw "Could Not Locate Costing Sheet Template.";
		}

		const sheetName = `Costing Sheet - ${project.ProjectId}${" "}${project.ProjectName}${" #"}${costingProfile.ProfileNumber}${" "}${costingProfile.ProfileName ? costingProfile.ProfileName : ""}`;

		const createdSheetId = await googleDrive.copySheet(sheetName, project.CostingsFolderId, vertical.GlobalCostingSheetTemplateId);
		// console.log(
		// 	"profileinfo",
		// 	costingProfile.IsMultiCountry,
		// 	costingProfile.id
		// );
		await googleDrive.createMultipleTabs(_.head(costingProfile.CountrySpecs).MethodologySpecs, createdSheetId)
		// await googleDrive.copySubMethSheets(_.head(costingProfile.CountrySpecs).MethodologySpecs, createdSheetId)
		await googleDrive.prepareSheet(createdSheetId, sheetName, costingProfile.IsMultiCountry);

		await googleDrive.SheetHideStudytype(createdSheetId, costingProfile.IsMultiCountry);

		costingProfile.CostingsSheetId = createdSheetId;
		await costingProfile.save();
		res.status(201).json({
			message: "SUCCESS: Costing Sheet Created.",
			CostingsSheetId: createdSheetId,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Costing Sheet.",
			error: ex.toString(),
		});
	}
};

const CreateAdditionalSheet = async (req, res) => {
	const costingProfileId = req.params.CostingProfileId;
	try {
		const costingProfile = await models.CostingProfiles.findByPk(costingProfileId, {
			attributes: ["id", "ProfileName", "ProfileNumber", "AdditionalSheetId", "CostingsSheetId"],
			include: [
				{
					model: models.Projects,
					attributes: ["ProjectId", "id", "ProjectName", "VerticalId", "CostingsFolderId", "ProjectResourcesFolderId"],
				},
			],
		});

		if (!costingProfile) {
			throw "Could Not Locate Costing Profile.";
		}
		if (costingProfile.AdditionalSheetId) {
			throw "Additional Sheet Already Exists For This Profile.";
		}
		const project = costingProfile.Project.dataValues;

		if (!project.CostingsFolderId) {
			throw "Costings Folder Missing For This Project.";
		}

		const verticalId = project.VerticalId;
		const vertical = await models.Verticals.findByPk(verticalId, {
			attributes: ["id", "GlobalCostingSheetTemplateId", "AdditionalSheetTemplateId"],
		});

		if (!vertical.AdditionalSheetTemplateId) {
			throw "Could Not Locate Additional Sheet Template.";
		}

		const sheetName = `Additional Sheet - ${project.ProjectId}${" "}${project.ProjectName}${" #"}${costingProfile.ProfileNumber}${" "}${costingProfile.ProfileName ? costingProfile.ProfileName : ""}`;

		//if null throw error
		const createdSheetId = await googleDrive.copySheet(sheetName, project.CostingsFolderId, vertical.AdditionalSheetTemplateId);

		costingProfile.AdditionalSheetId = createdSheetId;
		await costingProfile.save();
		res.status(201).json({
			message: "SUCCESS: Additional Sheet Created.",
			AdditionalSheetId: createdSheetId,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Additional Sheet.",
			error: ex.toString(),
		});
	}
};
// const getSheetsData = async (CountrySpecs, sheetId) => {
// 	let data = []
// 	let allnames = []
// 	CountrySpecs.map(cs => {
// 		if (cs.MethodologySpecs)
// 			cs.MethodologySpecs.map((ms) => {
// 				allnames.push(`${ms.Label} (${ms.Code})`)
// 				data.push(googleDrive.fetchSheetData(sheetId, `${ms.Label} (${ms.Code})`))
// 			})
// 	})
// 	await Promise.all(data)
// 	data.map(d => {
// 		console.log(d, "current d")
// 		console.log(d.values, "current d")
// 	})
// 	console.log(data, "Data in getSheetsData")
// 	console.log(data, "Data in getSheetsData")

// 	console.log(allnames, "allnames in getSheetsData")
// 	return data
// }
const SyncCostingSheet = async (req, res) => {
	try {
		const costingProfile = await models.CostingProfiles.findByPk(req.params.CostingProfileId, {
			attributes: ["CostingsSheetId", "id"],
			include: [
				{
					model: models.CountrySpecs,
					include: [{ model: models.MethodologySpecs }],
				},
			],
		});

		if (!costingProfile) {
			throw "Could Not Find Costing Profile.";
		}

		if (!costingProfile.CostingsSheetId) {
			throw "Could Not Find Costing Sheet For This Profile.";
		}

		if (!costingProfile.CountrySpecs) {
			throw "Could Not Find Country Specs For This Profile.";
		}

		const sheetId = costingProfile.CostingsSheetId

		let allMethCodes = _.head(costingProfile.CountrySpecs).MethodologySpecs.map(meth => meth.Code)

		let requiredSheetNamesData = await googleDrive.fetchSheetNames(sheetId, allMethCodes)
		let requiredSheetNames = requiredSheetNamesData.sheets
		let submethodologySheetFetchPromises = [];
		let isOldSheet = requiredSheetNamesData.isOldSheet;
		if (requiredSheetNames && requiredSheetNames.length) {
			requiredSheetNames.map(sheet => {
				submethodologySheetFetchPromises.push(googleDrive.fetchSheetData(sheetId, sheet.properties.title, sheet.properties.gridProperties, _.head(_.head(costingProfile.CountrySpecs).MethodologySpecs)));
			})
		}
		const formattedSheetData = await Promise.all(submethodologySheetFetchPromises)
			.then((res) => {
				return res.reduce((dict, submeth) => {
					let key = Object.keys(submeth)[0];
					dict[key] = submeth[key];
					return dict;
				}, {});
			})
			.catch((err) => {
				throw err;
			});

		console.log(formattedSheetData);


		await models.sequelize.transaction(async (t) => {
			let deferredUpdatesList = []; //using promises for faster async updates.


			let countryspecs = costingProfile.CountrySpecs


			countryspecs.map(async (country) => {
				let currentCountry = {}
				currentCountry.MethodologySpecs = country.MethodologySpecs.map((ms) => {
					let currentMeth = {}
					if (formattedSheetData[ms.Code]) {
						if (formattedSheetData[ms.Code]["SheetsCostsData"]
							&& formattedSheetData[ms.Code]["SheetsCostsData"][country.CountryCode]) {
							currentMeth.CostsData = JSON.stringify(formattedSheetData[ms.Code]["SheetsCostsData"][country.CountryCode])
						}
						if (formattedSheetData[ms.Code]["SheetsTimingsData"]
							&& formattedSheetData[ms.Code]["SheetsTimingsData"][country.CountryCode]) {
							currentMeth.TimingsData = JSON.stringify(formattedSheetData[ms.Code]["SheetsTimingsData"][country.CountryCode])
						}
					}
					deferredUpdatesList.push(
						new Promise((resolve, reject) => {
							models.MethodologySpecs.update(currentMeth, {
								where: {
									id: ms.id,
								},
								transaction: t,
							})
								.then((res) => {
									console.log("Methodology update: " + ms.id);
									resolve(res);
								})
								.catch((e) => {
									console.log("Methodology Update failed " + e);
									reject(e);
								});
						})
					);

					return { ...currentMeth }
				})



			})

			await Promise.all(deferredUpdatesList)
				.then((res) => {
					console.log("finish");
					return res;
				})
				.catch((e) => {
					console.error("Issue in promises");
					throw e;
				});
		});

		const refreshedProfile = await models.CostingProfiles.findOne({
			where: { id: req.params.CostingProfileId },
			include: [{ model: models.Projects, include: [models.ContractDetails] }, { model: models.ProfileSettings }, { model: models.WaveSpecs }, { model: models.CountrySpecs, include: [models.MethodologySpecs] }],
		});

		return res.status(200).json({
			message: "SUCCESS: Costing Sheet Sync Complete.",
			//only sending the data below for spot checking visually via Postman etc. Otherwise no need. Can remove once testing is complete.
			// CostingProfile: costingProfile,
			data: formattedSheetData,
			isOldSheet,
			CostingProfile: refreshedProfile
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Syncing Cost Sheet.",
			error: ex.toString(),
		});
	}
};

const getLabels = async (Project) => {
	const OfficeOptions = await models.Offices.findOne({
		where: { Code: Project.CommissioningOffice },
	});
	// const CommissioningCountriesOptions = models.Countries.findOne({
	// 	where: { Code: Project.CommissioningCountry },
	// });
	const CommissioningCountriesOptions = await models.Countries.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.Countries,
	});
	const BusinessUnitOptions = await models.BusinessUnits.findOne({
		where: { Code: Project.BusinessUnit },
	});
	const VerticalOptions = await models.Verticals.findOne({
		where: { Code: Project.IndustryVertical },
	});
	const MethodologyOptions = await models.Methodologies.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.Methodologies,
	});
	await Promise.all([OfficeOptions, BusinessUnitOptions, MethodologyOptions, CommissioningCountriesOptions, VerticalOptions]);
	return {
		CommissioningCountry: CommissioningCountriesOptions.map((fc) => fc.dataValues).filter((fc) => fc.Code == Project.CommissioningCountry)[0].Label,
		CommissioningOffice: OfficeOptions.dataValues ? OfficeOptions.dataValues.Label : "",
		IndustryVertical: VerticalOptions.dataValues ? VerticalOptions.dataValues.Label : "",
		MethodologyOptions: MethodologyOptions.map((fc) => fc.dataValues),
	};
};
const applySpLabels = async (waveData) => {
	const OfficeOptions = await models.Offices.findOne({
		where: { Code: waveData.CommissioningOffice },
	});
	const BusinessUnitOptions = await models.BusinessUnits.findOne({
		where: { Code: waveData.BusinessUnit },
	});
	const VerticalOptions = await models.Verticals.findOne({
		where: { Code: waveData.IndustryVertical },
	});
	const FieldingCountriesOptions = await models.Countries.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.Countries,
	});
	const MethodologyOptions = await models.Methodologies.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.Methodologies,
	});
	const SubMethodologyOptions = await models.SubMethodologies.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.SubMethodologies,
	});
	const TrackingFrequencyOptions = await models.CodeLabels.findAll({
		attributes: [],
		model: models.CodeLabels,
		where: { Code: "TrackingFrequency" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});

	const DataProcessingComplexityOptions = await models.CodeLabels.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.CodeLabels,
		where: { Code: "DataProcessingComplexity" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});

	const ChartingComplexityOptions = await models.CodeLabels.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.CodeLabels,
		where: { Code: "ChartingComplexity" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});

	const QuestionnaireComplexityOptions = await models.CodeLabels.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.CodeLabels,
		where: { Code: "QuestionnaireComplexity" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});
	await Promise.all([OfficeOptions, BusinessUnitOptions, FieldingCountriesOptions, MethodologyOptions, SubMethodologyOptions, TrackingFrequencyOptions]);
	return {
		OfficeOptions: OfficeOptions.dataValues,
		BusinessUnitOptions: BusinessUnitOptions.dataValues,
		VerticalOptions: VerticalOptions.dataValues,
		FieldingCountriesOptions: FieldingCountriesOptions.map((fc) => fc.dataValues),
		MethodologyOptions: MethodologyOptions.map((fc) => fc.dataValues),
		SubMethodologyOptions: SubMethodologyOptions.map((fc) => fc.dataValues),
		TrackingFrequencyOptions: TrackingFrequencyOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
		DataProcessingComplexityOptions: DataProcessingComplexityOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
		ChartingComplexityOptions: ChartingComplexityOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
		QuestionnaireComplexityOptions: QuestionnaireComplexityOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
	};
};

const applyLabels = async (waveData) => {
	const OfficeOptions = await models.Offices.findOne({
		where: { Code: waveData.CostingProfile.Project.CommissioningOffice },
	});
	const BusinessUnitOptions = await models.BusinessUnits.findOne({
		where: { Code: waveData.CostingProfile.Project.BusinessUnit },
	});
	const VerticalOptions = await models.Verticals.findOne({
		where: { Code: waveData.CostingProfile.Project.IndustryVertical },
	});
	const FieldingCountriesOptions = await models.Countries.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.Countries,
	});
	const MethodologyOptions = await models.Methodologies.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.Methodologies,
	});
	const SubMethodologyOptions = await models.SubMethodologies.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.SubMethodologies,
	});
	const TrackingFrequencyOptions = await models.CodeLabels.findAll({
		attributes: [],
		model: models.CodeLabels,
		where: { Code: "TrackingFrequency" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});

	const DataProcessingComplexityOptions = await models.CodeLabels.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.CodeLabels,
		where: { Code: "DataProcessingComplexity" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});

	const ChartingComplexityOptions = await models.CodeLabels.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.CodeLabels,
		where: { Code: "ChartingComplexity" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});

	const QuestionnaireComplexityOptions = await models.CodeLabels.findAll({
		attributes: ["Code", "Label", "id"],
		model: models.CodeLabels,
		where: { Code: "QuestionnaireComplexity" },
		include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
	});
	await Promise.all([OfficeOptions, BusinessUnitOptions, FieldingCountriesOptions, MethodologyOptions, SubMethodologyOptions, TrackingFrequencyOptions]);
	return {
		OfficeOptions: OfficeOptions.dataValues,
		BusinessUnitOptions: BusinessUnitOptions.dataValues,
		VerticalOptions: VerticalOptions.dataValues,
		FieldingCountriesOptions: FieldingCountriesOptions.map((fc) => fc.dataValues),
		MethodologyOptions: MethodologyOptions.map((fc) => fc.dataValues),
		SubMethodologyOptions: SubMethodologyOptions.map((fc) => fc.dataValues),
		TrackingFrequencyOptions: TrackingFrequencyOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
		DataProcessingComplexityOptions: DataProcessingComplexityOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
		ChartingComplexityOptions: ChartingComplexityOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
		QuestionnaireComplexityOptions: QuestionnaireComplexityOptions[0].dataValues.CodeLabelOptions.map((fc) => fc.dataValues),
	};
};
const SendEwnEmails = async (req, res) => {
	try {
		let waveData = await models.WaveSpecs.findByPk(req.params.WaveId, {
			include: [
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.CountrySpecs,
							include: [{ model: models.MethodologySpecs }],
						},
						{
							model: models.Projects,
							// include: [{ model: models.ContractDetails }],
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
							],
						},
					],
				},
			],
		});
		const currencies = await models.Countries.findAll({
			where: {
				ConversionRateToLocal: {
					[Op.ne]: null,
				},
			},
			attributes: ["id", "Code", "Label", "CurrencyUnit", "ConversionRateToLocal"],
		});
		if (!waveData) {
			throw "No Wave Data Found.";
		}

		waveData.EWNVersion = waveData.EWNVersion ? waveData.EWNVersion + 1 : 1;

		const businessUnitSettings = await models.BusinessUnits.findByPk(waveData.CostingProfile.Project.BusinessUnitId);

		if (!businessUnitSettings) {
			throw "Could not locate EWN Recepient Settings.";
		}
		//console.log(waveData);
		let internalEwnRecepients = [];
		let externalEwnRecepients = [];

		const ewnSender = req.tokenData.Email; // always send both EWN emails to who triggered
		const proposalOwner = waveData.CostingProfile.Project.ProposalOwnerEmail.label; //always send both
		internalEwnRecepients.push(ewnSender);
		externalEwnRecepients.push(ewnSender);
		internalEwnRecepients.push(proposalOwner);
		externalEwnRecepients.push(proposalOwner);

		const intOpsPM = businessUnitSettings.EwnInternalOpsPM ? businessUnitSettings.EwnInternalOpsPM.split(",") : []; //Always send Internal EWN only, also used for piping text inside EWNs
		const extOpsPM = businessUnitSettings.EwnExternalOpsPM ? businessUnitSettings.EwnExternalOpsPM.split(",") : []; //Always send ext ewn only

		internalEwnRecepients = internalEwnRecepients.concat(intOpsPM);
		externalEwnRecepients = externalEwnRecepients.concat(extOpsPM);

		let OpsResourcesData = {};
		if (waveData.OpsResourcesData) OpsResourcesData = waveData.OpsResourcesData;

		if (!waveData.DateFinalQuestionnaireNA) {
			const intContactSp = businessUnitSettings.EwnInternalProgramming ? businessUnitSettings.EwnInternalProgramming.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactSp);

			if (OpsResourcesData && OpsResourcesData.surveyProgrammingResource == "External") {
				const extContactSp = businessUnitSettings.EwnExternalProgramming ? businessUnitSettings.EwnExternalProgramming.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactSp);
			}
		}
		if (!waveData.DateTranslationsNA) {
			const intContactTranslations = businessUnitSettings.EwnInternalTranslations ? businessUnitSettings.EwnInternalTranslations.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactTranslations);
			if (OpsResourcesData && OpsResourcesData.translationsResource == "External") {
				const extContactTranslations = businessUnitSettings.EwnExternalTranslations ? businessUnitSettings.EwnExternalTranslations.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactTranslations);
			}
		}
		if (!waveData.DateFieldworkNA) {
			const intContactFW = businessUnitSettings.EwnInternalFieldwork ? businessUnitSettings.EwnInternalFieldwork.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactFW);
			//todo: add external check case for fieldworks
			const extContactFW = businessUnitSettings.EwnExternalFieldwork ? businessUnitSettings.EwnExternalFieldwork.split(",") : [];
			externalEwnRecepients = externalEwnRecepients.concat(extContactFW);
		}
		if (!waveData.DateVerbatimCodingNA) {
			const intContactCoding = businessUnitSettings.EwnInternalVerbatimCoding ? businessUnitSettings.EwnInternalVerbatimCoding.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactCoding);
			if (OpsResourcesData && OpsResourcesData.verbatimCodingResource == "External") {
				const extContactCoding = businessUnitSettings.EwnExternalVerbatimCoding ? businessUnitSettings.EwnExternalVerbatimCoding.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactCoding);
			}
		}
		if (!waveData.DateDataProcessingNA) {
			const intContactDP = businessUnitSettings.EwnInternalDataProcessing ? businessUnitSettings.EwnInternalDataProcessing.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactDP);
			if (OpsResourcesData && OpsResourcesData.dataProcessingResource == "External") {
				const extContactDP = businessUnitSettings.EwnExternalDataProcessing ? businessUnitSettings.EwnExternalDataProcessing.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactDP);
			}
		}
		if (!waveData.DateChartsNA) {
			const intContactChart = businessUnitSettings.EwnInternalCharts ? businessUnitSettings.EwnInternalCharts.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactChart);
			if (OpsResourcesData && OpsResourcesData.chartingResource == "External") {
				const extContactChart = businessUnitSettings.EwnExternalCharts ? businessUnitSettings.EwnExternalCharts.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactChart);
			}
		}
		if (!waveData.DateDashboardsNA) {
			const intContactDB = businessUnitSettings.EwnInternalDashboards ? businessUnitSettings.EwnInternalDashboards.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactDB);
			if (OpsResourcesData && OpsResourcesData.dashboardingResource == "External") {
				const extContactDB = businessUnitSettings.EwnExternalDashboards ? businessUnitSettings.EwnExternalDashboards.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactDB);
			}
		}

		if (waveData.NotesDataScience) {
			//sending if notes available
			const intContactDsci = businessUnitSettings.EwnInternalDashboards ? businessUnitSettings.EwnInternalDashboards.split(",") : [];
			internalEwnRecepients = internalEwnRecepients.concat(intContactDsci);
			if (OpsResourcesData && OpsResourcesData.dataScienceResource == "External") {
				const extContactDsci = businessUnitSettings.EwnExternalDataScience ? businessUnitSettings.EwnExternalDataScience.split(",") : [];
				externalEwnRecepients = externalEwnRecepients.concat(extContactDsci);
			}
		}
		if (waveData.IncludeProjectTeamInComms) {
			let otherTeamContacts = waveData.CostingProfile.Project.OtherProjectTeamContacts; // pending incomplete. extract emails (currently array of label/value objects)
			otherTeamContacts = otherTeamContacts && otherTeamContacts.length ? otherTeamContacts.map((otc) => otc.value) : [];
			internalEwnRecepients = internalEwnRecepients.concat(otherTeamContacts);
		}

		const dedupedEmailsInternalTo = internalEwnRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const dedupedEmailsExternalTo = externalEwnRecepients.filter((v, i, a) => a.indexOf(v) === i);

		let codeLabels = {};
		await applyLabels(waveData).then((res) => {
			codeLabels = res;
		});
		const emailBodyInternal = await ejs.renderFile(path.join("src", waveData.CostingProfile.IsImportedProfile ? "views/ewnInternal-migratedProj.ejs" : "views/ewnInternal.ejs"), {
			wave: waveData,
			currencies,
			opsContacts: intOpsPM,
			ewnSender: ewnSender,
			codeLabels: codeLabels,
		});

		const emailBodyExternal = await ejs.renderFile(path.join("src", waveData.CostingProfile.IsImportedProfile ? "views/ewnExternal-migratedProj.ejs" : "views/ewnExternal.ejs"), {
			wave: waveData,
			currencies,
			opsContacts: intOpsPM,
			ewnSender: ewnSender,
			codeLabels: codeLabels,
		});
		const subjectTextInternal = `${waveData.EWNVersion > 1 ? "Updated EWN: " : "EWN: New "}Project Commissioned - ${waveData.CostingProfile.Project.ProjectName} (${waveData.CostingProfile.Project.ProjectId}) | v${waveData.EWNVersion}`;
		const subjectTextExternal = `(EXT) ${waveData.EWNVersion > 1 ? "Updated EWN: " : "EWN: New "}Project Commissioned - ${waveData.CostingProfile.Project.ProjectName} (${waveData.CostingProfile.Project.ProjectId}) | v${waveData.EWNVersion
			}`;
		await emailing.SendEmail(emailBodyInternal, dedupedEmailsInternalTo, subjectTextInternal);
		await emailing.SendEmail(emailBodyExternal, dedupedEmailsExternalTo, subjectTextExternal);
		await waveData.save();
		res.status(201).json({
			message: "SUCCESS: Both Internal And External EWNs Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending EWNs.",
			error: ex.toString(),
		});
	}
};

const SendFinanceScheduleEmail = async (req, res) => {
	try {
		const waveData = await models.WaveSpecs.findByPk(req.params.WaveId, {
			include: [
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.CountrySpecs,
							include: [{ model: models.MethodologySpecs }],
						},
						{
							model: models.Projects,
							include: [{ model: models.ContractDetails }],
						},
					],
				},
			],
		});
		const currencies = await models.Countries.findAll({
			where: {
				ConversionRateToLocal: {
					[Op.ne]: null,
				},
			},
			attributes: ["id", "Code", "Label", "CurrencyUnit", "ConversionRateToLocal"],
		});
		if (!waveData) {
			throw "No Wave Data Found.";
		}
		const businessUnitSettings = await models.BusinessUnits.findByPk(waveData.CostingProfile.Project.BusinessUnitId);

		if (!businessUnitSettings) {
			throw "Could not locate default recepients.";
		}
		let notificationRecepients = [];
		const financeContacts = businessUnitSettings.EwnInternalFinance ? businessUnitSettings.EwnInternalFinance.split(",") : [];
		notificationRecepients = notificationRecepients.concat(financeContacts);
		const proposalOwner = waveData.CostingProfile.Project.ProposalOwnerEmail.label;
		notificationRecepients.push(proposalOwner);
		const ewnSender = req.tokenData.Email;
		notificationRecepients.push(ewnSender);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		let codeLabels = {};
		await applyLabels(waveData).then((res) => {
			codeLabels = res;
		});
		const emailBodyInternal = await ejs.renderFile(path.join("src", "views/financeNotificationTemplate.ejs"), {
			wave: waveData,
			ewnSender: ewnSender,
			codeLabels: codeLabels,
		});

		const subjectText = `Schedule Update - ${waveData.CostingProfile.Project.ProjectName} (${waveData.CostingProfile.Project.ProjectId}) | ${waveData.EWNVersion ? "v" + waveData.EWNVersion : "v1"}`;

		await emailing.SendEmail(emailBodyInternal, dedupedEmailsTo, subjectText);
		res.status(201).json({
			message: "SUCCESS: Finance Schedule Update Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Finance Schedule Update Notification.",
			error: ex.toString(),
		});
	}
};

const SendNewApprovalRequestEmail = async (req, res) => {
	try {
		const costingProfile = await models.CostingProfiles.findByPk(req.params.CostingProfileId, {
			include: [
				{
					model: models.Projects,
					include: [{ model: models.ContractDetails }],
				},
			],
		});
		if (!costingProfile.ApprovalDetails || costingProfile.ApprovalLevelAwaiting == null) {
			throw "No Costing Profile Approval Info Found.";
		}

		costingProfile.ApprovalVersionNumber = costingProfile.ApprovalVersionNumber ? costingProfile.ApprovalVersionNumber + 1 : 1;

		const approverData = dbHelpers.FetchApprovalMailContent(costingProfile);
		//console.log(approverData);
		const proposalOwner = costingProfile.Project.ProposalOwnerEmail.label;
		const approvalRequestor = req.tokenData.Email;
		costingProfile.ApprovalRequestor = approvalRequestor;
		const notificationRecepients = approverData.Emails;
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(approvalRequestor);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const approvalLevelLabel = approverData.Label;
		let codeLabels = {};
		await getLabels(costingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/approvalRequest.ejs"), {
			costingProfile: costingProfile,
			approvalRequestor: approvalRequestor,
			notificationRecepients: dedupedEmailsTo,
			approvalLevelLabel: approverData.Label,
			bypassJustification: approverData.BypassJustification,
			isBypassed: approverData.IsBypassed,
			codeLabels: codeLabels,
		});

		const subjectText = `${approvalLevelLabel} Approval ${approverData.IsBypassed ? "Bypassed" : "Requested"} - ${costingProfile.Project.ProjectName} (${costingProfile.Project.ProjectId}) | ${costingProfile.ApprovalVersionNumber ? "v" + costingProfile.ApprovalVersionNumber : "v1"
			}`;

		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await costingProfile.save();
		res.status(201).json({
			message: "SUCCESS: Approval Request Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Approval Request Notification.",
			error: ex.toString(),
		});
	}
};

const SendApprovalRequestCompleteEmail = async (req, res) => {
	try {
		const costingProfile = await models.CostingProfiles.findByPk(req.params.CostingProfileId, {
			include: [
				{
					model: models.Projects,
					include: [{ model: models.ContractDetails }],
				},
			],
		});
		if (!costingProfile.ApprovalDetails || costingProfile.ApprovalLevelAwaiting == null) {
			throw "No Costing Profile Approval Info Found.";
		}

		costingProfile.ApprovalVersionNumber = costingProfile.ApprovalVersionNumber ? costingProfile.ApprovalVersionNumber + 1 : 1;
		const approverData = dbHelpers.FetchApprovalMailContent(costingProfile);
		//console.log(approverData);
		const proposalOwner = costingProfile.Project.ProposalOwnerEmail.label;
		const approver = req.tokenData.Email;
		const notificationRecepients = approverData.Emails;
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(approver);
		notificationRecepients.push(costingProfile.ApprovalRequestor);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const approvalLevelLabel = approverData.Label;
		let codeLabels = {};
		await getLabels(costingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/approvalGranted.ejs"), {
			costingProfile: costingProfile,
			approver: approver,
			notificationRecepients: dedupedEmailsTo,
			approvalLevelLabel: approverData.Label,
			bypassJustification: approverData.BypassJustification,
			isBypassed: approverData.IsBypassed,
			codeLabels: codeLabels,
		});

		const subjectText = `${approvalLevelLabel} Approval ${approverData.IsBypassed ? "Bypassed" : "Granted"} - ${costingProfile.Project.ProjectName} (${costingProfile.Project.ProjectId}) | ${costingProfile.ApprovalVersionNumber ? "v" + costingProfile.ApprovalVersionNumber : "v1"
			}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await costingProfile.save();
		res.status(201).json({
			message: "SUCCESS: Approval Granted Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Approval Granted Notification.",
			error: ex.toString(),
		});
	}
};

const SendApprovalRequestCancelledEmail = async (req, res) => {
	try {
		const costingProfile = await models.CostingProfiles.findByPk(req.params.CostingProfileId, {
			include: [
				{
					model: models.Projects,
					include: [{ model: models.ContractDetails }],
				},
			],
		});
		if (!costingProfile.ApprovalDetails || costingProfile.ApprovalLevelAwaiting == null) {
			throw "No Costing Profile Approval Info Found.";
		}

		costingProfile.ApprovalVersionNumber = costingProfile.ApprovalVersionNumber ? costingProfile.ApprovalVersionNumber + 1 : 1;
		const approverData = dbHelpers.FetchApprovalMailContent(costingProfile);
		//console.log(approverData);
		const proposalOwner = costingProfile.Project.ProposalOwnerEmail.label;
		const user = req.tokenData.Email;
		const notificationRecepients = approverData.Emails;
		notificationRecepients.push(user);
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(costingProfile.ApprovalRequestor);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const approvalLevelLabel = approverData.Label;
		let codeLabels = {};
		await getLabels(costingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/approvalRequestCancelled.ejs"), {
			costingProfile: costingProfile,
			user: user,
			notificationRecepients: dedupedEmailsTo,
			approvalLevelLabel: approverData.Label,
			bypassJustification: approverData.BypassJustification,
			isBypassed: approverData.IsBypassed,
			codeLabels: codeLabels,
		});

		const subjectText = `${approvalLevelLabel} Approval Request ${approverData.IsBypassed ? "Bypassed" : "Withdrawn"} - ${costingProfile.Project.ProjectName} (${costingProfile.Project.ProjectId}) | ${costingProfile.ApprovalVersionNumber ? "v" + costingProfile.ApprovalVersionNumber : "v1"
			}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await costingProfile.save();
		res.status(201).json({
			message: "SUCCESS: Approval Withdrawl Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Approval Withdrawl Notification.",
			error: ex.toString(),
		});
	}
};

const SendApprovalRequestDeniedEmail = async (req, res) => {
	try {
		const costingProfile = await models.CostingProfiles.findByPk(req.params.CostingProfileId, {
			include: [
				{
					model: models.Projects,
					include: [{ model: models.ContractDetails }],
				},
			],
		});
		if (!costingProfile.ApprovalDetails || costingProfile.ApprovalLevelAwaiting == null) {
			throw "No Costing Profile Approval Info Found.";
		}

		costingProfile.ApprovalVersionNumber = costingProfile.ApprovalVersionNumber ? costingProfile.ApprovalVersionNumber + 1 : 1;
		const approverData = dbHelpers.FetchApprovalMailContent(costingProfile);
		//console.log(approverData);
		const proposalOwner = costingProfile.Project.ProposalOwnerEmail.label;
		const approvalRequestor = req.tokenData.Email;
		const notificationRecepients = approverData.Emails;
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(approvalRequestor);
		notificationRecepients.push(costingProfile.ApprovalRequestor);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const approvalLevelLabel = approverData.Label;
		let codeLabels = {};
		await getLabels(costingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/approvalDenied.ejs"), {
			costingProfile: costingProfile,
			approver: approvalRequestor,
			notificationRecepients: dedupedEmailsTo,
			approvalLevelLabel: approverData.Label,
			bypassJustification: approverData.BypassJustification,
			isBypassed: approverData.IsBypassed,
			codeLabels: codeLabels,
		});

		const subjectText = `${approvalLevelLabel} Approval ${approverData.IsBypassed ? "Bypassed" : "Denied"} - ${costingProfile.Project.ProjectName} (${costingProfile.Project.ProjectId}) | ${costingProfile.ApprovalVersionNumber ? "v" + costingProfile.ApprovalVersionNumber : "v1"
			}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await costingProfile.save();
		res.status(201).json({
			message: "SUCCESS: Approval Denied Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Approval Denied Notification.",
			error: ex.toString(),
		});
	}
};

const SendRequestCreatedEmail = async (req, res) => {
	try {
		const request = await models.Requests.findByPk(req.params.RequestId, {
			include: [
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.Projects,
							include: [{ model: models.ContractDetails }],
						},
					],
				},
			],
		});
		if (!request) {
			throw "No Request Info Found.";
		}
		if (!request.CostingProfile) {
			throw "No Costing Profile Info Found.";
		}

		request.RequestVersionNumber = request.RequestVersionNumber ? request.RequestVersionNumber + 1 : 1;

		let notificationRecepients = [];

		const sessionUser = req.tokenData.Email;
		const requestCreator = request.RequestorEmail;
		const proposalOwner = request.CostingProfile.Project.ProposalOwnerEmail.label;
		const agentEmail = request.AgentEmail ? request.AgentEmail.split(",") : [];
		const ccEmails = request.CCAgentEmails ? request.CCAgentEmails.split(",") : [];
		console.log(sessionUser, requestCreator, proposalOwner, agentEmail, ccEmails);
		notificationRecepients.push(sessionUser);
		//console.log("sessionUser", notificationRecepients);
		notificationRecepients.push(proposalOwner);
		//console.log("proposalOwner", notificationRecepients);
		notificationRecepients.push(requestCreator);
		//console.log("requestCreator", notificationRecepients);
		notificationRecepients = notificationRecepients.concat(agentEmail);
		//console.log("agentEmail", notificationRecepients);
		notificationRecepients = notificationRecepients.concat(ccEmails);
		//console.log("ccEmails", notificationRecepients);
		//console.log("All", notificationRecepients);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		//console.log("deduped", dedupedEmailsTo);
		const requestTypeLabel = request.RequestType;
		let codeLabels = {};
		await getLabels(request.CostingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/requestCreated.ejs"), {
			request: request,
			requestCreator: sessionUser,
			notificationRecepients: dedupedEmailsTo,
			requestTypeLabel: requestTypeLabel,
			codeLabels: codeLabels,
		});

		const subjectText = `New ${requestTypeLabel} Request Created - ${request.CostingProfile.Project.ProjectName} (${request.CostingProfile.Project.ProjectId}) | ${request.RequestVersionNumber ? "v" + request.RequestVersionNumber : "v1"}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await request.save();
		res.status(201).json({
			message: "SUCCESS: New Request Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending New Request Notification.",
			error: ex.toString(),
		});
	}
};

const SendRequestUpdatedEmail = async (req, res) => {
	try {
		const request = await models.Requests.findByPk(req.params.RequestId, {
			include: [
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.Projects,
							include: [{ model: models.ContractDetails }],
						},
					],
				},
			],
		});
		if (!request) {
			throw "No Request Info Found.";
		}
		if (!request.CostingProfile) {
			throw "No Costing Profile Info Found.";
		}

		request.RequestVersionNumber = request.RequestVersionNumber ? request.RequestVersionNumber + 1 : 1;

		let notificationRecepients = [];

		const sessionUser = req.tokenData.Email;
		const requestCreator = request.RequestorEmail;
		const proposalOwner = request.CostingProfile.Project.ProposalOwnerEmail.label;
		const agentEmail = request.AgentEmail ? request.AgentEmail.split(",") : [];
		const ccEmails = request.CCAgentEmails ? request.CCAgentEmails.split(",") : [];

		notificationRecepients.push(sessionUser);
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(requestCreator);
		notificationRecepients = notificationRecepients.concat(agentEmail);
		notificationRecepients = notificationRecepients.concat(ccEmails);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const requestTypeLabel = request.RequestType;
		let codeLabels = {};
		await getLabels(request.CostingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/requestUpdated.ejs"), {
			request: request,
			sessionUser: sessionUser,
			notificationRecepients: dedupedEmailsTo,
			requestTypeLabel: requestTypeLabel,
			codeLabels: codeLabels,
		});

		const subjectText = `${requestTypeLabel} Request Updated - ${request.CostingProfile.Project.ProjectName} (${request.CostingProfile.Project.ProjectId}) | ${request.RequestVersionNumber ? "v" + request.RequestVersionNumber : "v1"}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await request.save();
		res.status(201).json({
			message: "SUCCESS: Request Updated Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Request Updated Notification.",
			error: ex.toString(),
		});
	}
};

const SendRequestClosedEmail = async (req, res) => {
	try {
		const request = await models.Requests.findByPk(req.params.RequestId, {
			include: [
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.Projects,
							include: [{ model: models.ContractDetails }],
						},
					],
				},
			],
		});
		if (!request) {
			throw "No Request Info Found.";
		}
		if (!request.CostingProfile) {
			throw "No Costing Profile Info Found.";
		}

		request.RequestVersionNumber = request.RequestVersionNumber ? request.RequestVersionNumber + 1 : 1;

		let notificationRecepients = [];

		const sessionUser = req.tokenData.Email;
		const requestCreator = request.RequestorEmail;
		const proposalOwner = request.CostingProfile.Project.ProposalOwnerEmail.label;
		const agentEmail = request.AgentEmail ? request.AgentEmail.split(",") : [];
		const ccEmails = request.CCAgentEmails ? request.CCAgentEmails.split(",") : [];

		notificationRecepients.push(sessionUser);
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(requestCreator);
		notificationRecepients = notificationRecepients.concat(agentEmail);
		notificationRecepients = notificationRecepients.concat(ccEmails);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const requestTypeLabel = request.RequestType;
		let codeLabels = {};
		await getLabels(request.CostingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/requestClosed.ejs"), {
			request: request,
			sessionUser: sessionUser,
			notificationRecepients: dedupedEmailsTo,
			requestTypeLabel: requestTypeLabel,
			codeLabels: codeLabels,
		});

		const subjectText = `${requestTypeLabel} Request Closed - ${request.CostingProfile.Project.ProjectName} (${request.CostingProfile.Project.ProjectId}) | ${request.RequestVersionNumber ? "v" + request.RequestVersionNumber : "v1"}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await request.save();
		res.status(201).json({
			message: "SUCCESS: Request Closed Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Request Closed Notification.",
			error: ex.toString(),
		});
	}
};

const SendRequestReOpenedEmail = async (req, res) => {
	try {
		const request = await models.Requests.findByPk(req.params.RequestId, {
			include: [
				{
					model: models.CostingProfiles,
					include: [
						{
							model: models.Projects,
							include: [{ model: models.ContractDetails }],
						},
					],
				},
			],
		});
		if (!request) {
			throw "No Request Info Found.";
		}
		if (!request.CostingProfile) {
			throw "No Costing Profile Info Found.";
		}

		request.RequestVersionNumber = request.RequestVersionNumber ? request.RequestVersionNumber + 1 : 1;

		let notificationRecepients = [];

		const sessionUser = req.tokenData.Email;
		const requestCreator = request.RequestorEmail;
		const proposalOwner = request.CostingProfile.Project.ProposalOwnerEmail.label;
		const agentEmail = request.AgentEmail ? request.AgentEmail.split(",") : [];
		const ccEmails = request.CCAgentEmails ? request.CCAgentEmails.split(",") : [];

		notificationRecepients.push(sessionUser);
		notificationRecepients.push(proposalOwner);
		notificationRecepients.push(requestCreator);
		notificationRecepients = notificationRecepients.concat(agentEmail);
		notificationRecepients = notificationRecepients.concat(ccEmails);
		const dedupedEmailsTo = notificationRecepients.filter((v, i, a) => a.indexOf(v) === i);
		const requestTypeLabel = request.RequestType;
		let codeLabels = {};
		await getLabels(request.CostingProfile.Project).then((result) => {
			codeLabels = result;
		});
		const emailBody = await ejs.renderFile(path.join("src", "views/requestReopened.ejs"), {
			request: request,
			sessionUser: sessionUser,
			notificationRecepients: dedupedEmailsTo,
			requestTypeLabel: requestTypeLabel,
			codeLabels: codeLabels,
		});

		const subjectText = `${requestTypeLabel} Request Re-opened - ${request.CostingProfile.Project.ProjectName} (${request.CostingProfile.Project.ProjectId}) | ${request.RequestVersionNumber ? "v" + request.RequestVersionNumber : "v1"}`;

		//console.log(dedupedEmailsTo);
		await emailing.SendEmail(emailBody, dedupedEmailsTo, subjectText);

		await request.save();
		res.status(201).json({
			message: "SUCCESS: Request Re-opened Notification Sent.",
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Sending Request Re-opened Notification.",
			error: ex.toString(),
		});
	}
};

const PrepareTest = async (req, res) => {
	var sheetId = "18s45bcx-9sopF-mHyShV3X5ebsFLzZnugdeKm3SkTic";
	await googleDrive.SheetUnlock(sheetId);
};

const SpProjectSchedule = async (data, from, to) => {
	try {
		let codeLabels = {};
		await applySpLabels(data).then((res) => {
			codeLabels = res;
		});
		const expectedFWS = data.CostingProfiles
			? data.CostingProfiles[0].WaveSpecs[0].DateFieldStart
				? new Intl.DateTimeFormat("en-US", {
					year: "numeric",
					month: "short",
					day: "2-digit",
				}).format(new Date(Date.parse(data.CostingProfiles[0].WaveSpecs[0].DateFieldStart)))
				: "No FWS Start date available"
			: null;

		const func = data.CostingProfiles ? (data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].Label.toString().toLowerCase().includes("telephone") ? "CATI" : "FIELD") : null;

		const body = await ejs.renderFile(path.join("src", "views/planner/projectSchedule.ejs"), {
			data: data,
			codeLabels: codeLabels,
			expectedFieldWorkStartDate: expectedFWS,
			func: func,
		});
		const subject = "New Project Scheduled -" + data.ProjectName + " - " + data.ProjectId;
		await emailing.SendSpEmail(body, to, subject);
		console.log("Email Sent!");
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const SpProjectInvite = async (data, project) => {
	try {
		let plannerId;

		await models.ProjectPlanner.findAll({
			where: {
				MethodologySpecId: data.MethodologySpecId,
				[Op.and]: {
					IsActive: true,
					[Op.and]: {
						IsCompleted: false,
					},
				},
			},
		}).then(function (list) {
			plannerId = list[0].dataValues.id;
		});

		var fwStartTask = "FWStart";
		var fwEndTask = "FWEnd";
		var FWStartDate = [];
		var FWEndDate = [];

		var researchType = project.CostingProfiles ? (project.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : project.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE") : null;

		if (researchType === "ONLINE") {
			fwStartTask = "FullLaunch";
			fwEndTask = "FWCompletion";
		} else if (researchType === "QUAL") {
			fwEndTask = "FWFinished";
		}

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannerId,
				[Op.and]: {
					Task: fwStartTask,
				},
			},
		}).then(function (list) {
			list.map((fwStart) => FWStartDate.push(fwStart.dataValues));
		});

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannerId,
				[Op.and]: {
					Task: fwEndTask,
				},
			},
		}).then(function (list) {
			list.map((fwEnd) => FWEndDate.push(fwEnd.dataValues));
		});

		const FWStart = FWStartDate.length ? (JSON.parse(FWStartDate[0].PlannedDate) ? JSON.parse(FWStartDate[0].PlannedDate).current.date : "TBD") : "TBD";
		const FWEnd = FWEndDate.length ? (JSON.parse(FWEndDate[0].ActualDate) ? JSON.parse(FWEndDate[0].ActualDate).current.date : "TBD") : "TBD";

		const emails = [data.Email];
		const body = await ejs.renderFile(path.join("src", "views/planner/projectInvite.ejs"), {
			data: project,
			FWStart: FWStart,
			FWEnd: FWEnd,
		});
		const subject = "Added to Project -" + project.ProjectName + " - " + project.ProjectId;

		await emailing.SendSpEmail(body, emails, subject);
		console.log("Email Sent!");
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const SpProjectPauseResume = async (data, projectModuleDetail) => {
	try {
		const ScheduleAssignees = data.projectData.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].SchedulerAssignees;

		const emails = [...new Set(ScheduleAssignees.map((assignee) => assignee.Email))];

		let plannerId;

		await models.ProjectPlanner.findAll({
			where: {
				MethodologySpecId: projectModuleDetail.MethodologySpecId,
				[Op.and]: {
					IsActive: true,
					[Op.and]: {
						IsCompleted: false,
					},
				},
			},
		}).then(function (list) {
			plannerId = list[0].dataValues.id;
		});

		var fwStartTask = "FWStart";
		var FWStartDate = [];

		var researchType = data.projectData.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.projectData.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		if (researchType === "ONLINE") {
			fwStartTask = "FullLaunch";
			fwEndTask = "FWCompletion";
		} else if (researchType === "QUAL") {
			fwEndTask = "FWFinished";
		}

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannerId,
				[Op.and]: {
					Task: fwStartTask,
				},
			},
		}).then(function (list) {
			list.map((fwStart) => FWStartDate.push(fwStart.dataValues));
		});

		const FWStart = FWStartDate.length ? (JSON.parse(FWStartDate[0].PlannedDate) ? JSON.parse(FWStartDate[0].PlannedDate).current.date : "TBD") : "TBD";

		const body = await ejs.renderFile(path.join("src", data.pause ? "views/planner/projectPause.ejs" : "views/planner/projectResume.ejs"), {
			data: data.projectData,
			result: data.data,
			projectModuleDetail: projectModuleDetail,
			FWStart: FWStart,
		});
		const subject = data.pause ? "Project Hold: " + data.projectData.ProjectName + " - " + data.projectData.ProjectId : "Project Resume: " + data.projectData.ProjectName + " - " + data.projectData.ProjectId;
		await emailing.SendSpEmail(body, emails, subject);
		console.log("Email Sent!");
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const SpProjectActivityAssignment = async (data, plannedDates) => {
	try {
		const ScheduleAssignees = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].SchedulerAssignees;

		var file = JSON.parse(fs.readFileSync(dirPathToKey));

		var fwStartTask = "FWStart";
		var fwEndTask = "FWEnd";
		var FWStartDate = [];
		var FWEndDate = [];

		var researchType = data.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		if (researchType === "ONLINE") {
			fwStartTask = "FullLaunch";
			fwEndTask = "FWCompletion";
		} else if (researchType === "QUAL") {
			fwEndTask = "FWFinished";
		}

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannedDates[0].ProjectPlannerId,
				[Op.and]: {
					Task: fwStartTask,
				},
			},
		}).then(function (list) {
			list.map((fwStart) => FWStartDate.push(fwStart.dataValues));
		});

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannedDates[0].ProjectPlannerId,
				[Op.and]: {
					Task: fwEndTask,
				},
			},
		}).then(function (list) {
			list.map((fwEnd) => FWEndDate.push(fwEnd.dataValues));
		});

		const FWStart = FWStartDate.length ? (JSON.parse(FWStartDate[0].PlannedDate) ? JSON.parse(FWStartDate[0].PlannedDate).current.date : "TBD") : "TBD";
		const FWEnd = JSON.parse(FWEndDate[0].PlannedDate) ? JSON.parse(FWEndDate[0].PlannedDate).current.date : null;

		var currentWave = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.filter((planner) => planner.id == plannedDates[0].ProjectPlannerId)[0].Wave;

		var statuses = file.find((e) => e.title === researchType).properties;
		var statusKeys = Object.keys(statuses);

		var taskData = [];

		statusKeys.forEach((statusKey) => {
			var tasksKeys = Object.keys(statuses[statusKey].properties);
			tasksKeys.forEach((task) => {
				if (plannedDates.some((plannedDate) => plannedDate.Task === task)) {
					taskData.push({
						...statuses[statusKey].properties[task],
						date: JSON.parse(plannedDates.find((plannedDate) => plannedDate.Task === task).PlannedDate).current.date,
					});
				}
			});
		});

		let body;

		ScheduleAssignees.forEach(async (scheduleAssignee) => {
			const assigneeTasks = taskData.filter((task) => task.Role === scheduleAssignee.Role);
			if (assigneeTasks.length) {
				body = await ejs.renderFile(path.join("src", "views/planner/projectActivityAssignment.ejs"), {
					data: data,
					wave: currentWave + " of " + data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.length,
					FWStart: FWStart,
					FWEnd: FWEnd,
					assigneeTasks: assigneeTasks,
				});
				const subject = "Project Activity Assignment: " + data.ProjectName + " - " + data.ProjectId;
				emailing.SendSpEmail(body, scheduleAssignee.Email, subject);
				console.log("Email Sent!");
			}
		});
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const SpProjectCompletion = async (data, projectPlannerId) => {
	try {
		const ScheduleAssignees = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].SchedulerAssignees;
		const emails = [...new Set(ScheduleAssignees.map((assignee) => assignee.Email))];

		var fwStartTask = "FWStart";
		var fwEndTask = "FWEnd";
		var FWStartDate = [];
		var FWEndDate = [];

		var researchType = data.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		if (researchType === "ONLINE") {
			fwStartTask = "FullLaunch";
			fwEndTask = "FWCompletion";
		} else if (researchType === "QUAL") {
			fwEndTask = "FWFinished";
		}

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: projectPlannerId,
				[Op.and]: {
					Task: fwStartTask,
				},
			},
		}).then(function (list) {
			list.map((fwStart) => FWStartDate.push(fwStart.dataValues));
		});

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: projectPlannerId,
				[Op.and]: {
					Task: fwEndTask,
				},
			},
		}).then(function (list) {
			list.map((fwEnd) => FWEndDate.push(fwEnd.dataValues));
		});

		const FWStart = JSON.parse(FWStartDate[0].PlannedDate).current.date;
		const FWEnd = JSON.parse(FWEndDate[0].ActualDate).current.date;

		var currentWave = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.filter((planner) => planner.id == projectPlannerId)[0].Wave;

		const body = await ejs.renderFile(path.join("src", "views/planner/projectCompletion.ejs"), {
			data: data,
			wave: currentWave + " of " + data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.length,
			FWStart: FWStart,
			FWEnd: FWEnd,
		});
		const subject = "Project Completion: " + data.ProjectName + " - " + data.ProjectId;
		await emailing.SendSpEmail(body, emails, subject);
		console.log("Email Sent!");
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const SpTaskReopenActualDateChange = async (data, actualDate) => {
	try {
		const ScheduleAssignees = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].SchedulerAssignees;
		var emails = [
			...new Set(
				ScheduleAssignees.map((assignee) => {
					return assignee.IsAccepted ? assignee.Email : null;
				})
			),
		];

		var fwStartTask = "FWStart";
		var fwEndTask = "FWEnd";
		var FWStartDate = [];
		var FWEndDate = [];

		var researchType = data.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		if (researchType === "ONLINE") {
			fwStartTask = "FullLaunch";
			fwEndTask = "FWCompletion";
		} else if (researchType === "QUAL") {
			fwEndTask = "FWFinished";
		}

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: actualDate.ProjectPlannerId,
				[Op.and]: {
					Task: fwStartTask,
				},
			},
		}).then(function (list) {
			list.map((fwStart) => FWStartDate.push(fwStart.dataValues));
		});

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: actualDate.ProjectPlannerId,
				[Op.and]: {
					Task: fwEndTask,
				},
			},
		}).then(function (list) {
			list.map((fwEnd) => FWEndDate.push(fwEnd.dataValues));
		});

		const FWStart = FWStartDate.length ? (JSON.parse(FWStartDate[0].PlannedDate) ? JSON.parse(FWStartDate[0].PlannedDate).current.date : "TBD") : "TBD";
		const FWEnd = FWEndDate.length ? (JSON.parse(FWEndDate[0].ActualDate) ? JSON.parse(FWEndDate[0].ActualDate).current.date : "TBD") : "TBD";

		await models.SpTasksAssignees.findAll({
			where: {
				Task: actualDate.Task,
				[Op.and]: {
					ProjectPlannerId: actualDate.ProjectPlannerId,
				},
			},
			attributes: ["EmailId"],
		}).then(function (list) {
			list.map((email) => emails.push(email.dataValues.EmailId));
		});

		emails = [...new Set(emails)];

		var file = JSON.parse(fs.readFileSync(dirPathToKey));
		var researchType = data.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		var taskId = actualDate.Task;
		var statusKeys = Object.keys(file.find((e) => e.title === researchType).properties);
		var task;
		var statuses = file.find((e) => e.title === researchType).properties;
		statusKeys.forEach((statusKey) => {
			var tasksKeys = Object.keys(statuses[statusKey].properties);
			var foundKey = tasksKeys.find((tasksKey) => tasksKey === taskId);
			if (foundKey) {
				task = statuses[statusKey].properties[foundKey];
			}
		});

		var currentDate = JSON.parse(actualDate.ActualDate).current.date;
		var previousDate = JSON.parse(actualDate.ActualDate).history[0].date;

		var currentWave = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.filter((planner) => planner.id === actualDate.ProjectPlannerId)[0].Wave;

		const body = await ejs.renderFile(path.join("src", "views/planner/taskReopenActualDateChange.ejs"), {
			data: data,
			result: data.data,
			actualDate: actualDate,
			currentDate: currentDate,
			previousDate: previousDate,
			wave: currentWave + " of " + data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.length,
			task: task,
			FWStart: FWStart,
			FWEnd: FWEnd,
		});

		const subject = "Task Reopened: " + data.ProjectName + "_" + data.ProjectId;
		await emailing.SendSpEmail(body, emails, subject);
		console.log("Email Sent!");
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const SpTaskPlannedDateChange = async (data, plannedDate) => {
	try {
		const ScheduleAssignees = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].SchedulerAssignees;

		var emails = [
			...new Set(
				ScheduleAssignees.map((assignee) => {
					return assignee.IsAccepted ? assignee.Email : null;
				})
			),
		];

		await models.SpTasksAssignees.findAll({
			where: {
				Task: plannedDate.Task,
				[Op.and]: {
					ProjectPlannerId: plannedDate.ProjectPlannerId,
				},
			},
			attributes: ["EmailId"],
		}).then(function (list) {
			list.map((email) => emails.push(email.dataValues.EmailId));
		});

		emails = [...new Set(emails)];

		var file = JSON.parse(fs.readFileSync(dirPathToKey));
		var researchType = data.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		var fwStartTask = "FWStart";
		var fwEndTask = "FWEnd";
		var FWStartDate = [];
		var FWEndDate = [];

		var researchType = data.CostingProfiles[0].ResearchType === "Qualitative" ? "QUAL" : data.CostingProfiles[0].ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

		if (researchType === "ONLINE") {
			fwStartTask = "FullLaunch";
			fwEndTask = "FWCompletion";
		} else if (researchType === "QUAL") {
			fwEndTask = "FWFinished";
		}

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannedDate.ProjectPlannerId,
				[Op.and]: {
					Task: fwStartTask,
				},
			},
		}).then(function (list) {
			list.map((fwStart) => FWStartDate.push(fwStart.dataValues));
		});

		await models.SpTasksDate.findAll({
			where: {
				ProjectPlannerId: plannedDate.ProjectPlannerId,
				[Op.and]: {
					Task: fwEndTask,
				},
			},
		}).then(function (list) {
			list.map((fwEnd) => FWEndDate.push(fwEnd.dataValues));
		});

		const FWStart = FWStartDate.length ? (JSON.parse(FWStartDate[0].PlannedDate) ? JSON.parse(FWStartDate[0].PlannedDate).current.date : "TBD") : "TBD";
		const FWEnd = FWEndDate.length ? (JSON.parse(FWEndDate[0].ActualDate) ? JSON.parse(FWEndDate[0].ActualDate).current.date : "TBD") : "TBD";

		var taskId = plannedDate.Task;
		var statusKeys = Object.keys(file.find((e) => e.title === researchType).properties);
		var task;
		var statuses = file.find((e) => e.title === researchType).properties;
		statusKeys.forEach((statusKey) => {
			var tasksKeys = Object.keys(statuses[statusKey].properties);
			var foundKey = tasksKeys.find((tasksKey) => tasksKey === taskId);
			if (foundKey) {
				task = statuses[statusKey].properties[foundKey];
			}
		});

		var currentDate = JSON.parse(plannedDate.PlannedDate).current.date;
		var previousDate = JSON.parse(plannedDate.PlannedDate).history[0].date;

		var currentWave = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.filter((planner) => planner.id === plannedDate.ProjectPlannerId)[0].Wave;

		const body = await ejs.renderFile(path.join("src", "views/planner/taskPlannedDateChange.ejs"), {
			data: data,
			result: data.data,
			plannedDate: plannedDate,
			currentDate: currentDate,
			previousDate: previousDate,
			wave: currentWave + " of " + data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlanners.length,
			task: task,
			FWStart: FWStart,
			FWEnd: FWEnd,
		});
		const subject = "Task Planned Date Change: " + data.ProjectName + "_" + data.ProjectId;
		await emailing.SendSpEmail(body, emails, subject);
		console.log("Email Sent!");
	} catch (ex) {
		console.log(ex);
		throw "Error in sending Email!";
	}
};

const ConvertToPdf = async (req, res) => {
	try {
		var options = {
			format: req.body.format,
			border: {
				top: "0in",
				right: "0.5in",
				bottom: "0.8in",
				left: "0.5in",
			},
			type: "pdf",
			zoomFactor: "1",
			orientation: req.body.orientation,
			header: {
				height: "2in",
			},
		};
		if (options.format == "A4") {
			options.height = "11.5in";
		}
		var html = req.body.htmlcontent;
		pdf.create(html, options).toBuffer(function (err, buffer) {
			res.status(201).json({
				data: buffer,
			});
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Generating PDF.",
			error: ex.toString(),
		});
	}
};

module.exports = {
	FetchCurrencies: FetchCurrencies,
	CreateProjectFolders: CreateProjectFolders,
	CreateWaveFolderAndPbox: CreateWaveFolderAndPbox,
	CreateDriveFolders: CreateDriveFolders,
	CreateCostingSheet: CreateCostingSheet,
	CreateAdditionalSheet: CreateAdditionalSheet,
	SyncCostingSheet: SyncCostingSheet,
	SendEwnEmails: SendEwnEmails,
	SendFinanceScheduleEmail: SendFinanceScheduleEmail,
	SendNewApprovalRequestEmail: SendNewApprovalRequestEmail,
	SendApprovalRequestCompleteEmail: SendApprovalRequestCompleteEmail,
	SendApprovalRequestCancelledEmail: SendApprovalRequestCancelledEmail,
	SendApprovalRequestDeniedEmail: SendApprovalRequestDeniedEmail,
	SendRequestCreatedEmail: SendRequestCreatedEmail,
	SendRequestUpdatedEmail: SendRequestUpdatedEmail,
	SendRequestClosedEmail: SendRequestClosedEmail,
	SendRequestReOpenedEmail: SendRequestReOpenedEmail,
	PrepareTest: PrepareTest,
	SpProjectSchedule: SpProjectSchedule,
	SpProjectInvite: SpProjectInvite,
	SpProjectPauseResume: SpProjectPauseResume,
	ConvertToPdf: ConvertToPdf,
	SpProjectActivityAssignment,
	SpTaskReopenActualDateChange,
	SpTaskPlannedDateChange,
	SpProjectCompletion,
};
