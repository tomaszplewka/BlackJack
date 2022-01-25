import React from "react";

const Balance = ({ balance }) => {
  return (
    <div className="balance">
      <h2 className="header-button-like">{balance}</h2>
    </div>
  );
};

export default Balance;
