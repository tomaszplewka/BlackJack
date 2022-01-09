import React from "react";
import "./Round.css";

const Round = ({ gameState }) => {
  return (
    <div className="round-wrapper">
      <h2>Round {gameState[gameState.length - 1].round}</h2>
    </div>
  );
};

export default Round;
