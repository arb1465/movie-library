// src/pages/WatchlistPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getWatchlistMovieIds, removeMovieFromWatchlist } from '../../src/db/dbHelpers';
import { fetchMovieDetails } from '../utils/tmdbApi';
import MovieCard from '../components/MovieCard';
import '../styles/WatchlistPage.css'; // Styling for this page

function WatchlistPage({ currentUser }) {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the fetch function to avoid re-creating on every render
  const fetchWatchlistMovies = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      setError('Please log in to view your watchlist.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const movieIds = await getWatchlistMovieIds(currentUser.id);
      if (movieIds.length === 0) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }

      // Fetch details for each movie ID concurrently
      const movieDetailsPromises = movieIds.map(id => fetchMovieDetails(id));
      const details = await Promise.all(movieDetailsPromises);

      // Filter out any null responses (e.g., movie not found on TMDB)
      setWatchlistMovies(details.filter(movie => movie !== null));
    } catch (err) {
      console.error('Error fetching watchlist movies:', err);
      setError('Failed to load watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // Dependency on currentUser

  useEffect(() => {
    fetchWatchlistMovies();
  }, [fetchWatchlistMovies]); // Re-run when fetchWatchlistMovies changes (due to currentUser)

  const handleRemoveFromWatchlist = async (movieId) => {
    if (!currentUser) {
      alert('You must be logged in to remove movies.');
      return;
    }
    try {
      await removeMovieFromWatchlist(currentUser.id, movieId);
      alert('Movie removed from watchlist!');
      // After removal, re-fetch the watchlist to update the UI
      fetchWatchlistMovies();
    } catch (err) {
      console.error('Error removing movie from watchlist:', err);
      alert('Failed to remove movie from watchlist.');
    }
  };

  if (!currentUser) {
    return (
      <div className="watchlist-page-container">
        <h2 className="watchlist-page-title">Your Watchlist</h2>
        <div className="watchlist-message login-prompt">Please log in to view your watchlist.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-page-container">
        <h2 className="watchlist-page-title">Your Watchlist</h2>
        <div className="watchlist-message">Loading watchlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watchlist-page-container">
        <h2 className="watchlist-page-title">Your Watchlist</h2>
        <div className="watchlist-message error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="watchlist-page-container">
      <h2 className="watchlist-page-title">Your Watchlist</h2>
      {watchlistMovies.length === 0 ? (
        <div className="watchlist-message no-movies-message">
          Your watchlist is empty. Go to the <a href="/" className="link">Home</a> page to add some movies!
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlistMovies.map(movie => (
            // Reusing MovieCard, but overriding the actions for watchlist context
            <MovieCard
              key={movie.id}
              movie={movie}
              // We'll hide the add buttons on this page
              currentUser={null} // Pass null or a flag to hide "add" buttons
              onAddToWatchlist={() => {}} // No-op
              onAddToListCustom={() => {}} // No-op
            >
              <div className="watchlist-actions">
                <button
                  onClick={() => handleRemoveFromWatchlist(movie.id)}
                  className="btn-remove-watchlist"
                >
                  Remove from Watchlist
                </button>
              </div>
            </MovieCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistPage;