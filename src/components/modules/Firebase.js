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

  const logInAnonymously = async (setAppState, authorization = auth) => {
    try {
      const result = await signInAnonymously(authorization);
      // Signed in..
      console.log("SIGNED IN");
      console.log("USER ID: ", result.user.uid);
      // Set state
      setTimeout(() => {
        setAppState((prevState) => ({
          ...prevState,
          isUserLoggedIn: true,
        }));
      }, 1500);
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

  const logOut = async (authorization = auth) => {
    try {
      await signOut(authorization);
      // Sign-out successful.
      console.log("SIGNED OUT");
    } catch (error) {
      // An error happened.
    }
  };

  const storeUser = async () => {
    await setDoc(doc(db, "users", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    });
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    // try {
    //   const docRef = await addDoc(collection(db, "users"), {
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815,
    //     objectExample: {
    //       a: 5,
    //       b: {
    //         nested: "foo",
    //       },
    //     },
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  };

  return {
    logInAnonymously,
    logInGoogle,
    logInGitHub,
    logOut,
    storeUser,
  };
})();

export default Firebase;
