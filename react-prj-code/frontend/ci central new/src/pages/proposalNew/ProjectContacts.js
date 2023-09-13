import React, { useEffect } from "react";
import { Label, CustomInput, Row, Col } from "reactstrap";
import Select from "react-select";

const ProjectContacts = ({
  user,
  project,
  updateProject,
  primaryCSContacts,
  otherInternalContacts,
  fieldInvalidation,
}) => {
  useEffect(() => {
    if (!project.ProposalOwnerEmail.value) {
      project.ProposalOwnerEmail = updateProject({
        ProposalOwnerEmail: {
          value: user.Email,
          label: user.Email,
        },
      });
    }
  }, [project]);
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Row>
            <Col>
              <Label className="h5">Primary Client Service Contact</Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Select
                className="react-select-container mb-3 lg-12 md-12"
                classNamePrefix="react-select"
                options={primaryCSContacts.map((item) => {
                  return { value: item.Email, label: item.Email };
                })}
                isSearchable
                value={project.ProposalOwnerEmail}
                onChange={(e) => {
                  updateProject({ ProposalOwnerEmail: e });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomInput
                type="switch"
                id="isSFContactSyncPaused"
                name="customSwitch"
                label="Pause Salesforce Contacts Sync"
                className="h5"
                // defaultChecked={project.IsSFContactSyncPaused}
                checked={project.IsSFContactSyncPaused}
                onChange={(e) => {
                  updateProject({
                    IsSFContactSyncPaused: !project.IsSFContactSyncPaused,
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CustomInput
                type="switch"
                id="isRestrictedProject"
                name="customSwitch"
                label="Restrict Project Access"
                className="h5"
                // defaultChecked={project.IsRestrictedProject}
                checked={project.IsRestrictedProject}
                onChange={(e) => {
                  updateProject({
                    IsRestrictedProject: !project.IsRestrictedProject,
                  });
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Label className="h5">Other Project Team Contacts</Label>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={otherInternalContacts.map((item) => {
              return { value: item.Email, label: item.Email };
            })}
            isMulti
            isSearchable
            value={project.OtherProjectTeamContacts}
            onChange={(e) => updateProject({ OtherProjectTeamContacts: e })}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ProjectContacts;
