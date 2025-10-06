// src/pages/MovieDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl, getBackdropUrl } from '../utils/tmdbApi';
import { addMovieToWatchlist, fetchUserCustomLists, addMovieToCustomList } from '../../src/db/dbHelpers'; 
import CustomListSelectionModal from '../components/CustomListSelectionModal';
import '../styles/MovieDetailPage.css';

function MovieDetailPage({ currentUser }) {
  const { id } = useParams(); // Get movie ID from URL
  
  console.log("Movie ID from useParams:", id); // <--- ADD THIS LINE
  console.log("Type of movie ID:", typeof id); // <--- AND THIS LINE
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userCustomLists, setUserCustomLists] = useState([]); // State for user's custom lists
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedListsForAdding, setSelectedListsForAdding] = useState([]);

  useEffect(() => {
    const getMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieDetails = await fetchMovieDetails(id);
        if (movieDetails) {
          setMovie(movieDetails);
        } else {
          setError('Movie not found or failed to fetch details.');
        }

        if (currentUser && currentUser.id) {
          const lists = await fetchUserCustomLists(currentUser.id);
          setUserCustomLists(lists);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getMovie();
  }, [id, currentUser]); // Re-fetch if movie ID changes

  const getDirector = (crew) => {
    const director = crew.find(member => member.job === 'Director');
    return director ? director.name : 'N/A';
  };

  const getScreenplayWriters = (crew) => {
    const writers = crew.filter(member =>
      member.department === 'Writing' && (member.job === 'Screenplay' || member.job === 'Writer')
    );
    // Limit to 2 writers for display
    return writers.slice(0, 2).map(w => w.name).join(', ') || 'N/A';
  };

  const getTrailer = (videos) => {
    const trailer = videos.results.find(
      (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const handleAddToWatchlist = async () => {
    if (!currentUser) {
      alert('Please log in to add movies to your watchlist.');
      return;
    }
    if (!movie) return;
    try {
      await addMovieToWatchlist(currentUser.id, movie.id);
      alert(`${movie.title} added to your watchlist!`);
    } catch (err) {
      console.error('Failed to add movie to watchlist:', err);
      alert('Failed to add movie to watchlist.');
    }
  };

  const handleAddToListCustom = () => {
    if (!currentUser) {
      alert('Please log in to add movies to custom lists.');
      return;
    }

    if (!currentUser) {
      alert('Please log in to add movies to custom lists.');
      return;
    }
    // Open the modal instead of showing an alert
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedListsForAdding([]); // Clear selections when closing
  };

  const handleListSelectionChange = (listId) => {
    setSelectedListsForAdding(prevSelected => {
      if (prevSelected.includes(listId)) {
        return prevSelected.filter(id => id !== listId);
      } else {
        return [...prevSelected, listId];
      }
    });
  };

  const handleConfirmAddToLists = async () => {
    if (selectedListsForAdding.length === 0) {
      alert("Please select at least one list.");
      return;
    }
    if (!movie) {
      alert("Movie data not loaded yet.");
      return;
    }

    try {
      // Use your dbHelper to add the movie to selected lists
      await addMovieToCustomList(currentUser.id, movie.id, selectedListsForAdding);
      alert(`Movie "${movie.title}" added to selected custom lists!`);
      handleModalClose(); // Close modal after successful addition
      // Optionally re-fetch userCustomLists if movie counts need to be updated immediately
      if (currentUser && currentUser.id) {
        const updatedLists = await fetchUserCustomLists(currentUser.id);
        setUserCustomLists(updatedLists);
      }

    } catch (err) {
      console.error("Error adding movie to custom lists:", err);
      alert("Failed to add movie to custom lists. " + err.message);
    }
  };

  if (loading) return <div className="detail-loading-message">Loading movie details...</div>;
  if (error) return <div className="detail-error-message">{error}</div>;
  if (!movie) return null; // Should not happen if error is handled

  const posterPath = getImageUrl(movie.poster_path);
  const backdropPath = getBackdropUrl(movie.backdrop_path);
  const director = getDirector(movie.credits.crew);
  const screenplayWriters = getScreenplayWriters(movie.credits.crew);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const genres = movie.genres.map(g => g.name).join(', ') || 'N/A';
  const runtime = movie.runtime ? `${movie.runtime}m` : 'N/A';
  const trailerUrl = getTrailer(movie.videos);


  return (
    <div className="movie-detail-page">
      {backdropPath && (
        <div
          className="backdrop-background"
          style={{ backgroundImage: `url(${backdropPath})` }}
        ></div>
      )}

      <div className="detail-content-wrapper">
        <div className="detail-left-column">
          {posterPath ? (
            <img src={posterPath} alt={movie.title} className="detail-poster" />
          ) : (
            <div className="detail-no-poster">No Poster Available</div>
          )}
        </div>

        <div className="detail-right-column">
          <h1 className="detail-title">{movie.title} ({releaseYear})</h1>
          <p className="detail-meta">
            <span>{movie.release_date || 'N/A'} (IN)</span> •
            <span> {genres}</span> •
            <span> {runtime}</span>
          </p>

          <div className="detail-actions">
            {currentUser && (
              <>
                <button onClick={handleAddToWatchlist} className="btn-detail-action">
                  <i className="fa-solid fa-list"></i> Add to Watchlist
                </button>
                <button onClick={handleAddToListCustom} className="btn-detail-action">
                  <i className="fa-solid fa-bookmark"></i> Add to List (Custom)
                </button>
              </>
            )}
            {trailerUrl && (
              <a href={trailerUrl} target="_blank" rel="noopener noreferrer" className="btn-detail-action btn-play-trailer">
                <i className="fa-solid fa-play"></i> Play Trailer
              </a>
            )}
          </div>

          <h2 className="overview-title">Overview</h2>
          <p className="overview-text">{movie.overview || 'No overview available.'}</p>

          <div className="crew-info">
            <div className="crew-member">
              <p className="crew-name">{director}</p>
              <p className="crew-role">Director</p>
            </div>
            {screenplayWriters !== 'N/A' && ( // Only show if writers exist
                <div className="crew-member">
                <p className="crew-name">{screenplayWriters}</p>
                <p className="crew-role">Screenplay</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom List Selection Modal */}
      {isModalOpen && (
        <CustomListSelectionModal
          lists={userCustomLists}
          selectedLists={selectedListsForAdding}
          onListSelect={handleListSelectionChange}
          onConfirm={handleConfirmAddToLists}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default MovieDetailPage;