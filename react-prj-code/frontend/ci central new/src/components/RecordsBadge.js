import React from "react";
import { Badge } from "reactstrap";

const RecordsBadge = (props) => {
  return (
    <div className={"d-flex justify-content-center"}>
      <h6>
        <Badge href="#" color="info">
          All {props.recordTypeLabel} loaded. Back to top ↑
        </Badge>
      </h6>
    </div>
  );
};

export default RecordsBadge;
