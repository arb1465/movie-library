import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // For movie posters

if (!API_KEY) {
  console.error("Missing VITE_TMDB_API_KEY environment variable.");
}

export const fetchPopularMovies = async () => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
    if (!API_KEY || !movieId) return null;
    try {
        // Use 'append_to_response' to get credits (cast/crew) and videos (trailers) in one request
        const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
        return response.data;
    } 
    catch (error) {
        console.error(`Error fetching movie details for ID ${movieId}:`, error);
        return null;
    }
};


// For the blurred background, we often use a larger size like 'w1280' or 'original'
export const getBackdropUrl = (path, size = 'w1280') => {
    if (!path) return '';
    return `${IMAGE_BASE_URL}${size}${path}`;
}

export const fetchMoviesByGenre = async (genreId) => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};

export const fetchTrendingMovies = async () => {
  if (!API_KEY) return [];
  try {
    // Trending movies of the day
    const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

export const fetchMovieGenres = async () => {
  if (!API_KEY) return [];
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return [];
  }
};

export const getImageUrl = (path) => {
    if (!path) return '';
    return `${IMAGE_BASE_URL}${path}`;
}

export const searchMovies = async (query) => {
  if (!API_KEY) {
    console.error("API_KEY is not defined for search.");
    return { results: [], total_pages: 0, total_results: 0 };
  }
  if (!query) {
    return { results: [], total_pages: 0, total_results: 0 }; // Return empty if no query
  }
  try {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    return response.data; // This will contain { results: [], total_pages: X, total_results: Y }
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 0, total_results: 0 };
  }
};