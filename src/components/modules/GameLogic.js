const GameLogic = (() => {
  const dealCards = (cards, single = []) => {
    let playerHand = [];
    let dealerHand = [];
    if (single.length) {
      if (single[0] === "player") {
        playerHand.push({ card: cards[0], back: false });
        return playerHand;
      } else {
        dealerHand.push({ card: cards[0], back: false });
        return dealerHand;
      }
    }

    cards.forEach((card, index) => {
      if (index % 2) {
        if (dealerHand.length === 1) {
          dealerHand.push({ card, back: true });
        } else {
          dealerHand.push({ card, back: false });
        }
      } else {
        playerHand.push({ card, back: false });
      }
    });

    return {
      playerHand,
      dealerHand,
    };
  };

  const getHandValue = (hand, ignoreBack = true) => {
    let value = 0;
    let numOfAces = 0;

    hand.forEach((card) => {
      let flag = true;
      if (ignoreBack & card.back) {
        flag = false;
      }

      if (flag) {
        switch (card.card.value) {
          case "JACK":
          case "QUEEN":
          case "KING":
            value += 10;
            break;
          case "ACE":
            numOfAces++;
            break;
          default:
            value += parseInt(card.card.value);
            break;
        }
      }
    });

    let total = 0;
    total = value + numOfAces * 11;
    if (total > 21) {
      let i = numOfAces;
      while (i > 0) {
        total -= 10;
        if (total < 21) {
          break;
        }
        i--;
      }
    }

    return total;
  };

  const resolveRound = (gameState) => {
    const handValue = gameState[gameState.length - 1].handValue;
    const bet = gameState[gameState.length - 1].bet;
    const balance = gameState[gameState.length - 1].balance;
    let newBalance, result;
    // Resolve round
    if (handValue.playerValue === 21) {
      // Player has blackjack -- player gets back 1.5 X bet
      newBalance = balance + 1.5 * bet;
      result = "Player has blackjack. Player wins.";
    } else if (handValue.playerValue > 21) {
      // Player is busted -- player loses bet
      newBalance = balance;
      result = "Player is busted. Player loses bet.";
    } else if (handValue.dealerValue > 21) {
      // Dealer is busted -- player gets back 1.5 X bet;
      newBalance = balance + 1.5 * bet;
      result = "Dealer is busted. Player wins.";
    } else {
      if (handValue.playerValue - handValue.dealerValue > 0) {
        // Player wins -- player gets back 1.5 X bet
        newBalance = balance + 1.5 * bet;
        result = "Player wins.";
      } else if (handValue.playerValue - handValue.dealerValue === 0) {
        // Push
        newBalance = balance + bet;
        result = "Push.";
      } else {
        // Player loses bet
        newBalance = balance;
        result = "Player loses bet.";
      }
    }

    return {
      newBalance,
      result,
    };
  };

  const resolveDealer = ({ gameState, setGameState }) => {
    // First check dealer's hand
    const hands = gameState[gameState.length - 1].hands;
    const dealerValue = getHandValue(hands.dealerHand, false);
    const mappedDealerHand = gameState[
      gameState.length - 1
    ].hands.dealerHand.map((item) => {
      return {
        card: item.card,
        back: false,
      };
    });

    if (dealerValue >= 17) {
      console.log("DEALER'S NOT DRAWING ANYMORE");
      setGameState((prevState) => {
        const currRound = prevState[prevState.length - 1];
        const result =
          dealerValue >= 17 && dealerValue <= 21
            ? "Dealer is not drawing anymore."
            : "Dealer is busted.";
        if (prevState.length === 1) {
          return [
            {
              ...currRound,
              handValue: {
                ...currRound.handValue,
                dealerValue,
              },
              hands: {
                ...currRound.hands,
                dealerHand: [...mappedDealerHand],
              },
              isRoundFinished: true,
              message: result,
              result,
            },
          ];
        } else {
          return [
            ...prevState.slice(0, prevState.length - 1),
            {
              ...currRound,
              handValue: {
                ...currRound.handValue,
                dealerValue,
              },
              hands: {
                ...currRound.hands,
                dealerHand: [...mappedDealerHand],
              },
              isRoundFinished: true,
              message: result,
              result,
            },
          ];
        }
      });

      return {
        status: true,
        dealerValue,
        mappedDealerHand,
      };
    } else {
      // Round continues
      return {
        status: false,
        dealerValue,
        mappedDealerHand,
      };
    }
  };

  return {
    dealCards,
    getHandValue,
    resolveRound,
    resolveDealer,
  };
})();

export default GameLogic;
