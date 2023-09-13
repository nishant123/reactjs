import React from "react";
import { Spinner } from "reactstrap";

const RecordsSpinner = () => {
  return (
    <div className={"d-flex justify-content-center mb-1"}>
      <Spinner size="md" color="primary" />
    </div>
  );
};

export default RecordsSpinner;
