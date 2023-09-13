const express = require("express");
const verticalsController = require("../controllers/verticals");
const authController = require("../controllers/auth");

const router = express.Router();

router.get(
  "/:VerticalId/approvers/all",
  authController.ValidateToken,
  verticalsController.GetApprovers
);

module.exports = router;
// module
