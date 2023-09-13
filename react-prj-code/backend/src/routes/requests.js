const express = require("express");
const requestController = require("../controllers/requests");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/", authController.ValidateToken, requestController.CreateRequest);

router.post(
  "/filter",
  authController.ValidateToken,
  requestController.FetchRequests
);

router.get(
  "/",
  authController.ValidateToken,
  requestController.FetchAllRequests
);

router.get(
  "/:RequestId",
  authController.ValidateToken,
  requestController.FetchRequest
);

router.post(
  "/:RequestId/requestlogs",
  authController.ValidateToken,
  requestController.CreateRequestLog
);

router.get(
  "/:RequestId/requestlogs",
  authController.ValidateToken,
  requestController.FetchRequestLogs
);

router.put(
  "/:RequestId",
  authController.ValidateToken,
  requestController.UpdateRequest
);

module.exports = router;
