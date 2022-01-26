import React, { useState, useEffect } from "react";
import { getDeck } from "./components/modules/Api";
import Firebase from "./components/modules/Firebase";
import Auth from "./components/auth/Auth";
import Table from "./components/table/Table";
import Loader from "./components/loader/Loader";

const App = () => {
  const [initialLoader, setIniitalLoader] = useState(true);
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
    setTimeout(() => {
      setIniitalLoader(false);
      document.body.classList.add("bg-green");
    }, 2000);
  }, []);

  useEffect(() => {
    if (appState.getNewDeck) {
      // Get new deck
      setTimeout(async () => {
        const deckId = await getDeck();
        // Set state
        setAppState((prevState) => ({
          ...prevState,
          deckId,
          showLoader: false,
          getNewDeck: false,
        }));
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

  return (
    <section>
      {initialLoader ? <Loader /> : null}
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
