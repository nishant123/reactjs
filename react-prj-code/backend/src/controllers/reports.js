const models = require("../models");
const dbHelpers = require("../utils/dbhelpers");
const Op = require("sequelize").Op;

const FetchOneWave = async (req, res) => {
  try {
    const result = await models.Projects.findAll({
      where: {
        CommissioningCountry: req.params.CountryCode,
      },
    });

    if (result) {
      res.status(200).json({
        message: "SUCCESS: Fetched Projects for " + req.params.CountryCode,
        project: result,
      });
    } else {
      res.status(404).json({
        message: "INFO: No Projects Found for this Country.",
        CommissioningCountry: req.params.CountryCode,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "ERROR: Something Went Wrong While Fetching One Project.",
      error: err.toString(),
    });
  }
};

const FetchAllByProject = async (req, res) => {
  try {
    const result = await models.Projects.findAll();

    if (result) {
      res.status(200).json({
        message: "SUCCESS: Fetched All Projects",
        projects: result,
      });
    } else {
      res.status(404).json({
        message: "INFO: No Projects Found.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "ERROR: Something Went Wrong While Fetching All Project.",
      error: err.toString(),
    });
  }
};

const FetchAllByWavesFinance = async (req, res) => {
  try {
    // Auth middleware ValidateToken() puts tokenData in request obj
    const userData = req.tokenData;

    if (!userData.FinanceAccess) {
      throw "Access Denied.";
    }
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

    //filters to come later
    //Pagination
    //const { offset, limit } = req.query;
    const { limit, offset } = dbHelpers.GetPagination(
      req.query.limit,
      req.query.offset
    );

    const results = await models.WaveSpecs.findAndCountAll({
      //where: condition,
      //restrict to just CI Business Unit later and commissioned Projects Only and IsDeleted=false on projects.
      distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
      limit,
      offset,
      order: [["id", "DESC"]],
      attributes: [
        "DateFieldStart",
        "DateFieldEnd",
        "DateFinalReport",
        "DateFieldStartActual",
        "DateFieldEndActual",
        "DateFinalReportActual",
        "WaveNumber",
        "DateFinalReportNA",
        "DateFieldworkNA",
        "WaveName",
        "NotesFinance",
        "id",
      ],
      include: [
        {
          model: models.CostingProfiles,
          attributes: [
            "IsMultiCountry",
            "PriceToClient",
            "CostTotalExternalOperations",
            "ProfileStatus",
            "OutOfPocketCostPercent",
            "ContributionMarginPercent",
            "IsTracker",
            "NumberOfWaves",
            "TrackingFrequency",
            "FieldingCountries",
            "Methodology",
            "SubMethodology",
            "ResearchType",
            "FieldType",
            "CommissionedBy",
            "CommissionedDate",
            "CostInputCurrency",
            "id",
          ],
          include: [
            {
              model: models.Projects,
              attributes: [
                "ProjectId",
                "ProjectName",
                "IndustryVertical",
                "BusinessUnit",
                "CommissioningCountry",
                "IsSyndicated",
                "ProjectStatus",
                "ProposalOwnerEmail",
                "CommissioningOffice",
                "NotesProjectStatus",
                "id",
              ],
              //where: projectCondition,
              include: [
                {
                  model: models.ContractDetails,
                  attributes: [
                    "OpportunityNumber",
                    "OpportunityName",
                    "AccountName",
                    "Probability",
                    "Industry",
                    "id",
                  ],
                  include: [
                    {
                      model: models.OpportunityLineItemDetails,
                      as: "opportunityLineItemDetails",
                      attributes: [
                        "WBSNumber",
                        "PracticeArea",
                        "ProductDescription",
                        "id",
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
      message: "SUCCESS: Fetched All Waves For Finance Report.",
      items: results.rows, //filteredProjects,
      totalItems: results.count,
      offset: offset,
      limit: limit,
    });
  } catch (ex) {
    res.status(500).json({
      message:
        "ERROR: Something Went Wrong While Fetching All Waves For Finance Report.",
      error: ex.toString(),
    });
  }
};

const FetchAllByDeliverSpecsTCS = async (req, res) => {
  try {
    // Auth middleware ValidateToken() puts tokenData in request obj
    const userData = req.tokenData;

    //may need to lock out based on permissions later.
    // if (!userData.FinanceAccess) {
    // 	throw "Access Denied.";
    // }
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

    //filters to come later
    //Pagination
    //const { offset, limit } = req.query;
    const { limit, offset } = dbHelpers.GetPagination(
      req.query.limit,
      req.query.offset
    );

    const results = await models.DeliverySpecs.findAndCountAll({
      //where: condition,
      //restrict to just CI Business Unit later and commissioned Projects Only and IsDeleted=false on projects.
      distinct: true, //workaround - sequelize count in findAll is broken. https://github.com/sequelize/sequelize/issues/10557
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: models.WaveSpecs,
          attributes: [
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
            "OpsResourcesData",
          ],
          include: [
            {
              model: models.CostingProfiles,
              attributes: [
                "id",
                "ProfileName",
                "ProfileNumber",
                "IsTracker",
                "TrackingFrequency",
                "NumberOfWaves",
                "FieldingCountries",
                "Methodology",
                "CommissionedDate",
                "CommissionedBy",
              ],
              include: [
                {
                  model: models.CountrySpecs,
                  include: [{ model: models.MethodologySpecs }],
                },
                {
                  model: models.Projects,
                  attributes: [
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
                  ],
                  //where: projectCondition,
                  include: [
                    {
                      model: models.ContractDetails,
                      attributes: [
                        "AccountName",
                        "Industry",
                        "OpportunityNumber",
                        "id",
                      ],
                      include: [
                        {
                          model: models.OpportunityLineItemDetails,
                          as: "opportunityLineItemDetails",
                          attributes: [
                            "WBSNumber",
                            "PracticeArea",
                            "ProductDescription",
                            "id",
                          ],
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
      message: "SUCCESS: Fetched All DeliverySpecs For TCS Report.",
      items: results.rows, //filteredProjects,
      totalItems: results.count,
      offset: offset,
      limit: limit,
    });
  } catch (ex) {
    res.status(500).json({
      message:
        "ERROR: Something Went Wrong While Fetching All Waves For Finance Report.",
      error: ex.toString(),
    });
  }
};

module.exports = {
  FetchOneWave: FetchOneWave,
  FetchAllByWavesFinance: FetchAllByWavesFinance,
  FetchAllByProject: FetchAllByProject,
  FetchAllByDeliverSpecsTCS: FetchAllByDeliverSpecsTCS,
};
