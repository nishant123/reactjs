import React from "react";
import { Modal, ModalBody, Spinner } from "reactstrap";

const ModalSpinner = ({ message, show }) => {
  return (
    <Modal isOpen={show} centered={true} fade={false}>
      <ModalBody>
        <div
          className={"d-flex justify-content-center"}
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <Spinner size="md" color="primary" />
          {message ? message : null}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ModalSpinner;
