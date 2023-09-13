const models = require("../models");
const Sequelize = require("sequelize");
const Op = require("sequelize").Op;
const GetApproversByVertical = async (req, res) => {
	try {
		let VerticalId = req.params.VerticalId;
		if (isNaN(Number(VerticalId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const approvalDetails = await models.ApprovalSettings.findAll({
			where: {
				VerticalId: {
					[Op.eq]: VerticalId,
				},
			},
			attributes: [
				"id",
				"Label",
				"ThresholdOutOfPocketPercentage",
				"ThresholdRevenueAmount",
				"ThresholdOutOfPocketAmountSyndicated",
				"Order",
			],
			include: [
				{
					model: models.ApproverContacts,
					attributes: [
						"id",
						"EmailAddress",
						"IsMandatoryApprover",
						"ApprovalSettingId",
					],
				},
			],
		});

		//console.log("HERE", approvalDetails);

		await res.status(200).json({
			message: "SUCCESS: Fetched All Approvers",
			ApprovalDetails: approvalDetails,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching Approvers.",
			error: ex.toString(),
		});
	}
};

const GetRequestTypesByCountry = async (req, res) => {
	try {
		let param = req.params.CountryCode;
		if (param.length != 2) {
			//country codes always 2 chars
			throw "Invalid Parameter.";
		}
		const country = await models.Countries.findAll({
			where: { Code: param.toUpperCase() },
			attributes: ["id", "Code"],
			include: [
				{
					model: models.RequestTypes,
					attributes: [
						"id",
						"RequestTypeName",
						"PrimaryContactEmails",
						"OtherContactEmails",
					],
				},
			],
		});

		await res.status(200).json({
			message: "SUCCESS: Fetched All Request Types",
			RequestTypes: country,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching Request Types.",
			error: ex.toString(),
		});
	}
};
const GetRequestTypesByMultipleCountry = async (req, res) => {
	try {
		const jsonObject=req.body
		const requestTypes = await models.RequestTypes.findAll({
			where: { CountryId:jsonObject.countryCode },
					attributes: [
						"id",
						"RequestTypeName",
						"PrimaryContactEmails",
						"OtherContactEmails",
					],
		});
		await res.status(200).json({
			message: "SUCCESS: Fetched All Request Types",
			RequestTypes: requestTypes,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching Request Types.",
			error: ex.toString(),
		});
	}
};

const GetCSRatesByBusinessUnit = async (req, res) => {
	try {
		let businessUnitId = req.params.BusinessUnitId;
		if (isNaN(Number(businessUnitId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const csrates = await models.ClientServiceRates.findAll({
			where: { BusinessUnitId: businessUnitId },
			attributes: [
				"id",
				"ProfileName",
				"ExecutiveDirector",
				"Director",
				"AssociateDirector",
				"SeniorManager",
				"Manager",
				"SeniorExecutive",
				"Executive",
				"DatascienceInternalComm",
				"IsDefault",
			],
		});

		await res.status(200).json({
			message: "SUCCESS: Fetched All CS Ratecards.",
			CSRatecards: csrates,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching CS Ratecards",
			error: ex.toString(),
		});
	}
};

const FetchAllCurrencies = async (req, res) => {
	try {
		const result = await models.Countries.findAll({
			where: {
				ConversionRateToLocal: {
					[Op.ne]: null,
				},
			},
			attributes: [
				"id",
				"Code",
				"Label",
				"CurrencyUnit",
				"ConversionRateToLocal",
			],
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

const SetupFormLayouts = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		//First check if existing form layouts found, if yes then abort.
		let businessUnitId = req.params.BusinessUnitId;
		if (isNaN(Number(businessUnitId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			const existingForms = await models.FormLayouts.findAndCountAll({
				where: { BusinessUnitId: [businessUnitId] },
			});

			if (existingForms.count > 0) {
				throw "Form layouts already exist for this Business Unit";
			}

			const defaultLayouts = await models.SubMethodologies.findAll();

			for (eachFormRecord in defaultLayouts) {
				let buFormDraft = defaultLayouts[eachFormRecord].dataValues;
				buFormDraft.id = null;
				buFormDraft.BusinessUnitId = req.params.BusinessUnitId;
				await models.FormLayouts.create(buFormDraft, {
					transaction: t,
				});
			}
			await models.BusinessUnits.update(
				{ UsesCustomFormLayouts: true },
				{
					where: {
						id: businessUnitId,
					},
					transaction: t,
				}
			);
		});

		res.status(201).json({
			message: "SUCCESS: Form Layouts Setup Complete",
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Setting Form Layouts.",
			error: err.toString(),
		});
	}
};

const FetchAllMarketSettings = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}
		// Auth middleware ValidateToken() puts tokenData in request obj

		let allowedCountries;

		//Using tokendata to find full user record
		await models.Users.findByPk(userData.UserId)
			.then((clientUser) => {
				//find all access limiters
				allowedCountries = clientUser.Countries.split(",");
				//allowedVerticals = clientUser.Verticals.split(",");
			})
			.catch((err) => {
				throw err;
			});

		//UserScopeOptions
		const marketData = await models.Countries.findAll({
			where: { Code: allowedCountries, IsCommissioningMarket: true },
			// include: [
			// 	{
			// 		model: models.BusinessUnits,
			// 		include: [
			// 			{
			// 				model: models.Verticals,
			// 				attributes: {
			// 					exclude: [
			// 						"GlobalCostingSheetCostsSchema",
			// 						"GlobalCostingSheetTimingsSchema",
			// 						"CommercialHoursSchema",
			// 						"OpsResourcesSchema",
			// 					],
			// 				},
			// 				include: [
			// 					{
			// 						model: models.ApprovalSettings,
			// 						include: [{ model: models.ApproverContacts }],
			// 					},
			// 				],
			// 			},
			// 			{
			// 				model: models.ClientServiceRates,
			// 			},
			// 			// {
			// 			// 	model: models.FormLayouts,
			// 			// }, //not required for now
			// 		],
			// 	},
			// 	{ model: models.Offices },
			// 	{ model: models.RequestTypes },
			// ],
		});

		await res.status(200).json({
			message: "SUCCESS: Fetched All Market Settings Data.",
			MarketSettingsData: marketData,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetching Market Settings Data.",
			error: ex.toString(),
		});
	}
};

const FetchOneMarketSetting = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}
		// Auth middleware ValidateToken() puts tokenData in request obj

		let countryId = req.params.CountryId;
		if (isNaN(Number(countryId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		//UserScopeOptions
		const marketData = await models.Countries.findByPk(countryId, {
			include: [
				{
					model: models.BusinessUnits,
					include: [
						{
							model: models.Verticals,
							attributes: {
								exclude: [
									"GlobalCostingSheetCostsSchema",
									"GlobalCostingSheetTimingsSchema",
									"CommercialHoursSchema",
									"OpsResourcesSchema",
								],
							},
							include: [
								{
									model: models.ApprovalSettings,
									include: [{ model: models.ApproverContacts }],
								},
							],
						},
						{
							model: models.ClientServiceRates,
						},
						// {
						// 	model: models.FormLayouts,
						// }, //not required for now
					],
				},
				{ model: models.Offices },
				{ model: models.RequestTypes },
			],
		});

		await res.status(200).json({
			message: "SUCCESS: Fetched Market Setting Data.",
			MarketSettingsData: marketData,
		});
	} catch (ex) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Fetching Market Setting Data.",
			error: ex.toString(),
		});
	}
};

const CreateOffice = async (req, res) => {
	try {
		const draftOffice = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const countryRecord = await models.Countries.findByPk(
			req.params.CountryId,
			{
				attributes: ["id"],
				include: [
					{
						model: models.Offices,
						attributes: ["id", "CountryId", "Code", "Label"],
					},
				],
			}
		);
		for (let office of countryRecord.Offices) {
			if (office.Code === draftOffice.Code) {
				throw "This Office Already Exists For this Country";
			}
		}
		//if (countryRecord.Offices && countryRecord.Offices)
		//{ //check if the "Code" in existing BUs match draftBU.Code,
		//throw "This Office Already Exists For this Country"
		const result = await models.sequelize.transaction(async (t) => {
			const createdOffice = await models.Offices.create(draftOffice, {
				transaction: t,
				userEmail: req.tokenData.Email,
			});
			return createdOffice;
		});
		res.status(201).json({
			message: "SUCCESS: Office Created.",
			Office: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Office.",
			error: err.toString(),
		});
	}
};

const CreateBusinessUnit = async (req, res) => {
	try {
		const draftBU = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const countryRecord = await models.Countries.findByPk(
			req.params.CountryId,
			{
				attributes: ["id"],
				include: [
					{
						model: models.BusinessUnits,
						attributes: ["id", "CountryId", "Code", "Label"],
					},
				],
			}
		);
		for (let bu of countryRecord.BusinessUnits) {
			if (bu.Code === draftBU.Code) {
				throw "This Business Unit Already Exists For this Country";
			}
		}
		//if (countryRecord.BusinessUnits && countryRecord.BusinessUnits){ //check if the "Code" in existing BUs match draftBU.Code,
		//throw "This Business Unit Already Exists For this Country"
		const result = await models.sequelize.transaction(async (t) => {
			const createdBU = await models.BusinessUnits.create(draftBU, {
				transaction: t,
				userEmail: req.tokenData.Email,
			});

			return createdBU;
		});

		res.status(201).json({
			message: "SUCCESS: Business Unit Created.",
			BusinessUnit: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Business Unit.",
			error: err.toString(),
		});
	}
};

const CreateVertical = async (req, res) => {
	try {
		const draftVertical = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const buRecord = await models.BusinessUnits.findByPk(
			req.params.BusinessUnitId,
			{
				attributes: ["id"],
				include: [
					{
						model: models.Verticals,
						attributes: ["id", "BusinessUnitId", "Code", "Label"],
					},
				],
			}
		);
		for (let vi of buRecord.Verticals) {
			if (vi.Code === draftVertical.Code) {
				throw "This Vertical Already Exists For this Country";
			}
		}

		//if (buRecord.Verticals && buRecord.Verticals){ //check if the "Code" in existing BUs match draftVertical.Code,
		//throw "This Business Unit Already Exists For this Country"
		const result = await models.sequelize.transaction(async (t) => {
			const createdVertical = await models.Verticals.create(draftVertical, {
				transaction: t,
				userEmail: req.tokenData.Email,
			});

			return createdVertical;
		});

		res.status(201).json({
			message: "SUCCESS: Vertical Created.",
			Vertical: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Vertical.",
			error: err.toString(),
		});
	}
};

const CreateClientServiceRate = async (req, res) => {
	try {
		const drafCSRate = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const buRecord = await models.BusinessUnits.findByPk(
			req.params.BusinessUnitId,
			{
				attributes: ["id"],
				include: [
					{
						model: models.ClientServiceRates,
						attributes: ["id", "ProfileName", "IsDefault"],
					},
				],
			}
		);
		for (let cs of buRecord.ClientServiceRates) {
			if (cs.IsDefault && drafCSRate.IsDefault) {
				throw "Default Rate Card already exists for this Business Unit";
			}
		}
		//if (buRecord.ClientServiceRates && buRecord.ClientServiceRates){ //check if the "IsDefault" existing CS rates already exists,
		//throw "Default Rate Card already exists for this Business Unit."
		const result = await models.sequelize.transaction(async (t) => {
			const createdCSRate = await models.ClientServiceRates.create(drafCSRate, {
				transaction: t,
				userEmail: req.tokenData.Email,
			});

			return createdCSRate;
		});
		res.status(201).json({
			message: "SUCCESS: Client Service Ratecard Created.",
			ClientServiceRateCard: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating CS Ratecard.",
			error: err.toString(),
		});
	}
};
const CreateApprovalSetting = async (req, res) => {
	try {
		const draftApprovalSetting = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const result = await models.sequelize.transaction(async (t) => {
			const createdApprovalSetting = await models.ApprovalSettings.create(
				draftApprovalSetting,
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return createdApprovalSetting;
		});
		res.status(201).json({
			message: "SUCCESS: Approval Setting Created.",
			ApprovalSetting: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Approval Setting.",
			error: err.toString(),
		});
	}
};
const CreateApproverContact = async (req, res) => {
	try {
		const draftApproverContact = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const result = await models.sequelize.transaction(async (t) => {
			const createdApproverContact = await models.ApproverContacts.create(
				draftApproverContact,
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return createdApproverContact;
		});
		res.status(201).json({
			message: "SUCCESS: Approver Contact Created.",
			ApproverContact: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Approver Contact.",
			error: err.toString(),
		});
	}
};

const CreateRequestType = async (req, res) => {
	try {
		const draftRequestType = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		const result = await models.sequelize.transaction(async (t) => {
			const createdRequestType = await models.RequestTypes.create(
				draftRequestType,
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return createdRequestType;
		});
		res.status(201).json({
			message: "SUCCESS: Request Type Created.",
			RequestType: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Creating Request Type.",
			error: err.toString(),
		});
	}
};

const UpdateBusinessUnit = async (req, res) => {
	try {
		const draftBusinessUnit = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		delete draftBusinessUnit.ClientServiceRates;
		delete draftBusinessUnit.Verticals;
		// delete draftBusinessUnit.FormLayouts

		let businessUnitId = req.params.BusinessUnitId;
		if (isNaN(Number(businessUnitId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const updateBusinessUnit = await models.BusinessUnits.update(
				draftBusinessUnit,
				{
					where: {
						id: businessUnitId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return updateBusinessUnit;
		});
		res.status(200).json({
			message: "SUCCESS: Business Unit Updated.",
			BusinessUnit: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Business Unit.",
			error: err.toString(),
		});
	}
};

const UpdateVertical = async (req, res) => {
	try {
		const draftVertical = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}
		delete draftVertical.ApprovalSettings;

		let verticalId = req.params.VerticalId;
		if (isNaN(Number(verticalId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const updateVertical = await models.Verticals.update(
				draftVertical,
				{
					where: {
						id: verticalId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return updateVertical;
		});
		res.status(200).json({
			message: "SUCCESS: Vertical Updated.",
			ApproverContact: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Vertical.",
			error: err.toString(),
		});
	}
};

const UpdateApprovalSetting = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}
		const draftApprovalSetting = req.body;
		delete draftApprovalSetting.ApproverContacts;

		let approvalSettingId = req.params.ApprovalSettingId;
		if (isNaN(Number(approvalSettingId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const updateApprovalSetting = await models.ApprovalSettings.update(
				draftApprovalSetting,
				{
					where: {
						id: approvalSettingId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return updateApprovalSetting;
		});
		res.status(200).json({
			message: "SUCCESS: Approver Contact Updated.",
			ApproverContact: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Approver Setting.",
			error: err.toString(),
		});
	}
};

const UpdateClientServiceRate = async (req, res) => {
	try {
		const draftClientServiceRate = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let clientServiceRateId = req.params.ClientServiceRateId;
		if (isNaN(Number(clientServiceRateId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const UpdateClientServiceRate = await models.ClientServiceRates.update(
				draftClientServiceRate,
				{
					where: {
						id: clientServiceRateId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return UpdateClientServiceRate;
		});

		res.status(200).json({
			message: "SUCCESS: Client Service Rate Updated.",
			ApproverContact: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Client Service Rate",
			error: err.toString(),
		});
	}
};

const UpdateApproverContact = async (req, res) => {
	try {
		const draftApproverContact = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let approverContactId = req.params.ApproverContactId;
		if (isNaN(Number(approverContactId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const updateApproverContact = await models.ApproverContacts.update(
				draftApproverContact,
				{
					where: {
						id: approverContactId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return updateApproverContact;
		});
		res.status(200).json({
			message: "SUCCESS: Approver Contact Updated.",
			ApproverContact: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Approver Contact.",
			error: err.toString(),
		});
	}
};

const UpdateOffice = async (req, res) => {
	try {
		const draftOffice = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let officeId = req.params.OfficeId;
		if (isNaN(Number(officeId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const updateOffice = await models.Offices.update(
				draftOffice,
				{
					where: {
						id: officeId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return updateOffice;
		});
		res.status(200).json({
			message: "SUCCESS: Office Updated.",
			ApproverContact: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Office.",
			error: err.toString(),
		});
	}
};

const UpdateRequestType = async (req, res) => {
	try {
		const draftRequestType = req.body;
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let requestTypeId = req.params.RequestTypeId;
		if (isNaN(Number(requestTypeId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		const result = await models.sequelize.transaction(async (t) => {
			const updatedRequestType = await models.RequestTypes.update(
				draftRequestType,
				{
					where: {
						id: requestTypeId,
					},
				},
				{
					transaction: t,
					userEmail: req.tokenData.Email,
				}
			);
			return updatedRequestType;
		});
		res.status(200).json({
			message: "SUCCESS: Request Type Updated.",
			RequestType: result,
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Updating Request Type.",
			error: err.toString(),
		});
	}
};

const DeleteBusinessUnit = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let businessUnitId = req.params.BusinessUnitId;
		if (isNaN(Number(businessUnitId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.BusinessUnits.destroy({
				where: { id: businessUnitId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Business Unit Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Business Unit.",
			error: err.toString(),
		});
	}
};

const DeleteApprovalSetting = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let ApprovalSettingId = req.params.ApprovalSettingId;
		if (isNaN(Number(ApprovalSettingId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.ApprovalSettings.destroy({
				where: { id: req.params.ApprovalSettingId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Approval Setting Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Approval Setting.",
			error: err.toString(),
		});
	}
};

const DeleteApproverContact = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let ApproverContactId = req.params.ApproverContactId;
		if (isNaN(Number(ApproverContactId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.ApproverContacts.destroy({
				where: { id: ApproverContactId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Approval Contact Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Approval Contact.",
			error: err.toString(),
		});
	}
};

const DeleteClientServiceRate = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let ClientServiceRateId = req.params.ClientServiceRateId;
		if (isNaN(Number(ClientServiceRateId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.ClientServiceRates.destroy({
				where: { id: ClientServiceRateId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Client Service Rate Card Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message:
				"ERROR: Something Went Wrong While Deleting Client Service Rate Card.",
			error: err.toString(),
		});
	}
};

const DeleteVertical = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let VerticalId = req.params.VerticalId;
		if (isNaN(Number(VerticalId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.Verticals.destroy({
				where: { id: VerticalId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Vertical Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Vertical.",
			error: err.toString(),
		});
	}
};

const DeleteOffice = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let OfficeId = req.params.OfficeId;
		if (isNaN(Number(OfficeId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.Offices.destroy({
				where: { id: OfficeId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Office Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Office.",
			error: err.toString(),
		});
	}
};

const DeleteRequestType = async (req, res) => {
	try {
		const userData = req.tokenData;

		if (!userData.ManageMarketAccess) {
			throw "Access Denied.";
		}

		let RequestTypeId = req.params.RequestTypeId;
		if (isNaN(Number(RequestTypeId))) {
			//use when integer expected
			throw "Invalid Parameter.";
		}
		await models.sequelize.transaction(async (t) => {
			await models.RequestTypes.destroy({
				where: { id: RequestTypeId },
				transaction: t,
			});
			res.status(200).json({
				message: "SUCCESS: Request Type Deleted.",
			});
		});
	} catch (err) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Deleting Request Type.",
			error: err.toString(),
		});
	}
};

module.exports = {
	SetupFormLayouts: SetupFormLayouts,
	FetchAllCurrencies: FetchAllCurrencies,
	GetCSRatesByBusinessUnit: GetCSRatesByBusinessUnit,
	GetApproversByVertical: GetApproversByVertical,
	GetRequestTypesByCountry: GetRequestTypesByCountry,
	FetchAllMarketSettings: FetchAllMarketSettings,
	FetchOneMarketSetting: FetchOneMarketSetting,
	CreateBusinessUnit: CreateBusinessUnit,
	CreateVertical: CreateVertical,
	CreateClientServiceRate: CreateClientServiceRate,
	CreateApprovalSetting: CreateApprovalSetting,
	CreateApproverContact: CreateApproverContact,
	CreateOffice: CreateOffice,
	CreateRequestType: CreateRequestType,
	UpdateBusinessUnit,
	UpdateClientServiceRate,
	UpdateVertical,
	UpdateApprovalSetting,
	UpdateApproverContact,
	UpdateOffice,
	UpdateRequestType,
	DeleteBusinessUnit,
	DeleteApprovalSetting,
	DeleteApproverContact,
	DeleteClientServiceRate,
	DeleteVertical,
	DeleteOffice,
	DeleteRequestType,
	GetRequestTypesByMultipleCountry
};
