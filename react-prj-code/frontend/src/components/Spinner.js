import React from "react";
import "./Spinner.css";

const Spinner = (props) => {
  let styles = {};
  let parentStyles = {};

  switch (props.size) {
    case "small":
      styles = {
        width: "20px",
        height: "20px",
        margin: "1px",
        border: "4px solid #fff",
        borderColor: "#3A89FF transparent transparent transparent",
      };
      if (props.color) {
        styles.borderColor = `${props.color} transparent transparent transparent`;
      }
      parentStyles = {
        width: "15px",
        height: "15px",
      };
      break;

    default:
      styles = {
        width: "64px",
        height: "64px",
        margin: "8px",
        border: "8px solid #fff",
        borderColor: "#3A89FF transparent transparent transparent",
      };
      if (props.color) {
        styles.borderColor = `${props.color} transparent transparent transparent`;
      }
      parentStyles = {
        paddingTop: "20vh",
      };
      break;
  }
  return props.size === "small" ? (
    <div className="lds-ring" style={parentStyles}>
      <div style={styles}></div>
      <div style={styles}></div>
      <div style={styles}></div>
      <div style={styles}></div>
    </div>
  ) : (
    <div className="text-center mt-4" style={parentStyles}>
      <div className="lds-ring">
        <div style={styles}></div>
        <div style={styles}></div>
        <div style={styles}></div>
        <div style={styles}></div>
      </div>
    </div>
  );
};

export default Spinner;
