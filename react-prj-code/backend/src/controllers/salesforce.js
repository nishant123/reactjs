const sfConfig = require("../config/salesforce");
const authController = require("../controllers/auth");
const axios = require("axios");

const GetOpportunity = (req, res, next) => {
  authController
    .SFAuth()
    .then((authData) => {
      //console.log("authdata", authData);
      const url =
        authData.instance_url +
        sfConfig.api_endpoint +
        req.params.OpportunityNumber;

      var options = {
        headers: {
          Authorization: authData.token_type + " " + authData.access_token,
        },
      };
      axios
        .get(url, options)
        .then((result) => {
          if (result.data.errorMessage != null) {
            res.status(404).json({
              message: "ERROR: Opportunity Not Found.",
              opportunityNumber: req.params.OpportunityNumber,
            });
          } else {
            res.status(200).json({
              message:
                "SUCCESS: Opportunity " +
                req.params.OpportunityNumber +
                " Found.",
              opportunity: result.data,
            });
          }
        })
        .catch((err) => {
          //console.error(err);
          res.status(500).json({
            message: "ERROR: SF Opportunity Fetch Issue.",
            error: err.toString(),
          });
        });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "ERROR: SF Auth Issue.", error: error.toString() });
    });
};

module.exports = {
  GetOpportunity: GetOpportunity,
};
