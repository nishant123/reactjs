const express = require("express");
const projectModuleDetailController = require("../controllers/projectModuleDetailController");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/save", authController.ValidateToken, projectModuleDetailController.Create);
router.delete("/reschedule/:methodologyid", authController.ValidateToken, projectModuleDetailController.Reschedule);

module.exports = router;