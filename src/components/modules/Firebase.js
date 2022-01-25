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

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
      // Get user's data
      const { getNewDeck, gameState, showLoader } = await resolveUserData();
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
      // Show alert
      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Something went wrong!</strong>,
        html: <i>{`Login unsuccessful! ${error.message}`}</i>,
        icon: "error",
      });
    }
  };

  const logInGitHub = async (setAppState, authorization = auth) => {
    try {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({ propmt: "select_account" });
      const result = await signInWithPopup(authorization, provider);
      // Get user's data
      const { getNewDeck, gameState, showLoader } = await resolveUserData(
        result.user.uid
      );
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
      // Show alert
      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Something went wrong!</strong>,
        html: <i>{`Login unsuccessful! ${error.message}`}</i>,
        icon: "error",
      });
    }
  };

  const logInGoogle = async (setAppState, authorization = auth) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ propmt: "select_account" });
      const result = await signInWithPopup(authorization, provider);
      // Get user's data
      const { getNewDeck, gameState, showLoader } = await resolveUserData(
        result.user.uid
      );
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
      // Show alert
      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Something went wrong!</strong>,
        html: <i>{`Login unsuccessful! ${error.message}`}</i>,
        icon: "error",
      });
    }
  };

  const logOut = async (setAppState, authorization = auth) => {
    try {
      await signOut(authorization);
      // Set state
      setAppState((prevState) => {
        return {
          ...prevState,
          isUserLoggedIn: false,
        };
      });
    } catch (error) {
      // Show alert
      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Something went wrong!</strong>,
        html: <i>{`Logout unsuccessful! ${error.message}`}</i>,
        icon: "error",
      });
    }
  };

  const storeData = async (userId, data, setShowLoader) => {
    // Check if user exists
    const isUserInDb = await userExists(userId);
    try {
      if (!isUserInDb) {
        // Save brand-new user
        await setDoc(doc(db, "users", userId), {
          data,
          timestamp: Date.now(),
        });
      } else {
        // Merge with existing data
        await setDoc(
          doc(db, "users", userId),
          {
            data,
            timestamp: Date.now(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      // Show alert
      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Something went wrong!</strong>,
        html: <i>{`Saving user's data unsuccessful! ${error.message}`}</i>,
        icon: "error",
      });
    }

    if (setShowLoader) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1500);
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

  const resolveUserData = async (user = "guest") => {
    // Check if user already exists in LS
    const guestFromLS = LocalStorage.getFromLS(user);
    // Check if user already exists in db
    const isUserInDb = await userExists(user);
    // Resolve state
    let getNewDeck = false;
    let gameState = null;
    let showLoader = false;
    if (guestFromLS && isUserInDb) {
      const userDoc = await getDoc(doc(db, "users", user));
      if (guestFromLS.timestamp >= userDoc.data().timestamp) {
        gameState = guestFromLS.data;
      } else {
        gameState = userDoc.data().data;
      }
    } else if (guestFromLS) {
      gameState = guestFromLS.data;
    } else if (isUserInDb) {
      const userDoc = await getDoc(doc(db, "users", user));
      gameState = userDoc.data().data;
    } else {
      getNewDeck = true;
      showLoader = true;
    }

    return {
      getNewDeck,
      gameState,
      showLoader,
    };
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
