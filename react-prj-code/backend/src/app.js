require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const models = require("./models");
const projectsRoute = require("./routes/projects");
const marketSettingsRoute = require("./routes/marketSettings");
const costingProfilesRoute = require("./routes/costingprofiles");
const wavesRoute = require("./routes/waves");
const reportsRoute = require("./routes/reports");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const salesforceRoute = require("./routes/salesforce");
const initRoute = require("./routes/init");
const deliveriesRoute = require("./routes/deliveries");
const requestsRoute = require("./routes/requests");
const utilsRoute = require("./routes/utils");
const projectPlanner = require("./routes/projectPlanner");
const spbudget = require("./routes/spbudget");
const projectModuleDetail = require("./routes/projectModuleDetail");
const verticalsRoute = require("./routes/verticals");
const miscController = require("./controllers/misc");
const schedulerAssigneesRoute = require("./routes/schedulerAssignees");
// const scheduler = require("./utils/scheduler");
const JobScheduler = require("./utils/JobScheduler");

//models.sequelize.sync(); //Streamline with migrations for Prod.

const app = express();
// scheduler.sched;
JobScheduler.JobScheduler;
app.use(bodyParser.json({ limit: "25mb" })); //was exceeding default 100kb
app.use(bodyParser.urlencoded({ extended: true, limit: "25mb" }));
app.use(helmet());
app.use(cors());
app.use(compression());
app.get("/", miscController.showDefault);
app.use("/projects", projectsRoute);
app.use("/marketsettings", marketSettingsRoute);
app.use("/costingprofiles", costingProfilesRoute);
app.use("/waves", wavesRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoute);
app.use("/salesforce", salesforceRoute);
app.use("/init", initRoute);
app.use("/reports", reportsRoute);
app.use("/scheduler", schedulerAssigneesRoute);
app.use("/deliveries", deliveriesRoute);
app.use("/requests", requestsRoute);
app.use("/utils", utilsRoute);
app.use("/projectplanner", projectPlanner);
app.use("/spbudget", spbudget);

app.use("/projectmoduledetail", projectModuleDetail);



app.use("/verticals", verticalsRoute);
app.use(miscController.show404);
app.options("*", cors());
const port = process.env.PORT || 3030;

app.listen(port);

console.log("server listening on port", port);
console.log("environment: ", process.env.NODE_ENV);
