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
      // Check if user already exists in db
      const isUserInDb = await userExists("guest");
      // Set state
      if (isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", "guest"));
        setAppState((prevState) => {
          return {
            ...prevState,
            userId: "guest",
            getNewDeck: false,
            isUserLoggedIn: true,
            gameState: guestDoc.data().data,
            showLoader: false,
          };
        });
      } else {
        setAppState((prevState) => {
          return {
            ...prevState,
            userId: "guest",
            getNewDeck: true,
            isUserLoggedIn: true,
          };
        });
      }
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
      // Check if user already exists in db
      const isUserInDb = await userExists(result.user.uid);
      // Set state
      if (isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", result.user.uid));
        setAppState((prevState) => {
          return {
            ...prevState,
            userId: result.user.uid,
            getNewDeck: false,
            isUserLoggedIn: true,
            gameState: guestDoc.data().data,
            showLoader: false,
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL,
          };
        });
      } else {
        setAppState((prevState) => {
          return {
            ...prevState,
            userId: result.user.uid,
            getNewDeck: true,
            isUserLoggedIn: true,
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL,
          };
        });
      }
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
      // Check if user already exists in db
      const isUserInDb = await userExists(result.user.uid);
      // Set state
      if (isUserInDb) {
        const guestDoc = await getDoc(doc(db, "users", result.user.uid));
        setAppState((prevState) => {
          return {
            ...prevState,
            userId: result.user.uid,
            getNewDeck: false,
            isUserLoggedIn: true,
            gameState: guestDoc.data().data,
            showLoader: false,
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL,
          };
        });
      } else {
        setAppState((prevState) => {
          return {
            ...prevState,
            userId: result.user.uid,
            getNewDeck: true,
            isUserLoggedIn: true,
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL,
          };
        });
      }
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
        await setDoc(doc(db, "users", userId), { data });
        console.log("NEW USER SAVED SUCCESSFULLY");
      } catch (error) {
        const errorMessage = error.message;
        console.log(errorMessage);
      }
    } else {
      // Save doc with merge
      setDoc(doc(db, "users", userId), { data });
    }

    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
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
