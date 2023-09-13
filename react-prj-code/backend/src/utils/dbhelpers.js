const models = require("../models");
const sqlOp = require("sequelize").Op;

const CheckIfExistsUnique = async (modelName, columnName, columnValue) => {
	let result = await modelName
		.findOne({
			where: { [columnName]: { [sqlOp.eq]: columnValue } },
		})
		.then((result) => {
			if (result) {
				return result;
			} else {
				return false;
			}
		})
		.catch((err) => {
			throw err;
		});
	return await result;
};

const CreateProjectId = (recordId, CommissioningCountry) => {
	try {
		let today = new Date();
		let year = today.getFullYear().toString();
		year = year.substring(2, 4);
		let month = (today.getMonth() + 1).toString();

		if (month.length === 1) {
			month = "0" + month;
		}
		let day = today.getDate().toString();
		if (day.length === 1) {
			day = "0" + day;
		}

		recordId = recordId.toString();
		while (recordId.length < 4) {
			recordId = "0" + recordId;
		}
		if (recordId.length > 4) {
			recordId = recordId.substring(recordId.length - 4, recordId.length);
		}

		return CommissioningCountry + year + month + day + recordId;
	} catch (err) {
		throw err;
	}
};

const CreateProjectDeliveryNumber = (waveNumber, projectId) => {
	try {
		let num = waveNumber.toString();
		while (num.length < 3) {
			num = "0" + num;
		}

		const createDeliveryNumber = projectId + "W" + num;
		return createDeliveryNumber;
	} catch (err) {
		throw err;
	}
};

const MultiToString = (arr) => {
	try {
		if (arr && arr.length > 0) {
			return arr
				.reduce((total, obj) => {
					return total.concat(obj.value);
				}, [])
				.join(",");
		} else {
			return null;
		}
	} catch (err) {
		throw err;
	}
};

const StringToMulti = (str) => {
	try {
		if (str && str != "") {
			return str.split(",").map((item) => {
				return { label: item, value: item };
			});
		} else {
			return [];
		}
	} catch (ex) {
		throw ex;
	}
};
const ObjToString = (obj) => {
	try {
		// const processed = obj.value;
		return obj ? obj.value : null;
	} catch (err) {
		throw err;
	}
};

const StringToObj = (str) => {
	try {
		if (str && str != "") {
			return { label: str, value: str };
		} else {
			return {};
		}
	} catch (ex) {
		throw ex;
	}
};

const EmptyStringToNull = (str) => {
	try {
		return str == "" ? null : str;
	} catch (ex) {
		throw ex;
	}
};

const NullToEmptyString = (val) => {
	try {
		return val == null ? "" : val;
	} catch (ex) {
		throw ex;
	}
};

const CreateProfileNumber = async (projectIdFk, Model) => {
	try {
		if (projectIdFk) {
			const results = await Model.findAll({
				where: {
					ProjectId: projectIdFk,
				},
			});

			let max = 0;
			results.forEach((obj) => {
				if (obj.dataValues.ProfileNumber > max) {
					max = obj.dataValues.ProfileNumber;
				}
			});
			return max + 1;
		} else {
			return 1;
		}
	} catch (ex) {
		throw ex;
	}
};

const GetPagination = (limit, offset) => {
	try {
		limit = limit ? Number(limit) : null; //load all records if no limit provided in the query param.
		offset = offset ? Number(offset) : null;
		if ((limit != null && !Number.isInteger(limit)) || (offset != null && !Number.isInteger(offset))) {
			throw "Invalid offset/limit value(s).";
		}
		return { limit, offset };
	} catch (ex) {
		throw ex;
	}
};

const FetchApprovalMailContent = (costingProfile) => {
	try {
		const level = costingProfile.ApprovalDetails.filter((level) => {
			return level.Order === costingProfile.ApprovalLevelAwaiting;
		})[0];

		if (!level) {
			throw "No Approvals Required.";
		}

		let emails = level.ApproverContacts.map((contact) => {
			return contact.EmailAddress;
		});
		emails = emails.filter((email, index) => {
			return emails.indexOf(email) === index;
		});
		return {
			Label: level.Label,
			Emails: emails,
			IsBypassed: level.isBypassed || false,
			BypassJustification: level.bypassJustification || null,
		};
	} catch (ex) {
		throw ex;
	}
};

module.exports = {
	CheckIfExistsUnique: CheckIfExistsUnique,
	CreateProjectId: CreateProjectId,
	MultiToString: MultiToString,
	ObjToString: ObjToString,
	EmptyStringToNull: EmptyStringToNull,
	StringToMulti: StringToMulti,
	StringToObj: StringToObj,
	NullToEmptyString: NullToEmptyString,
	CreateProfileNumber: CreateProfileNumber,
	GetPagination: GetPagination,
	CreateProjectDeliveryNumber: CreateProjectDeliveryNumber,
	FetchApprovalMailContent: FetchApprovalMailContent,
};
