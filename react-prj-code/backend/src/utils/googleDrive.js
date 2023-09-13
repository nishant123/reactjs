const { google } = require("googleapis");
const _ = require("lodash");
const credentials = require("../config/googleapis-credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
const drive = google.drive({ version: "v3", auth });
const sheets = google.sheets({ version: "v4", auth });

const createFolder = async (folderData) => {
	try {
		const res = await drive.files.create({
			resource: folderData,
			fields: "id",
		});
		//Only returning folder ID
		return res.data.id;
	} catch (err) {
		throw err;
	}
};

const createSpFolder = async (folderData, assignees) => {
	try {
		const res = await drive.files.create({
			resource: folderData,
			fields: "id",
		});
		if (assignees) {
			await createPermissions(assignees, res.data.id);
		}
		return res.data.id;
	} catch (err) {
		throw err;
	}
};

const createPermissions = async (assignees, folderId) => {
	let permissions = [];
	assignees.forEach((assignee) => {
		permissions.push({
			type: "user",
			role: "writer",
			emailAddress: assignee.Email,
		});
	});
	try {
		permissions.forEach(async (permission) => {
			await drive.permissions.create({
				resource: permission,
				fileId: folderId,
				fields: "id",
			});
		});
	} catch (err) {
		throw err;
	}
};

const UpdateSheetName = async (sheetId, title) => {
	let requests = [];
	requests.push({
		updateSpreadsheetProperties: {
			properties: {
				title: title,
			},
			fields: "title",
		},
	});
	let batchUpdateRequest = {
		requests,
	};
	try {
		const res = await sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: batchUpdateRequest,
		});
		//Only returning folder ID
	} catch (err) {
		throw err;
	}
};

const UpdateFolderName = async (folderId, title) => {
	try {
		const body = { name: title };
		await drive.files.update({
			fileId: folderId,
			resource: body,
		});
		//Only returning folder ID
	} catch (err) {
		throw err;
	}
};

const copyFolder = async (source, target) => {
	try {
		var folders = await getDriveData(source, "folder");
		var files = await getDriveData(source, "file");
		console.log(files, "000");
		for (let file of files) {
			await copySheet(file.name, target, file.id);
		}
		for (let folder of folders) {
			var folderName = folder.name;
			const folderJson = {
				name: folderName,
				mimeType: "application/vnd.google-apps.folder",
				parents: [source],
			};
			var targetFolder = await createFolder(folderJson);
			await copyFolder(folder.id, targetFolder);
		}
	} catch (err) {
		throw err;
	}
};

const getDriveData = async (folderId, type) => {
	try {
		console.log("ppp");
		let q = `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder`;
		if (type === "folder") q = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder`;
		const res = await drive.files.list({
			q: q,
			fields: files("id,name"),
		});
		console.log(res, "---");
		return res.data;
	} catch (err) {
		throw err;
	}
};

const createSheet = async (sheetName, directory) => {
	try {
		let newSheet = await sheets.spreadsheets.create({
			resource: {
				properties: {
					title: sheetName,
				},
			},
		});

		const updatedSheet = await drive.files.update({
			fileId: newSheet.data.spreadsheetId,
			addParents: directory,
			fields: "id, parents",
		});
		return updatedSheet;
	} catch (err) {
		throw err;
	}
};
const copySheet = async (sheetName, sheetFolder, copyingId) => {
	try {
		const res = await drive.files.copy({
			resource: {
				parents: [sheetFolder],
				name: sheetName,
			},
			fileId: copyingId,
		});

		//console.log("SHEET ID ", res.data.id);
		//Only returning Sheet ID
		return res.data.id;
	} catch (err) {
		throw err;
	}
};
const createMultipleTabs = async (methodologyspecs, sheetId) => {

	let requests = methodologyspecs.map(ms => {
		return { Code: ms.Code, Label: `${ms.Label} (${ms.Code})` }
	})

	let finalSheets = []
	await sheets.spreadsheets.get({
		spreadsheetId: sheetId
	}).then(function (response) {
		finalSheets = response.data.sheets.filter(sheet => (!sheet.properties.hidden))
	}, function (response) {
		console.log('Error: ' + response.data.error.message);
	});

	let firstSheet = _.head(finalSheets)
	let finalResult = []
	let copiedSheets = []

	//copying the first sheet multiple times i.e., equal to number of methodology specs
	await methodologyspecs.map(async (ms) => {
		let request = {
			// The ID of the spreadsheet containing the sheet to copy.
			spreadsheetId: sheetId,
			// The ID of the sheet to copy.
			sheetId: firstSheet.properties.sheetId,

			resource: {
				// The ID of the spreadsheet to copy the sheet to.
				destinationSpreadsheetId: sheetId,
			},

		};
		copiedSheets.push(sheets.spreadsheets.sheets.copyTo(request))
	})
	await Promise.all(copiedSheets).then(responses => {
		copiedSheets = responses.map(res => res.data)
	})

	//hiding master sheet after copying
	await finalResult.push(sheets.spreadsheets.batchUpdate({
		spreadsheetId: sheetId,
		resource: {
			"requests": [
				{
					updateSheetProperties: {
						"properties": { sheetId: firstSheet.properties.sheetId, "hidden": true },
						"fields": "hidden"
					}
				}
			]
		},
	}))

	//changing titles and replacing SMXXXXXX with respective sub-meth code
	await copiedSheets.map((sheet, index) => {
		let updateRequests = [];
		updateRequests.push({
			updateSheetProperties: {
				"properties": { sheetId: sheet.sheetId, "title": requests[index].Label },
				"fields": "title"
			}
		});
		updateRequests.push({
			findReplace: {
				find: "SMXXXXXX",
				replacement: requests[index].Code,
				sheetId: sheet.sheetId
			},
		});

		const batchUpdateRequest = {
			requests: updateRequests
		};

		finalResult.push(sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: batchUpdateRequest,
		}))
	})
	await Promise.all(finalResult)
}

const prepareSheet = async (sheetId, sheetName, multiCountry) => {
	//Bernhard:
	//updating the new created cost sheet (Project Name, Study Type MC/SC)
	//filtering MC/SC pending
	//hiding not needed sheets pending but not needed now

	try {
		//console.log("prep sheet", multiCountry);
		var studyType;
		if (multiCountry) {
			var studyType = "MC";
		} else {
			studyType = "SC";
		}

		// sheets.spreadsheets.batchUpdate({
		// 	spreadsheetId: sheetId,
		// 	resource: { requests: [{ addSheet: { properties: { title: "" } } }] }
		// })

		//Add Profile Name
		sheets.spreadsheets.values.update({
			spreadsheetId: sheetId,
			range: "'Costing Sheet'!D2",
			includeValuesInResponse: true,
			responseDateTimeRenderOption: "FORMATTED_STRING",
			responseValueRenderOption: "UNFORMATTED_VALUE",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [[sheetName]],
			},
		});

		//Add SC/MC flag
		sheets.spreadsheets.values.update({
			spreadsheetId: sheetId,
			range: "'API to Sheet'!B2",
			includeValuesInResponse: true,
			responseDateTimeRenderOption: "FORMATTED_STRING",
			responseValueRenderOption: "UNFORMATTED_VALUE",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [[studyType]],
			},
		});
	} catch (err) {
		throw err;
	}
};
const fetchSheetNames = async (sheetId, methCodes) => {
	try {
		let finalSheets = []
		let allSheets = []
		await sheets.spreadsheets.get({
			spreadsheetId: sheetId
		}).then(function (response) {
			allSheets = response.data.sheets
		}, function (response) {
			console.log('Error: ' + response.data.error.message);
		});
		finalSheets = allSheets.filter(sheet => (!sheet.properties.hidden
			&& sheet.properties.gridProperties.rowCount > 1000))

		// await sheets.spreadsheets.get({
		// 	spreadsheetId: sheetId
		// }).then(function (response) {
		// 	finalSheets = response.data.sheets.filter(sheet => )
		// }, function (response) {
		// 	console.log('Error: ' + response.data.error.message);
		// });

		let requiredSheets = []
		let isOldSheet = false
		requiredSheets = await finalSheets.map(async (fsheet) => {
			const submethodologyTargetCell = {
				spreadsheetId: sheetId,
				range: `${fsheet.properties.title}!D1001`,
			};
			const _submethodology = await sheets.spreadsheets.values.get(submethodologyTargetCell);
			let subMethodology = _submethodology.data
				&& _submethodology.data.values
				&& _submethodology.data.values[0][0] ? _submethodology.data.values[0][0] : null;

			if (_.includes(methCodes, subMethodology)) {
				return fsheet
			}
		})
		let _sheets = []
		_sheets = await Promise.all(requiredSheets).then((response => {
			// console.log(response, "response")
			return response
		}))
		_sheets = _sheets.filter(sheet => sheet)

		if (!_sheets.length) {
			isOldSheet = true
			_sheets = allSheets.filter(sheet => sheet.properties.title == "CostSummary")
		}
		return { sheets: _sheets, isOldSheet }
	}
	catch (err) {
		throw err
	}
}
const fetchSheetData = async (sheetId, sheetName, gridProperties, methodology) => {
	try {
		//sheetId = "18s45bcx-9sopF-mHyShV3X5ebsFLzZnugdeKm3SkTic";
		//console.log(sheetId);

		//using single cells to pull json data and parsing it. No need for named ranges anymore for server-side data-pull

		let sheetsTimingsTargetCellIndex = "";
		let sheetsCostsDataTargetCellIndex = "";
		let subMethodology = ""
		if (gridProperties.rowCount > 1000) {
			sheetsTimingsTargetCellIndex = "D1002";
			sheetsCostsDataTargetCellIndex = "D1003";
			const submethodologyTargetCell = {
				spreadsheetId: sheetId,
				range: `${sheetName}!D1001`, //single cell
			};
			const _submethodology = await sheets.spreadsheets.values.get(submethodologyTargetCell);
			subMethodology = _submethodology.data.values[0][0] ? _submethodology.data.values[0][0] : null;
		} else {
			sheetsTimingsTargetCellIndex = "F124";
			sheetsCostsDataTargetCellIndex = "F125";
			subMethodology = methodology.Code
		}
		const sheetsTimingsTargetCell = {
			spreadsheetId: sheetId,
			range: `${sheetName}!${sheetsTimingsTargetCellIndex}`,
		};

		const sheetsCostsDataTargetCell = {
			spreadsheetId: sheetId,
			range: `${sheetName}!${sheetsCostsDataTargetCellIndex}`,
		};

		// const submethodologyTargetCell = {
		// 	spreadsheetId: sheetId,
		// 	range: `${sheetName}!D1001`, //single cell
		// };

		const _sheetsDataTimings = await sheets.spreadsheets.values.get(sheetsTimingsTargetCell);

		const _sheetsCostsData = await sheets.spreadsheets.values.get(sheetsCostsDataTargetCell);

		let sheetsTimingsData = _sheetsDataTimings.data.values[0][0] ? _sheetsDataTimings.data.values[0][0] : null;
		sheetsTimingsData = processSheetData(sheetsTimingsData);

		let sheetsCostsData = _sheetsCostsData.data.values[0][0] ? _sheetsCostsData.data.values[0][0] : null;
		sheetsCostsData = processSheetData(sheetsCostsData);


		return {
			[subMethodology]: {
				SheetsTimingsData: sheetsTimingsData,
				SheetsCostsData: sheetsCostsData, // ? JSON.parse(sheetsCostsData) : null,
			},
		};
	} catch (err) {
		throw err;
	}
};

const SheetHideStudytype = async (sheetId, multiCountry) => {
	try {
		var studyType;
		//console.log("Hide sheet", multiCountry);
		if (multiCountry) {
			var studyType = "MC";
		} else {
			studyType = "SC";
		}

		var filterSettings = {};

		filterSettings.range = {
			sheetId: "204968739",
			startRowIndex: 0,
			startColumnIndex: 0,
			endColumnIndex: 2,
		};

		filterSettings.criteria = {};
		var columnIndex = 1;

		filterSettings["criteria"][columnIndex] = {
			condition: {
				type: "TEXT_CONTAINS",
				values: { userEnteredValue: studyType },
			},
		};

		sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: {
				requests: [
					{
						clearBasicFilter: {
							sheetId: "204968739",
						},
					},
				],
			},
		});

		sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: {
				requests: [
					{
						setBasicFilter: {
							filter: filterSettings,
						},
					},
				],
			},
		});
	} catch (err) {
		throw err;
	}
};

const SheetLock = async (sheetId) => {
	//locks a Cost Sheet, e.g. during decommissioning
	try {
		sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: {
				requests: [
					{
						addProtectedRange: {
							protectedRange: {
								range: {
									sheetId: "204968739",
									startRowIndex: 0,
									endRowIndex: 145,
									startColumnIndex: 3,
									endColumnIndex: 100,
								},
								description: "LockCostingSheet",
								warningOnly: false,
								protectedRangeId: "123",
							},
						},
					},
				],
			},
		});
	} catch (err) {
		throw err;
	}
};

const SheetUnlock = async (sheetId) => {
	//unlocks a locked Cost Sheet, e.g. when copied after decommissioning
	try {
		sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: {
				requests: [
					{
						deleteProtectedRange: {
							protectedRangeId: "123",
						},
					},
				],
			},
		});
	} catch (err) {
		throw err;
	}
};

const prepareSheetTest = async () => {
	var sheetId = "18s45bcx-9sopF-mHyShV3X5ebsFLzZnugdeKm3SkTic";
	var sheetName = "Project Name: Bernies Project II";
	var multiCountry = false;

	try {
		var studyType;
		if (multiCountry) {
			var studyType = "MC";
		} else {
			studyType = "SC";
		}

		sheets.spreadsheets.values.update({
			spreadsheetId: sheetId,
			range: "'Costing Sheet'!D2",
			includeValuesInResponse: true,
			responseDateTimeRenderOption: "FORMATTED_STRING",
			responseValueRenderOption: "UNFORMATTED_VALUE",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [[sheetName]],
			},
		});

		sheets.spreadsheets.values.update({
			spreadsheetId: sheetId,
			range: "'API to Sheet'!C2",
			includeValuesInResponse: true,
			responseDateTimeRenderOption: "FORMATTED_STRING",
			responseValueRenderOption: "UNFORMATTED_VALUE",
			valueInputOption: "USER_ENTERED",
			resource: {
				values: [[studyType]],
			},
		});

		var filterSettings = {};

		filterSettings.range = {
			sheetId: "204968739",
			startRowIndex: 0,
			startColumnIndex: 0,
			endColumnIndex: 2,
		};

		filterSettings.criteria = {};
		var columnIndex = 1;

		filterSettings["criteria"][columnIndex] = {
			condition: {
				type: "TEXT_CONTAINS",
				values: { userEnteredValue: studyType },
			},
		};

		sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: {
				requests: [
					{
						clearBasicFilter: {
							sheetId: "204968739",
						},
					},
				],
			},
		});

		sheets.spreadsheets.batchUpdate({
			spreadsheetId: sheetId,
			resource: {
				requests: [
					{
						setBasicFilter: {
							filter: filterSettings,
						},
					},
				],
			},
		});

		//   const res = await drive.files.copy({
		//     resource: {
		//       parents: [sheetFolder],
		//       name: sheetName,
		//     },
		//     fileId: copyingId,
		//   });
		//   //console.log("SHEET ID ", res.data.id);
		//   //Only returning Sheet ID
		//   return res.data.id;
	} catch (err) {
		throw err;
	}
};

const processSheetData = (data) => {
	if (!data) {
		throw "No costs data found for sync. Cost sheet formulae may have issues. Please contact admins for assistance.";
	}
	let parsedString = data.split("},");
	parsedString.pop(); //removing "lastDummy":{} as it is just a placeholder for last position.

	if (parsedString.length === 0) {
		//if no data available, returning null to set inside MethodologySpec.CostsData
		return null;
	}

	let parsedObj = parsedString.map((str, index) => {
		if (index === 0) {
			str = str.substring(1, str.length);
		}
		str = "{" + str + "}}";
		// rid white space
		str = str.replace(/\s/g, "");
		str = JSON.parse(str);
		return str;
	});
	let dedupedCostData = {};

	parsedObj.forEach((obj) => {
		// obj = {"AE":{...}}
		let cc = Object.keys(obj)[0]; // country code
		if (dedupedCostData.hasOwnProperty(cc)) {
			// add to existing keys
			Object.keys(obj[cc]).forEach((key) => {
				dedupedCostData[cc][key] += obj[cc][key];
			});
		} else {
			// initialise new country code in dedupedCostData
			dedupedCostData[cc] = obj[cc];
		}
	});

	return dedupedCostData;
};

module.exports = {
	createFolder: createFolder,
	createSheet: createSheet,
	copySheet: copySheet,
	prepareSheet: prepareSheet,
	fetchSheetData: fetchSheetData,
	SheetHideStudytype: SheetHideStudytype,
	SheetLock: SheetLock,
	SheetUnlock: SheetUnlock,
	prepareSheetTest: prepareSheetTest,
	copyFolder: copyFolder,
	UpdateSheetName,
	UpdateFolderName,
	createSpFolder,
	createPermissions,
	fetchSheetNames,
	createMultipleTabs
};
