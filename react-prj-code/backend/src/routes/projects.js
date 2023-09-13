const express = require("express");
const projectsController = require("../controllers/projects");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.ValidateToken, projectsController.FetchAll);
router.post("/", authController.ValidateToken, projectsController.Create);
router.get("/sp", authController.ValidateToken, projectsController.FetchAllSP);
router.get("/projectPlanners", projectsController.FetchAllForProjectPlanners);

router.put(
  "/sp:ProjectId",
  authController.ValidateToken,
  projectsController.SpUpdate
)
router.get(
	"/sp:ProjectId",
	authController.ValidateToken,
	projectsController.FetchOneSP
);
router.delete(
	"/:ProjectId",
	authController.ValidateToken,
	projectsController.TrashOne
);
router.delete(
	"/contractdetails/:contractId",
	authController.ValidateToken,
	projectsController.TrashOpportunity
);

router.get(
	"/:ProjectId",
	authController.ValidateToken,
	projectsController.FetchOne
);
router.put(
	"/:ProjectId",
	authController.ValidateToken,
	projectsController.Update
);
router.put(
	"/:ProjectId/projectname/:NewProjectName",
	authController.ValidateToken,
	projectsController.UpdateName
);

router.post(
	"/filter",
	authController.ValidateToken,
	projectsController.FetchProjects
);
module.exports = router;
// module
