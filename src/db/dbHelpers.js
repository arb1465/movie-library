import db from "./db";

// Add movie to default watchlist
export async function addToWatchlist(movie) {
  return await db.watchlist.add(movie);
}

// Get all watchlist movies
export async function getWatchlist() {
  return await db.watchlist.toArray();
}

// Remove movie
export async function removeFromWatchlist(id) {
  return await db.watchlist.delete(id);
}

// Create new list
export async function createList(name) {
  return await db.lists.add({ name, movies: [] });
}

// Get all lists
export async function getLists() {
  return await db.lists.toArray();
}

// Add movie to a list
export async function addMovieToList(listId, movie) {
  const list = await db.lists.get(listId);
  if (list) {
    list.movies.push(movie);
    await db.lists.put(list); // update list with new movie
  }
}

// Remove movie from list
export async function removeMovieFromList(listId, movieId) {
  const list = await db.lists.get(listId);
  if (list) {
    list.movies = list.movies.filter((m) => m.movieId !== movieId);
    await db.lists.put(list);
  }
}