import React from "react";
import { ModalGeneric } from "./ModalGeneric";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";

const ModalCommissioning = ({ isOpen, toggle, setIsOpen }) => {
  const dispatch = useDispatch();
  const app = useSelector(({ app }) => app);
  const header = <h4>Warning!</h4>;
  const body = (
    <>
      <p>
        <h4>
          <strong>You are about to commission this project. </strong>
        </h4>
      </p>
      <p>
        <strong>Please note the following before you continue:</strong>
      </p>
      <p>Only one costing profile can be commissioned per project.</p>
      <p>
        Once the costing profile is commissioned, the proposal will be finalized
        and all costing profiles associated to this proposal will be locked.
      </p>
      <p>
        Any changes to the costing profile will require decommissioning of the
        costing before any alterations can be made again. Original will remain
        locked and an editable duplicate will be automatically created after
        providing justification for decommissioning.
      </p>
      <p>
        <em>
          Please ensure all approvals are completed on your final price, all
          external costs are entered, all feasibility checks on latest
          specifications have been completed before continuing.
        </em>
      </p>
      <p>
        <strong>Are you sure you want to commission this project now?</strong>
      </p>
    </>
  );
  const footer = (
    <div className="d-flex justify-content-between">
      <Button color="secondary" disabled={app.recordloading} onClick={toggle}>
        Cancel
      </Button>
      <Button
        color="primary"
        className="ml-2"
        onClick={() => {
          toggle();
          dispatch(
            currentCostingActions.commissionCosting(() => {
              console.log("callback called");
              setIsOpen({ ModalPostCommission: !isOpen.ModalPostCommission });
            })
          );
        }}
        disabled={app.recordloading}
      >
        Commission Project
      </Button>
    </div>
  );

  return (
    <ModalGeneric
      isOpen={isOpen.ModalCommissioning}
      toggle={toggle}
      header={header}
      body={body}
      footer={footer}
    />
  );
};

export default ModalCommissioning;
