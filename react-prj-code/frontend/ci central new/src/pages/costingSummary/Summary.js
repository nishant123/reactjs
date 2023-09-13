import { Container } from "reactstrap";
import React from "react";
import ProjectDetails from "./ProjectDetails";
import OnlineSampleSpecs from "./MethodologyPanels/OnlineSampleSpecs";
import OfflineSampleSpecs from "./MethodologyPanels/OfflineSampleSpecs";
import CATISampleSpecs from "./MethodologyPanels/CATISampleSpecs";
import QualSampleSpecs from "./MethodologyPanels/QualSampleSpecs";
import OperationResources from "./OperationResources";
import ClientServiceHours from "./ClientServiceHours";
import CostBreakdown from "./CostBreakdown";
import ProfitabilityReview from "./ProfitabilityReview";
import PriceToClientApproval from "./PriceToClientApproval";

const Summary = () => {
  return (
    <Container>
      <h1>COSTING SUMMARY</h1>
      <ProjectDetails></ProjectDetails>
      <OnlineSampleSpecs></OnlineSampleSpecs>
      <OfflineSampleSpecs></OfflineSampleSpecs>
      <CATISampleSpecs></CATISampleSpecs>
      <QualSampleSpecs></QualSampleSpecs>
      <OperationResources></OperationResources>
      <ClientServiceHours></ClientServiceHours>
      <CostBreakdown></CostBreakdown>
      <ProfitabilityReview></ProfitabilityReview>
      <PriceToClientApproval></PriceToClientApproval>
    </Container>
  );
};

export default Summary;
