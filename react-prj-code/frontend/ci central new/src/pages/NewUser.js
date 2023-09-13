import axios from "../axios-setup";
import React from "react";

function sfAuth() {
  const opportunityNumber = "OP0000576681";
  const URL = "/salesforce/" + opportunityNumber;

  const config = {
    headers: { "auth-token": localStorage.getItem("auth-token") },
  };

  axios
    .get(URL, config)
    .then((res) => {
      // console.log(res.data);
      return res.status;
    })
    .catch((err) => {
      console.log(err);
    });
}

const Test = (props) => {
  let params = sfAuth();
  return <p>{params}</p>;
};

export default Test;
