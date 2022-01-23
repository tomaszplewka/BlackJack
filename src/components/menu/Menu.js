import React, { useState } from "react";
import Btn from "../btn/Btn";
import Loader from "../loader/Loader";
import TopResults from "../topResults/TopResults";
import History from "../history/History";
import LoadedRounds from "../loadedRounds/LoadedRounds";

import "./Menu.css";

const Menu = ({
  gameState,
  setGameState,
  setAppState,
  Firebase,
  appState,
  setIsHistoryMode,
  isHistoryMode,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTopResultsOpen, setIsTopResultsOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const onMenuClick = () => {
    // Open / close menu
    setIsMenuOpen(!isMenuOpen);
    // Close TopResults and / or Load
    setTimeout(() => {
      if (isTopResultsOpen) {
        setIsTopResultsOpen(false);
      } else if (isLoadOpen) {
        setIsLoadOpen(false);
      }
    }, 300);
  };

  const onOptionClick = (e) => {
    const id = e.target.parentElement.id;
    switch (id) {
      case "top-results":
        setIsTopResultsOpen(!isTopResultsOpen);
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

  const onSignOutClick = (e) => {
    // Show loader
    setShowLoader(true);
    // Save game

    // Log out
    setTimeout(() => {
      Firebase.logOut(setAppState);
    }, 1500);
  };

  const onRestartClick = (e) => {
    // Show loader
    setShowLoader(true);
    setIsMenuOpen(!isMenuOpen);
    // Restart game
    setGameState((prevState) => [
      {
        ...prevState[prevState.length - 1],
        round: null,
        balance: 1000,
        bet: null,
        hands: {
          playerHand: null,
          dealerHand: null,
        },
        handValue: {
          playerValue: null,
          dealerValue: null,
        },
        lastMove: null,
        isRoundFinished: null,
        isPlayerActive: null,
        message: "Round begins. Place the bet.",
        result: null,
        isGameFinished: false,
      },
    ]);
    // Hide loader
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
  };

  const onSaveClick = (e) => {
    // Show loader
    setShowLoader(true);
    console.log("USER ID: ", appState.userId);
    // Save user's data
    Firebase.storeData(appState.userId, gameState, setShowLoader);
  };

  const onHistoryClick = (e) => {
    console.log("HISTORY MODE");
    setIsMenuOpen(false);
    setIsHistoryMode(true);
  };

  console.log("MENU");

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
      {isHistoryMode ? (
        <History
          cb={setIsHistoryMode}
          gameState={gameState}
          setGameState={setGameState}
        />
      ) : null}
      <section className={`options-wrapper ${isMenuOpen ? "" : "roll-up"}`}>
        <div className="options">
          <Btn id="top-results" className="btn">
            <span onClick={(e) => onOptionClick(e)}>top results</span>
          </Btn>
          {isTopResultsOpen ? <TopResults cb={setIsTopResultsOpen} /> : null}
          <Btn id="history" className="btn">
            <span onClick={(e) => onHistoryClick(e)}>history</span>
          </Btn>
          <Btn id="save" className="btn">
            <span
              onClick={(e) => {
                onSaveClick(e);
              }}
            >
              save
            </span>
          </Btn>
          {/* <div className="save-wrapper roll-up"></div> */}
          <Btn id="load" className="btn">
            <span onClick={(e) => onOptionClick(e)}>load</span>
          </Btn>
          {isLoadOpen ? (
            <LoadedRounds
              cb={setIsLoadOpen}
              gameState={gameState}
              setGameState={setGameState}
              setIsMenuOpen={setIsMenuOpen}
              setShowLoader={setShowLoader}
              setIsLoadOpen={setIsLoadOpen}
            />
          ) : null}
          <Btn id="restart" className="btn">
            <span onClick={(e) => onRestartClick(e)}>restart</span>
          </Btn>
          <Btn id="sign-out" className="btn">
            <span onClick={(e) => onSignOutClick(e)}>sign-out</span>
          </Btn>
        </div>
      </section>
      {showLoader ? <Loader /> : null}
    </>
  );
};

export default Menu;
