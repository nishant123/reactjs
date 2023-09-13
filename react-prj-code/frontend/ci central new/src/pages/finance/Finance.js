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

const FinanceDashboard = () => {
  const dispatch = useDispatch();
  const [infiniteLoad, setInfiniteLoad] = useState(false);
  const comissioningCountries =
    useSelector(({ codeLabels }) => codeLabels.CommissioningCountriesOptions) ||
    [];
  const fieldingCountries =
    useSelector(({ codeLabels }) => codeLabels.FieldingCountriesOptions) || [];
  const verticals =
    useSelector(({ codeLabels }) => codeLabels.VerticalOptions) || [];
  const methodology =
    useSelector(({ codeLabels }) => codeLabels.MethodologyOptions) || [];
  const [record, setRecord] = useState({
    records: [],
    hasMore: true,
    totalItems: null,
  });
  const [selectColumns, openSelectColumns] = useState(false);
  const [allColumns] = useState([
    "ID",
    "Project ID",
    "Project Name",
    "Wave Number",
    "Wave Name",
    "WBS Number",
    "Opportunity Number",
    "Commissioning Country",
    "Fielding Countries",
    "Industry",
    "Practice Area",
    "Product Description",
    "SF Probability",
    "Research Type",
    "Methodology",
    "Multi-Country",
    "Syndicated",
    "Project Status",
    "Tracker",
    "Total Waves",
    "Price To Client (USD)",
    "Total External Operations Cost",
    "OOP%",
    "CM%",
    "Field End Actual",
    "Field End",
    "Field Start Actual",
    "Field Start",
    "Reports Due",
    "Reports Due Actual",
    "Schedule Notes",
    "Status Notes",
  ]);
  const [selectedDisplayColumns, setSelectedDisplayColumns] = useState(
    allColumns
  );
  const [selectedTempDisplayColumns, setSelectedTempDisplayColumns] = useState(
    allColumns
  );
  const [resetDisplayCols, setResetDisplayCols] = useState([]);

  useEffect(() => {
    console.log("initial call");
    dispatch(pageLoadStart());
    axios
      .post("/reports/finance/waves/all?limit=30")
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
  const loadAllFinances = () => {
    dispatch(pageLoadStart());
    axios
      .post("/reports/finance/waves/all")
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
        "/reports/finance/waves/all?limit=30&offset=" + record.records.length
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
  const getContractDetails = (data, value) => {
    let output = [];
    if (data) {
      switch (value) {
        case "industry":
          for (let contract of data) {
            output.push(contract.Industry);
          }
          return output.join(",");
        case "practiceArea":
          for (let contract of data) {
            for (let oppLine of contract.opportunityLineItemDetails) {
              output.push(oppLine.PracticeArea);
            }
          }
          return output.join(",");
        case "opNumber":
          for (let contract of data) {
            output.push(contract.OpportunityNumber);
          }
          return output.join(",");
        case "prodDesc":
          for (let contract of data) {
            for (let oppLine of contract.opportunityLineItemDetails) {
              output.push(oppLine.ProductDescription);
            }
          }
          return output.join(",");
        // case "WBSNumber":
        //   for (let contract of data) {
        //     for (let oppLine of contract.opportunityLineItemDetails) {
        //       output.push(oppLine.WBSNumber);
        //     }
        //   }
        //   return output.join(",");
        case "method":
          return getCommaSeperatedData(methodology, data);
        case "sfProb":
          let res;
          for (let contract of data) {
            res = contract.Probability;
          }
          return res;
        default:
          return "";
      }
    } else return "";
  };
  const formattedDate = (date, flag) => {
    if (flag === false) return "not required";
    if (date) return date.substring(0, 10);
    else return "not available";
  };
  const formattedPrec = (data) => {
    if (data) return (data * 100).toFixed(2) + "%";
    else return "not available";
  };
  const finalColumns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.id}</span>;
      },
      filter: textFilter(),
    },
    {
      dataField: "ProjectId",
      text: "Project ID",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.CostingProfile?.Project?.ProjectId}</span>;
      },
      filter: textFilter(),
    },
    {
      dataField: "ProjectName",
      text: "Project Name",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "WaveNumber",
      text: "Wave Number",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.WaveNumber}</span>;
      },
      filter: textFilter(),
    },
    {
      dataField: "WaveName",
      text: "Wave Name",
      sort: true,
      formatter: (cell, row) => {
        return <span>{row.WaveName}</span>;
      },
      filter: textFilter(),
    },
    {
      dataField: "WBSNumber",
      text: "WBS Number",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "OpportunityNumber",
      text: "Opportunity Number",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "CommissioningCountry",
      text: "Commissioning Country",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "FieldingCountries",
      text: "Fielding Countries",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "Industry",
      text: "Industry",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "PracticeArea",
      text: "Practice Area",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "ProductDescription",
      text: "Product Description",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "SFProbability",
      text: "SF Probability",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "ResearchType",
      text: "Research Type",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "Methodology",
      text: "Methodology",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "IsMultiCountry",
      text: "Multi-Country",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "IsSyndicated",
      text: "Syndicated",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "ProjectStatus",
      text: "Project Status",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "NotesProjectStatus",
      text: "Status Notes",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "IsTracker",
      text: "Tracker",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "NumberOfWaves",
      text: "Total Waves",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "PriceToClient",
      text: "Price To Client (USD)",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "CostTotalExternalOperations",
      text: "Total External Operations Cost",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "OutOfPocketCostPercent",
      text: "OOP%",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "ContributionMarginPercent",
      text: "CM%",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "FieldStart",
      text: "Field Start",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "DateFieldStartActual",
      text: "Field Start Actual",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "DateFieldEnd",
      text: "Field End",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "DateFieldEndActual",
      text: "Field End Actual",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "DateFinalReport",
      text: "Reports Due",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "DateFinalReportActual",
      text: "Reports Due Actual",
      sort: true,

      filter: textFilter(),
    },
    {
      dataField: "NotesFinance",
      text: "Schedule Notes",
      sort: true,

      filter: textFilter(),
      formatter: (cell, row) => {
        return <span>{row.NotesFinance}</span>;
      },
    },
  ];
  const [tableColumns, setTableColumns] = useState(finalColumns);
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
  const applyLabels = (projects) => {
    let finalProjects = projects.map((proj) => {
      proj.ProductDescription =
        proj.CostingProfile &&
        proj.CostingProfile.Project &&
        proj.CostingProfile.Project.ContractDetails
          ? getContractDetails(
              proj.CostingProfile.Project.ContractDetails,
              "prodDesc"
            )
          : "";

      proj.Methodology =
        proj.CostingProfile && proj.CostingProfile.Methodology
          ? getContractDetails(proj.CostingProfile.Methodology, "method")
          : "";

      proj.WBSNumber =
        // proj.CostingProfile &&
        // proj.CostingProfile.Project &&
        // proj.CostingProfile.Project.ContractDetails
        //   ? getContractDetails(
        //       proj.CostingProfile.Project.ContractDetails,
        //       "WBSNumber"
        //     )
        //   : "";

        proj.CostingProfile?.Project?.ContractDetails?.map((contract) => {
          return contract?.opportunityLineItemDetails
            .map((item) => {
              return item.WBSNumber;
            })
            .filter(
              (item, i, array) =>
                item !== null && item !== "" && array.indexOf(item) === i
            )
            .join(",\n");
        })
          .join(",\n")
          .split(",\n")
          .filter(
            (item, i, array) =>
              item !== null && item !== "" && array.indexOf(item) === i
          )
          .join(",\n");
      proj.OpportunityNumber =
        proj.CostingProfile &&
        proj.CostingProfile.Project &&
        proj.CostingProfile.Project.ContractDetails
          ? getContractDetails(
              proj.CostingProfile.Project.ContractDetails,
              "opNumber"
            )
          : "";
      proj.Industry =
        proj.CostingProfile &&
        proj.CostingProfile.Project &&
        proj.CostingProfile.Project.ContractDetails
          ? getContractDetails(
              proj.CostingProfile.Project.ContractDetails,
              "industry"
            )
          : "";
      proj.PracticeArea =
        proj.CostingProfile &&
        proj.CostingProfile.Project &&
        proj.CostingProfile.Project.ContractDetails
          ? getContractDetails(
              proj.CostingProfile.Project.ContractDetails,
              "practiceArea"
            )
          : "";
      proj.SFProbability =
        proj.CostingProfile &&
        proj.CostingProfile.Project &&
        proj.CostingProfile.Project.ContractDetails
          ? getContractDetails(
              proj.CostingProfile.Project.ContractDetails,
              "sfProb"
            )
          : "";
      proj.IsMultiCountry = proj.CostingProfile?.IsMultiCountry ? "Yes" : "No";
      proj.IsTracker = proj.CostingProfile?.IsTracker ? "Yes" : "No";
      proj.IsSyndicated = proj.CostingProfile?.Project?.IsSyndicated
        ? "Yes"
        : "No";
      proj.NumberOfWaves = proj.CostingProfile?.IsTracker
        ? proj.CostingProfile?.NumberOfWaves
        : "NA";
      proj.PriceToClient =
        proj.CostingProfile && proj.CostingProfile.PriceToClient
          ? proj.CostingProfile.PriceToClient.toFixed(2)
          : "";
      proj.CostTotalExternalOperations =
        proj.CostingProfile && proj.CostingProfile.CostTotalExternalOperations
          ? proj.CostingProfile.CostTotalExternalOperations.toFixed(2)
          : "";
      proj.ContributionMarginPercent =
        proj.CostingProfile && proj.CostingProfile.ContributionMarginPercent
          ? formattedPrec(proj.CostingProfile.ContributionMarginPercent)
          : "";
      proj.OutOfPocketCostPercent =
        proj.CostingProfile && proj.CostingProfile.OutOfPocketCostPercent
          ? formattedPrec(proj.CostingProfile.OutOfPocketCostPercent)
          : "";
      proj.FieldStart = formattedDate(proj.FieldStart, proj.DateFieldworkNA);
      proj.DateFieldStartActual = formattedDate(proj.DateFieldStartActual);
      proj.DateFieldEnd = formattedDate(
        proj.DateFieldEnd,
        proj.DateFieldworkNA
      );
      proj.DateFieldEndActual = formattedDate(proj.DateFieldEndActual);
      proj.DateFinalReportActual = formattedDate(proj.DateFinalReportActual);
      proj.DateFinalReport = formattedDate(
        proj.DateFinalReport,
        proj.DateFinalReportNA
      );
      proj.NotesProjectStatus =
        proj.CostingProfile?.Project?.NotesProjectStatus;
      proj.ProjectStatus = getLabel(
        "ProjectStatusOptions",
        proj.CostingProfile?.Project?.ProjectStatus
      );
      proj.FieldingCountries =
        proj.CostingProfile && proj.CostingProfile.FieldingCountries
          ? getCommaSeperatedData(
              fieldingCountries,
              proj.CostingProfile.FieldingCountries
            )
          : "";
      proj.CommissioningCountry =
        proj.CostingProfile &&
        proj.CostingProfile.Project &&
        proj.CostingProfile.Project.CommissioningCountry
          ? getCommissionCountries(
              proj.CostingProfile.Project.CommissioningCountry
            )
          : "";
      proj.ProjectName = proj.CostingProfile?.Project?.ProjectName;
      proj.ProjectId = proj.CostingProfile?.Project?.ProjectId;
      proj.ResearchType = proj.CostingProfile?.ResearchType;
      return proj;
    });
    return finalProjects;
  };
  const data = {
    tableColumns: [...tableColumns],
    tableData: applyLabels(record.records),
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
        navbar={<Navbar headerTitle="FINANCE REPORTS" show={false} />}
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
                          Load all finance data
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

export default FinanceDashboard;
