const express = require("express");
const costingProfilesController = require("../controllers/costingprofiles");
const authController = require("../controllers/auth");

const router = express.Router();

router.get(
  "/commissioned/all",
  authController.ValidateToken,
  costingProfilesController.FetchAllCommissioned
);
router.get("/", authController.ValidateToken, costingProfilesController.FetchAll);
router.get("/:ProjectId/commissioned", authController.ValidateToken, costingProfilesController.FetchCommissionedByProject);
router.post("/", authController.ValidateToken, costingProfilesController.Create);
router.delete("/", authController.ValidateToken, costingProfilesController.TrashAll);
router.delete("/:CostingProfileId", authController.ValidateToken, costingProfilesController.TrashOne);
router.get("/:CostingProfileId", authController.ValidateToken, costingProfilesController.FetchOne);
router.put("/:CostingProfileId", authController.ValidateToken, costingProfilesController.Update);
router.put("/:CostingProfileId/profilename/:NewProfileName", authController.ValidateToken, costingProfilesController.UpdateName);
router.post("/duplicate/:CostingProfileId", authController.ValidateToken, costingProfilesController.Duplicate);

module.exports = router;
// module
