// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook to get query parameters
import { searchMovies } from '../utils/tmdbApi'; // Your API utility
import MovieCard from '../components/MovieCard'; // Your MovieCard component
import '../styles/HomePage.css'; // Assuming movie-grid and movie-card use this

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams(); // Get URL search parameters
  const query = searchParams.get('q'); // Get the 'q' parameter

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query);
        setSearchResults(data.results);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); // Re-run effect when the 'q' query parameter changes

  if (loading) return <p className="loading-message">Loading search results...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="search-results-page-container">
      <h2 className="page-title">Search Results for "{query}"</h2>
      {searchResults.length === 0 && !loading && (
        <p className="no-movies">No movies found for your search.</p>
      )}
      <div className="movie-grid"> {/* Use your existing movie grid class */}
        {searchResults.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type="search" />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;