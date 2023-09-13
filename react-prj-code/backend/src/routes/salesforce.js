const express = require("express");
const sfController = require("../controllers/salesforce");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/:OpportunityNumber", authController.ValidateToken, sfController.GetOpportunity);

module.exports = router;
// module
