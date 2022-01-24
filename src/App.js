import React, { useState, useEffect } from "react";
import { getDeck } from "./components/modules/Api";
import Firebase from "./components/modules/Firebase";
import Auth from "./components/auth/Auth";
import Table from "./components/table/Table";
import Loader from "./components/loader/Loader";

import "./App.css";

const App = () => {
  const [appState, setAppState] = useState({
    deckId: "",
    showLoader: false,
    displayName: null,
    photoUrl: null,
    userId: "",
    getNewDeck: false,
    isUserLoggedIn: false,
    gameState: null,
  });

  useEffect(() => {
    if (appState.getNewDeck) {
      // Get new deck
      setTimeout(() => {
        getDeck(setAppState);
      }, 1500);
    }
  }, [appState]);

  const onAuthClick = async () => {
    // Show loader
    setAppState((prevState) => ({
      ...prevState,
      showLoader: true,
    }));
  };

  console.log("RENDER");

  return (
    <section>
      {appState.isUserLoggedIn && (appState.deckId || appState.gameState) ? (
        <Table
          appState={appState}
          setAppState={setAppState}
          Firebase={Firebase}
        />
      ) : (
        <Auth
          onAuthClick={onAuthClick}
          setAppState={setAppState}
          Firebase={Firebase}
        />
      )}
      {appState.showLoader ? <Loader /> : null}
    </section>
  );
};

export default App;
