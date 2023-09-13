import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import Select from "react-select";

const ProjectOverview = ({ project, costingSPOCs, updateProject }) => {
  return (
    <>
      <FormGroup>
        <Label className="h5">Project Background</Label>
        <Input
          id="ProjectBackground"
          type="textarea"
          value={project.ProjectBackground ?? ""}
          onChange={(e) => updateProject({ ProjectBackground: e.target.value })}
        />
      </FormGroup>
      <FormGroup>
        <Label className="h5">Research Objectives</Label>
        <Input
          id="ResearchObjectives"
          type="textarea"
          value={project.ResearchObjectives ?? ""}
          onChange={(e) =>
            updateProject({ ResearchObjectives: e.target.value })
          }
        />
      </FormGroup>
      {/* <FormGroup>
        <Label className="h5">Lead Costing SPOC/HUB</Label>
        <Input
          id="LeadCostingSPOC"
          type="select"
          name="LeadCostingSPOC"
          value={project.LeadCostingSPOC ?? ""}
          onChange={(e) => updateProject({ LeadCostingSPOC: e.target.value })}
        >
          <option value="">Please select an option</option>
          {costingSPOCs.map((item) => {
            return <option value={item.Email}>{item.Email}</option>;
          })}
        </Input>
      </FormGroup> */}
      {/* <FormGroup>
        <Label>Request Date</Label>
        <Input
          id="requestDate"
          type="datetime"
          value={project.RequestDate ?? ""}
          onChange={(e) =>
            updateProject({ RequestDate: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label>Response Needed By</Label>
        <Input
          id="responseNeededBy"
          type="datetime"
          value={project.ResponseNeededBy ?? ""}
          onChange={(e) =>
            updateProject({ ResponseNeededBy: e.target.value })
          }
        />
      </FormGroup> */}
    </>
  );
};

export default React.memo(ProjectOverview);
