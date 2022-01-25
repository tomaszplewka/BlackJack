import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
  } catch (error) {
    // Show alert
    const swal = withReactContent(Swal);
    await swal.fire({
      title: <strong>Something went wrong!</strong>,
      html: <i>{`API error! ${error.message}`}</i>,
      icon: "error",
    });
  }
};

export const getDeck = async () => {
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
    return data.deck_id;
  } catch (error) {
    // Show alert
    const swal = withReactContent(Swal);
    await swal.fire({
      title: <strong>Something went wrong!</strong>,
      html: <i>{`API error! ${error.message}`}</i>,
      icon: "error",
    });
  }
};
