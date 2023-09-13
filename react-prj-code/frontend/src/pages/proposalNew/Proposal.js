import React, { useState, useEffect } from "react";
import { getLabel } from "../../utils/codeLabels";
import { useHistory, Link } from "react-router-dom";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import * as currentProjectActions from "../../redux/actions/currentProjectActions";
import * as costingsActions from "../../redux/actions/costingsActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import * as mapperFunctions from "../../utils/rfqMapper";

import { toastr } from "react-redux-toastr";
import _ from "lodash";
import Layout from "../../layouts/Project";
import MarketDetails from "./MarketDetails";
import Salesforce from "./Salesforce";
import ProjectContacts from "./ProjectContacts";
import ProjectDetails from "./ProjectDetails";
import CountryMethodologyTabs from "./CountryMethodologyTabsFinal";
//import CountryMethodologyTabs from "./CountryMethodologyTabs";
import CostingProfilesTable from "./CostingProfilesTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import
{
    faChevronRight,
    faChevronDown,
    faChevronUp,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import
{
    Button,
    Row,
    Col,
    Card,
    CardBody,
    Container,
    Collapse,
    CardTitle,
    CardHeader,
    Label,
    Badge,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from "reactstrap";
const alasql = window.alasql;

const Proposal = () =>
{
    const user = useSelector(({ user }) => user.userRecord);

    const project = useSelector(
        ({ currentProject }) => currentProject.newProject
    );

    const newProjectCreated = useSelector(
        ({ currentProject }) => currentProject.newProjectCreated
    );     

    const primaryCSContacts = useSelector(
        ({ currentProject }) => currentProject.primaryCSContacts
    );
    const otherInternalContacts = useSelector(
        ({ currentProject }) => currentProject.otherInternalContacts
    );
    const costingProfiles = useSelector(
        ({ costings }) => costings.costingProfiles
    );
    const currentCostingProfile = useSelector(
        ({ currentCosting }) => currentCosting.currentCostingProfile
    );
    const codeLabels = useSelector(({ codeLabels }) => codeLabels);
    const dispatch = useDispatch();

    const history = useHistory();
    const [profileCreation, setProfileCreation] = useState(false);
    const [selectProfilesDownload, setSelectProfilesDownload] = useState(false);
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [costingOptions, setCostingOptions] = useState(false);

    const [toggle, setToggle] = useState({
        start: true,
        salesforce: true,
        projectContacts: true,
        costingProfiles: true,
        overall: true,
    });
    const [fieldInvalidationProject, setFieldInvalidationProject] = useState({
        BusinessUnit: false,
        CommissioningCountry: false,
        IndustryVertical: false,
        CommissioningOffice: false,
        Contracts: false,
        ProposalOwnerEmail: false,
        OtherProjectTeamContacts: false,
        ProjecName: false,
    });

    const [fieldInvalidationCosting, setFieldInvalidationCosting] = useState({
        Methodology: false,
        Syndicated: false,
        IsTracker: false,
        NumberOfWaves: false,
        TrackingFrequency: false,
        IsMultiCountry: false,
        FieldingCountries: false,
        StudyType: false,
    });

    useEffect(() =>
    {
        if (project.id && (costingProfiles.length === 0 || profileCreation))
        {
            setToggle({ start: false, salesforce: false, projectContacts: false });
        }
    }, [project]);

    useEffect(() =>
    {
        dispatch(currentProjectActions.initProject());
    }, []);    

    useEffect(() =>
    {
        debugger;
        if (project.FieldingCountries && project.FieldingCountries.length>0)
        {
            const Coptions = mapperFunctions.getCostingOptions(project);
            setCostingOptions(Coptions);
            for (var option of Coptions)
            {
                dispatch(
                    currentCostingActions.createCostingProfile(option)
                );
            }
        }

    }, [newProjectCreated]);   

    useEffect(() =>
    {
        let a = 12;
        if (costingOptions.length == costingProfiles.length)           
            debugger;
             
    }, [costingProfiles]); 

    

    const updateProject = (newProject) =>
        dispatch({
            type: currentProjectActions.UPDATE_NEW_PROJECT,
            newProject: newProject,
        });

    const validateProject = () =>
    {
        let isValid = true;
        let updatedObj = {};

        // Market Details Fields
        let fieldsToValidate = [
            "BusinessUnit",
            "CommissioningCountry",
            "CommissioningOffice",
            "IndustryVertical",
        ];

        fieldsToValidate.forEach((field) =>
        {
            if (!project[field] || project[field] === "")
            {
                console.log(field);
                updatedObj[field] = true;
                isValid = false;
            } else
            {
                updatedObj[field] = false;
            }
        });

        // Contracts
        if (
            (project.ContractDetails && project.ContractDetails.length > 0) ||
            project.IsSyndicated
        )
        {
            updatedObj["Contracts"] = false;
        } else
        {
            console.log("Contracts");
            isValid = false;
            updatedObj["Contracts"] = true;
        }

        // Project Name
        if (
            !project.ProjectName ||
            project.ProjectName === "New Project..." ||
            project.ProjectName.trim().length < 1
        )
        {
            isValid = false;
            updatedObj["ProjectName"] = true;
        } else
        {
            updatedObj["ProjectName"] = false;
        }
        setFieldInvalidationProject({ ...fieldInvalidationProject, ...updatedObj });
        if (!isValid)
        {
            toastr.error("Validation Errors", "Please check for missing Inputs");
        }
        return isValid;
    };

    const validateCosting = () =>
    {
        let isValid = true;
        let updatedObj = {};

        // Project Details Fields
        if (costingProfiles ?.length === 0 || profileCreation)
        {
            if (currentCostingProfile.Methodology ?.length < 1)
            {
                console.log("MEthodology");
                isValid = false;
                updatedObj["Methodology"] = true;
            } else
            {
                updatedObj["Methodology"] = false;
            }

            if (currentCostingProfile.SubMethodology ?.length < 1)
            {
                console.log("SubMethodology");
                isValid = false;
                updatedObj["SubMethodology"] = true;
            } else
            {
                updatedObj["SubMethodology"] = false;
            }

            if (currentCostingProfile.StudyType ?.length < 1)
            {
                console.log("StudyType");
                isValid = false;
                updatedObj["StudyType"] = true;
            } else
            {
                updatedObj["StudyType"] = false;
            }

            if (currentCostingProfile.IsTracker)
            {
                if (currentCostingProfile.NumberOfWaves <= 1)
                {
                    console.log("numberof waves");
                    isValid = false;
                    updatedObj["NumberOfWaves"] = true;
                } else
                {
                    updatedObj["NumberOfWaves"] = false;
                }

                if (currentCostingProfile.TrackingFrequency === "")
                {
                    console.log("tracking");
                    isValid = false;
                    updatedObj["TrackingFrequency"] = true;
                } else
                {
                    updatedObj["TrackingFrequency"] = false;
                }
            }

            if (currentCostingProfile.IsMultiCountry)
            {
                if (
                    currentCostingProfile.FieldingCountries === null ||
                    (currentCostingProfile.FieldingCountries.length < 2 &&
                        currentCostingProfile.FieldingCountries.length !== 0 &&
                        currentCostingProfile.FieldingCountries[0].value ===
                        currentCostingProfile.CommissioningCountry)
                )
                {
                    console.log("fielding ");
                    isValid = false;
                    updatedObj["FieldingCountries"] = true;
                } else
                {
                    updatedObj["FieldingCountries"] = false;
                }
            }
        }

        console.log("UPDATED OBJ", updatedObj);
        setFieldInvalidationCosting(
            update(fieldInvalidationCosting, { $merge: updatedObj })
        );
        if (!isValid)
        {
            toastr.error("Form is missing fields");
        }
        return isValid;
    };

    const handleProjectCreate = () =>
    {
        //if (validateProject())
        //{
        //    console.log("project being created", project);
        //    dispatch(currentProjectActions.createProject(project));
        //    // history.push("/costing");

        //}

        const cloneFieldingCountries = getCostingOptionsOnProjectCreate();
        updateProject({
            Mode: "MethodologiesDTL",
            FieldingCountries: cloneFieldingCountries
        });       
        
    };

    const getCostingOptionsOnProjectCreate = () =>
    {
        debugger;
        let tempVariables = [
            { type: "text", label: "Cities Coverage", value: null, mandatory: true },
            { type: "number", label: "Sample size 1", value: null, mandatory: true, parent: "var3", parentValue: ["Yes"] },
            { type: "number", label: "Length of Interview (LOI)", value: null, mandatory: true, parent: "var3", parentValue: ["Yes"] },
            { type: "text", label: "Target Group definition", value: null, mandatory: true, parent: "var3", parentValue: ["Yes"] },
            {
                type: "multi", label: "Sampling Type", value: null,
                options: [{ label: "option1", value: "option1" }, { label: "option2", value: "option2" }],
                mandatory: true
            },             
            { type: "text", label: "var8", value: null, mandatory: false },
            { type: "text", label: "var9", value: null, mandatory: false },            
            { type: "text", label: "var8", value: null, mandatory: false },
            { type: "text", label: "var9", value: null, mandatory: false }
        ]

        //create a costing profile 
        //let tempCostingOption = [{ label: "Default Option", value: "Default Option", Variables: _.cloneDeep(tempVariables) }];
        let tempCostingOption = [{ label: "Default Option", value: "Default Option", Variables: _.cloneDeep(tempVariables.filter(x => x.mandatory)) }];
        //we will get variables list on the bases of methodologies 

        //make clone of methodology
        let cloneSubMethodology = _.cloneDeep(project.SubMethodology);
        cloneSubMethodology.forEach(x =>
        {
            x["CostingOptions"] = _.cloneDeep(tempCostingOption);
            x["Variables"] = _.cloneDeep(tempVariables.filter(x => !x.mandatory));
        });

        //make clone of fieldingCountries
        let cloneFieldingCountries = _.cloneDeep(project.FieldingCountries);
        cloneFieldingCountries.forEach(x =>
        {
            x["SubMethodologies"] = _.cloneDeep(cloneSubMethodology);
        });

        return cloneFieldingCountries;
    };

    const handleAddProfile = () =>
    {
        console.log("handle add profile");
        dispatch({ type: currentCostingActions.CLEAR_NEW_COSTING });
        setProfileCreation(true);
    };

    const handleCostingProfileCreate = () =>
    {
        if (validateCosting())
        {
            dispatch(
                currentCostingActions.createCostingProfile(
                    {
                        ...currentCostingProfile,
                        ProjectId: project.id,
                        VerticalId: project.VerticalId,
                    }
                    //() => history.push("/costing")
                )
            );
        }
    };

    const handleProjectSave = () =>
    {
        if (validateProject())
        {
            console.log("made it into validate");
            console.log(project);
            if (project.IsImportedProject && !project.IndustryVertical)
            {
                toastr.error(
                    "Industry Vertical not found",
                    "Please select an industry vertical and save the project before attempted to create a profile"
                );
            } else
            {
                dispatch(currentProjectActions.saveProject(project));
            }
        }
    };
    const getProperty = (schema, prop) =>
    {
        if (schema.properties[prop]) return schema.properties[prop];
        else
        {
            let reqVal = "";
            if (schema.dependencies)
            {
                Object.keys(schema.dependencies).map((dep) =>
                {
                    schema.dependencies[dep].oneOf.map((oo) =>
                    {
                        if (oo.properties[prop] && oo.properties[prop].title)
                        {
                            reqVal = oo.properties[prop];
                        }
                    });
                });
            }
            return reqVal;
        }
    };
    const dowloadMultipleProfileRFQ = (profile, rfqData) =>
    {
        let data = null;
        _.head(profile.CountrySpecs).MethodologySpecs.map((ms) =>
        {
            var title = "";
            data = ms.RFQSchema.order.map((rfq) =>
            {
                let finalList = [];
                let finalObj = {};
                let property = getProperty(ms.RFQSchema, rfq);
                if (property && property.isNewSection)
                {
                    let titleObj = {};
                    titleObj["Methodology BreakDown"] = property.sectionTitle;
                    profile.CountrySpecs.map((cs) =>
                    {
                        titleObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] = "";
                    });
                    finalList.push(titleObj);
                }
                if (property)
                {
                    finalObj["Methodology BreakDown"] = property.title;
                    profile.CountrySpecs.map((cs) =>
                    {
                        finalObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] =
                            rfqData[cs.CountryCode] && rfqData[cs.CountryCode][ms.Code]
                                ? Array.isArray(rfqData[cs.CountryCode][ms.Code][rfq])
                                    ? rfqData[cs.CountryCode][ms.Code][rfq].join()
                                    : typeof rfqData[cs.CountryCode][ms.Code][rfq] == "boolean"
                                        ? rfqData[cs.CountryCode][ms.Code][rfq]
                                            ? "Yes"
                                            : "No"
                                        : rfqData[cs.CountryCode][ms.Code][rfq]
                                            ? rfqData[cs.CountryCode][ms.Code][rfq]
                                            : "-"
                                : "-";
                    });
                    finalList.push(finalObj);
                }
                return finalList;
            });
        });
        return data;
        // let final = []
        // data.map(t => {
        //   final.push(...t)
        // })
        // allTabs.push(final)
        // }
    };
    const getOpsValue = (value, prop) =>
    {
        if (value || value == false)
        {
            if (prop.toLowerCase().indexOf("complexity") != -1)
            {
                if (prop == "surveyProgrammingComplexity")
                {
                    return _.head(
                        codeLabels.QuestionnaireComplexityOptions.filter(
                            (frq) => frq.Code == value
                        )
                    ) ?.Label;
                }
                if (prop == "dataProcessingComplexity")
                {
                    return _.head(
                        codeLabels.DataProcessingComplexityOptions.filter(
                            (frq) => frq.Code == value
                        )
                    ) ?.Label;
                }
                if (prop == "chartingComplexity")
                {
                    return _.head(
                        codeLabels.ChartingComplexityOptions.filter(
                            (frq) => frq.Code == value
                        )
                    ) ?.Label;
                }
            } else
            {
                if (Array.isArray(value))
                {
                    return value.join();
                } else if (typeof value == "boolean")
                {
                    return value ? "Yes" : "No";
                } else return value;
            }
        } else
        {
            return "-";
        }
    };
    const downloadMultipleOps = (profile, opsData) =>
    {
        let data = [];
        _.head(profile.WaveSpecs) ?.OpsResourcesSchema ?.order ?.map((ors) =>
        {
            let finalList = [];
            let property = getProperty(
                _.head(profile.WaveSpecs).OpsResourcesSchema,
                ors
            );
            if (property && property.isNewSection)
            {
                let titleObj = {};
                titleObj["Operation Resources BreakDown"] = property.sectionTitle;
                profile.WaveSpecs.map((cs) =>
                {
                    let key = cs.WaveName
                        ? `#${cs.WaveNumber} ${cs.WaveName}`
                        : `#${cs.WaveNumber}`;
                    titleObj[key] = "";
                });
                finalList.push(titleObj);
            }
            if (property)
            {
                let finalObj = {};
                finalObj["Operation Resources BreakDown"] = property.title;
                profile.WaveSpecs.map((cs) =>
                {
                    let key = cs.WaveName
                        ? `#${cs.WaveNumber} ${cs.WaveName}`
                        : `#${cs.WaveNumber}`;
                    finalObj[key] = opsData[cs.WaveNumber]
                        ? getOpsValue(opsData[cs.WaveNumber][ors], ors)
                        : "-";
                });
                finalList.push(finalObj);
            }
            data.push(finalList);
        });
        return data;
    };
    const downloadProfiles = () =>
    {
        var opts = [];
        var allTabs = [];
        selectedProfiles.map((profile) =>
        {
            let finalData = {};
            profile.CountrySpecs.map((cs) =>
            {
                cs.MethodologySpecs.filter((ms) => !ms.NotApplicable).map((ms) =>
                {
                    if (!finalData[cs.CountryCode])
                    {
                        finalData[cs.CountryCode] = {};
                    }
                    if (!finalData[cs.CountryCode][ms.Code])
                    {
                        finalData[cs.CountryCode][ms.Code] = {};
                    }
                    finalData[cs.CountryCode][ms.Code] = ms.RFQData;
                });
            });
            let data = dowloadMultipleProfileRFQ(profile, finalData);
            let final = [];
            data ?.map((t) =>
            {
                final.push(...t);
            });
            allTabs.push(final);
            opts.push({
                sheetid: `${profile.ProfileNumber}${
                    profile.ProfileName ? `_${profile.ProfileName}_RFQData` : ""
                    }`,
                header: true,
            });

            let opsFinal = {};
            profile.WaveSpecs.map((ws) =>
            {
                opsFinal[ws.WaveNumber] = ws.OpsResourcesData;
            });

            let reqData = downloadMultipleOps(profile, opsFinal);
            // })
            let finalOps = [];
            reqData.map((t) =>
            {
                finalOps.push(...t);
            });
            allTabs.push(finalOps);
            opts.push({
                sheetid: `${profile.ProfileNumber}${
                    profile.ProfileName ? `_${profile.ProfileName}_OpsData` : ""
                    }`,
                header: true,
            });
        });

        alasql("SELECT INTO XLSX('ProfileSummary.xlsx',?) FROM ?", [
            opts,
            [...allTabs],
        ]);
    };
    return (
        <Layout
            hideProfileName={true}
            hideActions={true}
            projectStatusToDisplay={getLabel(
                "ProjectStatusOptions",
                project ?.ProjectStatus
      )}
        >
            <>
                <Container>
                    <Card>
                        <CardHeader>
                            <Row className="d-flex justify-content-between">
                                <Col xs="8" className="align-self-center">
                                    <Row className="d-flex justify-content-start">
                                        <Col className="align-self-center">
                                            
                                            <CardTitle className="text-uppercase mb-0">
                                                Project Details
                      </CardTitle>
                                        </Col>
                                        {/* <Col className="align-self-center">
                      <Badge title="Project Status">
                        {getLabel(
                          "ProjectStatusOptions",
                          project?.ProjectStatus
                        )}
                      </Badge>
                    </Col> */}
                                    </Row>
                                </Col>
                                <Col xs="3" className="align-self-center">
                                    <Link
                                        className=" p-1 medium float-right mr-2"
                                        onClick={(e) =>
                                            setToggle({
                                                ...toggle,
                                                overall: !toggle.overall,
                                                start: !toggle.overall ? true : false,
                                                salesforce: !toggle.overall ? true : false,
                                                projectContacts: !toggle.overall ? true : false,
                                                costingProfiles: !toggle.overall ? true : false,
                                            })
                                        }
                                    >
                                        <Label className="mb-0 mr-1 small">
                                            {!toggle.overall ? "Expand All" : "Collapse All"}
                                        </Label>
                                        <FontAwesomeIcon
                                            icon={!toggle.overall ? faChevronDown : faChevronUp}
                                            fixedWidth
                                            className="mb-0 mr-3 medium"
                                        />
                                    </Link>
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                    <Card className="ml-2 mr-2 mb-2">
                        <CardHeader
                            onClick={(e) => setToggle({ ...toggle, start: !toggle.start })}
                        >
                            <Row>
                                <Col xs="11">
                                    <CardTitle className="mb-0">Market Details</CardTitle>
                                </Col>
                                <Col xs="1">
                                    <FontAwesomeIcon
                                        className="align-middle mr-2"
                                        icon={!toggle.start ? faChevronRight : faChevronDown}
                                        fixedWidth
                                    />
                                </Col>
                            </Row>
                        </CardHeader>
                        <Collapse isOpen={toggle.start}>
                            <CardBody>
                                <MarketDetails
                                    project={project}
                                    updateProject={updateProject}
                                    fieldInvalidation={fieldInvalidationProject}
                                />
                            </CardBody>
                        </Collapse>
                    </Card>

                    {project.IndustryVertical && project.IndustryVertical !== "" ? (
                        <>
                            <Card className="ml-2 mr-2 mb-2">
                                <CardHeader
                                    onClick={(e) =>
                                        setToggle({ ...toggle, salesforce: !toggle.salesforce })
                                    }
                                >
                                    <Row>
                                        <Col>
                                            <CardTitle className="mb-0">Client Details</CardTitle>
                                        </Col>
                                        <Col xs="1">
                                            <FontAwesomeIcon
                                                className="align-middle mr-2"
                                                icon={
                                                    !toggle.salesforce ? faChevronRight : faChevronDown
                                                }
                                                fixedWidth
                                            />
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <Collapse isOpen={toggle.salesforce}>
                                    <CardBody>
                                        <Salesforce
                                            user={user}
                                            project={project}
                                            updateProject={updateProject}
                                            fieldInvalidation={fieldInvalidationProject}
                                        />
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </>
                    ) : null}
                    <Card className="ml-2 mr-2 mb-2">
                        <CardHeader
                            onClick={(e) =>
                                setToggle({
                                    ...toggle,
                                    projectContacts: !toggle.projectContacts,
                                })
                            }
                        >
                            <Row>
                                <Col>
                                    <CardTitle className="mb-0">Project Contacts</CardTitle>
                                </Col>
                                <Col xs="1">
                                    <FontAwesomeIcon
                                        className="align-middle mr-2"
                                        icon={
                                            !toggle.projectContacts ? faChevronRight : faChevronDown
                                        }
                                        fixedWidth
                                    />
                                </Col>
                            </Row>
                        </CardHeader>

                        <Collapse isOpen={toggle.projectContacts}>
                            <CardBody>
                                <ProjectContacts
                                    user={user}
                                    project={project}
                                    updateProject={updateProject}
                                    primaryCSContacts={primaryCSContacts}
                                    otherInternalContacts={otherInternalContacts}
                                    fieldInvalidation={fieldInvalidationProject}
                                />
                            </CardBody>
                        </Collapse>
                    </Card>
                    {project.id && (costingProfiles.length === 0 || profileCreation) || 1 == 1 ? (
                        <Card className="ml-2 mr-2">
                            <CardHeader>
                                <Row>
                                    <Col>
                                        <CardTitle className="mb-0">
                                            Methodologies Details
                                        </CardTitle>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <ProjectDetails
                                    project={project}
                                    updateProject={updateProject}
                                    fieldInvalidation={fieldInvalidationCosting}
                                />
                            </CardBody>
                        </Card>
                    ) : null}
                    {project.Mode == "MethodologiesDTL" &&
                        <Card className="ml-2 mr-2">
                            <CardHeader>
                                <Row>
                                    <Col>
                                        <CardTitle className="mb-0">
                                            Methodologies Details
                            </CardTitle>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <CountryMethodologyTabs
                                    project={project}
                                    updateProject={updateProject}
                                />
                            </CardBody>
                        </Card>
                    }
                </Container>
                <Container className="d-flex mt-4 mr-2 justify-content-end">
                    {profileCreation ? (
                        <Button
                            color="secondary"
                            className="mr-2"
                            onClick={() => setProfileCreation(false)}
                        >
                            Cancel
            </Button>
                    ) : null}

                    {project.id ? (
                        costingProfiles.length === 0 || profileCreation ? (
                            <Button onClick={handleCostingProfileCreate} color="primary">
                                Create Profile
              </Button>
                        ) : (
                                <Button
                                    onClick={(e) =>
                                    {
                                        handleProjectSave();
                                    }}
                                    color="primary"
                                >
                                    Save Project
              </Button>
                            )
                    ) : (
                            <Button
                                onClick={handleProjectCreate}
                                color="primary"
                            >
                                Save
                            </Button>
                        )}

                </Container>
                <Container className="d-flex justify-content-center">
                    <Badge href="#" color="secondary">
                        Back to top ↑
          </Badge>
                </Container>
            </>

            <Modal
                isOpen={selectProfilesDownload}
                toggle={() => setSelectProfilesDownload(!selectProfilesDownload)}
            >
                <ModalHeader
                    toggle={() => setSelectProfilesDownload(!selectProfilesDownload)}
                >
                    Select Profiles to be downloaded
        </ModalHeader>
                <ModalBody>
                    <Row className="m-0 justify-content-end">
                        <a className="mr-1 select-link" onClick={() => setSelectedProfiles([...costingProfiles.filter(sp => !sp.IsImportedProfile).map(adp => { return { ...adp } })])}>Select all</a>
                        <a className="ml-1 select-link" onClick={() => setSelectedProfiles([])}>Deselect all</a>
                    </Row>
                    <ul>
                        {costingProfiles.map((cp, index) => <li>
                            <span><input id={`cp_${index}`} disabled={cp.IsImportedProfile}
                                type="checkbox"
                                checked={_.includes(selectedProfiles.map(sp => sp.id), cp.id)}
                                onChange={(e) =>
                                {
                                    if (!cp.IsImportedProfile)
                                    {
                                        if (e.target.checked)
                                        {
                                            let selectedprofiles = [...selectedProfiles]
                                            setSelectedProfiles([...selectedprofiles, cp])
                                        } else
                                        {
                                            let selectedprofiles = [...selectedProfiles]
                                            setSelectedProfiles([...selectedprofiles.filter(sp => sp.id != cp.id)])
                                        }
                                    }
                                }} /><label className={`ml-2${cp.IsImportedProfile ? " no-actions" : " pointer"}`}
                                    for={`cp_${index}`}>#{cp.ProfileNumber} {cp.ProfileName}</label> {cp.IsImportedProfile ? <span><FontAwesomeIcon
                                        className="warning pointer"
                                        icon={faExclamationTriangle}
                                        title="You cannot download this profile as it is Migrated from v1."
                                    /></span> : null}</span>
                        </li>)}
                    </ul>
                </ModalBody>
                <ModalFooter>
                    <Row>
                        <Button
                            color="secondary"
                            onClick={() =>
                            {
                                setSelectedProfiles([]);
                                setSelectProfilesDownload(!selectProfilesDownload);
                            }}
                        >
                            Cancel
            </Button>
                        <Button
                            color="primary"
                            className="ml-2"
                            disabled={!selectedProfiles.length}
                            onClick={() =>
                            {
                                downloadProfiles();
                                setSelectedProfiles([]);
                                setSelectProfilesDownload(!selectProfilesDownload);
                            }}
                        >
                            Download
            </Button>
                    </Row>
                </ModalFooter>
            </Modal>
        </Layout>
    );
};

export default Proposal;
