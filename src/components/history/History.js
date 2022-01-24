import React, { useState } from "react";
import Btn from "../btn/Btn";

import "./History.css";

const History = ({ cb, gameState, setGameState }) => {
  const [tempGameState] = useState(gameState);
  const renderedRounds = tempGameState
    .slice(0, tempGameState.length - 1)
    .map((round, index) => {
      return (
        <Btn key={index + 1} className="btn">
          <span data-key={index + 1} onClick={(e) => onBtnClick(e)}>{`Round ${
            index + 1
          }`}</span>
        </Btn>
      );
    });

  const onBtnClick = (e) => {
    const currRound = e.target.getAttribute("data-key");
    // Set game state to chosen round
    setGameState(() => {
      return [
        {
          ...tempGameState[currRound - 1],
        },
      ];
    });
  };

  const onGoBackClick = (e) => {
    // Close history mode
    cb(false);
    // Restore game's state
    setGameState(tempGameState);
  };

  return (
    <div className="game-history">
      <div className="go-back-wrapper">
        <Btn className="control-btn">
          <span onClick={(e) => onGoBackClick(e)}>go back</span>
        </Btn>
      </div>
      <div className="game-history-wrapper">
        {tempGameState.length === 1 ||
        !tempGameState[tempGameState.length - 2].isRoundFinished ? (
          <p>NO HISTORY TO SHOW</p>
        ) : (
          renderedRounds
        )}
      </div>
    </div>
  );
};

export default History;
