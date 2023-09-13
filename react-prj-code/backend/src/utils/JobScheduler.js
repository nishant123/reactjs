const CronJob = require('cron').CronJob;
const models = require("../models");
const Op = require("sequelize").Op;
const moment = require("moment");
const path = require("path");
const emailing = require("./sendMail");
const ejs = require("ejs");
const fs = require("fs");
const dirPathToKey = path.join(__dirname, "../config/formSchemas/default/taskslistSchema/default.json");

var markets = [{ code: 'AE', timeZone: 'Asia/Dubai' },
{ code: 'DZ', timeZone: 'Africa/Algiers' },
{ code: 'EG', timeZone: 'Africa/Cairo' },
{ code: 'JO', timeZone: 'Asia/Amman' },
{ code: 'LB', timeZone: 'Asia/Beirut' },
{ code: 'MA', timeZone: 'Africa/Casablanca' },
{ code: 'PK', timeZone: 'Asia/Karachi' },
{ code: 'QA', timeZone: 'Asia/Qatar' },
{ code: 'ZA', timeZone: 'Africa/Johannesburg' },
{ code: 'SA', timeZone: 'Asia/Riyadh' }];

async function findMarkets() {
	await models.Countries.findAll({
		where: {
			Code: {
				[Op.or]: [
					"QA", "LB", "JO", "ZA", "MA", "EG", "DZ", "SA", "PK", "AE"
				]
			}
		}
	})
		.then((results) => {
			markets = results.map(result => ({ code: result.Code, timeZone: result.TimeZone, reference: "" }));
			console.log(markets);
			// JobScheduler3.start();
			// 00 14 20 * * 1-5
		})
}

const JobScheduler = function () {
};

const tasksNotifications = async (country) => {
	await models.ProjectPlanner.findAll({
		where: {
			[Op.and]: {
				IsActive: true,
				IsCompleted: false,
				'$MethodologySpec.CountrySpec.CountryCode$': country
			},
		},
		include: [
			{
				model: models.MethodologySpecs,
				as: 'MethodologySpec',
				include: [
					{
						model: models.CountrySpecs,
						as: 'CountrySpec',
						include: {
							model: models.CostingProfiles,
							include: {
								model: models.Projects,
							}
						}
					},
					{
						model: models.SchedulerAssignees,
						attributes: ["Email"],
						where: {
							Role: {
								[Op.or]: [
									"FM",
									"E2S"
								]
							}
						},
						separate: true,
					},
					{
						model: models.ProjectModuleDetail,
						separate: true,
					}
				],
			},
			{
				model: models.SpTasksDate,
				separate: true,
			}
		]
	}).then((projectPlanners) => {

		if (projectPlanners.length) {
			projectPlanners.forEach(async (projectPlanner) => {
				if (projectPlanner.SpTasksDates.length) {
					var activitySchema = JSON.parse(fs.readFileSync(dirPathToKey));
					const methodologySpec = projectPlanner.MethodologySpec;
					const projectModuleDetail = methodologySpec.ProjectModuleDetails;
					const isProjectModulePaused = projectModuleDetail && projectModuleDetail[projectModuleDetail.length - 1] ?
						projectModuleDetail[projectModuleDetail.length - 1].Action !== "PAUSE"
						: false

					if (isProjectModulePaused) {
						const spTasksDates = projectPlanner.SpTasksDates;
						const schedulerAssignees = methodologySpec.SchedulerAssignees;
						const emails = schedulerAssignees.map(schedulerAssignee => schedulerAssignee.Email).filter((value, index, self) => { return self.indexOf(value) === index; });
						const countrySpec = methodologySpec.CountrySpec;
						const costingProfile = countrySpec.CostingProfile;
						const project = costingProfile.Project;
						const researchType = costingProfile.ResearchType === "Qualitative" ? "QUAL" :
							costingProfile.ResearchType === "Quantitative" ? "QUANT" : "ONLINE";

						var CompletedTasks = [];
						var PendingTasks = [];
						var threeDaysPendingTasks = [];
						var oneDayPendingTasks = [];

						var activityParent = activitySchema.find(e => e.title === researchType).properties;
						var statusKeys = Object.keys(activityParent);

						statusKeys.forEach(statusKey => {
							var tasksKeys = Object.keys(activityParent[statusKey].properties)
							tasksKeys.forEach(task => {
								var currentTask = spTasksDates.find(spTaskDates => spTaskDates.Task === task);
								if (currentTask) {
									if (currentTask.ActualDate) {
										CompletedTasks.push({
											Task: task,
											PlannedDate: currentTask.PlannedDate.current.date,
											ActualDate: currentTask.ActualDate.current.date,
											User: "NA",
											Owner: activityParent[statusKey].properties[task].Role
										});
									}
									else {
										PendingTasks.push({
											Task: task,
											PlannedDate: currentTask.PlannedDate.current.date,
											Owner: activityParent[statusKey].properties[task].Role
										});

										var timeDiff = (new Date().setHours(0, 0, 0, 0) - new Date(currentTask.PlannedDate.current.date).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);

										if (timeDiff >= 3) {
											threeDaysPendingTasks.push({
												Task: task,
												Owner: activityParent[statusKey].properties[task].Role,
												PlannedDate: currentTask.PlannedDate.current.date,
												ActualDate: "TBD"
											});
										}

										if (timeDiff == 1) {
											oneDayPendingTasks.push({
												Task: task,
												Owner: activityParent[statusKey].properties[task].Role,
												PlannedDate: currentTask.PlannedDate.current.date,
												ActualDate: "TBD"
											});
										}
									}
								}
							})
						})
						var body = await ejs.renderFile(
							path.join("src", "views/taskCompletionNotification.ejs"),
							{
								ProjectDetails: { name: project.ProjectName, id: project.ProjectId, methodology: methodologySpec.Label, currentWave: projectPlanner.Wave, fwStartDate: spTasksDates[0].PlannedDate.current.date, fwEndDate: spTasksDates[spTasksDates.length - 1].PlannedDate.current.date },
								CompletedTasks: CompletedTasks,
								PendingTasks: PendingTasks,
							}
						);
						var subject = "TASK COMPLETION NOTIFICATION: " + project.ProjectName + " " + project.ProjectId;
						await emailing.SendSpEmail(body, emails, subject);

						if (threeDaysPendingTasks.length) {
							var body = await ejs.renderFile(
								path.join("src", "views/taskOverdueNotification.ejs"),
								{
									ProjectDetails: { name: project.ProjectName, id: project.ProjectId, methodology: methodologySpec.Label, currentWave: projectPlanner.Wave, fwStartDate: spTasksDates[0].PlannedDate.current.date, fwEndDate: spTasksDates[spTasksDates.length - 1].PlannedDate.current.date },
									PendingTasks: threeDaysPendingTasks,
								}
							);
							var subject = "TASK OVERDUE: " + project.ProjectName + " " + project.ProjectId;
							await emailing.SendSpEmail(body, emails, subject);
						}

						if (oneDayPendingTasks.length) {
							var body = await ejs.renderFile(
								path.join("src", "views/taskReminderNotification.ejs"),
								{
									ProjectDetails: { name: project.ProjectName, id: project.ProjectId, methodology: methodologySpec.Label, currentWave: projectPlanner.Wave, fwStartDate: spTasksDates[0].PlannedDate.current.date, fwEndDate: spTasksDates[spTasksDates.length - 1].PlannedDate.current.date },
									PendingTasks: oneDayPendingTasks,
								}
							);

							var subject = "TASK REMINDER: " + project.ProjectName + " " + project.ProjectId;
							await emailing.SendSpEmail(body, emails, subject);
						}

						console.log("Email Sent!");
					}
				}
			})
		}
	});
}

const projectSheduleOverdue = async (country) => {
	await models.MethodologySpecs.findAll({
		where: {
			[Op.and]: {
				'$CountrySpec.CostingProfile.ProfileStatus$': 6,
				'$CountrySpec.CountryCode$': country
			},
		},
		include: [
			{
				model: models.CountrySpecs,
				as: 'CountrySpec',
				include: {
					model: models.CostingProfiles,
					as: 'CostingProfile',
					include: {
						model: models.Projects,
						as: 'Project'
					}
				}
			},
			{
				model: models.SchedulerAssignees,
				separate: true
			}
		],
	}).then((methodologySpecs) => {

		if (methodologySpecs.length) {
			methodologySpecs.forEach(async (methodologySpec) => {

				const schedulerAssignees = methodologySpec.SchedulerAssignees;
				const countrySpec = methodologySpec.CountrySpec;
				const costingProfile = countrySpec.CostingProfile;
				const project = costingProfile.Project;
				var emails = await models.Users.findAll({
					where: {
						[Op.and]: {
							SpRole: "CC",
							Countries: [country]
						}
					},
					attributes: ["Email"]
				});
				const commissionedDateDiff = costingProfile.CommissionedDate ? (new Date().setHours(0, 0, 0, 0) - new Date(costingProfile.CommissionedDate).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24) : 0;

				if (schedulerAssignees.length == 0 && commissionedDateDiff >= 1 && emails.length) {
					var body = await ejs.renderFile(
						path.join("src", "views/scheduleOverdueNotification.ejs"),
						{
							ProjectDetails: { name: project.ProjectName, id: project.ProjectId, methodology: methodologySpec.Label, fwStartDate: spTasksDates[0].PlannedDate.current.date, fwEndDate: spTasksDates[spTasksDates.length - 1].PlannedDate.current.date },
							days: commissionedDateDiff
						}
					);

					const subject = "PROJECT SCHEDULE OVERDUE: " + project.ProjectName + " " + project.ProjectId;
					await emailing.SendSpEmail(body, emails.map(user => user.Email), subject);

					console.log("Email Sent!");
				}
			});
		}
	});
};

markets.forEach(market => {
	new CronJob('00 00 06 * * *', function () {
		console.log('You are looking:' + market.code + " Time Zone: " + market.timeZone);
		tasksNotifications(market.code);
		projectSheduleOverdue(market.code);
	}, null, true, market.timeZone);
});

module.exports = { JobScheduler: JobScheduler }