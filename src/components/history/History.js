import React, { useState } from "react";
import Btn from "../btn/Btn";

import "./History.css";

const History = ({ cb, gameState, setGameState }) => {
  const renderedRounds = gameState.map((round, index) => {
    return (
      <Btn key={index + 1} className="btn">
        <span data-key={index + 1} onClick={(e) => onBtnClick(e)}>{`Round ${
          index + 1
        }`}</span>
      </Btn>
    );
  });

  const onBtnClick = (e) => {
    console.log(e.target.getAttribute("data-key"));
    const currRound = e.target.getAttribute("data-key");
    setGameState((prevState) => {
      return [
        ...prevState,
        {
          ...prevState[currRound - 1],
        },
      ];
    });
  };

  return (
    <div className="game-history">
      <div className="go-back-wrapper">
        <Btn className="control-btn">
          <span onClick={() => cb(false)}>go back</span>
        </Btn>
      </div>
      <div className="game-history-wrapper">
        {gameState.length === 1 ? "NO HISTORY TO SHOW" : renderedRounds}
      </div>
    </div>
  );
};

export default History;
