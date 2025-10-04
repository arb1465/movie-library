import React, { useEffect, useState } from "react";
import { fetchPopularMovies } from "../api/moviesApi";
import { addToWatchlist, addMovieToList } from "../db/dbHelpers";
import "../styles/Movies.css";

export default function Movies({ listId = null }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    const data = await fetchPopularMovies();
    setMovies(data);
  }

  async function handleAddToWatchlist(movie) {
    await addToWatchlist({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path
    });
    alert(`${movie.title} added to watchlist`);
  }

  async function handleAddToList(movie) {
    if (!listId) return;

    await addMovieToList(listId, {
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path
    });
    alert(`${movie.title} added to list`);
  }

  return (
    <div>
      <h2>Popular Movies</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            <h3>{movie.title}</h3>
            <button onClick={() => handleAddToWatchlist(movie)}>Add to Watchlist</button>
            {listId && <button onClick={() => handleAddToList(movie)}>Add to List</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
