// src/components/GenreFilter.jsx
import React, { useState, useEffect } from 'react';
import { fetchMovieGenres } from '../utils/tmdbApi';
import '../styles/GenreFilter.css';

function GenreFilter({ onSelectGenre }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  useEffect(() => {
    const getGenres = async () => {
      const tmdbGenres = await fetchMovieGenres();
      setGenres(tmdbGenres);
    };
    getGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    setSelectedGenreId(genreId === selectedGenreId ? null : genreId); // Toggle selection
    onSelectGenre(genreId === selectedGenreId ? null : genreId); // Notify parent
  };

  return (
    <div className="genre-filter">
      <button
        className={`genre-button ${selectedGenreId === null ? 'active' : ''}`}
        onClick={() => handleGenreClick(null)}
      >
        All Popular
      </button>
      <button
        className={`genre-button ${selectedGenreId === 'trending' ? 'active' : ''}`}
        onClick={() => handleGenreClick('trending')}
      >
        Trending
      </button>
      {genres.map(genre => (
        <button
          key={genre.id}
          className={`genre-button ${selectedGenreId === genre.id ? 'active' : ''}`}
          onClick={() => handleGenreClick(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;