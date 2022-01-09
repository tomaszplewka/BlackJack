import React, { useState, useEffect } from "react";
import { getDeck } from "./components/modules/Api";
import Table from "./components/table/Table";
import Loader from "./components/loader/Loader";

const App = () => {
  const [deckId, setDeckId] = useState("");
  useEffect(() => {
    setTimeout(() => {
      getDeck(setDeckId);
    }, 1500);
  }, []);

  return (
    <section>
      {deckId ? (
        <>
          <Table deckId={deckId} />
        </>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default App;
