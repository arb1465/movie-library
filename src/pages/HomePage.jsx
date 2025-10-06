// src/pages/HomePage.jsx - MODIFICATION
import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import GenreFilter from '../components/GenreFilter';
import {
  fetchPopularMovies,
  fetchMoviesByGenre,
  fetchTrendingMovies,
} from '../utils/tmdbAPI';
import { addMovieToWatchlist } from '../../src/db/dbHelpers';
import '../styles/HomePage.css';

// Accept onAddToListCustom prop
function HomePage({ currentUser, onAddToListCustom }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);
      let fetchedMovies = [];
      try {
        if (selectedGenre === 'trending') {
          fetchedMovies = await fetchTrendingMovies();
        } else if (selectedGenre) {
          fetchedMovies = await fetchMoviesByGenre(selectedGenre);
        } else {
          fetchedMovies = await fetchPopularMovies();
        }
        setMovies(fetchedMovies);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error('Error in HomePage fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [selectedGenre]);

  const handleAddToWatchlist = async (movie) => {
    if (!currentUser) {
      alert('Please log in to add movies to your watchlist.');
      return;
    }
    try {
      await addMovieToWatchlist(currentUser.id, movie.id);
      alert(`${movie.title} added to your watchlist!`);
    } catch (err) {
      console.error('Failed to add movie to watchlist:', err);
      alert('Failed to add movie to watchlist.');
    }
  };

  // Now, this directly calls the prop passed from App.jsx, which opens the modal
  const handleAddToListCustom = (movie) => {
    // onAddToListCustom will handle currentUser check and modal opening
    onAddToListCustom(movie);
  };


  if (loading) return <div className="loading-message">Loading movies...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      <h2 className="page-title">Discover Movies</h2>
      <GenreFilter onSelectGenre={setSelectedGenre} />

      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              currentUser={currentUser}
              onAddToWatchlist={handleAddToWatchlist}
              onAddToListCustom={handleAddToListCustom} // Pass the handler
            />
          ))
        ) : (
          <p className="no-movies-found">No movies found for this selection.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;