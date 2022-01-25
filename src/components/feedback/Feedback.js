import React from "react";
import "./Feedback.css";

const Feedback = ({ gameState }) => {
  const currRound = gameState[gameState.length - 1];
  return (
    <div className="feedback-wrapper">
      <div>
        <div className="chips">{currRound.bet ?? ""}</div>
      </div>
      <div className="feedback-content">{currRound.message}</div>
      <div>
        <div className="card-pile-wrapper">
          <div className="card card-pile"></div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
