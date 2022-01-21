import React from "react";
import Btn from "../btn/Btn";

const LoadedRounds = ({ cb, gameState }) => {
  const onBtnClick = (e) => {
    console.log(e.target.getAttribute("data-key"));
  };

  const renderedRounds = gameState.map((round, index) => {
    return (
      <Btn key={index + 1} className="btn">
        <span
          data-key={index + 1}
          onClick={(e) => {
            onBtnClick(e);
          }}
        >{`Round ${index + 1}`}</span>
      </Btn>
    );
  });

  return (
    <div className="loaded-rounds">
      <div className="btn-wrapper">
        <Btn className="control-btn">
          <span onClick={() => cb(false)}>go back</span>
        </Btn>
      </div>
      <ul className="results-wrapper">{renderedRounds}</ul>
    </div>
  );
};

export default LoadedRounds;
