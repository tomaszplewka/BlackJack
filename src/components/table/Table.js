import React, { useState, useEffect } from "react";
import Round from "../round/Round";
import Bet from "../bet/Bet";
import Balance from "../balance/Balance";
import Hand from "../hand/Hand";
import Feedback from "../feedback/Feedback";
import WhatNext from "../whatNext/WhatNext";
import Menu from "../menu/Menu";

import { drawCards } from "../modules/Api";
import GameLogic from "../modules/GameLogic";
import LocalStorage from "../modules/LocalStorage";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./Table.css";

const Table = ({ appState, setAppState, Firebase }) => {
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [gameState, setGameState] = useState(
    appState.gameState
      ? appState.gameState
      : [
          {
            round: null,
            balance: 1000,
            bet: null,
            hands: {
              playerHand: null,
              dealerHand: null,
            },
            handValue: {
              playerValue: null,
              dealerValue: null,
            },
            lastMove: null,
            isRoundFinished: null,
            isPlayerActive: null,
            message: "Round begins. Place the bet.",
            result: null,
            isGameFinished: false,
            deckId: appState.deckId,
          },
        ]
  );

  useEffect(() => {
    const currRound = gameState[gameState.length - 1];
    // Check if round has finished
    if (!isHistoryMode && currRound.isRoundFinished) {
      // Resolve round
      setTimeout(() => {
        const { newBalance, result } = GameLogic.resolveRound(gameState);
        if (currRound.round === 5) {
          // Set top results
          LocalStorage.setTopResults(newBalance);
          // Set state
          setGameState((prevState) => {
            return [
              ...prevState.slice(0, -1),
              {
                ...prevState.slice(-1)[0],
                message: result,
              },
              {
                ...prevState[prevState.length - 1],
                isGameFinished: true,
                round: null,
                balance: newBalance,
                lastMove: null,
                isRoundFinished: null,
                isPlayerActive: null,
                result: null,
                message: `Game has ended. Your final score is ${newBalance}.`,
              },
            ];
          });
        } else {
          // Set state
          setGameState((prevState) => {
            console.log(prevState.slice(-1)[0]);

            return [
              ...prevState.slice(0, -1),
              {
                ...prevState.slice(-1)[0],
                message: result,
              },
              {
                ...prevState[prevState.length - 1],
                round: null,
                balance: newBalance,
                lastMove: null,
                isRoundFinished: null,
                isPlayerActive: null,
                result: null,
                message: `${result} Place the bet to start the next round.`,
              },
            ];
          });
        }
      }, 1500);
    } else if (
      !isHistoryMode &&
      currRound.isPlayerActive != null &&
      !currRound.isPlayerActive
    ) {
      setTimeout(() => {
        // Player is busted or stands -- resolve dealer's hand
        const { status, mappedDealerHand } = GameLogic.resolveDealer({
          gameState,
          setGameState,
        });
        if (!status) {
          // Draw card & concat with curr hand
          setTimeout(async () => {
            const cards = await drawCards(
              gameState[gameState.length - 1].deckId,
              1
            );
            const dealerHand = GameLogic.dealCards(cards, ["dealer"]);
            mappedDealerHand.push(...dealerHand);
            // Get hand value
            const dealerValue = GameLogic.getHandValue(mappedDealerHand);
            // Set state
            setGameState((prevState) => {
              if (prevState.length === 1) {
                return [
                  {
                    ...prevState[prevState.length - 1],
                    hands: {
                      ...prevState[prevState.length - 1].hands,
                      dealerHand: [...mappedDealerHand],
                    },
                    handValue: {
                      ...prevState[prevState.length - 1].handValue,
                      dealerValue,
                    },
                    message: "Dealer draws cards.",
                  },
                ];
              } else {
                return [
                  ...prevState.slice(0, prevState.length - 1),
                  {
                    ...prevState[prevState.length - 1],
                    hands: {
                      ...prevState[prevState.length - 1].hands,
                      dealerHand: [...mappedDealerHand],
                    },
                    handValue: {
                      ...prevState[prevState.length - 1].handValue,
                      dealerValue,
                    },
                    message: "Dealer draws cards.",
                  },
                ];
              }
            });
          }, 1500);
        }
      }, 1500);
    }
  }, [gameState, isHistoryMode]);

  useEffect(() => {
    console.log("EVENT LISTENER");

    const beforeUnloadCb = async (e) => {
      // Check if user is logged in
      if (appState.isUserLoggedIn) {
        e.preventDefault();

        if (!isHistoryMode) {
          // Save user's data
          LocalStorage.saveToLocalStorage(appState.userId, {
            data: gameState,
            timestamp: Date.now(),
          });
        }
        // Show alert
        const swal = withReactContent(Swal);
        await swal.fire({
          title: <strong>Game saved!</strong>,
          html: <i>You may go now!</i>,
          icon: "success",
        });

        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", beforeUnloadCb);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadCb);
    };
  });

  return (
    <>
      <Menu
        gameState={gameState}
        setGameState={setGameState}
        appState={appState}
        setAppState={setAppState}
        isHistoryMode={isHistoryMode}
        setIsHistoryMode={setIsHistoryMode}
        Firebase={Firebase}
      />
      <div className="table-wrapper">
        {gameState[gameState.length - 1].round ? (
          <Round round={gameState[gameState.length - 1].round} />
        ) : (
          ""
        )}
        <Hand
          player="dealer"
          hand={gameState[gameState.length - 1].hands.dealerHand}
          value={gameState[gameState.length - 1].handValue.dealerValue}
        />
        <Feedback gameState={gameState} />
        <Hand
          player="player"
          hand={gameState[gameState.length - 1].hands.playerHand}
          value={gameState[gameState.length - 1].handValue.playerValue}
        />
        {isHistoryMode ? null : (
          <div className="controls-wrapper">
            <Balance balance={gameState[gameState.length - 1].balance} />
            {gameState[gameState.length - 1].round ? (
              <WhatNext
                drawCards={drawCards}
                dealCards={GameLogic.dealCards}
                getHandValue={GameLogic.getHandValue}
                gameState={gameState}
                setGameState={setGameState}
              />
            ) : gameState[gameState.length - 1].isGameFinished ? null : (
              <Bet
                drawCards={drawCards}
                dealCards={GameLogic.dealCards}
                getHandValue={GameLogic.getHandValue}
                gameState={gameState}
                setGameState={setGameState}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
