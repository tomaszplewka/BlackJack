import React from "react";
import Btn from "../btn/Btn";

import LocalStorage from "../modules/LocalStorage";

const TopResults = ({ cb }) => {
  const results = LocalStorage.getFromLS("results");
  const renderedResults = results ? (
    results.results.map((result, index) => {
      return <li key={index}>{`${index + 1}. ${result}`}</li>;
    })
  ) : (
    <p>NO RESULTS TO SHOW</p>
  );
  return (
    <div className="top-results">
      <div className="btn-wrapper">
        <Btn className="control-btn">
          <span onClick={() => cb(false)}>go back</span>
        </Btn>
      </div>
      <ul className="results-wrapper">{renderedResults}</ul>
    </div>
  );
};

export default TopResults;
