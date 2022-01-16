import React, { useState, useEffect } from "react";
import { getDeck } from "./components/modules/Api";
import Auth from "./components/auth/Auth";
import Table from "./components/table/Table";
import Loader from "./components/loader/Loader";

import "./App.css";

const App = () => {
  const [appState, setAppState] = useState({
    deckId: "",
    showLoader: false,
    isUserLoggedIn: false,
  });
  // useEffect(() => {
  //   // console.log("USER LOGGED IN: ", isUserLoggedIn);
  //   // console.log("SHOW LOADER: ", showLoader);
  //   if (isUserLoggedIn) {
  //     setTimeout(() => {
  //       getDeck(setDeckId);
  //     }, 1500);
  //   }
  // }, [isUserLoggedIn, showLoader]);

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
      {appState.deckId ? (
        <Table deckId={appState.deckId} />
      ) : appState.showLoader ? (
        <Loader />
      ) : (
        <Auth onAuthClick={onAuthClick} setAppState={setAppState} />
      )}
    </section>
  );
};

export default App;
