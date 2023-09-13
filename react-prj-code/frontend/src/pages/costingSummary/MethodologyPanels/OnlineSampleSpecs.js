import React from "react";
import { Card, Table } from "reactstrap";

const OnlineSampleSpecs = () => {
  const rows = [1, 2, 3];
  return (
    <React.Fragment>
      <h1>Online Sample Specs</h1>

      <Card>
        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Country</th>
              <th scope="col">LOI (mins)</th>
              <th scope="col">IR (%)</th>
              <th scope="col">Total Sample (n=)</th>
              <th scope="col">External Sample Providers</th>
              <th scope="col">Nielsen Panels</th>
              <th scope="col">Client Supplied</th>
              <th scope="col">Other Sample</th>
              <th scope="col">Online Not Applicable</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((val, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{val}</th>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </React.Fragment>
  );
};

export default React.memo(OnlineSampleSpecs);
