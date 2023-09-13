const models = require("../models");

const GetApprovers = async (req, res) => {
	try {
		const approvalDetails = await models.ApprovalSettings.findAll({
			where: { VerticalId: [req.params.VerticalId] },
			attributes: [
				"id",
				"Label",
				"ThresholdOutOfPocketPercentage",
				"ThresholdRevenueAmount",
				"ThresholdOutOfPocketAmountSyndicated",
				"Order",
			],
			include: [
				{
					model: models.ApproverContacts,
					attributes: [
						"id",
						"EmailAddress",
						"IsMandatoryApprover",
						"ApprovalSettingId",
					],
				},
			],
		});

		//console.log("HERE", approvalDetails);

		await res.status(200).json({
			message: "SUCCESS: Fetched All Approvers",
			ApprovalDetails: approvalDetails,
		});
	} catch (ex) {
		res.status(500).json({
			message: "ERROR: Something Went Wrong While Fetching Approvers.",
			error: ex.toString(),
		});
	}
};

module.exports = {
	GetApprovers: GetApprovers,
};
