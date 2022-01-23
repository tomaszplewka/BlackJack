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

import "./Table.css";

const Table = ({ appState, setAppState, Firebase }) => {
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [gameState, setGameState] = useState([
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
  ]);

  useEffect(() => {
    console.log("useEffect (gameState): ", gameState);
    // Check if round has finished
    const currRound = gameState[gameState.length - 1];
    if (!isHistoryMode && currRound.isRoundFinished) {
      console.log("useEffect -- round is finished");
      setTimeout(() => {
        // Resolve round
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
        console.log("Resolve dealer: ");
        // Player is busted or stands -- resolve dealer's hand
        const { status, mappedDealerHand } = GameLogic.resolveDealer({
          gameState,
          setGameState,
        });
        if (!status) {
          setTimeout(async () => {
            // Draw card & concat with curr hand
            const cards = await drawCards(
              gameState[gameState.length - 1].deckId,
              1
            );
            const dealerHand = GameLogic.dealCards(cards, ["dealer"]);
            mappedDealerHand.push(...dealerHand);
            // Get hand value
            const dealerValue = GameLogic.getHandValue(mappedDealerHand);
            console.log("BEFORE SETGAMESTATE");
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

  return (
    <>
      <Menu
        gameState={gameState}
        setGameState={setGameState}
        setAppState={setAppState}
        Firebase={Firebase}
        appState={appState}
        setIsHistoryMode={setIsHistoryMode}
        isHistoryMode={isHistoryMode}
      />
      <div className="table-wrapper">
        {gameState[gameState.length - 1].round ? (
          <Round gameState={gameState} />
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
