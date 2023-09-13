import * as types from "../actions/currentProjectActions";

const initialState = {
    newProject: {
        ProjectId: "",
        ProjectName: "New Project...",
        ProjectStatus: "1",
        BusinessUnit: "",
        IndustryVertical: "",
        VerticalId: null,
        CommissioningCountry: "",
        CommissioningOffice: "",
        Syndicated: false,
        ContractDetails: [],
        ProposalOwnerEmail: {},
        OtherProjectTeamContacts: [],
        IsSFContactSyncPaused: false,
        IsRestrictedProject: false,
        CostingProfiles: [],
        ProjectBackground: "",
        ResearchObjectives: "",
        LeadCostingSPOC: "",
        id: null,
    },
    // These are options
    primaryCSContacts: [],
    otherInternalContacts: [],
    costingSPOCs: [],
    //era_start
    newProjectCreated: false
    //era_end
};

export default function currentProjectReducer(state = initialState, actions)
{
    switch (actions.type)
    {
        case types.UPDATE_PROJECT: {
            return {
                ...state,
                ...actions.contacts,
            };
        }
        case types.UPDATE_NEW_PROJECT: {
            return {
                ...state,
                newProject: {
                    ...state.newProject,
                    ...actions.newProject,
                },
            };
        }
        //era_start
        case types.PROJECT_CREATED: {
            return {
                ...state,
                newProjectCreated: true
            };
        }
       //era_end
        case types.CLEAR_NEW_PROJECT:
            return {
                ...initialState,
            };
        case types.SET_CURRENT_LOADING_CONTACT:
            return {
                ...state,
                currentContactLoading: actions.contact
            }
        default:
            return state;
    }
}
