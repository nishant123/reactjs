import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export const ModalGeneric = ({
  isOpen,
  toggle,
  header,
  body,
  footer,
  backdrop,
  keyboard,
  headerNoToggle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      backdrop={backdrop}
      keyboard={keyboard}
      size="md"
    >
      <ModalHeader toggle={headerNoToggle ? null : toggle}>
        {header}
      </ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};
