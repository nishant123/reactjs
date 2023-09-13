const express = require("express");
const initController = require("../controllers/init");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.ValidateToken, initController.LoadConfig);

module.exports = router;
