import React from "react";
import { ModalGeneric } from "./ModalGeneric";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

const ModalPostCommission = ({ isOpen, toggle }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const app = useSelector(({ app }) => app);
  const header = <h4>Project Schedule (EWN)</h4>;
  const body = (
    <>
      <p>
        This project has now been commissioned and all costings are now locked.
      </p>
      <p>
        You are advised to complete project schedule as soon as possible so that
        the relevant teams can be notified to take appropriate action.
      </p>
      <p>
        <strong>Would you like to continue to the Project Schedule now?</strong>
      </p>
    </>
  );
  const footer = (
    <div className="d-flex justify-content-between">
      <Button color="secondary" disabled={app.recordloading} onClick={toggle}>
        Do It Later
      </Button>
      <Button
        color="primary"
        className="ml-2"
        onClick={() => {
          toggle();
          history.push("/schedule");
        }}
        disabled={app.recordloading}
      >
        Go To Schedule
      </Button>
    </div>
  );

  return (
    <ModalGeneric
      isOpen={isOpen.ModalPostCommission}
      toggle={toggle}
      header={header}
      body={body}
      footer={footer}
    />
  );
};

export default ModalPostCommission;
