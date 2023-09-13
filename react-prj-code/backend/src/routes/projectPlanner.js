const express = require("express");
const projectPlanner = require("../controllers/projectPlanner");
const router = express.Router();
const authController = require("../controllers/auth");

router.get(
    "/",
    projectPlanner.GetAll
);

router.put(
    "/:id", 
    authController.ValidateToken, 
    projectPlanner.Update
);

router.post(
    "/assignees",
    authController.ValidateToken,
    projectPlanner.AddAssignees
);

router.put(
    "/assignees",
    authController.ValidateToken,
    projectPlanner.UpdateAssignees
);

router.delete(
    "/assignees/:id",
    authController.ValidateToken,
    projectPlanner.TrashAssignees
);

router.post(
    "/dates",
    authController.ValidateToken,
    projectPlanner.AddDates
);

router.put(
    "/dates",
    authController.ValidateToken,
    projectPlanner.UpdateDates
);

router.delete(
    "/dates/:id",
    authController.ValidateToken,
    projectPlanner.TrashDates
);

module.exports = router;