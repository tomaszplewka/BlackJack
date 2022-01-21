import React from "react";
import Btn from "../btn/Btn";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

import "./Auth.css";

const Auth = ({ onAuthClick, setIsUserLoggedIn, Firebase }) => {
  const onGuestClick = (e) => {
    e.preventDefault();
    console.log("ON GUEST CLICK");
    onAuthClick();
    Firebase.logInAnonymously(setIsUserLoggedIn);
  };

  const onGitHubClick = (e) => {
    e.preventDefault();
    console.log("GITHUB CLICKED");
    Firebase.logInGitHub();
  };

  const onGoogleClick = (e) => {
    e.preventDefault();
    console.log("GOOGLE CLICKED");
    Firebase.logInGoogle();
  };

  const onLogOutClick = (e) => {
    e.preventDefault();
    Firebase.logOut();
  };

  return (
    <section id="welcome-section">
      <div className="welcome-wrapper">
        <Btn id="guest" className="btn">
          <span onClick={(e) => onGuestClick(e)}>guest</span>
        </Btn>
        <Btn id="sign-in" className="btn">
          <span className="btn-text">sign in</span>
          <ul className="choices">
            <li>
              <span
                id="google"
                onClick={(e) => {
                  onGoogleClick(e);
                }}
              >
                <FontAwesomeIcon icon={faGoogle} />
              </span>
            </li>
            <li>
              <span
                id="github"
                target="_blank"
                onClick={(e) => {
                  onGitHubClick(e);
                }}
              >
                <FontAwesomeIcon icon={faGithub} />
              </span>
            </li>
            <li>
              <span
                id="github"
                target="_blank"
                onClick={(e) => {
                  onLogOutClick(e);
                }}
              >
                LOG OUT
              </span>
            </li>
          </ul>
        </Btn>
      </div>
    </section>
  );
};

export default Auth;
