import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const [currentConversionRate, setCurrentConversionRate] = useState(1);
  const [currentCurrencyUnit, setCurrentCurrencyUnit] = useState("USD");
  const costing = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  useEffect(() => {
    if (
      costing &&
      costing.ProfileSetting &&
      costing.ProfileSetting.CurrenciesData
    ) {
      let cvalues = costing?.CostInputCurrency?.split("-");
      let currencyUnit = _.last(cvalues);
      let countryCode = _.head(cvalues);
      let conversionUnit = _.head(
        costing?.ProfileSetting?.CurrenciesData?.filter(
          (cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
        )
      )?.ConversionRateToLocal;
      setCurrentConversionRate(conversionUnit);
      setCurrentCurrencyUnit(currencyUnit);
    }
  }, [costing]);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({
    width: "40px",
    alignItems: "start",
    placeContent: "center",
    flexDirection: "column",
    display: "flex",
    position: "fixed",
    right: "0px",
    top: "110px",
    height: "100%",
    zIndex: "99999",
    transitionDuration: "0.2s",
    // whiteSpace:"nowrap"
  });

  const toggle = () => {
    if (open) {
      setStyle({
        ...style,
        width: "40px",
        background: null,
        boxShadow: null,
        border: null,
      });
      setOpen(false);
    } else {
      setStyle({
        ...style,
        width: "400px",
        background: "white",
        boxShadow: "1px 10px 11px 8px rgb(0 0 0 / 8%)",
        borderLeft: "1px solid #80808057",
        borderTop: "1px solid #80808057",
      });
      setOpen(true);
    }
  };

  const finalCosts = {
    InternalOperationsCosts: {
      title: "Internal Operations Costs",
      properties: {
        CostIntOpsSurveyProgramming: "Survey Programming",
        CostIntOpsDataProcessing: "Data Processing",
        CostIntOpsCharting: "Charting",
        CostIntOpsVerbatimCoding: "Verbatim Coding",
        CostIntOpsDataEntry: "Data Entry",
        CostIntOpsPM: "Project Management",
        CostIntOpsAdditionalOperationsSupport:
          "Additional Operations PM Support",
        CostIntOpsDataScience: "Data Science",
        CostIntOpsOtherDataPreparation: "Other Data Preparation",
      },
    },
    ExternalOperationsCosts: {
      title: "External Operations Costs",
      properties: {
        CostExtOpsOnlineSample: "Online Sample",
        CostExtOpsHosting: "Online Hosting",
        CostExtOpsSurveyProgramming: "Survey Programming",
        CostExtOpsDataProcessing: "Data Processing",
        CostExtOpsCharting: "Charting",
        CostExtOpsVerbatimCoding: "Verbatim Coding",
        CostExtOpsDataEntry: "Data Entry",
        CostExtOpsTextAnalytics: "Text Analytics",
      },
    },
    InternalCommercialCosts: {
      title: "Internal Commercial Costs",
      properties: {
        CostIntCommExecDirector: "Executive Director",
        CostIntCommDirector: "Director",
        CostIntCommAssociateDirector: "Associate Director",
        CostIntCommSeniorManager: "Senior Manager",
        CostIntCommManager: "Manager",
        CostIntCommSeniorExecutive: "Senior Executive",
        CostIntCommExecutive: "Executive",
        CostIntCommDataScience: "Data Science",
      },
    },
  };
  return (
    <div style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
          width: "100%",
          alignItems: "center",
        }}
      >
        <button style={{ height: "30px" }} onClick={() => toggle()}>
          {open ? ">" : "<"}
          {/* <span>
		  // TODO: style this
            <FontAwesomeIcon
              title="Mini Summary"
              // className="align-middle mr-2"
              icon={faFileInvoiceDollar}
              fixedWidth
              style={{ cursor: "pointer" }}
            />
          </span> */}
        </button>
        <div style={{ height: "100%", width: "100%", padding: "20px" }}>
          <h2>Mini Cost Summary</h2>

          {Object.keys(finalCosts).filter(
            (fc) =>
              Object.keys(finalCosts[fc].properties).filter(
                (prop) => costing[prop]
              ).length
          ).length ? (
            Object.keys(finalCosts).map((fc) => {
              return Object.keys(finalCosts[fc].properties).filter(
                (prop) => costing[prop]
              ).length ? (
                <div className="mb-2">
                  <h5>{finalCosts[fc].title}</h5>
                  {Object.keys(finalCosts[fc].properties).map((prop) => {
                    return costing[prop] ? (
                      <Row className="m-0">
                        <strong>{finalCosts[fc].properties[prop]} :</strong>{" "}
                        <span className="ml-2">
                          {_.round(costing[prop] * currentConversionRate, 2)}{" "}
                          {currentCurrencyUnit}
                        </span>
                      </Row>
                    ) : null;
                  })}
                </div>
              ) : null;
            })
          ) : (
            <Row className="m-0">
              <strong>No Mini Cost Summary found</strong>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
