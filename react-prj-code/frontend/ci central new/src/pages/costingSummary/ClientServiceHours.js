import React from "react";
import { Table, Card, CardBody } from "reactstrap";

const ClientServiceHours = () => {
  const rows = [1, 2, 3];
  return (
    <React.Fragment>
      <Card>
        <h1>CLIENT SERVICE HOURS</h1>
        <CardBody>
          <Table responsive hover striped bordered={true}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Wave Number</th>
                <th scope="col">Wave Name</th>
                <th scope="col">Executive Director Hours</th>
                <th scope="col">Director Hours</th>
                <th scope="col">Associate Director Hours</th>
                <th scope="col">Senior Manager Hours</th>
                <th scope="col">Manager Hours</th>
                <th scope="col">Senior Executive Hours</th>
                <th scope="col">Executive Hours</th>
                <th scope="col">Data Science Hours</th>
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
                    <td>Cell</td>
                  </tr>
                );
              })}

              <tr>
                <th scope="row">TOTAL HOURS BY BAND</th>
                <td>Cell</td>
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
              <tr>
                <th scope="row">TOTAL OVERALL HOURS</th>
                <td>Cell</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default React.memo(ClientServiceHours);
