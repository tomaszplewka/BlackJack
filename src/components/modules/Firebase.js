import { FirebaseConfig } from "./FirebaseConfig";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  GithubAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import LocalStorage from "./LocalStorage";

const Firebase = (() => {
  // Initialize Firebase
  initializeApp(FirebaseConfig);

  // Auth
  const auth = getAuth();

  // Firestore
  const db = getFirestore();

  const logInAnonymously = async (setAppState, authorization = auth) => {
    try {
      await signInAnonymously(authorization);
      // Signed in..
      console.log("SIGNED IN");
      // Check if user already exists in LS
      const guestFromLS = LocalStorage.getFromLS("guest");
      console.log("GUEST FROM LS: ", guestFromLS);
      // Check if user already exists in db
      const isUserInDb = await userExists("guest");
      // Resolve state
      let getNewDeck = false;
      let gameState = null;
      let showLoader = false;
      if (guestFromLS && isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", "guest"));
        console.log("GUEST DOC: ", guestDoc.data());
        if (guestFromLS.timestamp >= guestDoc.data().timestamp) {
          console.log("FROM LS");
          gameState = guestFromLS.data;
        } else {
          console.log("FROM FIRESTORE");
          gameState = guestDoc.data().data;
        }
      } else if (guestFromLS) {
        gameState = guestFromLS.data;
      } else if (isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", "guest"));
        gameState = guestDoc.data().data;
      } else {
        getNewDeck = true;
        showLoader = true;
      }
      // Set state
      setAppState((prevState) => {
        return {
          ...prevState,
          userId: "guest",
          getNewDeck,
          isUserLoggedIn: true,
          gameState,
          showLoader,
        };
      });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const logInGitHub = async (setAppState, authorization = auth) => {
    try {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({ propmt: "select_account" });
      const result = await signInWithPopup(authorization, provider);
      // Check if user already exists in LS
      const guestFromLS = LocalStorage.getFromLS(result.user.uid);
      // Check if user already exists in db
      const isUserInDb = await userExists(result.user.uid);
      // Resolve state
      let getNewDeck = false;
      let gameState = null;
      let showLoader = false;
      if (guestFromLS && isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", result.user.uid));
        console.log("GUEST DOC: ", guestDoc.data());
        if (guestFromLS.timestamp >= guestDoc.data().timestamp) {
          console.log("FROM LS");
          gameState = guestFromLS.data;
        } else {
          console.log("FROM FIRESTORE");
          gameState = guestDoc.data().data;
        }
      } else if (guestFromLS) {
        gameState = guestFromLS.data;
      } else if (isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", result.user.uid));
        gameState = guestDoc.data().data;
      } else {
        getNewDeck = true;
        showLoader = true;
      }
      // Set state
      setAppState((prevState) => {
        return {
          ...prevState,
          userId: result.user.uid,
          getNewDeck,
          isUserLoggedIn: true,
          gameState,
          showLoader,
          displayName: result.user.displayName,
          photoUrl: result.user.photoURL,
        };
      });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const logInGoogle = async (setAppState, authorization = auth) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ propmt: "select_account" });
      const result = await signInWithPopup(authorization, provider);
      // Check if user already exists in LS
      const guestFromLS = LocalStorage.getFromLS(result.user.uid);
      // Check if user already exists in db
      const isUserInDb = await userExists(result.user.uid);
      // Resolve state
      let getNewDeck = false;
      let gameState = null;
      let showLoader = false;
      if (guestFromLS && isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", result.user.uid));
        console.log("GUEST DOC: ", guestDoc.data());
        if (guestFromLS.timestamp >= guestDoc.data().timestamp) {
          console.log("FROM LS");
          gameState = guestFromLS.data;
        } else {
          console.log("FROM FIRESTORE");
          gameState = guestDoc.data().data;
        }
      } else if (guestFromLS) {
        gameState = guestFromLS.data;
      } else if (isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", result.user.uid));
        gameState = guestDoc.data().data;
      } else {
        getNewDeck = true;
        showLoader = true;
      }
      // Set state
      setAppState((prevState) => {
        return {
          ...prevState,
          userId: result.user.uid,
          getNewDeck,
          isUserLoggedIn: true,
          gameState,
          showLoader,
          displayName: result.user.displayName,
          photoUrl: result.user.photoURL,
        };
      });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const logOut = async (setAppState, authorization = auth) => {
    try {
      await signOut(authorization);
      // Sign-out successful.
      console.log("SIGNED OUT");
      // Set state
      setAppState((prevState) => {
        return {
          ...prevState,
          isUserLoggedIn: false,
        };
      });
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const userExists = async (userId) => {
    // Get "users" collection
    const docSnap = await getDoc(doc(db, "users", userId));
    // Check if collection with userId already exists
    let isUserInDb = false;
    if (docSnap.exists()) {
      isUserInDb = true;
    }

    return isUserInDb;
  };

  const storeData = async (userId, data, setShowLoader) => {
    // Check if user exists
    console.log("USER IN STORE DATA: ", userId);
    const isUserInDb = await userExists(userId);
    // Save brand-new user
    if (!isUserInDb) {
      try {
        await setDoc(doc(db, "users", userId), {
          data,
          timestamp: Date.now(),
        });
        console.log("NEW USER SAVED SUCCESSFULLY");
      } catch (error) {
        const errorMessage = error.message;
        console.log(errorMessage);
      }
    } else {
      // Save doc with merge
      console.log("SET DOC");
      setDoc(doc(db, "users", userId), {
        data,
        timestamp: Date.now(),
      });
    }

    if (setShowLoader) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1500);
    }
  };

  return {
    logInAnonymously,
    logInGoogle,
    logInGitHub,
    logOut,
    storeData,
  };
})();

export default Firebase;
