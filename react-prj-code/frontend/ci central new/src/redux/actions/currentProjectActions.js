import axios from "../../axios-interceptor";
import * as costingsActions from "./costingsActions";
import * as currentCostingActions from "./currentCostingActions";
import * as appActions from "./appActions";
import { setProjects } from "./projectsActions";
import { toastr } from "react-redux-toastr";
import _ from "lodash";
import moment from "moment";

export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const UPDATE_NEW_PROJECT = "UPDATE_NEW_PROJECT";
export const CLEAR_NEW_PROJECT = "CLEAR_NEW_PROJECT";
export const SET_CURRENT_LOADING_CONTACT = "SET_CURRENT_LOADING_CONTACT";

export const initProject = () => {
	console.log("init project called");
	return (dispatch, getState) => {
		dispatch(appActions.pageLoadStart());
		dispatch(
			appActions.setCostingStatus({
				showManualCostEntry: false,
				showSheetsCosts: false,
			})
		);
		let p1 = axios
			.get("/users/cs/all")
			.then((res) => {
				console.log("init project finished");
				console.log(res);
				dispatch({
					type: UPDATE_PROJECT,
					contacts: {
						primaryCSContacts: res.data.users,
					},
				});
			})
			.catch((err) => {
				dispatch(appActions.pageLoadEnd());
			});
		let p2 = axios
			.get("/users/internal/all")
			.then((res) => {
				console.log(res);
				dispatch({
					type: UPDATE_PROJECT,
					contacts: {
						otherInternalContacts: res.data.users,
					},
				});
			})
			.catch((err) => {
				dispatch(appActions.pageLoadEnd());
			});
		let p3 = axios
			.get("/users/costingspocs/all")
			.then((res) => {
				console.log(res);
				dispatch({
					type: UPDATE_PROJECT,
					contacts: {
						costingSPOCs: res.data.users,
					},
				});
			})
			.catch((err) => {
				dispatch(appActions.pageLoadEnd());
			});
		Promise.all([p1, p2, p3]).then(() => {
			console.log("end");
			dispatch(appActions.pageLoadEnd());
		});
	};
};

export const getProject = (projectId, callback) => {
	return (dispatch, getState) => {
		dispatch(appActions.pageLoadStart());
		axios
			.get("/projects/" + projectId)
			.then((res) => {
				let project = res.data.project;
				if (!project.BusinessUnitId && project.IsImportedProject) {
					project.BusinessUnit = null;
					project.VerticalId = null; //null anyway, just for safety
					project.IndustryVertical = null; //null anyway, just for safety
				}

				dispatch({ type: UPDATE_NEW_PROJECT, newProject: { ...project } });
				dispatch(
					costingsActions.setCurrentCostingProfiles(
						res.data.project.CostingProfiles
					)
				);
				if (callback) callback();
				dispatch(appActions.pageLoadEnd());
			})
			.catch((err) => {
				dispatch(appActions.pageLoadEnd());
			});
		// dispatch(selectProject(id));
	};
};
export const getIndividualProject = (projectId, pid, callback) => {
	return (dispatch, getState) => {
		dispatch(appActions.recordLoadStart());
		let existingProjects = [...getState().projects.items];
		axios
			.get(`/costingprofiles/${pid}/commissioned`)
			.then((res) => {
				// axios
				//   .get("/costingprofiles/" + reqpro.id)
				//   .then((profile) => {
				existingProjects = existingProjects.map((it) => {
					if (it.id == pid) {
						// let reqpro = _.head(it.CostingProfiles.filter(cp => cp.ProfileStatus == "6"))
						it.CostingProfiles = it.CostingProfiles.map((cp) => {
							if (cp.ProfileStatus == "6") {
								return { ...res.data.costingProfile };
							}
							return { ...cp };
						});
						// currentProject.CostingProfiles = currentProject.CostingProfiles.map(cp => {
						//   if (cp.id == reqpro.id) {
						//     cp = profile.data.costingProfile
						//   }
						//   return { ...cp }
						// })
						return { ...it, isCostingOverviewLoaded: true };
					} else
						return {
							...it,
							isCostingOverviewLoaded: it.isCostingOverviewLoaded,
						};
				});
				dispatch(setProjects({ items: [...existingProjects] }));

				if (callback) callback();
				dispatch(appActions.recordLoadEnd());
				// }).catch((err) => {
				//   dispatch(appActions.recordLoadEnd());
				// });
				// dispatch({ type: UPDATE_NEW_PROJECT, newProject: res.data.project });
			})
			.catch((err) => {
				dispatch(appActions.recordLoadEnd());
			});
		// dispatch(selectProject(id));
	};
};
export const setOverviewStatus = (row) => {
	return (dispatch, getState) => {
		let existingProjects = [...getState().projects.items];
		existingProjects = existingProjects.map((ep) => {
			if (ep.id == row.id) {
				ep.isCostingOverviewLoaded = true;
			}
			return { ...ep };
		});
		dispatch(setProjects({ items: [...existingProjects] }));
	};
};
export const setCurrentProject = (project) => {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_NEW_PROJECT, newProject: project });
	};
};
export const clearCurrentProject = () => {
	return (dispatch) => {
		dispatch({ type: CLEAR_NEW_PROJECT });
		dispatch({ type: currentCostingActions.CLEAR_NEW_COSTING });
		dispatch({ type: costingsActions.CLEAR_ALL_COSTINGS });
	};
};

export const createProject = (newProject) => {
	return (dispatch, getState) => {
		dispatch(appActions.pageLoadStart());
		newProject = {
			...newProject,
			ContractDetails: [
				...newProject.ContractDetails.map((obj) => {
					delete obj.id;
					return obj;
				}),
			],
		};

		axios
			.post("/projects", newProject, {
				headers: { "auth-token": localStorage.getItem("auth-token") },
			})
			.then((res) => {
				axios
					.post("/utils/folders/" + res.data.Project.id)
					.then((res) => {
						console.log(res);
						dispatch({
							type: UPDATE_NEW_PROJECT,
							newProject: {
								CostingsFolderId: res.data.CostingsFolderId,
								ProjectResourcesFolderId: res.data.ProjectResourcesFolderId,
							},
						});
						toastr.success("Google Drive folders are now ready for use");
					})
					.catch(() => {
						toastr.error("Google Drive folder creation failed");
					});
				dispatch(setCurrentProject(res.data.Project));
				dispatch(appActions.pageLoadEnd());
			})
			.catch((err) => {
				dispatch(appActions.pageLoadEnd());
			});
	};
};

export const saveProject = (currentProject, callback, isInternalLoad) => {
	return (dispatch, getState) => {
		if (isInternalLoad) dispatch(appActions.recordLoadStart());
		else dispatch(appActions.pageLoadStart());
		// console.log("/projects/" + currentProject.ProjectId);
		// console.log(getState());
		currentProject.CostingProfiles = getState().costings.costingProfiles;
		currentProject.CostingProfiles.forEach((profile) => {
			delete profile.Methodology;
			delete profile.SubMethodology;
			delete profile.FieldingCountries;
			delete profile.StudyType;
		});
		let existingProjects = getState().projects.items.map((it) => {
			if (it.id == currentProject.id) {
				return { ...currentProject };
			} else return { ...it };
		});

		// console.log("after delete");
		// console.log(currentProject);
		axios
			.put("/projects/" + currentProject.ProjectId, currentProject, {
				headers: { "auth-token": localStorage.getItem("auth-token") },
			})
			.then((res) => {
				if (callback) callback();
				//update projects table without api call
				dispatch(setProjects({ items: [...existingProjects] }));

				//avoiding whole page loader
				if (isInternalLoad) dispatch(appActions.recordLoadEnd());
				else dispatch(appActions.pageLoadEnd());
			})
			.catch((err) => {
				if (callback) callback();
				console.error(err);
				if (isInternalLoad) dispatch(appActions.recordLoadEnd());
				else dispatch(appActions.pageLoadEnd());
			});
	};
};
export const saveIndividualProject = (
	currentProject,
	callback,
	isInternalLoad
) => {
	return (dispatch, getState) => {
		dispatch(appActions.recordLoadStart());

		axios
			.put("/projects/" + currentProject.ProjectId, currentProject, {
				headers: { "auth-token": localStorage.getItem("auth-token") },
			})
			.then((res) => {
				if (callback) callback();
				dispatch(appActions.recordLoadEnd());
			})
			.catch((err) => {
				if (callback) callback();
				console.error(err);
				if (isInternalLoad) dispatch(appActions.recordLoadEnd());
				else dispatch(appActions.pageLoadEnd());
			});
	};
};

export const syncContactDetails = (
	projectId,
	contact,
	updateProfile,
	callback
) => {
	return (dispatch, getState) => {
		dispatch(appActions.recordLoadStart());
		dispatch({
			type: SET_CURRENT_LOADING_CONTACT,
			contact,
		});
		axios
			.get(`/salesforce/${contact.OpportunityNumber}`)
			.then((response) => {
				let currentCostingProfile = {
					...getState().currentCosting.currentCostingProfile,
				};
				let currentProject = { ...currentCostingProfile.Project };
				let existingProjects = getState().projects.items.map((it) => {
					if (it.id == projectId) {
						it.ContractDetails = it.ContractDetails.map((cd) => {
							if (cd.id == contact.id)
								cd = {
									...cd,
									...response.data.opportunity,
									updateAt: moment().format("YYYY-MM-DD hh:mm:ss"),
								};
							return { ...cd };
						});
						dispatch(
							saveIndividualProject(
								it,
								() =>
									dispatch({
										type: SET_CURRENT_LOADING_CONTACT,
										contact: {},
									}),
								true
							)
						);
						return { ...it };
					} else return { ...it };
				});
				dispatch(setProjects({ items: [...existingProjects] }));

				if (
					currentProject &&
					currentProject.ContractDetails &&
					currentProject.ContractDetails.length
				) {
					if (currentProject.ContractDetails)
						currentProject.ContractDetails = currentProject.ContractDetails.map(
							(cd) => {
								if (cd.id == contact.id)
									cd = { ...cd, ...response.data.opportunity };
								return { ...cd };
							}
						);
					dispatch(
						saveIndividualProject(
							{ ...currentProject },
							updateProfile
								? () => {
										axios
											.get("/costingprofiles/" + currentCostingProfile.id)
											.then((res) => {
												let reqProjectClients =
													res.data.costingProfile.Project?.ContractDetails;
												let sfClients = reqProjectClients.filter(
													(rpc) => rpc.isSF
												);
												if (
													sfClients.filter(
														(sc) =>
															sc.Probability >=
															res.data.costingProfile.ProfileSetting
																.MinimumSFProbability
													).length &&
													callback
												) {
													callback();
												} else {
													toastr.error(
														"Commissioning Not Allowed",
														`Please ensure SF opportunity is update-to-date with minimum probability of ${res.data.costingProfile.ProfileSetting.MinimumSFProbability}%`
													);
												}
												dispatch(appActions.recordLoadEnd());
												dispatch({
													type: currentCostingActions.SELECT_COSTING,
													profile: res.data.costingProfile,
												});
											})
											.catch((error) => {
												dispatch(appActions.recordLoadEnd());
												toastr.error(
													"Failed updating Profile",
													error.data.message
												);
											});
								  }
								: callback,
							true
						)
					);
				}
			})
			.catch((error) => {
				dispatch(appActions.recordLoadEnd());
				toastr.error("Salesforce details sync failed", error?.data?.message);
			});
	};
};
