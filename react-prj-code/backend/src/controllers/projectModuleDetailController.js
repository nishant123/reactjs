const models = require("../models");
const utilsController = require("../controllers/utils");

const Create = async (req, res) => {
    try {
        await models.ProjectModuleDetail.create(req.body.data).then(
            (result) => {
                const sender = req.tokenData.Email;
                utilsController.SpProjectPauseResume(req.body, result.dataValues);
                res.status(200).json(
                    {
                        message: "SUCCESS: Project Module Detail Created.",
                        result: result
                    });

            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "ERROR: Something Went Wrong While Creating Project Module Detail.",
            error: err.toString(),
        });
    }
}

const Reschedule = async (req, res) => {
    console.log('Project Module Detail: ')
    try {
        console.log("Project Module Detail " + JSON.stringify(req.body))
        console.log(models.ProjectModuleDetail)

        await models.SpBudget.destroy({ where: { MethodologySpecId: req.params.methodologyid } })
        await models.SchedulerAssignees.destroy({ where: { MethodologySpecId: req.params.methodologyid } })
        await models.ProjectPlannerFolders.destroy({ where: { MethodologySpecId: req.params.methodologyid } })
        await await models.ProjectModuleDetail.findAll({ where: { MethodologySpecId: req.params.methodologyid } }).then(
            (result) => {
                res.status(200).json(
                    {
                        message: "SUCCESS: Project Module Detail.",
                        result: result
                    });

            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "ERROR: Something Went Wrong While Creating Project Module Resumed.",
            error: err.toString(),
        });
    }
}


module.exports = {
    Create,
    Reschedule
};