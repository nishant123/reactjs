const express = require("express");
const deliveryController = require("../controllers/deliveries");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.ValidateToken, deliveryController.FetchAll);
router.get(
	"/:DeliverySpecId",
	authController.ValidateToken,
	deliveryController.FetchOne
);

router.post(
	"/:WaveId/deliveryspec",
	authController.ValidateToken,
	deliveryController.Create
);
router.put(
	"/:DeliverySpecId",
	authController.ValidateToken,
	deliveryController.Update
);

router.post(
	"/filter",
	authController.ValidateToken,
	deliveryController.FetchDeliveries
);
module.exports = router;
