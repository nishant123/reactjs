const models = require("../models");
const dbHelpers = require("../utils/dbhelpers");

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
	"ApprovalLevelNeeded",
	"ApprovalDetails",
	"NetRevenuePercent",
	"OutOfPocketCostPercent",
	"ApprovalLevelNeeded"
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
	"DateFinalQuestionnaire", "DateFinalQuestionnaireNA",
	"DateTranslations", "DateTranslationsNA",
	"DateFieldStart", "DateFieldEnd", "DateFieldworkNA",
	"DateVerbatimCoding", "DateVerbatimCodingNA",
	"DateDataProcessing", "DateDataProcessingNA",
	"DateCharts", "DateChartsNA",
	"DateDashboards", "DateDashboardsNA",
	"DateFinalReport", "DateFinalReportNA",
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

const Create = async (req, res) => {
	let costingProfile;
	const record = req.body;

	try {
		try {
			costingProfile = JSON.parse(JSON.stringify(record));
		} catch (e) {
			throw "Invalid Body Content."; //only to satisfy checkmarx validation
		}

		const selectedSubMethodologies = req.body.SubMethodology.map((item) => {
			return item.value;
		});

		const projectIdFK = costingProfile.ProjectId;
		if (isNaN(Number(projectIdFK))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}

		const result = await models.sequelize.transaction(async (t) => {
			const parentProject = await models.Projects.findByPk(projectIdFK);
			const verticalId = parentProject.VerticalId;

			if (!verticalId) {
				throw "Please update the project industry vertical first and try again.";
			}
			let countrySettingsRecord = await models.Countries.findOne({
				where: { Code: [parentProject.CommissioningCountry] },
				attributes: ["Code", "Label", "id", "CurrencyUnit"],
			});

			costingProfile.CostInputCurrency =
				countrySettingsRecord.Code + "-" + countrySettingsRecord.CurrencyUnit;

			const createdCostingProfile = await models.CostingProfiles.create(
				costingProfile,
				{
					transaction: t,
					userEmail: req.tokenData.Email,
					projectIdFk: costingProfile.ProjectId,
				}
			);

			const costingProfileId = createdCostingProfile.id;
			const numberOfWaves = createdCostingProfile.NumberOfWaves;
			const fieldingCountries = createdCostingProfile.FieldingCountries.split(
				","
			);
			if (!parentProject.BusinessUnitId) {
				throw "Please update the project business first and try again.";
			}
			const businessUnitRecord = await models.BusinessUnits.findOne({
				where: { id: parentProject.BusinessUnitId },
			});

			let requiredFormLayouts;
			if (businessUnitRecord.UsesCustomFormLayouts) {
				requiredFormLayouts = await models.FormLayouts.findAll({
					//Previously form layouts
					where: {
						Code: selectedSubMethodologies,
						BusinessUnitId: businessUnitRecord.id,
					},
					transaction: t,
				});
			} else {
				requiredFormLayouts = await models.SubMethodologies.findAll({
					//Previously form layouts
					where: { Code: selectedSubMethodologies },
					transaction: t,
				});
			}
			for (country in fieldingCountries) {
				let countrySpecDraft = {};
				countrySpecDraft.CostingProfileId = costingProfileId;
				countrySpecDraft.CountryCode = fieldingCountries[country];

				let countrySettingsRecord = await models.Countries.findOne({
					where: { Code: [countrySpecDraft.CountryCode] },
					attributes: ["Code", "Label", "id", "CurrencyUnit"],
				});
				countrySpecDraft.CountryName = countrySettingsRecord.Label; //new addition for vendor module
				if (
					createdCostingProfile.IsMultiCountry &&
					countrySpecDraft.CountryCode != parentProject.CommissioningCountry
				) {
					countrySpecDraft.CostInputCurrency = "US-USD"; //setting default to usd for fieldiing countries if multicountry, otherwise local country currency e.g. NZ-NZD, IN-INR
				} else {
					countrySpecDraft.CostInputCurrency =
						countrySettingsRecord.Code +
						"-" +
						countrySettingsRecord.CurrencyUnit;
				}

				const createdCountryRecord = await models.CountrySpecs.create(
					countrySpecDraft,
					{
						transaction: t,
						userEmail: req.tokenData.Email,
					}
				);
				for (eachFormRecord in requiredFormLayouts) {
					let methodologySpecsDraft =
						requiredFormLayouts[eachFormRecord].dataValues;
					//console.log(methodologySpecsDraft);
					methodologySpecsDraft.id = null;
					methodologySpecsDraft.CountrySpecId = createdCountryRecord.id;
					await models.MethodologySpecs.create(methodologySpecsDraft, {
						transaction: t,
						userEmail: req.tokenData.Email,
					});
				}
			}

			const verticalSettings = await models.Verticals.findByPk(verticalId, {
				transaction: t,
			});
			const opsResourcesSchemaDraft = verticalSettings.OpsResourcesSchema;

			const profileSettingsDraft = verticalSettings.dataValues;
			profileSettingsDraft.id = null;
			profileSettingsDraft.CostingProfileId = costingProfileId;

			await models.ProfileSettings.create(profileSettingsDraft, {
				transaction: t,
				userEmail: req.tokenData.Email,
			});
			let waveSpecDraft = {};
			waveSpecDraft.CostingProfileId = costingProfileId;
			waveSpecDraft.OpsResourcesSchema = opsResourcesSchemaDraft;

			countrySettingsRecord = await models.Countries.findOne({
				where: { Code: [parentProject.CommissioningCountry] },
				attributes: ["Code", "Label", "id", "CurrencyUnit"],
			});

			waveSpecDraft.CostInputCurrency =
				countrySettingsRecord.Code + "-" + countrySettingsRecord.CurrencyUnit;

			for (let i = 0; i < numberOfWaves; i++) {
				waveSpecDraft.WaveNumber = i + 1;
				await models.WaveSpecs.create(waveSpecDraft, {
					transaction: t,
					userEmail: req.tokenData.Email,
				});
			}

			return createdCostingProfile;
		});
		res.status(201).json({
			message: "SUCCESS: Costing Profile Created.",
			costingProfile: result,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Costing Profile.",
			error: ex.toString(),
		});
	}
};

const FetchAll = (req, res) => {
	models.CostingProfiles.findAll()
		.then((result) => {
			res.status(200).json({
				message: "SUCCESS: Fetched All Costing Profiles.",
				costingProfiles: result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message:
					"ERROR: Something Went Wrong While Fetched All Costing Profiles.",
				error: err.toString(),
			});
		});
};

const FetchAllCommissioned = (req, res) => {
	models.CostingProfiles.findAll({
		//include where ProfileStatus later once we have commmissioned profiles available.
		//where: { ProfileStatus: "6" },

		include: [
			{ model: models.Projects },
			{ model: models.WaveSpecs },
			{ model: models.CountrySpecs, include: [models.MethodologySpecs] },
		],
	})
		.then((result) => {
			res.status(200).json({
				message: "SUCCESS: Fetched All Costing Commissioned Profiles.",
				costingProfiles: result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message:
					"ERROR: Something Went Wrong While Fetched All Commissioned Costing Profiles.",
				error: err.toString(),
			});
		});
};

const FetchOne = (req, res) => {
	models.CostingProfiles.findOne({
		where: { id: req.params.CostingProfileId },
		include: [
			{ model: models.Projects, include: [models.ContractDetails] },
			{ model: models.ProfileSettings },
			{ model: models.WaveSpecs },
			{ model: models.CountrySpecs, include: [models.MethodologySpecs] },
		],
	})
		.then((result) => {
			if (result) {
				res.status(200).json({
					message:
						"SUCCESS: Fetched Costing Profile with ID " +
						req.params.CostingProfileId,
					costingProfile: result,
				});
			} else {
				res.status(404).json({
					message: "ERROR: No Costing Profiles Found for this ID.",
					CostingProfileId: req.params.CostingProfileId,
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message:
					"ERROR: Something Went Wrong While Fetching One Costing Profile.",
				error: err.toString(),
			});
		});
};
const TrashAll = (req, res) => {
	models.CostingProfiles.destroy({ truncate: true })
		.then((result) => {
			res.status(200).json({
				message: "SUCCESS: All Costing Profiles Deleted.",
				costingProfile: result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: "ERROR: Something Went Wrong While Deleting All Profiles.",
				error: err.toString(),
			});
		});
};
const TrashOne = async (req, res) => {
	try {
		let costingProfileId = req.params.CostingProfileId;
		if (isNaN(Number(costingProfileId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.CostingProfiles.destroy({
				where: { id: costingProfileId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Costing Profile Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Costing Profile.",
			error: err.toString(),
		});
	}
};
const Update = async (req, res) => {
	try {
		const costingProfile = req.body;

		//Ensure Methodology, SubMethodology, FieldingCountries, StudyType, ResearchType, FieldType are removed from the request body.
		//These are currently not editable on frontend anyway and will otherwise require setter functions inside CostingProfile Model.
		delete costingProfile.Methodology;
		delete costingProfile.SubMethodology;
		delete costingProfile.FieldingCountries;
		delete costingProfile.StudyType;
		delete costingProfile.ResearchType;
		delete costingProfile.FieldType;
		delete costingProfile.Project.ContractDetails;
		costingProfile.ApprovalDetails = costingProfile.ApprovalDetails
			? JSON.stringify(costingProfile.ApprovalDetails)
			: null;
		let costingProfileId = req.params.CostingProfileId;
		if (isNaN(Number(costingProfileId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			let deferred = [];
			deferred.push(
				new Promise((resolve, reject) =>
					models.CostingProfiles.update(costingProfile, {
						where: {
							id: costingProfileId,
						},
						transaction: t,
						userEmail: req.tokenData.Email,
						projectIdFk: costingProfile.ProjectId,
					})
						.then((res) => resolve(res))
						.catch((e) => reject(e))
				)
			);
			if (costingProfile.Project) {
				deferred.push(
					new Promise((resolve, reject) =>
						models.Projects.update(costingProfile.Project, {
							where: { id: costingProfile.Project.id },
							transaction: t,
							userEmail: req.tokenData.Email,
						})
							.then((res) => resolve(res))
							.catch((e) => reject(e))
					)
				);
			}
			//console.log(costingProfile.ProfileSetting.CurrenciesData);
			if (costingProfile.ProfileSetting) {
				costingProfile.ProfileSetting.GlobalCostingSheetCostsSchema = costingProfile
					.ProfileSetting.GlobalCostingSheetCostsSchema
					? JSON.stringify(
						costingProfile.ProfileSetting.GlobalCostingSheetCostsSchema
					)
					: null;
				costingProfile.ProfileSetting.CommercialHoursSchema = costingProfile
					.ProfileSetting.CommercialHoursSchema
					? JSON.stringify(costingProfile.ProfileSetting.CommercialHoursSchema)
					: null;
				costingProfile.ProfileSetting.CurrenciesData = costingProfile
					.ProfileSetting.CurrenciesData
					? JSON.stringify(costingProfile.ProfileSetting.CurrenciesData)
					: null;
				costingProfile.ProfileSetting.CSRateCardUsed = costingProfile
					.ProfileSetting.CSRateCardUsed
					? JSON.stringify(costingProfile.ProfileSetting.CSRateCardUsed)
					: null;
				costingProfile.ProfileSetting.GlobalCostingSheetTimingsSchema = costingProfile
					.ProfileSetting.GlobalCostingSheetTimingsSchema
					? JSON.stringify(
						costingProfile.ProfileSetting.GlobalCostingSheetTimingsSchema
					)
					: null;
				//console.log("TEST", costingProfile.ProfileSetting.CurrenciesData);
				deferred.push(
					new Promise((resolve, reject) =>
						models.ProfileSettings.update(costingProfile.ProfileSetting, {
							where: { id: costingProfile.ProfileSetting.id },
							transaction: t,
							userEmail: req.tokenData.Email,
						})
							.then((res) => resolve(res))
							.catch((e) => reject(e))
					)
				);
			}

			//created promises for CountrySpecs. Any reason not to?
			for (eachCountrySpec of costingProfile.CountrySpecs) {
				deferred.push(
					new Promise((resolve, reject) => {
						//beforeUpdate hook on model seems to break so placing this here.
						eachCountrySpec.SheetsCostsData = eachCountrySpec.SheetsCostsData
							? JSON.stringify(eachCountrySpec.SheetsCostsData)
							: null;
						eachCountrySpec.SheetsTimingsData = eachCountrySpec.SheetsTimingsData
							? JSON.stringify(eachCountrySpec.SheetsTimingsData)
							: null;

						models.CountrySpecs.update(eachCountrySpec, {
							where: {
								id: eachCountrySpec.id,
							},
							transaction: t,
							userEmail: req.tokenData.Email,
						})
							.then((res) => resolve(res))
							.catch((e) => reject(e));
					})
				);

				for (eachMethodologySpec of eachCountrySpec.MethodologySpecs) {
					deferred.push(
						new Promise((resolve, reject) => {
							//beforeUpdate hook on model seems to break so placing this here.
							eachMethodologySpec.RFQSchema = eachMethodologySpec.RFQSchema
								? JSON.stringify(eachMethodologySpec.RFQSchema)
								: null;
							eachMethodologySpec.RFQData = eachMethodologySpec.RFQData
								? JSON.stringify(eachMethodologySpec.RFQData)
								: null;
							eachMethodologySpec.CostsSchema = eachMethodologySpec.CostsSchema
								? JSON.stringify(eachMethodologySpec.CostsSchema)
								: null;
							eachMethodologySpec.CostsData = eachMethodologySpec.CostsData
								? JSON.stringify(eachMethodologySpec.CostsData)
								: null;
							eachMethodologySpec.CalculationSchema = eachMethodologySpec.CalculationSchema
								? JSON.stringify(eachMethodologySpec.CalculationSchema)
								: null;
							eachMethodologySpec.CountryCostBreakdown = eachMethodologySpec.CountryCostBreakdown
								? JSON.stringify(eachMethodologySpec.CountryCostBreakdown)
								: null;
							eachMethodologySpec.TimingsData = eachMethodologySpec.TimingsData
								? JSON.stringify(eachMethodologySpec.TimingsData)
								: null;
							eachMethodologySpec.TimingsSchema = eachMethodologySpec.TimingsSchema
								? JSON.stringify(eachMethodologySpec.TimingsSchema)
								: null;
							models.MethodologySpecs.update(eachMethodologySpec, {
								where: {
									id: eachMethodologySpec.id,
								},
								transaction: t,
								userEmail: req.tokenData.Email,
							})
								.then((res) => resolve(res))
								.catch((e) => reject(e));
						})
					);
				}
			}
			for (eachWaveSpec of costingProfile.WaveSpecs) {
				eachWaveSpec.OpsResourcesSchema = eachWaveSpec.OpsResourcesSchema
					? JSON.stringify(eachWaveSpec.OpsResourcesSchema)
					: null;
				eachWaveSpec.OpsResourcesData = eachWaveSpec.OpsResourcesData
					? JSON.stringify(eachWaveSpec.OpsResourcesData)
					: null;
				eachWaveSpec.CommercialHoursData = eachWaveSpec.CommercialHoursData
					? JSON.stringify(eachWaveSpec.CommercialHoursData)
					: null;
				eachWaveSpec.CostOverrideNotes = eachWaveSpec.CostOverrideNotes
					? JSON.stringify(eachWaveSpec.CostOverrideNotes)
					: null;
				deferred.push(
					new Promise((resolve, reject) =>
						models.WaveSpecs.update(eachWaveSpec, {
							where: {
								id: eachWaveSpec.id,
							},
							transaction: t,
							userEmail: req.tokenData.Email,
						})
							.then((res) => resolve(res))
							.catch((e) => {
								reject(e);
							})
					)
				);
			}
			return await Promise.all(deferred)
				.then((res) => {
					return res;
				})
				.catch((e) => {
					throw e;
				});
		});
		res.status(200).json({ message: "SUCCESS: Costing Profile Updated." });
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While updating Costing Profile.",
			error: ex.toString(),
		});
	}
};

const UpdateName = async (req, res) => {
	//TODO: attach Gdrive related renaming.
	const updatedProfileName = req.params.NewProfileName;
	try {
		let costingProfileId = req.params.CostingProfileId;
		if (isNaN(Number(costingProfileId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			//console.log("Transaction");
			await models.CostingProfiles.update(
				{ ProfileName: updatedProfileName },
				{
					where: {
						id: costingProfileId,
					},
					transaction: t,
				}
			).catch((ex) => {
				// console.log("F1");
				//console.log("Error is: " + ex);
				throw ex;
			});
		});

		await res
			.status(200)
			.json({ message: "SUCCESS: Costing Profile Name Updated." });
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Updating Costing Profile Name.",
			error: ex.toString(),
		});
	}
};
const Duplicate = async (req, res) => {
	try {
		const costingProfile = await models.CostingProfiles.findByPk(
			req.params.CostingProfileId,
			{
				//where: { id: req.params.CostingProfileId },
				include: [
					{ model: models.Projects },
					{ model: models.ProfileSettings },
					{ model: models.WaveSpecs },
					{ model: models.CountrySpecs, include: [models.MethodologySpecs] },
				],
			}
		);

		if (!costingProfile) {
			throw "Costing Profile Not Found For Duplication.";
		}

		const result = await models.sequelize.transaction(async (t) => {
			//const parentProject = costingProfile.Project;
			// let countrySettingsRecord = await models.Countries.findOne({
			// 	where: { Code: [parentProject.CommissioningCountry] },
			// 	attributes: ["Code", "Label", "id", "CurrencyUnit"],
			// });
			//costingProfile.CostInputCurrency = countrySettingsRecord.Code + "-" + countrySettingsRecord.CurrencyUnit;
			costingProfile.ProfileName = "Copy of " + costingProfile.ProfileName;
			//costingProfile.ApprovalDetails = "{}"; there should no need anymore. getter updated
			let jsonBody = {
				...costingProfile.dataValues,
			};
			jsonBody = {
				...jsonBody,
				CostingSheetId: null,
				AdditionalSheetId: null,
				CommissionedBy: null,
				PriceToClient: null,
				PriceToClientLocal: null,
				ProfileStatus: "1",
				ProfileNumber: null,
				RecommendedPrice: null,
				TotalCostsRaw: null,
				Overheads: null,
				Markup: null,
				NeedsApproval: null,
				CostingType: null,
				InternalCommercialCostPercent: null,
				OutOfPocketCostPercent: null,
				NetRevenuePercent: null,
				ContributionMarginPercent: null,
				DecommissionNotes: null,
				ApprovalRequestor: null,
				ApprovalJustification: null,
				ApprovalNotes: null,
				ApprovalLevelNeeded: null,
				ApprovalLevelAwaiting: null,
				ApprovalLevelReached: null,
				ApprovalVersionNumber: null,
			};
			delete jsonBody.Project;
			delete jsonBody.ProfileSettings;
			delete jsonBody.WaveSpecs;
			delete jsonBody.CountrySpecs;
			delete jsonBody.id;
			jsonBody.Methodology = dbHelpers.StringToMulti(
				costingProfile.Methodology
			);
			jsonBody.SubMethodology = dbHelpers.StringToMulti(
				costingProfile.SubMethodology
			);
			jsonBody.FieldingCountries = dbHelpers.StringToMulti(
				costingProfile.FieldingCountries
			);
			jsonBody.StudyType = dbHelpers.StringToMulti(costingProfile.StudyType);
			let deferred = [];
			const createdCostingProfile = await models.CostingProfiles.create(
				jsonBody,
				{
					transaction: t,
					userEmail: req.tokenData.Email,
					projectIdFk: costingProfile.ProjectId,
				}
			);
			const costingProfileId = createdCostingProfile.id;
			let countrySpecs = costingProfile.CountrySpecs;
			for (country of countrySpecs) {
				let countrySpecDraft = {
					...country.dataValues,
					CostingProfileId: costingProfileId,
					id: null,
				};
				let countrySpec = {};
				delete countrySpecDraft.MethodologySpecs;
				deferred.push(
					new Promise((resolve, reject) =>
						models.CountrySpecs.create(countrySpecDraft, {
							transaction: t,
						})
							.then((res) => {
								countrySpec = res;
								let methodologySpecs = [...country.MethodologySpecs];
								for (methodologySpecsDraft of methodologySpecs) {
									methodologySpecsDraft = {
										...methodologySpecsDraft.dataValues,
										CountrySpecId: countrySpec.id,
										id: null,
									};
									models.MethodologySpecs.create(methodologySpecsDraft, {
										transaction: t,
									}).then((res) => resolve(res));
								}
							})
							.catch((e) => {
								reject(e);
							})
					)
				);
			}

			if (
				costingProfile.ProfileSetting &&
				costingProfile.ProfileSetting.dataValues
			) {
				const profileSettingsDraft = {
					...costingProfile.ProfileSetting.dataValues,
					CostingProfileId: costingProfileId,
					id: null,
				};
				deferred.push(
					new Promise((resolve, reject) =>
						models.ProfileSettings.create(profileSettingsDraft, {
							transaction: t,
						})
							.then((res) => resolve(res))
							.catch((e) => reject(e))
					)
				);
			}
			let waveSpecs = [...costingProfile.WaveSpecs];
			for (waveSpecDraft of waveSpecs) {
				waveSpecDraft = {
					...waveSpecDraft.dataValues,
					id: null,
					CostingProfileId: costingProfileId,
					WaveFolderId: null,
					ProjectBoxId: null,
					TimeTrackerId: null,
				};
				deferred.push(
					new Promise((resolve, reject) =>
						models.WaveSpecs.create(waveSpecDraft, { transaction: t })
							.then((res) => {
								resolve(res);
							})
							.catch((e) => reject(e))
					)
				);
				await Promise.all(deferred);
			}
			return createdCostingProfile;
		});
		res.status(201).json({
			message: "SUCCESS: Costing Profile Duplicate Ready.",
			costingProfile: result,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Duplicating Costing Profile.",
			error: ex.toString(),
		});
	}
};

const FetchCommissionedByProject = (req, res) => {
	models.CostingProfiles.findOne({
		where: { ProjectId: req.params.ProjectId, ProfileStatus: "6" },
		attributes: costingProfileInclusions,
		include: [
			{ model: models.ProfileSettings, attributes: ["CurrenciesData", "id"] },
			{
				model: models.WaveSpecs,
				attributes: waveSpecsInclusions,
				include: [
					{
						model: models.DeliverySpecs,
						attributes: ["id", "ProgrammerAssigned", "ProjectDeliveryNumber"],
					},
				],
			},
		],
	})
		.then((result) => {
			if (result) {
				res.status(200).json({
					message: "SUCCESS: Fetched Commissioned Costing Profile For Project.",
					costingProfile: result,
				});
			} else {
				res.status(404).json({
					message:
						"ERROR: No Commissioned Costing Profiles Found for this Project.",
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message:
					"ERROR: Something Went Wrong While Fetching Commissioned Costing Profile For Project.",
				error: err.toString(),
			});
		});
};

module.exports = {
	Create: Create,
	FetchAll: FetchAll,
	FetchAllCommissioned: FetchAllCommissioned,
	FetchCommissionedByProject: FetchCommissionedByProject,
	FetchOne: FetchOne,
	TrashAll: TrashAll,
	Update: Update,
	TrashOne: TrashOne,
	UpdateName: UpdateName,
	Duplicate: Duplicate,
};
