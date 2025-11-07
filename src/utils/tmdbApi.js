import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// ===== Utility: Centralized Error Handler =====
const handleApiError = (error, context = "") => {
  if (error.response) {
    // TMDB responded but with an error status (e.g., 500, 503)
    if (error.response.status >= 500) {
      console.error(`TMDB Server Error (${context}):`, error.message);
      alert("TMDB servers are currently down. Please try again later.");
    } else {
      console.error(`TMDB API Error (${context}):`, error.response.data);
    }
  } else if (error.request) {
    // No response from TMDB (possibly downtime or network issue)
    console.error(`TMDB Unreachable (${context}):`, error.message);
    alert("TMDB website is currently unreachable. Please try again after some time.");
  } else {
    // Request setup error
    console.error(`Error (${context}):`, error.message);
  }
  return null; // default safe fallback
};

// ===== API Key Check =====
if (!API_KEY) {
  console.error("Missing VITE_TMDB_API_KEY environment variable.");
}

// ===== API Calls =====
export const fetchPopularMovies = async () => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    handleApiError(error, "fetchPopularMovies");
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  if (!API_KEY || !movieId) return null;
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `fetchMovieDetails (ID: ${movieId})`);
    return null;
  }
};

export const fetchMoviesByGenre = async (genreId) => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    return response.data.results;
  } catch (error) {
    handleApiError(error, `fetchMoviesByGenre (Genre: ${genreId})`);
    return [];
  }
};

export const fetchTrendingMovies = async () => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    handleApiError(error, "fetchTrendingMovies");
    return [];
  }
};

export const fetchMovieGenres = async () => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    handleApiError(error, "fetchMovieGenres");
    return [];
  }
};

export const searchMovies = async (query) => {
  if (!API_KEY || !query) {
    return { results: [], total_pages: 0, total_results: 0 };
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `searchMovies (Query: ${query})`);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};

// ===== Image Helpers =====
export const getImageUrl = (path, size = "w500") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path, size = "w1280") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}${size}${path}`;
};
