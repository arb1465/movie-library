// src/components/MovieCard.jsx - MODIFICATION
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getImageUrl } from '../utils/tmdbApi';
import '../styles/MovieCard.css';

function MovieCard({ movie, currentUser, onAddToWatchlist, onAddToListCustom, children }) {
  const posterUrl = getImageUrl(movie.poster_path);
  const isAuthenticated = !!currentUser;

  const handleAddToWatchlist = (e) => {
    e.stopPropagation(); // Prevent card click from triggering detail page navigation
    if (isAuthenticated) {
      onAddToWatchlist(movie);
    } else {
      alert('Please log in to add movies to your watchlist.');
    }
  };

  const handleAddToListCustom = (e) => {
    e.stopPropagation(); // Prevent card click from triggering detail page navigation
    if (isAuthenticated) {
      // This will now trigger the modal opening in HomePage
      onAddToListCustom(movie);
    } else {
      alert('Please log in to add movies to custom lists.');
    }
  };

  

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="movie-poster" />
        ) : (
          <div className="no-poster">No Poster Available</div>
        )}
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-release-date">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>

        {isAuthenticated && !children && (
          <div className="movie-actions">
            <button onClick={handleAddToWatchlist} className="btn-add-watchlist">
              Add to Watchlist
            </button>
            <button onClick={handleAddToListCustom} className="btn-add-custom">
              Add to List (Custom)
            </button>
          </div>
        )}

        {children}
      </div>
    </Link>
  );
}

export default MovieCard;