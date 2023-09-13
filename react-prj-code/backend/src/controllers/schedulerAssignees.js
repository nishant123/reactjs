const models = require("../models");
const utilsController = require("../controllers/utils");
const { Sequelize } = require("../models");
const Op = require("sequelize").Op;
const googleDrive = require("../utils/googleDrive");

const Create = async (req, res) => {
    console.log('Scheduler: ')
    await models.SchedulerAssignees.bulkCreate(req.body.data).then((result) => {
        const sender = req.tokenData.Email;
        const getRecievers = result.map(e => e.dataValues);
        const reciever = [...new Set(getRecievers.map((assignee) => assignee.Email))]
        utilsController.SpProjectSchedule(req.body.projectData, sender, reciever);
        res.status(200).json(
            {
                message: "SUCCESS: Scheduler Assignee Created.",
                result: result
            });

    })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                message: "ERROR: Something Went Wrong While Creating Scheduler Assignee.",
                error: err.toString(),
            });
        })
}

const createOne = async (req, res) => {
    try {
        await models.SchedulerAssignees.create(req.body.data).then(
            (result) => {
                const sender = req.tokenData.Email;
                utilsController.SpProjectInvite(result, req.body.projectData);
                req.body.projectData.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlannerFolders && req.body.projectData.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlannerFolders.length > 0 ?
                    googleDrive.createPermissions([{ "Email": result.Email }], req.body.projectData.CostingProfiles[0].CountrySpecs[0].MethodologySpecs[0].ProjectPlannerFolders.find(folder => folder.ParentFolderId === null).FolderId)
                    : null
                res.status(200).json(
                    {
                        message: "SUCCESS: Scheduler Assignee Created.",
                        result: result
                    });
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "ERROR: Something Went Wrong While Creating Scheduler Assignee.",
            error: err.toString(),
        });
    }
}

const update = async (req, res) => {
    try {

        for (const [key, value] of Object.entries(req.body)) {
            await models.sequelize.transaction(async (t) => {
                console.log("Transiaction");
                await models.SchedulerAssignees.update(value, {
                    where: {
                        MethodologySpecId: value.MethodologySpecId,
                        [Op.and]: {
                            id: value.id,
                        },
                    },
                    transaction: t,
                }).catch((ex) => {
                    // console.log("F1");
                    console.log("Error is: " + ex);
                    throw ex;
                });
            });
        }

        await res.status(200).json({ message: "SUCCESS: SchedulerAssignees Updated." });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "ERROR: Something Went Wrong While Updating SchedulerAssignees.",
            error: err.toString(),
        });
    }
}

const fetchAll = async (req, res) => {
    models.SchedulerAssignees.findAll({
        where: {
            Email: req.params.email,
        },
        include: [
            {
                model: models.MethodologySpecs,
                distinct: true,
                include: [{
                    model: models.CountrySpecs,
                    include: [
                        {
                            model: models.CostingProfiles,
                            include: [
                                {
                                    model: models.Projects
                                }
                            ]
                        }
                    ]
                }]
            },
        ]
    }
    )
        .then((result) => {
            console.log('Result in SchedulerAssignees is: ' + JSON.stringify(result))
            res.status(200).json({
                message: "SUCCESS: Fetched Project SchedulerAssignees.",
                SchedulerAssignees: result,
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                message:
                    "ERROR: Something Went Wrong While Fetched SchedulerAssignees.",
                error: err.toString(),
            });
        });
}

const deleteAssignee = async (req, res) => {
    try {
        await models.SchedulerAssignees.destroy({
            where: {
                id: req.params.id
            }
        }).then((result) => {
            console.log('Result in SchedulerAssignees is: ' + JSON.stringify(result))
            res.status(200).json({
                message: "SUCCESS: Scheduler Assignee Removed.",
                result: result,
            });
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
                message:
                    "ERROR: Scheduler Assignee Removal failed.",
                error: err.toString(),
            });
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "ERROR: Something Went Wrong While Removing Scheduler Assignee.",
            error: err.toString(),
        });
    }
}

const fetchMethodologySpecific = (req, res) => {
    models.SchedulerAssignees.findAll({
        where: {
            MethodologySpecId: req.params.MethodologySpecId,
        },
        include: [
            {
                model: models.MethodologySpecs,
                distinct: true,
                include: [{
                    model: models.CountrySpecs,
                    include: [
                        {
                            model: models.CostingProfiles,
                            include: [
                                {
                                    model: models.Projects
                                }
                            ]
                        }
                    ]
                }]
            },
        ]
    }
    ).then((result) => {
        console.log('Result in SchedulerAssignees is: ' + JSON.stringify(result))
        res.status(200).json({
            message: "SUCCESS: Fetched Updated SchedulerAssignees.",
            result: result,
        });
    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            message:
                "ERROR: Something Went Wrong While Fetched SchedulerAssignees.",
            error: err.toString(),
        });
    });

}

module.exports = {
    Create: Create,
    createOne,
    update,
    fetchAll,
    deleteAssignee,
    fetchMethodologySpecific
};