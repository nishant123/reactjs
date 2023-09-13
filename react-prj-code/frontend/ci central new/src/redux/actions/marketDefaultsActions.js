import axios from "../../axios-interceptor";
import { toastr } from "react-redux-toastr";
import { localPageLoadEnd, localPageLoadStart, pageLoadEnd, pageLoadStart, recordLoadEnd, recordLoadStart } from "./appActions";

export const LOAD_ITEMS = "LOAD_ITEMS";

export const getFullMarkets = () => {
	return (dispatch) => {
		dispatch(getMarkets(true))
	}
}
export const getMarkets = (fullpageLoad) => {
	return (dispatch) => {
		if (fullpageLoad)
			dispatch(pageLoadStart())
		axios
			.get("/marketsettings")
			.then((response) => {
				dispatch({
					type: LOAD_ITEMS,
					items: response.data.MarketSettingsData,
				});
				if (fullpageLoad)
					dispatch(pageLoadEnd())
			})
			.catch((error) => {
				console.log(error);
			});
	};
};
export const getIndividualMarket = (countryId, callback) => {
	return (dispatch, getState) => {
		dispatch(recordLoadStart())
		axios
			.get(`/marketsettings/${countryId}`)
			.then(response => {
				let existingMarketSettingsData = [...getState().marketdefaults.items]
				existingMarketSettingsData = existingMarketSettingsData.map(emsd => {
					if (emsd.id == response.data.MarketSettingsData.id) {
						return { ...response.data.MarketSettingsData }
					}
					return { ...emsd }
				})
				dispatch({
					type: LOAD_ITEMS,
					items: existingMarketSettingsData,
				});
				dispatch(recordLoadEnd())
				dispatch(localPageLoadEnd())

				if (callback)
					callback()
			})
			.catch(error => {
				dispatch(recordLoadEnd())
				dispatch(localPageLoadEnd())
				toastr.error("Details fetch failed", error.data.message);
			})
	}
}
export const createBusinessUnit = (countryId, businessUnit, callback) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.post(`/marketsettings/${countryId}/businessunits`, { ...businessUnit, CountryId: countryId })
			.then((res) => {
				if (callback)
					callback()

				console.log(res);
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
};
export const createVertical = (businessUnitId, vertical, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.post(`/marketsettings/${businessUnitId}/verticals`, { ...vertical, BusinessUnitId: businessUnitId })
			.then((res) => {
				if (callback)
					callback()
				console.log(res);
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
};

export const createClientServiceRates = (businessUnitId, service, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.post(`/marketsettings/${businessUnitId}/clientservicerates/`, { ...service, BusinessUnitId: businessUnitId })
			.then((res) => {
				if (callback)
					callback()
				console.log(res);
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(recordLoadEnd())
				dispatch(localPageLoadEnd())

				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
};
export const createApprover = (verticalId, apprSetting, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.post(`/marketsettings/${verticalId}/approvalsettings/`, { ...apprSetting, VerticalId: verticalId })
			.then((res) => {
				if (callback) callback();
				console.log(res);
				dispatch(recordLoadEnd())
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
};
export const createApproverContact = (ApprovalSettingId, appContact, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.post(`/marketsettings/${ApprovalSettingId}/approvercontacts/`, { ...appContact, ApprovalSettingId: ApprovalSettingId })
			.then((res) => {
				if (callback) callback();
				console.log(res);
				dispatch(recordLoadEnd())
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
			})
			.catch((err) => {
				toastr.error("Create failed", err.data.message);
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				console.log(err);
			});
	};
};
export const createOffice = (countryId, office, callback) => {

	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.post(`/marketsettings/${countryId}/offices`, { ...office, CountryId: countryId })
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
}
export const saveOffice = (office, callback, countryId) => {

	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.put(`/marketsettings/offices/${office.id}`, { ...office, OfficeId: office.id })
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
}
export const deleteOffice = (office, callback, countryId) => {

	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.delete(`/marketsettings/offices/${office.id}`)
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
}

export const addRequestType = (CountryId, requestType, callback) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.post(`/marketsettings/${CountryId}/requesttypes/`, { ...requestType, CountryId: CountryId })
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(CountryId));
				toastr.success("Create Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Create failed", err.data.message);
				console.log(err);
			});
	};
}
export const deleteRequestType = (requestType, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.delete(`/marketsettings/requesttypes/${requestType.id}`)
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Delete Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Delete failed", err.data.message);
				console.log(err);
			});
	};
}
export const saveRequestType = (requestType, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.put(`/marketsettings/requesttypes/${requestType.id}`, { ...requestType, RequestTypeId: requestType.id })
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Update Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Update failed", err.data.message);
				console.log(err);
			});
	};
}
export const updateClientServiceRates = (businessUnitId, service, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.put(`/marketsettings/clientservicerates/${service.id}`, service)
			.then((res) => {
				if (callback)
					callback()

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				dispatch(recordLoadEnd())
				toastr.success("Update Success", res.data.message);
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Update failed", err.data.message);
			});
	};
};

export const saveBusinessUnit = (businessUnit, callback) => {
	return (dispatch) => {
		console.log(businessUnit);
		dispatch(recordLoadStart())
		axios
			.put(`/marketsettings/businessunits/${businessUnit.id}`, businessUnit)
			.then((res) => {
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(businessUnit.CountryId));
				toastr.success("Update Success", res.data.message);
				dispatch(recordLoadEnd())
				if (callback)
					callback()
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Update failed", err.data.message);
			});
	};
};

export const saveVertical = (vertical, countryId, callback) => {
	return (dispatch) => {
		console.log(vertical);
		dispatch(recordLoadStart())
		axios
			.put(`/marketsettings/verticals/${vertical.id}`, vertical)
			.then((res) => {
				if (callback) callback()
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				dispatch(recordLoadEnd())
				toastr.success("Update Success", res.data.message);
			})
			.catch((err) => {
				dispatch(localPageLoadEnd())
				if (callback) callback()
				dispatch(recordLoadEnd())
				toastr.error("Update Failed", err.data.message);
			});
	};
};
export const updateApprSetting = (ApprovalSettingId, approvalsettings, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.put(`/marketsettings/approvalsettings/${ApprovalSettingId}`, { ...approvalsettings, ApprovalSettingId: ApprovalSettingId })
			.then((res) => {
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				if (callback)
					callback()
				dispatch(recordLoadEnd())
				toastr.success("Update Success", res.data.message);
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Update Failed", err.data.message);
			});
	};
};

export const updateAppContact = (ApproverContactId, approverContact, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.put(`/marketsettings/approvercontacts/${ApproverContactId}`, { ...approverContact, ApproverContactId: ApproverContactId })
			.then((res) => {
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				if (callback)
					callback()
				dispatch(recordLoadEnd())
				toastr.success("Update Success", res.data.message);
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Update Failed", err.data.message);
			});
	}
}
export const createCustomLayouts = (businessUnit, callback) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.post(`/marketsettings/${businessUnit.id}/formlayouts/`, { ...businessUnit, UsesCustomFormLayouts: true, BusinessUnitId: businessUnit.id })
			.then((res) => {
				dispatch(saveBusinessUnit({ ...businessUnit, UsesCustomFormLayouts: true }))
				if (callback)
					callback()
				toastr.success("Update Success", res.data.message);
				dispatch(recordLoadEnd())
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Update Failed", err.data.message);
			});
	}
}

export const deleteBusinessUnit = (BusinessUnitId, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())
		axios
			.delete(`/marketsettings/businessunits/${BusinessUnitId}`)
			.then((res) => {
				// dispatch(saveBusinessUnit({ ...businessUnit, UsesCustomFormLayouts: true }))
				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				if (callback)
					callback()
				toastr.success("Delete Success", res.data.message);
				dispatch(recordLoadEnd())
			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Delete Failed", err.data.message);
			});
	}
}
export const deleteVertical = (vertical, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.delete(`/marketsettings/verticals/${vertical.id}`)
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Delete Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Delete failed", err.data.message);
				console.log(err);
			});
	};
}
export const deleteApprovalSetting = (apprSetting, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.delete(`/marketsettings/approvalsettings/${apprSetting.id}`)
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Delete Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Delete failed", err.data.message);
				console.log(err);
			});
	};
}
export const deleteApproverContact = (contact, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.delete(`/marketsettings/approvercontacts/${contact.id}`)
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Delete Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Delete failed", err.data.message);
				console.log(err);
			});
	};
}
export const deleteClientRateCard = (clientRateCard, callback, countryId) => {
	return (dispatch) => {
		dispatch(recordLoadStart())

		axios
			.delete(`/marketsettings/clientservicerates/${clientRateCard.id}`)
			.then((res) => {
				if (callback) callback();
				console.log(res);

				dispatch(localPageLoadStart())
				dispatch(getIndividualMarket(countryId));
				toastr.success("Delete Success", res.data.message);
				dispatch(recordLoadEnd())

			})
			.catch((err) => {
				if (callback)
					callback()
				dispatch(localPageLoadEnd())
				dispatch(recordLoadEnd())
				toastr.error("Delete failed", err.data.message);
				console.log(err);
			});
	};
}