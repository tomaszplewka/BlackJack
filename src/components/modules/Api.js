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

export const getDeck = async (setDeckId) => {
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
    setDeckId(data.deck_id);
  } catch (e) {
    // COME UP WITH SOMETHING BETTER
    console.error("Error");
  }
};
