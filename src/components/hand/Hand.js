import React from "react";
import Card from "../card/Card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faUser, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import "./Hand.css";
library.add(fab, faUser, faUserNinja);

const Hand = ({ appState, gameState, player }) => {
  const { displayName, photoUrl } = appState;
  const hand =
    player === "player"
      ? gameState[gameState.length - 1].hands.playerHand
      : gameState[gameState.length - 1].hands.dealerHand;
  const value =
    player === "player"
      ? gameState[gameState.length - 1].handValue.playerValue
      : gameState[gameState.length - 1].handValue.dealerValue;
  const renderedHand =
    hand === null
      ? []
      : hand.map(({ card, back }, index) => {
          return (
            <Card
              key={index}
              card={card.image}
              back={back}
              className="with-animation"
            />
          );
        });

  return (
    <div className={`hand-wrapper ${player === "dealer" ? "reverse" : ""}`}>
      <div className="hand-content">
        <div className="hand-info">
          {photoUrl && player === "player" ? (
            <img src={photoUrl} alt="" />
          ) : player === "dealer" ? (
            <span>
              <FontAwesomeIcon icon="user-ninja" inverse />
            </span>
          ) : (
            <span>
              <FontAwesomeIcon icon="user" inverse />
            </span>
          )}
          <h2 className="hand-name">
            {player === "player" ? displayName ?? "guest" : "dealer"}
          </h2>
          {renderedHand.length ? <h3 className="hand-value">{value}</h3> : ""}
        </div>
      </div>
      <div className={`card-wrapper ${player}-hand-card-wrapper`}>
        {renderedHand.length ? (
          renderedHand
        ) : (
          <>
            <Card card={[]} back={false} />
            <Card card={[]} back={false} />
          </>
        )}
      </div>
    </div>
  );
};

export default Hand;
