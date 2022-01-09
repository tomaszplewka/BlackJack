import React, { useState, useRef } from "react";
import "./Bet.css";
import Btn from "../btn/Btn";

const Bet = ({
  drawCards,
  dealCards,
  getHandValue,
  gameState,
  setGameState,
}) => {
  const [bet, setBet] = useState(50);
  const ref = useRef();

  const onDecrementClick = (e) => {
    e.preventDefault();
    if (!(Number(e.target.nextElementSibling.value) - 25 < 50)) {
      e.target.nextElementSibling.value =
        Number(e.target.nextElementSibling.value) - 25;
      setBet(e.target.nextElementSibling.value);
    }
  };

  const onIncrementClick = (e) => {
    e.preventDefault();
    if (!(Number(e.target.previousElementSibling.value) + 25 > 1000)) {
      e.target.previousElementSibling.value =
        Number(e.target.previousElementSibling.value) + 25;
      setBet(e.target.previousElementSibling.value);
    }
  };

  const onBetSubmit = (e) => {
    e.preventDefault();
    // Disable bet btn
    ref.current["bet-submit"].disabled = true;
    // PERFORM FORM INPUT VALIDATION HERE !!!
    // Check if balance > 0 after player bets
    const currRound = gameState[gameState.length - 1];
    const currBalance = currRound.balance - e.target.bet.value;
    if (currBalance >= 0) {
      // Draw cards
      setTimeout(async () => {
        console.log("BET: ", e.target.bet.value);
        console.log("BET: ", bet);
        const cards = await drawCards(currRound.deckId, 4);
        // Deal cards
        const { playerHand, dealerHand } = dealCards(cards);
        // Get hand value
        const playerValue = getHandValue(playerHand);
        const dealerValue = getHandValue(dealerHand);
        // Set state
        setGameState((prevState) => {
          const currRound = prevState[prevState.length - 1];
          const result =
            playerValue === 21 ? "Player has blackjack." : "Round continues.";
          if (prevState.length === 1) {
            return [
              {
                ...currRound,
                round: 1,
                balance: currBalance,
                bet,
                hands: {
                  playerHand,
                  dealerHand,
                },
                handValue: {
                  playerValue,
                  dealerValue,
                },
                lastMove: "bet",
                isRoundFinished: playerValue === 21 ? true : false,
                isPlayerActive: playerValue === 21 ? false : true,
                result,
                message: `Player bets ${bet}. ${result}`,
              },
            ];
          } else {
            return [
              ...prevState.slice(0, prevState.length - 1),
              {
                ...currRound,
                round: prevState.length,
                balance: currBalance,
                bet,
                hands: {
                  playerHand,
                  dealerHand,
                },
                handValue: {
                  playerValue,
                  dealerValue,
                },
                lastMove: "bet",
                isRoundFinished: playerValue === 21 ? true : false,
                isPlayerActive: playerValue === 21 ? false : true,
                result,
                message: `Player bets ${bet}. ${result}`,
              },
            ];
          }
        });
      }, 1500);
    } else {
      // COME UP WITH SOMETHING BETTER
      alert("Cannot bet! Balance below 0!");
    }
  };

  return (
    <form ref={ref} id="bet-form" onSubmit={(e) => onBetSubmit(e)}>
      <div className="number-input">
        <button
          className="decrement"
          name="decrement"
          onClick={(e) => onDecrementClick(e)}
        ></button>
        <input
          name="bet"
          min="50"
          max="1000"
          step="25"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          type="number"
        />
        <button
          className="increment"
          name="increment"
          onClick={(e) => onIncrementClick(e)}
        ></button>
      </div>
      <Btn id="bet-submit" className="btn" type="submit">
        <span>Bet</span>
      </Btn>
    </form>
  );
};

export default Bet;
