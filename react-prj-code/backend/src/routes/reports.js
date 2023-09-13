const express = require("express");
const authController = require("../controllers/auth");
const reportsController = require("../controllers/reports");
const router = express.Router();

// npm

router.get(
  "finance/:CountryCode",
  authController.ValidateToken,
  reportsController.FetchOneWave
);

//changing routes below to POST so we can use request body for filter criteria
router.post(
  "/finance/waves/all",
  authController.ValidateToken,
  reportsController.FetchAllByWavesFinance
);
router.post(
  "/finance/projects/all",
  authController.ValidateToken,
  reportsController.FetchAllByProject
);
router.post(
  "/tcs/deliveryspecs/all",
  authController.ValidateToken,
  reportsController.FetchAllByDeliverSpecsTCS
);
// router.post("/", authController.ValidateToken, reportsController.Create);
// router.delete("/", authController.ValidateToken, projectsController.TrashAll);
// router.get(
//   "/:ProjectId",
//   authController.ValidateToken,
//   projectsController.FetchOne
// );
// router.put(
//   "/:ProjectId",
//   authController.ValidateToken,
//   projectsController.Update
// );

// router.post(
//   "/search",
//   authController.ValidateToken,
//   projectsController.searchProjects
// );

module.exports = router;
// module
