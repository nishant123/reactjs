import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import React from "react";

const DeleteModal = ({ show, toggle, onSubmit, user }) => {
  return (
    <Modal isOpen={show} toggle={toggle} centered={true} fade={false}>
      <ModalHeader toggle={toggle}>Delete User</ModalHeader>
      <ModalBody>
        <strong>{user.Email}</strong> is about to be deleted. Are you sure you
        want to proceed?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          No
        </Button>
        <Button color="primary" onClick={onSubmit}>
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
