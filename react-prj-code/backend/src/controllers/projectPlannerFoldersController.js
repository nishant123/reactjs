const models = require("../models");

const Create = async (req) => {
    console.log('ProjectPlannerFolders: ')
    try {
       
        console.log("ProjectPlannerFolders are "+ JSON.stringify(req.body))
        console.log(models.ProjectPlannerFolders)

        await models.ProjectPlannerFolders.bulkCreate(req);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "ERROR: Something Went Wrong While adding ProjectPlannerFolders.",
            error: err.toString(),
        });
    }
}

module.exports = {
    Create,
};