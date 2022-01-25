import React from "react";
import "./Round.css";

const Round = ({ round }) => {
  return (
    <div className="round-wrapper">
      <h2 className="header-button-like">Round {round}</h2>
    </div>
  );
};

export default Round;
