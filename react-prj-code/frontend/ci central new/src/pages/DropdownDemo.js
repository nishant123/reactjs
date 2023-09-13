import React, { useState, setState } from "react";
import { Input } from "reactstrap";

const DropdownDemo = () => {
  const options = useState({
    country: [
      { code: "NZ", value: "New Zealand" },
      { code: "AU", value: "Australia" },
    ],
  });

  const funcOptions = (options) => {
    //logic

    return;
  };

  return (
    <Input
      type="select"
      id="questionnaireComplexity"
      name="questionnaireComplexity"
      className="mb-3"
      defaultValue=""
    >
      {funcOptions().map((option) => {})}
      <option value="" default>
        {" "}
        Please select...{" "}
      </option>
      <option> No Programming Required </option>
      <option> Easy </option>
      <option> Average </option>
      <option> Complex </option>
    </Input>
  );
};

export default DropdownDemo;
