import React, { useState } from "react";
import Btn from "../btn/Btn";
import TopResults from "../topResults/TopResults";
import History from "../history/History";

import "./Menu.css";

const Menu = ({ gameState }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTopResultsOpen, setIsTopResultsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const onMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onOptionClick = (e) => {
    const id = e.target.parentElement.id;
    switch (id) {
      case "top-results":
        setIsTopResultsOpen(!isTopResultsOpen);
        break;
      case "history":
        setIsHistoryOpen(!isHistoryOpen);
        break;
      case "load":
        setIsLoadOpen(!isLoadOpen);
        break;
      case "sign-in":
        setIsSignInOpen(!isSignInOpen);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div
        className={`menu-wrapper ${isMenuOpen ? "open" : ""}`}
        onClick={onMenuClick}
      >
        <div>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <section className={`options-wrapper ${isMenuOpen ? "" : "roll-up"}`}>
        <div className="options">
          <Btn id="top-results" className="btn">
            <span onClick={(e) => onOptionClick(e)}>top results</span>
          </Btn>
          {isTopResultsOpen ? <TopResults cb={setIsTopResultsOpen} /> : null}
          <Btn id="history" className="btn">
            <span onClick={(e) => onOptionClick(e)}>history</span>
          </Btn>
          {isHistoryOpen ? <History /> : null}
          <Btn id="save" className="btn">
            <span>save</span>
          </Btn>
          {/* <div className="save-wrapper roll-up"></div> */}
          <Btn id="load" className="btn">
            <span onClick={(e) => onOptionClick(e)}>load</span>
          </Btn>
          {/* <div className="load-wrapper roll-up"></div> */}
          <Btn id="restart" className="btn">
            <span>restart</span>
          </Btn>
          <Btn id="sign-out" className="btn">
            <span>sign-out</span>
          </Btn>
        </div>
      </section>
    </>
  );
};

export default Menu;
