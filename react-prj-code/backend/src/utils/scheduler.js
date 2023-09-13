const schedule = require('node-schedule');
const models = require("../models");
const Op = require("sequelize").Op;
const moment = require("moment");
const {getUsers} = require("./googleUsers");

const sched = schedule.scheduleJob('* * * * *', function(e){
    // console.log('Scheduler initiated!');
    try{
        testing(e);
        //projectNotScheduleNotification();
        //projectInactiveNotification();
        //taskCompleteNotification();
    }catch(e){
        console.log("Scheduler error: "+e.message)
    }
});

const testing = (e) => {
    console.log("Called!!!" + e);
}

const projectNotScheduleNotification = async () =>{
    const results = await models.Projects.findAndCountAll({
        distinct: true,
        order: [["id", "DESC"]],
        include: [
            {
                model: models.CostingProfiles,
                as: "CostingProfiles",
                where: {
                    [Op.and]: {
                        CommissionedDate: {
                            [Op.gte]: moment().subtract(1, 'days').toDate()
                        },
                        ProfileStatus: 6,
                    }
                }
            },
        ]
    });
    if(results.rows.length > 0){
        results.rows.forEach(project=>{
            project.CostingProfiles[0].CountrySpecs.forEach(country => {
                country.MethodologySpecs.forEach(methodology => {
                    if(methodology.SpBudget.length === 0){
                        const projectData = getProject(project,country,methodology);
                    }
                })
            })
        })
    }
}

const projectInactiveNotification = async () => {
    const results = await models.Projects.findAndCountAll({
        distinct: true,
        order: [["id", "DESC"]],
        include: [
            {
                model: models.CostingProfiles,
                as: "CostingProfiles",
                where: {
                    ProfileStatus: 6,
                }
            },
        ]
    });
    if(results.rows.length > 0){
        results.rows.forEach(project=>{
            project.CostingProfiles[0].CountrySpecs.forEach(country => {
                country.MethodologySpecs.forEach(methodology => {
                    if(methodology.ProjectPlanners.length > 0){
                        if(!methodology.ProjectPlanners[0].PlannedDateStart){
                            const projectData = getProject(project,country,methodology);
                        }
                    }
                })
            })
        })
    }
}

const taskCompleteNotification = async () => {
    const results = await models.Projects.findAndCountAll({
        distinct: true,
        order: [["id", "DESC"]],
        include: [
            {
                model: models.CostingProfiles,
                as: "CostingProfiles",
                where: {
                    [Op.and]: {
                        ProfileStatus: 6,
                    }
                }
            },
        ]
    });
    if(results.rows.length > 0){
        
    }
}
const getProject = (project,country,methodology) =>{
    projectData['CostingProfiles'] = project.CostingProfiles[0];
    projectData.CostingProfiles[0]['CountrySpecs'] = [];
    projectData.CostingProfiles[0].CountrySpecs.push(country);
    projectData.CostingProfiles[0].CountrySpecs[0]['MethodologySpecs'] = [];
    projectData.CostingProfiles[0].CountrySpecs[0].MethodologySpecs.push(methodology);
}
module.exports = {sched:sched}