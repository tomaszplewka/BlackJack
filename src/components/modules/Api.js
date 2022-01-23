import axios from "axios";

export const drawCards = async (deckId, numOfCards) => {
  try {
    const { data } = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw`,
      {
        params: {
          count: numOfCards,
          format: "json",
        },
      }
    );
    return data.cards;
  } catch (e) {
    // COME UP WITH SOMETHING BETTER
    console.error("Error");
    return null;
  }
};

export const getDeck = async (setAppState) => {
  try {
    const { data } = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/shuffle",
      {
        params: {
          deck_count: 6,
          format: "json",
        },
      }
    );
    // Set state
    setAppState((prevState) => ({
      ...prevState,
      deckId: data.deck_id,
      showLoader: false,
      getNewDeck: false,
    }));
  } catch (e) {
    // COME UP WITH SOMETHING BETTER
    console.error("Error");
  }
};
