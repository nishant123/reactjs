import React, { useEffect, useState } from "react";
import { toastr } from "react-redux-toastr";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "@alexcambose/react-infinite-scroll";
import axios from "../../axios-interceptor";
import Navbar from "../../components/Navbar";
import DashboardLayout from "../../layouts/Dashboard";
import RecordsSpinner from "../../components/RecordsSpinner";
import RecordsBadge from "../../components/RecordsBadge";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { getLabel } from "../../utils/codeLabels";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Input,
  Label,
  CardHeader,
  CardTitle,
  CardBody,
  Container,
  Card,
  Row,
  Col,
} from "reactstrap";
import _ from "lodash";
import { pageLoadEnd, pageLoadStart } from "../../redux/actions/appActions";
import filterFactory, {
  selectFilter,
  textFilter,
} from "react-bootstrap-table2-filter";

const DeliveryReport = () => {
  const dispatch = useDispatch();

  // infinite load state
  const [infiniteLoad, setInfiniteLoad] = useState(false);
  const [record, setRecord] = useState({
    records: [],
    hasMore: true,
    totalItems: null,
  });

  // code labels
  const comissioningCountries =
    useSelector(({ codeLabels }) => codeLabels.CommissioningCountriesOptions) ||
    [];
  const fieldingCountries =
    useSelector(({ codeLabels }) => codeLabels.FieldingCountriesOptions) || [];
  const verticals =
    useSelector(({ codeLabels }) => codeLabels.VerticalOptions) || [];
  const methodology =
    useSelector(({ codeLabels }) => codeLabels.MethodologyOptions) || [];

  // select columns to display states
  const [selectColumns, openSelectColumns] = useState(false);
  const [allColumns] = useState([
    "ID",
    "Project Delivery Number",

    "Profile Id",
    "Project Id",
    "WBS Number",
    "Project Name",
    "Proposal Owner",
    "Other CS Contacts",
    "Commissioning Country",
    "Commissioning Office",
    "Business Unit",
    "Fielding Countries",
    "Methodology",
    "Syndicated",
    "Status",
    "Tracker",
    "Tracking Frequency",
    "Number Of Waves",

    "Date Wave Commissioned",
    "Date Final Questionnaire",
    "Date Translations",
    "Date Field Start",
    "Date Field End",
    "Date Data Processing",
    "Date Charts",
    "Date Dashboards",
    "Date Final Report",
    "Date Test Link",
    "Date Link Link",

    "survey Programming Required",
    "survey Programming Complexity",
    "survey Programming Number Of Questions",
    "survey Programming Percentage Change Per Wave",
    "survey Programming Involve Fielding Market",
    "data Processing Complexity",
    "charting Complexity",
    "charting Number",
    "dashboarding",
    "translations",
    "translations Languages",
    "verbatim Coding",
    "verbatim Coding Full Open Ended",
    "verbatim Coding Other Specify",
    "text Analytics",
    "other Data Preparation Assistance",
    "other Data PreparationAssistance Hours",
    "additional Operations Support",
    "additional Operations Support Hours",
    "Programmer Assigned",
    "Group Lead Email",
    "Initial Setup CT Days",
    "Complexity Level",
    "Changes Before Initial Link Delivery ",
    "Number Of Questions",
    "Changes To Unique Questions",
    "Number Of Pids",
    "Changes After Initial Link Delivery",
    "Number Of Iterations",
    "Errors In Initial Link Delivery",
    "Errors After Initial Link Delivery",
    "Job Count",
    "Platform Project Id",
    "Changes After Live Link Created",
    "Errors After Live Link Created",
    "Total Number Of Iterations",
    "Actual LOI Mins",
    "Total Completes",
    "Cancelled Date",
    "Reason For Cancellation",
    "Platform",
    "Data Collection Method",
    "Cost Centre",
    "Delivery Status",
    "Data Collection Method Other",
    "Changes To Unique Questions NA",
    "Live Survey Project Id",
    "Test Survey Project Id",

    "Is Internal Delivery",
    "Is Decommissioned Fixed",
  ]);
  const [selectedDisplayColumns, setSelectedDisplayColumns] = useState(
    allColumns
  );
  const [selectedTempDisplayColumns, setSelectedTempDisplayColumns] = useState(
    allColumns
  );
  const [resetDisplayCols, setResetDisplayCols] = useState([]);

  // initial api call - load 30
  useEffect(() => {
    console.log("initial call");
    dispatch(pageLoadStart());
    axios
      .post("/reports/tcs/deliveryspecs/all?limit=30")
      .then((res) => {
        dispatch(pageLoadEnd());
        console.log(res);
        setRecord({
          ...record,
          records: res.data.items,
          totalItems: res.data.totalItems,
        }); // change records to whatever array is named
      })
      .catch((err) => {
        // toastr.error("Loading Failed", err.data.message);
      });
  }, []);

  // load all
  const loadAllFinances = () => {
    dispatch(pageLoadStart());
    axios
      .post("/reports/tcs/deliveryspecs/all")
      .then((res) => {
        dispatch(pageLoadEnd());
        console.log(res);
        setRecord({
          ...record,
          records: res.data.items,
          totalItems: res.data.totalItems,
        });
      })
      .catch((err) => {
        dispatch(pageLoadEnd());
        toastr.error("Loading Failed", err?.data?.message);
      });
  };
  useEffect(() => {
    console.log("record has changed", record);
  }, [record]);

  // infinite load fetch more
  const fetchMoreData = () => {
    console.log("fetch more called");
    console.log(record);
    if (record.records.length >= record.totalItems) {
      console.log("set hasMore false");
      setRecord({ ...record, hasMore: false });
      return;
    }
    setInfiniteLoad(true);
    axios
      .post(
        "/reports/tcs/deliveryspecs/all?limit=30&offset=" +
          record.records.length
      )
      .then((res) => {
        console.log(res);
        console.log(
          "new array",
          update(record.records, { $push: res.data.items })
        );
        setRecord({
          ...record,
          records: update(record.records, { $push: res.data.items }),
          totalItems: res.data.totalItems,
        });
        setInfiniteLoad(false);
      })
      .catch((err) => {
        console.log(err);
        // toastr.error("Loading Failed", err.data.message);
        setInfiniteLoad(false);
      });
  };

  // data parsers/formatters
  const getCommaSeperatedData = (array, value) => {
    let output = [];
    if (value) {
      let list = value.split(",");
      for (let i of list) {
        let a = array.find((data) => data.Code === i);
        if (a) output.push(a.Label);
      }
      return output.join();
    } else return "";
  };
  const getCommissionCountries = (value) => {
    if (value) {
      let a = comissioningCountries.find((data) => data.Code === value);
      if (a) return a.Label;
      return "";
    } else return "";
  };
  // camelCase to Title Case regex
  // str.replace(/((?<!^)[A-Z](?![A-Z]))(?=\S)/g, ' $1').replace(/^./, s => s.toUpperCase() );

  const getDates = () => {
    const fields = {
      DateWaveCommissioned: "Date Wave Commissioned",
      DateFinalQuestionnaire: "Date Final Questionnaire",
      DateTranslations: "Date Translations",
      DateFieldStart: "Date Field Start",
      DateFieldEnd: "Date Field End",
      DateDataProcessing: "Date Data Processing",
      DateCharts: "Date Charts",
      DateDashboards: "Date Dashboards",
      DateFinalReport: "Date Final Report",
      DateFirstTestLinkActual: "Date Test Link",
      DateLiveLinkActual: "Date Link Link",
    };

    return Object.keys(fields).map((key) => {
      return {
        dataField: key,
        text: fields[key],
        sort: true,
        // filter: textFilter(),
        formatter: (cell, row) => {
          return <span>{row.WaveSpec[key]?.split("T")[0]}</span>;
        },
        csvFormatter: (cell, row) => {
          return row.WaveSpec[key]?.split("T")[0] || "not available";
        },
      };
    });
  };
  const getOpsResources = () => {
    const fields = {
      surveyProgrammingRequired: "survey Programming Required",
      surveyProgrammingComplexity: "survey Programming Complexity",
      surveyProgrammingNumberOfQuestions:
        "survey Programming Number Of Questions",
      surveyProgrammingPercentageChangePerWave:
        "survey Programming Percentage Change Per Wave",
      surveyProgrammingInvolveFieldingMarket:
        "survey Programming Involve Fielding Market",
      dataProcessingComplexity: "data Processing Complexity",
      chartingComplexity: "charting Complexity",
      chartingNumber: "charting Number",
      dashboarding: "dashboarding",
      translations: "translations",
      translationsLanguages: "translations Languages",
      verbatimCoding: "verbatim Coding",
      verbatimCodingFullOpenEnded: "verbatim Coding Full Open Ended",
      verbatimCodingOtherSpecify: "verbatim Coding Other Specify",
      textAnalytics: "text Analytics",
      otherDataPreparationAssistance: "other Data Preparation Assistance",
      otherDataPreparationAssistanceHours:
        "other Data PreparationAssistance Hours",
      additionalOperationsSupport: "additional Operations Support",
      additionalOperationsSupportHours: "additional Operations Support Hours",
    };
    const sKeys = [
      "surveyProgrammingRequired",
      "dashboarding",
      "translations",
      "verbatimCoding",
      "textAnalytics",
      "otherDataPreparationAssistance",
      "additionalOperationsSupport",
    ];
    return Object.keys(fields).map((key) => {
      return {
        dataField: key,
        text: fields[key],
        sort: true,
        formatter: (cell, row) => {
          if (sKeys.indexOf(key) !== -1) {
            return (
              <span>
                {row.WaveSpec?.OpsResourcesData
                  ? row.WaveSpec?.OpsResourcesData[key]
                    ? "Yes"
                    : "No"
                  : ""}
              </span>
            );
          }
          if (key === "translationsLanguages") {
            return (
              <span>
                {row.WaveSpec?.OpsResourcesData
                  ? row.WaveSpec?.OpsResourcesData[key]?.join(",\n") || ""
                  : ""}
              </span>
            );
          }
          return (
            <span>
              {row.WaveSpec?.OpsResourcesData
                ? row.WaveSpec?.OpsResourcesData[key] || ""
                : ""}
            </span>
          );
        },
        csvFormatter: (cell, row) => {
          if (sKeys.indexOf(key) !== -1) {
            return row.WaveSpec?.OpsResourcesData
              ? row.WaveSpec?.OpsResourcesData[key]
                ? "Yes"
                : "No"
              : "";
          }
          if (key === "translationsLanguages") {
            return row.WaveSpec?.OpsResourcesData
              ? row.WaveSpec?.OpsResourcesData[key]?.join("|") || ""
              : "";
          }
          return row.WaveSpec?.OpsResourcesData
            ? row.WaveSpec?.OpsResourcesData[key] || ""
            : "";
        },
      };
    });
  };

  const getTCS = () => {
    const fields = {
      ProgrammerAssigned: "Programmer Assigned",
      GroupLeadEmail: "Group Lead Email",
      //InitialSetupCTDays: "Initial Setup CT Days",
      //ComplexityLevel: "Complexity Level",
      ChangesBeforeInitialLinkDelivery: "Changes Before Initial Link Delivery ",
      NumberOfQuestions: "Number Of Questions",
      ChangesToUniqueQuestions: "Changes To Unique Questions",
      NumberOfPids: "Number Of Pids",
      ChangesAfterInitialLinkDelivery: "Changes After Initial Link Delivery",
      NumberOfIterations: "Number Of Iterations",
      ErrorsInInitialLinkDelivery: "Errors In Initial Link Delivery",
      ErrorsAfterInitialLinkDelivery: "Errors After Initial Link Delivery",
      //JobCount: "Job Count",
      PlatformProjectId: "Platform Project Id",
      ChangesAfterLiveLinkCreated: "Changes After Live Link Created",
      ErrorsAfterLiveLinkCreated: "Errors After Live Link Created",
      TotalNumberOfIterations: "Total Number Of Iterations",
      ActualLOIMins: "Actual LOI Mins",
      TotalCompletes: "Total Completes",
      CancelledDate: "Cancelled Date",
      ReasonForCancellation: "Reason For Cancellation",
      //Platform: "Platform",
      //DataCollectionMethod: "Data Collection Method",
      //CostCentre: "Cost Centre",
      //DeliveryStatus: "Delivery Status",
      DataCollectionMethodOther: "Data Collection Method Other",
      ChangesToUniqueQuestionsNA: "Changes To Unique Questions NA",
      LiveSurveyProjectId: "Live Survey Project Id",
      TestSurveyProjectId: "Test Survey Project Id",
      IsInternalDelivery: "Is Internal Delivery",
      IsDecommissionedFixed: "Is Decommissioned Fixed",
    };
    const sKeys = {
      DeliveryStatus: {
        title: "Delivery Status",
        codeLabel: "DeliveryStatusOptions",
      },
      DataCollectionMethod: {
        title: "Data Collection Method",
        codeLabel: "DeliveryDataCollectionTypeOptions",
      },
      InitialSetupCTDays: {
        title: "Initial Setup CT Days",
        codeLabel: "DeliveryInitialSetupCTDaysOptions",
      },
      CostCentre: {
        title: "Cost Centre",
        codeLabel: "DeliveryCostCentreOptions",
      },
      ComplexityLevel: {
        title: "Complexity Level",
        codeLabel: "DeliveryComplexityLevelSPOptions",
      },
      JobCount: { title: "Job Count", codeLabel: "DeliveryJobCountSP" },
      Platform: { title: "Platform", codeLabel: "DeliveryPlatformSPOptions" },
    };
    let columns = [];
    columns = columns.concat(
      Object.keys(fields).map((key) => {
        return {
          dataField: key,
          text: fields[key],
          sort: true,
          //filter: textFilter(),
          formatter: (cell, row) => {
            return <span>{row[key] || ""}</span>;
          },
          csvFormatter: (cell, row) => {
            return row[key] || "";
          },
        };
      })
    );
    columns = columns.concat(
      Object.keys(sKeys).map((key) => {
        return {
          dataField: key,
          text: sKeys[key]["title"],
          sort: true,
          //filter: textFilter(),
          formatter: (cell, row) => {
            if (key === "DataCollectionMethod" && row[key] !== null) {
              return (
                <span>
                  {row[key]
                    .split(",")
                    .map((method) => {
                      return getLabel(sKeys[key]["codeLabel"], method);
                    })
                    .join(",\n")}
                </span>
              );
            }
            return (
              <span>{getLabel(sKeys[key]["codeLabel"], row[key]) || ""}</span>
            );
          },
          csvFormatter: (cell, row) => {
            if (key === "DataCollectionMethod" && row[key] !== null) {
              return row[key]
                .split(",")
                .map((method) => {
                  return getLabel(sKeys[key]["codeLabel"], method);
                })
                .join("|");
            }
            return getLabel(sKeys[key]["codeLabel"], row[key]) || "";
          },
        };
      })
    );
    return columns;
  };

  // const getOnline = () =>{
  //   const fields= [];
  //   return fields.map((field) => {
  //     return {
  //       dataField: field,
  //       text: field,
  //       sort: true,
  //       //filter: textFilter(),
  //       formatter: (cell, row) => {
  //         const methodologies = row.WaveSpec?.CostingProfile?.CountrySpecs?.filter(country=>{

  //         })
  //         if ()
  //         return <span>{row[field] || ""}</span>;
  //       },
  //     };
  //   });
  // }

  const finalColumns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.id}</span>;
      },
      //filter: textFilter(),
    },
    {
      dataField: "ProjectDeliveryNumber",
      text: "Project Delivery Number",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.ProjectDeliveryNumber || ""}</span>;
      },
      csvFormatter: (cell, row) => {
        return row.ProjectDeliveryNumber || "";
      },
    },
    {
      dataField: "ProfileId",
      text: "Profile Id",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return <span>{row.WaveSpec?.CostingProfile?.id}</span>;
      },
      csvFormatter: (cell, row) => {
        return row.WaveSpec?.CostingProfile?.id || "";
      },
    },
    {
      dataField: "ProjectId",
      text: "Project Id",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return <span>{row.WaveSpec?.CostingProfile?.Project?.id}</span>;
      },
      csvFormatter: (cell, row) => {
        return row.WaveSpec?.CostingProfile?.Project?.id || "";
      },
    },
    {
      dataField: "WBSNumber",
      text: "WBS Number",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {row.WaveSpec?.CostingProfile?.Project?.ContractDetails?.map(
              (contract) => {
                return contract?.opportunityLineItemDetails
                  .map((item) => {
                    return item.WBSNumber;
                  })
                  .filter(
                    (item, i, array) =>
                      item !== null && item !== "" && array.indexOf(item) === i
                  )
                  .join(",\n");
              }
            )
              .join(",\n")
              .split(",\n")
              .filter(
                (item, i, array) =>
                  item !== null && item !== "" && array.indexOf(item) === i
              )
              .join(",\n")}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          row.WaveSpec?.CostingProfile?.Project?.ContractDetails?.map(
            (contract) => {
              return contract?.opportunityLineItemDetails
                .map((item) => {
                  return item.WBSNumber;
                })
                .filter(
                  (item, i, array) =>
                    item !== null && item !== "" && array.indexOf(item) === i
                )
                .join("|");
            }
          )
            .join("|")
            .split("|")
            .filter(
              (item, i, array) =>
                item !== null && item !== "" && array.indexOf(item) === i
            )
            .join("|") || ""
        );
      },
    },
    {
      dataField: "ProjectName",
      text: "Project Name",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>{row.WaveSpec?.CostingProfile?.Project?.ProjectName}</span>
        );
      },
      csvFormatter: (cell, row) => {
        return row.WaveSpec?.CostingProfile?.Project?.ProjectName || "";
      },
    },
    {
      dataField: "ProposalOwner",
      text: "Proposal Owner",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {row.WaveSpec?.CostingProfile?.Project?.ProposalOwnerEmail?.value}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          row.WaveSpec?.CostingProfile?.Project?.ProposalOwnerEmail?.value || ""
        );
      },
    },
    {
      dataField: "OtherCSContacts",
      text: "Other CS Contacts",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {row.WaveSpec?.CostingProfile?.Project?.OtherProjectTeamContacts.map(
              (contact) => {
                return contact.value;
              }
            ).join(",\n")}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          row.WaveSpec?.CostingProfile?.Project?.OtherProjectTeamContacts.map(
            (contact) => {
              return contact.value;
            }
          ).join("|") || ""
        );
      },
    },
    {
      dataField: "CommissioningCountry",
      text: "Commissioning Country",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {getLabel(
              "CommissioningCountriesOptions",
              row.WaveSpec?.CostingProfile?.Project?.CommissioningCountry
            )}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          getLabel(
            "CommissioningCountriesOptions",
            row.WaveSpec?.CostingProfile?.Project?.CommissioningCountry
          ) || ""
        );
      },
    },
    {
      dataField: "CommissioningOffice",
      text: "Commissioning Office",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {getLabel(
              "OfficeOptions",
              row.WaveSpec?.CostingProfile?.Project?.CommissioningOffice
            )}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          getLabel(
            "OfficeOptions",
            row.WaveSpec?.CostingProfile?.Project?.CommissioningOffice
          ) || ""
        );
      },
    },
    {
      dataField: "BusinessUnit",
      text: "Business Unit",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {getLabel(
              "BusinessUnitOptions",
              row.WaveSpec?.CostingProfile?.Project?.BusinessUnit
            )}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          getLabel(
            "BusinessUnitOptions",
            row.WaveSpec?.CostingProfile?.Project?.BusinessUnit
          ) || ""
        );
      },
    },
    {
      dataField: "FieldingCountries",
      text: "Fielding Countries",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {row.WaveSpec?.CostingProfile?.FieldingCountries.split(",")
              .map((country) => {
                return getLabel("FieldingCountriesOptions", country);
              })
              .join(",\n")}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          row.WaveSpec?.CostingProfile?.FieldingCountries.split(",")
            .map((country) => {
              return getLabel("FieldingCountriesOptions", country);
            })
            .join("|") || ""
        );
      },
    },
    {
      dataField: "Methodology",
      text: "Methodology",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {row.WaveSpec?.CostingProfile?.Methodology.split(",")
              .map((meth) => {
                return getLabel("MethodologyOptions", meth);
              })
              .join(",\n")}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          row.WaveSpec?.CostingProfile?.Methodology.split(",")
            .map((meth) => {
              return getLabel("MethodologyOptions", meth);
            })
            .join("|") || ""
        );
      },
    },
    {
      dataField: "Syndicated",
      text: "Syndicated",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {row.WaveSpec?.CostingProfile?.Project?.IsSyndicated ? "Yes" : "No"}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return row.WaveSpec?.CostingProfile?.Project?.IsSyndicated
          ? "Yes"
          : "No" || "";
      },
    },
    {
      dataField: "Status",
      text: "Status",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {getLabel(
              "ProjectStatusOptions",
              row.WaveSpec?.CostingProfile?.Project?.ProjectStatus
            )}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          getLabel(
            "ProjectStatusOptions",
            row.WaveSpec?.CostingProfile?.Project?.ProjectStatus
          ) || ""
        );
      },
    },
    {
      dataField: "Tracker",
      text: "Tracker",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>{row.WaveSpec?.CostingProfile?.IsTracker ? "Yes" : "No"}</span>
        );
      },
      csvFormatter: (cell, row) => {
        return row.WaveSpec?.CostingProfile?.IsTracker ? "Yes" : "No" || "";
      },
    },
    {
      dataField: "TrackingFrequency",
      text: "Tracking Frequency",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return (
          <span>
            {getLabel(
              "TrackingFrequencyOptions",
              row.WaveSpec?.CostingProfile?.TrackingFrequency
            )}
          </span>
        );
      },
      csvFormatter: (cell, row) => {
        return (
          getLabel(
            "TrackingFrequencyOptions",
            row.WaveSpec?.CostingProfile?.TrackingFrequency
          ) || ""
        );
      },
    },
    {
      dataField: "NumberOfWaves",
      text: "Number Of Waves",
      sort: true,
      //filter: textFilter(),
      formatter: (cell, row) => {
        return <span>{row.WaveSpec?.CostingProfile?.NumberOfWaves}</span>;
      },
      csvFormatter: (cell, row) => {
        return row.WaveSpec?.CostingProfile?.NumberOfWaves || "";
      },
    },
    ...getDates(),
    ...getOpsResources(),
    ...getTCS(),
    // ...getOnline(),
  ];

  const [tableColumns, setTableColumns] = useState(finalColumns);

  // select columns to show
  useEffect(() => {
    if (selectedDisplayColumns) {
      dispatch(pageLoadStart());
      let columns = finalColumns
        .filter((col) => _.includes(selectedDisplayColumns, col.text))
        .map((col) => {
          return { ...col };
        });
      setTableColumns([]);
      setTimeout(() => {
        setTableColumns([...columns]);
        dispatch(pageLoadEnd());
      });
    }
  }, [selectedDisplayColumns]);

  const data = {
    tableColumns: [...tableColumns],
    tableData: record.records,
  };

  const ExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="btn btn-secondary mt-2" onClick={handleClick}>
          Export
        </button>
      </div>
    );
  };

  return (
    <>
      <DashboardLayout
        navbar={<Navbar headerTitle="DELIVERY REPORT" show={false} />}
      >
        <>
          {/* {record.records ? ( */}
          <InfiniteScroll
            loadMore={fetchMoreData}
            hasMore={record.hasMore}
            isLoading={infiniteLoad}
            loading={<RecordsSpinner />}
            noMore={<RecordsBadge recordTypeLabel="records" />}
            initialLoad={false}
          >
            <ToolkitProvider
              keyField="id"
              data={data.tableData}
              columns={[...data.tableColumns]}
              exportCSV={{ onlyExportFiltered: true, exportAll: false }}
            >
              {(props) => (
                // <Container fluid className="p-0">
                <Card>
                  <CardHeader>
                    <div>
                      <div className="float-left">
                        <h2>
                          Showing {record.records?.length || 0} of{" "}
                          {record.totalItems || 0} Waves
                        </h2>
                      </div>
                      <Row className="justify-content-end">
                        <button
                          className="btn btn-secondary mt-2 mr-2"
                          onClick={() => {
                            openSelectColumns(!selectColumns);
                            setResetDisplayCols(selectedTempDisplayColumns);
                          }}
                        >
                          Select Columns to display
                        </button>
                        <ExportCSV {...props.csvProps} />
                        <button
                          className="btn btn-secondary mt-2 ml-2"
                          onClick={() => loadAllFinances()}
                        >
                          Load all data
                        </button>
                      </Row>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4">
                    {data.tableColumns && data.tableColumns.length ? (
                      <BootstrapTable
                        classes="table-responsive"
                        {...props.baseProps}
                        bootstrap4
                        bordered={true}
                        striped
                        hover
                        condensed
                        filter={filterFactory()}
                      />
                    ) : null}
                  </CardBody>
                </Card>
                //</Container>
              )}
            </ToolkitProvider>
          </InfiniteScroll>
        </>
        {/* ) : null} */}
        <Modal
          toggle={() => openSelectColumns(!selectColumns)}
          isOpen={selectColumns}
        >
          <ModalHeader toggle={() => openSelectColumns(!selectColumns)}>
            Select Columns to display
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-end">
              <a
                className="select-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTempDisplayColumns([...allColumns]);
                }}
              >
                Select all
              </a>
              <a
                className="ml-2 mr-4 select-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTempDisplayColumns([]);
                }}
              >
                Deselect all
              </a>
            </Row>
            {allColumns.map((ac, index) => (
              <Col lg="6" className="d-inline-flex">
                <span>
                  <input
                    id={`column_${index}`}
                    type="checkbox"
                    checked={_.includes(selectedTempDisplayColumns, ac)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTempDisplayColumns([
                          ...selectedTempDisplayColumns,
                          ac,
                        ]);
                      } else {
                        setSelectedTempDisplayColumns([
                          ...selectedTempDisplayColumns.filter(
                            (sdc) => sdc != ac
                          ),
                        ]);
                      }
                    }}
                  />
                  <label className="ml-2 pointer" for={`column_${index}`}>
                    {ac}
                  </label>
                </span>
              </Col>
            ))}
          </ModalBody>
          <ModalFooter>
            <Row>
              <Button
                color="secondary"
                size="sm"
                onClick={() => {
                  openSelectColumns(!selectColumns);
                  setSelectedTempDisplayColumns([...resetDisplayCols]);
                  setResetDisplayCols([]);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                size="sm"
                className="ml-2"
                onClick={() => {
                  setSelectedDisplayColumns([...selectedTempDisplayColumns]);
                  openSelectColumns(!selectColumns);
                  // setSelectedTempDisplayColumns([])
                }}
              >
                Confirm
              </Button>
            </Row>
          </ModalFooter>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default DeliveryReport;
