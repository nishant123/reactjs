const express = require("express");
const schedulerAssignees = require("../controllers/schedulerAssignees");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/save", authController.ValidateToken, schedulerAssignees.Create);
router.post("/", authController.ValidateToken, schedulerAssignees.createOne);
router.get("/:email", authController.ValidateToken, schedulerAssignees.fetchAll);
router.put("/", authController.ValidateToken, schedulerAssignees.update);
router.delete("/:id", authController.ValidateToken, schedulerAssignees.deleteAssignee);
router.get("/methodologyspecid/:MethodologySpecId", authController.ValidateToken, schedulerAssignees.fetchMethodologySpecific);

module.exports = router;