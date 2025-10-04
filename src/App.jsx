import React from "react";
import Movies from "./components/Movies";
import Watchlist from "./components/WatchList";
import Lists from "./components/Lists";
import Navbar from "./components/Navbar";

import "./App.css";

export default function App() {
  return (
    <div>
      <Navbar />
      <h1>Movie App</h1>

      <Movies />
      <Watchlist />
      <Lists />
    </div>
  );
}
