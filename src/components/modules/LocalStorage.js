const LocalStorage = (() => {
  const setTopResults = (result) => {
    const topResults = getFromLS("results");
    if (topResults === null) {
      // No results in local storage
      const data = { results: [result] };
      localStorage.setItem("results", JSON.stringify(data));
    } else {
      // Append new top result
      topResults.results.push(result);
      // Sort top results
      topResults.results.sort((a, b) => b - a);
      // Keep top 5 results
      if (topResults.results.length > 5) {
        topResults.results.pop();
      }
      localStorage.setItem("results", JSON.stringify(topResults));
    }
  };
  const getFromLS = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  return {
    setTopResults,
    saveToLocalStorage,
    getFromLS,
  };
})();

export default LocalStorage;
