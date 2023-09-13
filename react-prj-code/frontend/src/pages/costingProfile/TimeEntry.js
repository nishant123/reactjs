import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Button, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";

import Spinner from "../../components/Spinner";
import * as countryActions from "../../redux/actions/countrySpecsActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";

import { getLabel } from "../../utils/codeLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faPaste, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { setCurrentCostingProfiles } from "../../redux/actions/costingsActions";
import Select from "react-select";
import { pageLoadEnd, pageLoadStart, setCostingStatus } from "../../redux/actions/appActions";
import { toastr } from "react-redux-toastr";
import axios from "../../axios-interceptor";

const TimeEntry = (props) => {
    const dispatch = useDispatch();
    const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
    const currentCosting = useSelector(({ currentCosting }) => currentCosting.currentCostingProfile);
    const app = useSelector(({ app }) => app);
    const costingStatus = useSelector(({ app }) => app.costingStatus);

    const [timeEntryDetails, updateTimeEntryForm] = useState({})

    const [countryDetails, setCountryDetails] = useState({});

    useEffect(() => {
        if (countrySpecs && countrySpecs.length && !Object.keys(timeEntryDetails).length) {
            let timeEntryDetails = {};
            countrySpecs.map((cs) => {
                timeEntryDetails[cs.CountryCode] = {};
                cs.MethodologySpecs.map((ms) => {
                    timeEntryDetails[cs.CountryCode][ms.Code] = ms.TimingsData ? ms.TimingsData : {};
                });
            });
            updateTimeEntryForm(timeEntryDetails);
        }
    }, [countrySpecs]);

    const currentprofile = useSelector(({ currentCosting }) => currentCosting.currentCostingProfile);
    const submitTimeEntryForm = () => {
        let profileToSave = { ...currentprofile }
        profileToSave.CountrySpecs = profileToSave.CountrySpecs.map(cs => {
            cs.MethodologySpecs = cs.MethodologySpecs.map(ms => {
                ms.TimingsData = timeEntryDetails[cs.CountryCode][ms.Code]
                return { ...ms }
            })
            return { ...cs }
        })
        dispatch(currentCostingActions.saveCostingProfile(profileToSave))
    }
    return (
        <Card className="rounded ext-costing">
            <CardHeader>
                <Row className="justify-content-between p-3">
                    <h3>Time Details</h3>
                    <Button className="mr-4" color="secondary" onClick={() => props.switchToTime(false)}>Navigate Back to Cost Entry</Button>
                </Row>
                <Row>
                    <Col><h5>Please input time for all waves combined if your project is a tracker.</h5></Col>
                </Row>

            </CardHeader>
            <div className="d-flex wrapper">
                {/* <FormLabels /> */}
                <Table inline hover bordered={true} size="sm">
                    <thead className="border">
                        <th className="h4">Breakdown by Methodology</th>
                        {countrySpecs.map((country) => (
                            <th className="text-center">
                                <span className="d-flex align-middle text-nowrap">
                                    {getLabel("FieldingCountriesOptions", country.CountryCode)}

                                </span>

                            </th>
                        ))}
                    </thead>
                    <tbody>
                        {
                            // countrySpecs.map((country) => {
                            //avoid hardcoding index
                            //replace with lodash when installed
                            countrySpecs && countrySpecs.length ? (
                                _.head(countrySpecs).MethodologySpecs.map((ms) => {
                                    return (
                                        <>
                                            <tr>
                                                <td className="main-meth-label text-uppercase">
                                                    <h5>{ms.Label}</h5>
                                                </td>
                                                {countrySpecs.map((cs) => (
                                                    <td></td>
                                                ))}
                                                {/* only for border styles purpose, todo: optimize */}
                                            </tr>

                                            {ms.TimingsSchema.map((timesch) => {

                                                return timesch.properties ? (
                                                    <>
                                                        <tr className="mt-4 h5">
                                                            <td>
                                                                <strong>{timesch.title}</strong>
                                                                {/* only for border styles purpose, todo: optimize */}
                                                            </td>
                                                            {countrySpecs.map((cs) => (
                                                                <td></td>
                                                            ))}
                                                        </tr>
                                                        {Object.keys(timesch.properties).map((prop) => {
                                                            return timesch.properties[prop].title ? (
                                                                <tr>
                                                                    <td className="sub-meth-label">{timesch.properties[prop].title}</td>
                                                                    {countrySpecs.map((cs) => {
                                                                        let currentMeth = _.head(cs.MethodologySpecs.filter((mt) => mt.Code == ms.Code));
                                                                        return (
                                                                            <td>
                                                                                <div class="input-group">
                                                                                    <input
                                                                                        placeholder={currentMeth.NotApplicable ? "Not Applicable" : null}
                                                                                        className="form-control"
                                                                                        type="number"
                                                                                        onChange={(e) => {
                                                                                            if (!timeEntryDetails[cs.CountryCode]) {
                                                                                                timeEntryDetails[cs.CountryCode] = {}
                                                                                            }
                                                                                            if (!timeEntryDetails[cs.CountryCode][currentMeth.Code]) {
                                                                                                timeEntryDetails[cs.CountryCode][currentMeth.Code] = currentMeth.TimingsData ? currentMeth.TimingsData : {}
                                                                                            }
                                                                                            timeEntryDetails[cs.CountryCode][currentMeth.Code] = { ...timeEntryDetails[cs.CountryCode][currentMeth.Code] }
                                                                                            timeEntryDetails[cs.CountryCode][currentMeth.Code][prop] = e.target.value
                                                                                            updateTimeEntryForm({ ...timeEntryDetails })
                                                                                        }}
                                                                                        defaultValue={currentMeth.TimingsData ? currentMeth.TimingsData[prop] : null}
                                                                                        id={prop}
                                                                                        min={0}
                                                                                        step="any"
                                                                                        disabled={
                                                                                            currentMeth.NotApplicable ||
                                                                                            currentprofile.CostingType == "SHEETS" ||
                                                                                            (currentprofile.CostingType == "VENDOR" && currentprofile.VendorBiddingSubmethodologies && _.includes(currentprofile.VendorBiddingSubmethodologies.split(","), currentMeth.Code))
                                                                                        }
                                                                                    />
                                                                                    <div class="input-group-append">
                                                                                        <span class="input-group-text text-sm">Days</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ) : null;
                                                        })}
                                                    </>
                                                ) : null;
                                            })}
                                        </>
                                    );
                                })
                            ) : (
                                    <></>
                                )
                            // })
                        }
                    </tbody>
                </Table>
            </div>
            <div className="ml-auto">
                <button className="btn btn-secondary mt-4 mr-2" onClick={() => dispatch(setCostingStatus({ ...costingStatus, showManualCostEntry: false }))}>
                    Back
				</button>
                <button
                    className="btn btn-primary mt-4"
                    disabled={app.recordloading || currentCosting.ProfileStatus > 5 || currentprofile.CostingType == "SHEETS"}
                    onClick={(e) => {
                        if (app.recordloading || currentCosting.ProfileStatus > 5 || currentprofile.CostingType == "SHEETS") {
                            e.preventDefault();
                        } else {
                            submitTimeEntryForm();
                        }
                    }}
                >
                    Save
					{app.recordloading ? <Spinner size="small" color="#495057" /> : null}
                </button>
            </div>
        </Card>
    )
}
export default TimeEntry