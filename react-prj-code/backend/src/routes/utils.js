const express = require("express");
const authController = require("../controllers/auth");
const utilsController = require("../controllers/utils");
const router = express.Router();

//For all miscellaneous routes which may need their own API endpoints

router.get("/currencies", authController.ValidateToken, utilsController.FetchCurrencies);

router.post("/folders/:ProjectId", authController.ValidateToken, utilsController.CreateProjectFolders);
router.post("/folders/waves/:WaveId", authController.ValidateToken, utilsController.CreateWaveFolderAndPbox);

//For creating Drive folders for Folder Action View in Dashboard
router.post("/folders/drive", authController.ValidateToken, utilsController.CreateDriveFolders);

router.post("/sheets/:CostingProfileId/costing", authController.ValidateToken, utilsController.CreateCostingSheet);
router.put("/sheets/:CostingProfileId/costing", authController.ValidateToken, utilsController.SyncCostingSheet);
router.post("/sheets/:CostingProfileId/additional", authController.ValidateToken, utilsController.CreateAdditionalSheet);
router.post("/mail/:WaveId/ewn/all", authController.ValidateToken, utilsController.SendEwnEmails);
router.post("/mail/:WaveId/finance/schedule", authController.ValidateToken, utilsController.SendFinanceScheduleEmail);
router.post("/mail/:CostingProfileId/approval/new", authController.ValidateToken, utilsController.SendNewApprovalRequestEmail);
router.post("/mail/:CostingProfileId/approval/complete", authController.ValidateToken, utilsController.SendApprovalRequestCompleteEmail);
router.post("/mail/:CostingProfileId/approval/deny", authController.ValidateToken, utilsController.SendApprovalRequestDeniedEmail);
router.post("/mail/:CostingProfileId/approval/cancel", authController.ValidateToken, utilsController.SendApprovalRequestCancelledEmail);
router.post("/mail/:RequestId/request/new", authController.ValidateToken, utilsController.SendRequestCreatedEmail);

router.post("/mail/:RequestId/request/update", authController.ValidateToken, utilsController.SendRequestUpdatedEmail);
router.post("/mail/:RequestId/request/close", authController.ValidateToken, utilsController.SendRequestClosedEmail);
router.post("/mail/:RequestId/request/reopen", authController.ValidateToken, utilsController.SendRequestReOpenedEmail);

router.put("/sheets/prepare", authController.ValidateToken, utilsController.PrepareTest);

router.post("/converttopdf", authController.ValidateToken, utilsController.ConvertToPdf);
module.exports = router;
