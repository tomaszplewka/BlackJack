import React, { useState, useEffect } from "react";
import { getDeck } from "./components/modules/Api";
import Firebase from "./components/modules/Firebase";
import Auth from "./components/auth/Auth";
import Table from "./components/table/Table";
import Loader from "./components/loader/Loader";

import "./App.css";

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const [showLoader, setShowLoader] = useState(false);
  const [appState, setAppState] = useState({
    deckId: "",
    showLoader: false,
  });
  useEffect(() => {
    // console.log("USER LOGGED IN: ", isUserLoggedIn);
    // console.log("SHOW LOADER: ", showLoader);
    if (isUserLoggedIn) {
      setTimeout(() => {
        getDeck(setAppState);
      }, 1500);
    }
  }, [isUserLoggedIn]);

  const onAuthClick = () => {
    // console.log("AUTH CLICKED");
    setAppState((prevState) => ({
      ...prevState,
      showLoader: true,
    }));
  };

  console.log("RENDER");

  return (
    <section>
      {isUserLoggedIn && appState.deckId ? (
        <Table
          deckId={appState.deckId}
          setIsUserLoggedIn={setIsUserLoggedIn}
          Firebase={Firebase}
          userId={isUserLoggedIn}
        />
      ) : (
        <Auth
          onAuthClick={onAuthClick}
          setIsUserLoggedIn={setIsUserLoggedIn}
          Firebase={Firebase}
        />
      )}
      {appState.showLoader ? <Loader /> : null}
    </section>
  );
};

export default App;
