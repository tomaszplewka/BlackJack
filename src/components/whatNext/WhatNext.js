import React, { useRef } from "react";
import "./WhatNext.css";
import Btn from "../btn/Btn";

const WhatNext = ({
  drawCards,
  dealCards,
  getHandValue,
  gameState,
  setGameState,
}) => {
  const ref = useRef();

  const onHitClick = () => {
    console.log("HIT IS CLICKED");
    // Disable what-next btn
    ref.current.firstElementChild.disabled = true;
    // Draw a card
    setTimeout(async () => {
      const card = await drawCards(gameState[gameState.length - 1].deckId, 1);
      // Deal cards & concat with current hand
      const newCard = dealCards(card, ["player"]);
      const currPlayerHand = gameState[gameState.length - 1].hands.playerHand;
      currPlayerHand.push(...newCard);
      // Get hand value
      const playerValue = getHandValue(currPlayerHand);
      // Set state
      setGameState((prevState) => {
        const currRound = prevState[prevState.length - 1];
        const result =
          playerValue >= 21
            ? playerValue === 21
              ? "Player has blackjack."
              : "Player is busted."
            : "Round continues.";
        if (prevState.length === 1) {
          return [
            {
              ...currRound,
              hands: {
                ...currRound.hands,
                playerHand: [...currPlayerHand],
              },
              handValue: {
                ...currRound.handValue,
                playerValue,
              },
              lastMove: "hit",
              isRoundFinished: playerValue >= 21 ? true : false,
              isPlayerActive: playerValue >= 21 ? false : true,
              result,
              message: `Player hits. ${result}`,
            },
          ];
        } else {
          return [
            ...prevState.slice(0, prevState.length - 1),
            {
              ...currRound,
              hands: {
                ...currRound.hands,
                playerHand: [...currPlayerHand],
              },
              handValue: {
                ...currRound.handValue,
                playerValue,
              },
              lastMove: "hit",
              isRoundFinished: playerValue >= 21 ? true : false,
              isPlayerActive: playerValue >= 21 ? false : true,
              result,
              message: `Player hits. ${result}`,
            },
          ];
        }
      });
      // Enable what-next btn
      if (playerValue < 21) {
        ref.current.firstElementChild.disabled = false;
      }
    }, 1500);
  };

  const onStandClick = () => {
    console.log("STAND IS CLICKED");
    // Disable what-next btn
    ref.current.firstElementChild.disabled = true;
    // Set state
    setGameState((prevState) => {
      const currRound = prevState[prevState.length - 1];
      if (prevState.length === 1) {
        return [
          {
            ...currRound,
            lastMove: "stand",
            isPlayerActive: false,
            message: "Player stands. Dealer draws.",
          },
        ];
      } else {
        return [
          ...prevState.slice(0, prevState.length - 1),
          {
            ...currRound,
            lastMove: "stand",
            isPlayerActive: false,
            message: "Player stands. Dealer draws.",
          },
        ];
      }
    });
  };

  const onDoubleDownClick = () => {
    console.log("DOUBLE DOWN IS CLICKED");
    const tempBalance =
      gameState[gameState.length - 1].balance -
      gameState[gameState.length - 1].bet;

    if (tempBalance >= 0) {
      // Disable what-next btn
      ref.current.firstElementChild.disabled = true;
      // Draw a card
      setTimeout(async () => {
        const card = await drawCards(gameState[gameState.length - 1].deckId, 1);
        // Deal cards & concat with current hand
        const newCard = dealCards(card, ["player"]);
        const currPlayerHand = gameState[gameState.length - 1].hands.playerHand;
        currPlayerHand.push(...newCard);
        // Get hand value
        const playerValue = getHandValue(currPlayerHand);
        // Set state
        setGameState((prevState) => {
          const currRound = prevState[prevState.length - 1];
          const result =
            playerValue >= 21
              ? playerValue === 21
                ? "Player has blackjack."
                : "Player is busted."
              : "Dealer draws.";
          if (prevState.length === 1) {
            return [
              {
                ...currRound,
                hands: {
                  ...currRound.hands,
                  playerHand: [...currPlayerHand],
                },
                handValue: {
                  ...currRound.handValue,
                  playerValue,
                },
                lastMove: "double down",
                isRoundFinished: playerValue >= 21 ? true : false,
                isPlayerActive: false,
                bet: currRound.bet * 2,
                balance: currRound.balance - currRound.bet,
                result,
                message: `Player doubles down. ${result}`,
              },
            ];
          } else {
            return [
              ...prevState.slice(0, prevState.length - 1),
              {
                ...currRound,
                hands: {
                  ...currRound.hands,
                  playerHand: [...currPlayerHand],
                },
                handValue: {
                  ...currRound.handValue,
                  playerValue,
                },
                lastMove: "double down",
                isRoundFinished: playerValue >= 21 ? true : false,
                isPlayerActive: false,
                bet: currRound.bet * 2,
                balance: currRound.balance - currRound.bet,
                result,
                message: `Player doubles down. ${result}`,
              },
            ];
          }
        });
      }, 1500);
    } else {
      alert("Nie mozesz tak zrobic!!!");
    }
  };

  return (
    <div ref={ref} className="what-next-wrapper">
      <Btn id="what-next-btn" className="btn">
        <span className="btn-text">what next</span>
        <ul className="choices">
          <li onClick={onHitClick}>
            <span id="hit">hit</span>
          </li>
          <li onClick={onStandClick}>
            <span id="stand">stand</span>
          </li>
          {gameState[gameState.length - 1].lastMove === "hit" ? null : (
            <li onClick={onDoubleDownClick}>
              <span id="double-down">double down</span>
            </li>
          )}
        </ul>
      </Btn>
    </div>
  );
};

export default WhatNext;
