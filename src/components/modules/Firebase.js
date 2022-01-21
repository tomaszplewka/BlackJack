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

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const Firebase = (() => {
  // Initialize Firebase
  initializeApp(FirebaseConfig);

  // Auth
  const auth = getAuth();

  // Firestore
  const db = getFirestore();

  const logInAnonymously = async (setIsUserLoggedIn, authorization = auth) => {
    try {
      const result = await signInAnonymously(authorization);
      // Signed in..
      console.log("SIGNED IN");
      // console.log("USER ID: ", result.user.uid);
      // Set state
      setIsUserLoggedIn(result.user.uid);
    } catch (error) {
      // const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  };

  const logInGitHub = async (authorization = auth) => {
    try {
      const provider = new GithubAuthProvider();
      provider.setCustomParameters({ propmt: "select_account" });
      const result = await signInWithPopup(authorization, provider);
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      // const credential = GithubAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("GITHUB USER: ", user);
    } catch (error) {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.email;
      // The AuthCredential type that was used.
      // const credential = GithubAuthProvider.credentialFromError(error);
    }
  };

  const logInGoogle = async (authorization = auth) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ propmt: "select_account" });
      const result = await signInWithPopup(authorization, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("GOOGLE USER: ", user);
    } catch (error) {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  const logOut = async (setIsUserLoggedIn, authorization = auth) => {
    try {
      await signOut(authorization);
      // Sign-out successful.
      console.log("SIGNED OUT");
      // Set state
      setIsUserLoggedIn(false);
    } catch (error) {
      // An error happened.
    }
  };

  const storeData = async (userId, data, setShowLoader) => {
    // Get "users" collection
    const querySnapshot = await getDocs(collection(db, "users"));
    // Check if collection with userId already exists
    let isUserInDb = false;
    querySnapshot.forEach((singleDoc) => {
      if (singleDoc.id === userId) {
        // console.log(
        //   "USER DOC BEFORE: ",
        //   singleDoc.id,
        //   " => ",
        //   singleDoc.data()
        // );
        // Save doc with merge
        setDoc(doc(db, "users", userId), { data });
        isUserInDb = true;
      }
    });
    // Save brand-new user
    if (!isUserInDb) {
      try {
        await addDoc(collection(db, "users", userId), { data });
        console.log("NEW USER SAVED SUCCESSFULLY");
      } catch (e) {
        console.error("USER SAVING NOT SUCCESSFULL", e);
      }
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
