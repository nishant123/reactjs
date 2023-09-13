const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.Login);
router.post("/register", authController.SelfRegister);
router.post("/forgot-password", authController.ResetPasswordTrigger);
router.post("/reset-password", authController.SaveNewPassword);
router.get("/google-auth", authController.GoogleAuth);
//router.post("/salesforce", authController.ValidateToken, authController.SFAuth);

module.exports = router;
// module
