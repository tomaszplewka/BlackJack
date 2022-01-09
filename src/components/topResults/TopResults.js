import React from "react";
import Btn from "../btn/Btn";

import LocalStorage from "../modules/LocalStorage";

import "./TopResults.css";

const TopResults = ({ cb }) => {
  const results = LocalStorage.getFromLS("results");
  const renderedResults = results ? (
    results.results.map((result, index) => {
      return <li key={index}>{`${index + 1}. ${result}`}</li>;
    })
  ) : (
    <p>No results to show</p>
  );
  return (
    <div className="top-results">
      <div className="btn-wrapper">
        <Btn id="results-go-back" className="control-btn">
          <span onClick={() => cb(false)}>go back</span>
        </Btn>
      </div>
      <ul className="results-wrapper">{renderedResults}</ul>
    </div>
  );
};

export default TopResults;
