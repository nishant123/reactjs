const express = require("express");
const usersController = require("../controllers/users");
const authController = require("../controllers/auth");
const router = express.Router();

router.get("/", authController.ValidateToken, usersController.FetchAll);
router.post("/", authController.ValidateToken, usersController.Create);
router.get("/sp/all", authController.ValidateToken, usersController.FetchAllSp);
router.delete(
  "/sp/one:UserEmail",
  authController.ValidateToken,
  usersController.TrashSp
);
router.delete(
  "/:UserEmail",
  authController.ValidateToken,
  usersController.Trash
);
router.get(
  "/:UserEmail",
  authController.ValidateToken,
  usersController.FetchOne
);
router.get(
  "/spteamleads/all",
  authController.ValidateToken,
  usersController.FetchSpTeamLeads
);
router.get(
  "/programmers/all",
  authController.ValidateToken,
  usersController.FetchProgrammers
);

router.get(
  "/costingspocs/all",
  authController.ValidateToken,
  usersController.FetchCostingSPOCs
);

router.get(
  "/opspms/all",
  authController.ValidateToken,
  usersController.FetchOpsPMs
);

router.get(
  "/internal/all",
  authController.ValidateToken,
  usersController.FetchInternalUsers
);

router.get("/cs/all", authController.ValidateToken, usersController.FetchCS);
router.put("/:UserEmail", authController.ValidateToken, usersController.Update);
router.post(
  "/search",
  authController.ValidateToken,
  usersController.searchUsers
);

router.post("/updateUser", authController.UpdateUser);
router.post("/spregister", authController.ValidateToken, usersController.RegisterSpUser);

module.exports = router;
