import React from "react";
import Btn from "../btn/Btn";

const LoadedRounds = ({
  cb,
  gameState,
  setGameState,
  setIsMenuOpen,
  setShowLoader,
  setIsLoadOpen,
}) => {
  const onBtnClick = (e) => {
    // Show loader
    setShowLoader(true);
    // Set state
    setTimeout(() => {
      const roundToLoad = e.target.getAttribute("data-key");
      setGameState((prevState) => {
        return [...prevState.slice(0, roundToLoad)];
      });
      // Close LoadedRounds
      setIsLoadOpen(false);
      // Close menu
      setIsMenuOpen(false);
      // Hide loader
      setTimeout(() => {
        setShowLoader(false);
        // Toggle overflow hidden on body
        document.body.classList.toggle("overflow-hidden");
      }, 300);
    }, 1500);
  };

  const renderedRounds = gameState.slice(1).map((round, index) => {
    return (
      <Btn key={index + 1} className="btn">
        <span
          data-key={index + 1}
          onClick={(e) => {
            onBtnClick(e);
          }}
        >{`End of Round ${index + 1}`}</span>
      </Btn>
    );
  });

  return (
    <div className="loaded-rounds">
      <div className="btn-wrapper">
        <Btn className="control-btn">
          <span onClick={() => cb(false)}>go back</span>
        </Btn>
      </div>
      <ul className="results-wrapper">
        {gameState.length === 1 ? <p>NO ROUNDS TO LOAD</p> : renderedRounds}
      </ul>
    </div>
  );
};

export default LoadedRounds;
