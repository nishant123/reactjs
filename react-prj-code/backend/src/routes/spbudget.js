const express = require("express");
const spbudget = require("../controllers/spbudget");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/", authController.ValidateToken, spbudget.Upsert);
// router.put("/:id", authController.ValidateToken, spbudget.Update);

module.exports = router;