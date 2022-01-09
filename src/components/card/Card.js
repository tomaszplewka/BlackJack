import React from "react";
import "./Card.css";

const Card = ({ card, back, className }) => {
  return (
    <div
      className={`card ${className} ${back ? "back" : ""}`}
      style={back ? {} : { backgroundImage: `url(${card})` }}
    ></div>
  );
};

export default Card;
