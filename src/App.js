import React, { useState, useEffect } from "react";
import { getDeck } from "./components/modules/Api";
import Firebase from "./components/modules/Firebase";
import Auth from "./components/auth/Auth";
import Table from "./components/table/Table";
import Loader from "./components/loader/Loader";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./App.css";

const App = () => {
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const [showLoader, setShowLoader] = useState(false);
  // const [deckId, setDeckId] = useState("");
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
    // console.log("APP STATE: ", appState);
    // console.log("USER LOGGED IN: ", isUserLoggedIn);
    // console.log("SHOW LOADER: ", showLoader);
    if (appState.getNewDeck) {
      // Get new deck
      setTimeout(() => {
        getDeck(setAppState);
      }, 1500);
    }
  }, [appState]);

  useEffect(() => {
    window.addEventListener("beforeunload", async (e) => {
      e.preventDefault();
      // Save state

      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Game saved!</strong>,
        html: <i>You may go now!</i>,
        icon: "success",
      });

      e.returnValue = "";
    });
  });

  const onAuthClick = async () => {
    console.log("APP STATE: ", appState);
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
