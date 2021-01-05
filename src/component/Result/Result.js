import React from "react";
import { Table } from "react-bootstrap";

const Result = (props) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Image</th>
          <th>Label</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {props.childdataList.map((data, index) => {
          return (
            <tr key={index}>
              <td>
                <img src={data.recipenameimg} style={{ width: "100px" }}></img>
              </td>
              <td>{data.recipename}</td>
              <td>{data.source}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
export default Result;
