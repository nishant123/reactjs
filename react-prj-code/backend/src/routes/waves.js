const express = require("express");
const wavesController = require("../controllers/waves");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/:WaveId/wavename/:NewWaveName",
  authController.ValidateToken,
  wavesController.UpdateName
);

module.exports = router;
// module
