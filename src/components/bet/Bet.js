import React, { useState, useRef } from "react";
import Btn from "../btn/Btn";
import Loader from "../loader/Loader";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./Bet.css";

const Bet = ({
  drawCards,
  dealCards,
  getHandValue,
  gameState,
  setGameState,
}) => {
  const [showLoader, setShowLoader] = useState(false);
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

  const onBetSubmit = async (e) => {
    e.preventDefault();
    // Disable bet btn
    ref.current["bet-submit"].disabled = true;
    // Validate bet
    const betValue = e.target.bet.value;
    const regex = new RegExp("[0-9]+");
    if (regex.test(betValue) && betValue >= 50) {
      const currRound = gameState[gameState.length - 1];
      const currBalance = currRound.balance - betValue;
      // Check if balance > 0 after player bets
      if (currBalance >= 0) {
        // Draw cards
        setTimeout(async () => {
          // Draw cards
          const cards = await drawCards(currRound.deckId, 4);
          // Check if cards exists
          if (!cards) {
            // Show loader
            setShowLoader(true);

            return;
          }
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
        // Enable bet btn
        ref.current["bet-submit"].disabled = false;
        // Show alert
        const swal = withReactContent(Swal);
        await swal.fire({
          title: <strong>Bet cannot be placed!</strong>,
          html: <i>Balance below 0!</i>,
          icon: "error",
        });
      }
    } else {
      // Enable bet btn
      ref.current["bet-submit"].disabled = false;
      // Show alert
      const swal = withReactContent(Swal);
      await swal.fire({
        title: <strong>Bet cannot be placed!</strong>,
        html: <i>Bet must be a number greater than 50!</i>,
        icon: "error",
      });
    }
  };

  return (
    <>
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
            max={gameState[gameState.length - 1].balance}
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
      {showLoader ? <Loader /> : null}
    </>
  );
};

export default Bet;
