import React from "react";
import "./Btn.css";

const Btn = ({ id, className, children }) => {
  return (
    <button id={id} className={className}>
      {children}
    </button>
  );
};

export default Btn;
