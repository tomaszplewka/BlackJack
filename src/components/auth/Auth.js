import React from "react";
import Btn from "../btn/Btn";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

import "./Auth.css";

const Auth = ({ onAuthClick, setAppState, Firebase }) => {
  const onBtnClick = (e) => {
    e.preventDefault();
    // Show loader
    onAuthClick();
    // Resolve login method
    const targetId = e.target.id;
    switch (targetId) {
      case "guest":
        Firebase.logInAnonymously(setAppState);
        break;
      case "google":
        Firebase.logInGoogle(setAppState);
        break;
      case "github":
        Firebase.logInGitHub(setAppState);
        break;
      default:
        break;
    }
  };

  return (
    <section className="welcome-section">
      <div className="welcome-wrapper">
        <Btn className="btn">
          <span id="guest" onClick={(e) => onBtnClick(e)}>
            guest
          </span>
        </Btn>
        <Btn id="sign-in" className="btn">
          <span className="btn-text">sign in</span>
          <ul className="choices">
            <li>
              <span
                id="google"
                onClick={(e) => {
                  onBtnClick(e);
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
                  onBtnClick(e);
                }}
              >
                <FontAwesomeIcon icon={faGithub} />
              </span>
            </li>
          </ul>
        </Btn>
      </div>
    </section>
  );
};

export default Auth;
