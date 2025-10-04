import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../db/dbHelpers";
import "../styles/Watchlist.css";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    const data = await getWatchlist();
    setMovies(data);
  }

  async function handleRemove(id) {
    await removeFromWatchlist(id);
    loadWatchlist();
  }

  return (
    <div>
      <h2>My Watchlist</h2>
      <ul>
        {movies.map((m) => (
          <li key={m.id}>
            {m.title}
            <button onClick={() => handleRemove(m.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}