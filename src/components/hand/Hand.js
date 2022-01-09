import React from "react";
import "./Hand.css";
import Card from "../card/Card";

const Hand = ({ player, hand, value }) => {
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
          <h2 className="hand-name">{player}</h2>
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
