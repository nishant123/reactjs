const Op = require("sequelize").Op;
const models = require("../models");
const utilsController = require("../controllers/utils");

const GetAll = async (req, res) => {
  const {projectId, countryCode, methodologySpecId, waveId} = req.query;
  console.log("projectId: "+projectId);
  console.log("countryCode: "+countryCode);
  console.log("methodologySpecId: "+methodologySpecId);
  console.log("waveId: "+waveId);
  let condition = {};
  if (projectId) {
    condition['ProjectId'] = { [Op.eq]: projectId }
  }
  if (methodologySpecId) {
    condition['MethodologySpecId'] = { [Op.eq]: methodologySpecId }
  }
  if (countryCode) {
    condition['$MethodologySpec.CountrySpec.CountryCode$'] = countryCode
  }
  console.log(condition)
  try{
    const planners = await models.ProjectPlanner.findAll({
      where: condition,
      order: [["id", "ASC"]],
      include: [
        {
          model: models.SpTasksAssignees,
          separate: true,
        },
        {
          model: models.SpTasksDate,
          separate: true,
        },
        {
          model: models.MethodologySpecs,
          as: 'MethodologySpec',
          include: {
            model: models.CountrySpecs,
            as: 'CountrySpec',
          }
        },
      ]
    });
    console.log("planners: "+planners.length)
    res.status(200).json({
			message: "Fetched planners successfully",
			planners: planners,
		});
  }catch(ex){
    res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching Planners.",
			error: ex.toString(),
		});
  }
}

const Update = (req, res) => {

  const data = req.body;

  console.log(data);

  async function findPlanner() {
    await models.ProjectPlanner.findAll({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: models.SpTasksAssignees,
          separate: true,
        },
        {
          model: models.SpTasksDate,
          separate: true,
        },
      ]
    })
      .then((results) => {
        res.status(201).json({
          message: "SUCCESS: Checklist Updated.",
          items: results[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Not Updated: Catched an error while updating a Checklist.",
          error: err.toString(),
        });
      })
  }

  models.ProjectPlanner.update(data, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      data.IsCompleted ? utilsController.SpProjectCompletion(req.body.projectData, req.params.id) : null
      findPlanner();
    })
    .catch((err) => {
      res.status(500).json({
        message: "Not Updated: Catched an error while updating a Checklist.",
        error: err.toString(),
      });
    });
}

const AddAssignees = (req, res) => {
  const data = req.body;

  models.SpTasksAssignees.bulkCreate(data)
    .then((result) => {
      res.status(201).json({
        message: "SUCCESS: Assignees Created.",
        items: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "ERROR: Something went wrong while adding assignees.",
        error: err.toString(),
      });
    });
};

const TrashAssignees = (req, res) => {
  models.SpTasksAssignees.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "SUCCESS: Assignee Removed.",
        Email: req.params.UserEmail,
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: "ERROR: Something Went Wrong While Removing Assignee.",
        error: err,
      })
    });
}

const UpdateAssignees = (req, res) => {
  const data = req.body;

  async function findAssignees() {
    await models.SpTasksAssignees.findAll({
      where: {
        id: data.id
      }
    })
      .then((results) => {
        res.status(201).json({
          message: "SUCCESS: Assignees has been added.",
          items: results[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Not Updated: Unable to add assignees",
          error: err.toString(),
        });
      })
  }

  models.SpTasksAssignees.update(data, {
    where: {
      id: data.id
    }
  })
    .then(() => {
      findAssignees();
    })
    .catch((err) => {
      res.status(500).json({
        message: "Not Updated: Catched an error while updating a Checklist.",
        error: err.toString(),
      });
    });
}

const AddDates = async (req, res) => {
  const data = req.body.data;

  data.forEach(d => {
    if (d.PlannedDate) {
      d.PlannedDate = JSON.stringify(d.PlannedDate)
    }
    if (d.ActualDate) {
      d.ActualDate = JSON.stringify(d.ActualDate)
    }
  });

  var newData = data.filter(d => !d.id);
  var updatedData = data.filter(d => d.id);

  try {

    async function updateData(upData) {
      await models.SpTasksDate.update(
        {
          ...upData
        },
        { where: { id: upData.id } }
      )
        .then(() => {
          const sender = req.tokenData.Email;
          upData.PlannedDate ? utilsController.SpTaskPlannedDateChange(req.body.projectData, upData) : null
          upData.ActualDate ? utilsController.SpTaskReopenActualDateChange(req.body.projectData, upData) : null

        }).catch((err) => {
          res.status(500).json({
            message: "Not Updated: Date Updation Error",
            error: err.toString(),
          });
        });
    }

    async function createDates(crData) {
      await models.SpTasksDate.bulkCreate(crData).then(() => {
        if (crData.length) {
          utilsController.SpProjectActivityAssignment(req.body.projectData, crData);
        }
      })
        .catch((err) => {
          res.status(500).json({
            message: "Not Updated: Catched an error while updating date",
            error: err.toString(),
          });
        });
    }

    async function updateStartDate(planner) {

      var mewPlanner = JSON.parse(JSON.stringify(planner));

      var updata = {};

      if (mewPlanner.SpTasksDates[0].PlannedDate) {
        updata = {
          ...updata,
          PlannedDateStart: planner.SpTasksDates[0].PlannedDate.current.date
        }
      }

      await models.ProjectPlanner.update({ ...updata }, { where: { id: planner.id } });

      mewPlanner.PlannedDateStart = updata.PlannedDateStart;

      res.status(201).json({
        message: "SUCCESS: Dates Updated.",
        items: mewPlanner,
      });
    }

    async function findDates() {
      await models.ProjectPlanner.findOne({
        where: {
          id: data[0].ProjectPlannerId
        },
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
      })
        .then((newresults) => {
          updateStartDate(newresults);
        })
        .catch((err) => {
          res.status(500).json({
            message: "Not Updated: Catched an error while updating date",
            error: err.toString(),
          });
        });
    }

    if (newData.length) {
      createDates(newData);
    }
    if (updatedData.length) {
      updatedData.forEach(upData => {
        updateData(upData);
      });
    }

    findDates();

  }
  catch (err) {
    res.status(500).json({
      message: "Not Updated: Date Updation Error",
      error: err.toString(),
    });
  }

};

const UpdateDates = (req, res) => {
  const data = req.body;

  async function findDate() {
    await models.SpTasksDate.findAll({
      where: {
        id: data.id
      }
    })
      .then((results) => {
        res.status(201).json({
          message: "SUCCESS: Date Updated.",
          items: results[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Not Updated: Catched an error while updating date",
          error: err.toString(),
        });
      })
  }

  models.SpTasksDate.update(data, {
    where: {
      id: data.id
    }
  })
    .then(() => {
      findDate();
    })
    .catch((err) => {
      res.status(500).json({
        message: "Not Updated: Catched an error while updating a Checklist.",
        error: err.toString(),
      });
    });
}

const TrashDates = (req, res) => {
  models.SpTasksDate.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "SUCCESS: Date Removed.",
        Email: req.params.UserEmail,
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: "ERROR: Something Went Wrong While Removing Date.",
        error: err,
      })
    });
}

module.exports = {
  AddAssignees,
  UpdateAssignees,
  TrashAssignees,
  AddDates,
  UpdateDates,
  TrashDates,
  Update,
  GetAll
};