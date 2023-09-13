const models = require("../models");
const utilsController = require("../controllers/utils");

const Upsert = (req, res) => {
  const data = req.body.selectedProjectData;
  const user = req.body.user;

  const budgets = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].SpBudgets;

  async function createPlanner(results) {

    let projectPlanner = [];

    results.forEach(result =>
      projectPlanner.push({
        ProjectId: data.ProjectId,
        ProjectName: data.ProjectName,
        Wave: result.Wave,
        PlannedDateStart: null,
        PlannedDateEnd: null,
        IsActive: result.Wave == 1 ? true : false,
        MethodologySpecId: data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].id,
        SpBudgetId: result.id,
      })
    )

    await models.ProjectPlanner.bulkCreate(projectPlanner)
      .then(async (result) => {
        const RFQData = data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].RFQData;
        // createProjectPlannerSub(result);


        const folderData = {
          MethodologySpecId: data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].id,
          CommissioningCountry: data.CommissioningCountry,
          Function: data.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].Label.toString().toLowerCase().includes('telephone') ? "CATI" : "FIELD",
          IndustryVertical: data.IndustryVertical,
          ProjectNameNumber: data.ProjectName + "_" + data.ProjectId,
          Assignees: req.body.assignees
        }
        await utilsController.CreateDriveFolders(folderData);
        await createProjectPlannerSub(result);

      })
      .catch((err) => {
        console.log("Post ProjectPlanner Called with: ", err);
        res.status(500).json({
          message: "ERROR: ProjectPlanner Creation Failed.",
          error: err.toString(),
        });
      });
  }

  async function createProjectPlannerSub(result) {

    let projectPlanner = [];

    result.forEach(result =>
      projectPlanner.push({
        ProjectPlannerId: result.id
      })
    )

    getMethodologies(result);

  }

  async function getMethodologies(result) {
    await models.MethodologySpecs.findOne({
      where: {
        id: result[0].MethodologySpecId
      },
      model: models.MethodologySpecs,
      separate: true,
      include: [
        {
          model: models.SpBudget,
          separate: true
        },
        {
          model: models.ProjectModuleDetail,
          separate: true
        },
        {
          model: models.ProjectPlannerFolders,
          separate: true
        },
        {
          model: models.ProjectPlanner,
          separate: true,
          include: [
            {
              model: models.SpTasksAssignees,
              separate: true
            },
            {
              model: models.SpTasksDate,
              separate: true
            },
          ]
        },
        {
          model: models.SchedulerAssignees,
          separate: true
        }
      ]
    })
      .then((results) => {
        res.status(200).json({
          message: "SUCCESS: Budget Created!",
          items: results,
        })
      })
      .catch((err) => {
        res.status(500).json({
          message: "ERROR: Budget Creation Failed.",
          error: err.toString(),
        });
      })
  }

  async function updateData(budget) {
    await models.SpBudget.update(
      {
        CostsData: budget.CostsData,
        Sample: budget.Sample,
        SampleEqualyDistributed: budget.SampleEqualyDistributed
      },
      { where: { id: budget.id } }
    ).then(result => {
      setBudgetLog([{dataValues: budget}], { updatedBy: user.Email, updatedAt: new Date() });
    })
  }

  async function setBudgetLog(budgets, data) {
    budgets.forEach(async budget => {
      await models.BudgetLogs.create({
        Data: JSON.stringify(budget.dataValues),
        CreatedBy: data.createdBy,
        CreatedAt: data.createdAt,
        UpdatedBy: data.updatedBy,
        UpdatedAt: data.updatedAt,
        BudgetId: budget.dataValues.id
      }).catch((err) => {
        res.status(500).json({
          message: "ERROR: BudgetLog Creation Failed.",
          error: err.toString(),
        });
      });
    })
  }

  budgets.forEach(budget => {
    budget.CostsData = JSON.stringify(budget.CostsData);
    return budget;
  });

  if (budgets[0].id) {
    budgets.forEach(budget => {
      updateData(budget);
    });
    getMethodologies(budgets);

  }
  else {
    models.SpBudget.bulkCreate(budgets)
      .then((result) => {
        setBudgetLog(result, { createdBy: user.Email, createdAt: new Date() });
        createPlanner(result);
      })
      .catch((err) => {
        console.log("Post Budget Called with: ", err);
        res.status(500).json({
          message: "ERROR: Budget Creation Failed.",
          error: err.toString(),
        });
      });
  }

};

module.exports = {
  Upsert: Upsert,
};