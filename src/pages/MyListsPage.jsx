// src/pages/MyListsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  getCustomListsForUser,
  removeMovieFromCustomList,
  deleteCustomList,
} from '../../src/db/dbHelpers';
import { fetchMovieDetails } from '../../src/utils/tmdbAPI';
import MovieCard from '../components/MovieCard';
import '../styles/MyListsPage.css';

function MyListsPage({ currentUser }) {
  const [customLists, setCustomLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedListId, setExpandedListId] = useState(null); // To toggle list expansion

  const fetchUserLists = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      setError('Please log in to view your custom lists.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const lists = await getCustomListsForUser(currentUser.id);

      // For each list, fetch movie details
      const listsWithMovieDetailsPromises = lists.map(async (list) => {
        if (list.movieIds && list.movieIds.length > 0) {
          const movieDetailsPromises = list.movieIds.map(id => fetchMovieDetails(id));
          const movieDetails = await Promise.all(movieDetailsPromises);
          // Filter out any null responses if a movie couldn't be found
          return { ...list, movies: movieDetails.filter(movie => movie !== null) };
        }
        return { ...list, movies: [] };
      });

      const listsWithMovies = await Promise.all(listsWithMovieDetailsPromises);
      setCustomLists(listsWithMovies);
    } catch (err) {
      console.error('Error fetching custom lists:', err);
      setError('Failed to load your custom lists. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // Dependency on currentUser

  useEffect(() => {
    fetchUserLists();
  }, [fetchUserLists]);

  const handleToggleList = (listId) => {
    setExpandedListId(prevId => (prevId === listId ? null : listId));
  };

  const handleRemoveMovieFromList = async (listId, movieId, listName) => {
    if (!currentUser) {
      alert('You must be logged in to remove movies.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove this movie from "${listName}"?`)) {
        try {
            await removeMovieFromCustomList(listId, movieId);
            alert('Movie removed from list!');
            fetchUserLists(); // Re-fetch to update the UI
        } catch (err) {
            console.error('Error removing movie from custom list:', err);
            alert('Failed to remove movie from list.');
        }
    }
  };

  const handleDeleteList = async (listId, listName) => {
    if (!currentUser) {
      alert('You must be logged in to delete lists.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the list "${listName}"? This action cannot be undone.`)) {
        try {
            await deleteCustomList(listId);
            alert(`List "${listName}" deleted!`);
            fetchUserLists(); // Re-fetch to update the UI
        } catch (err) {
            console.error('Error deleting custom list:', err);
            alert('Failed to delete list.');
        }
    }
  };


  if (!currentUser) {
    return (
      <div className="mylists-page-container">
        <h2 className="mylists-page-title">Your Custom Lists</h2>
        <div className="mylists-message login-prompt">Please log in to view your custom lists.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mylists-page-container">
        <h2 className="mylists-page-title">Your Custom Lists</h2>
        <div className="mylists-message">Loading your lists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mylists-page-container">
        <h2 className="mylists-page-title">Your Custom Lists</h2>
        <div className="mylists-message error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="mylists-page-container">
      <h2 className="mylists-page-title">Your Custom Lists</h2>
      {customLists.length === 0 ? (
        <div className="mylists-message no-lists-message">
          You haven't created any custom lists yet.
          <br />
          Click the "Create List" button in the navigation bar to get started!
        </div>
      ) : (
        <div className="custom-lists-container">
          {customLists.map(list => (
            <div key={list.listId} className="custom-list-card">
              <div className="list-header" onClick={() => handleToggleList(list.listId)}>
                <h3 className="list-name">{list.name} ({list.movies.length} movies)</h3>
                <span className="toggle-icon">
                  {expandedListId === list.listId ? '▲' : '▼'}
                </span>
              </div>
              {list.description && <p className="list-description">{list.description}</p>}

              {expandedListId === list.listId && (
                <div className="list-movies-grid">
                  {list.movies.length > 0 ? (
                    list.movies.map(movie => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        currentUser={null} // Hide add buttons in this context
                        onAddToWatchlist={() => {}}
                        onAddToListCustom={() => {}}
                      >
                        <div className="list-movie-actions">
                          <button
                            onClick={() => handleRemoveMovieFromList(list.listId, movie.id, list.name)}
                            className="btn-remove-from-list"
                          >
                            Remove
                          </button>
                        </div>
                      </MovieCard>
                    ))
                  ) : (
                    <p className="no-movies-in-list">No movies in this list yet.</p>
                  )}
                </div>
              )}
              <div className="list-footer-actions">
                <button
                    onClick={() => handleDeleteList(list.listId, list.name)}
                    className="btn-delete-list"
                >
                    Delete List
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListsPage;