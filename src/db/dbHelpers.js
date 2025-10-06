// src/db/dbHelper.js
import db from './db';
import { v4 as uuidv4 } from 'uuid'; // For generating unique list IDs;

// --- Watchlist Functions ---

/**
 * Adds a movie to a user's watchlist.
 * If the watchlist for the user doesn't exist, it creates one.
 * @param {string} userId - The ID of the logged-in user.
 * @param {number} movieId - The ID of the movie to add.
 * @returns {Promise<void>}
 */
export async function addMovieToWatchlist(userId, movieId) {
  try {
    await db.watchlist.put({
      userId: userId,
      movieIds: await getWatchlistMovieIds(userId).then(ids => {
        const newIds = new Set(ids);
        newIds.add(movieId);
        return Array.from(newIds);
      })
    });
    console.log(`Movie ${movieId} added to ${userId}'s watchlist.`);
  } catch (error) {
    console.error('Error adding movie to watchlist:', error);
    throw error;
  }
}

/**
 * Removes a movie from a user's watchlist.
 * @param {string} userId - The ID of the logged-in user.
 * @param {number} movieId - The ID of the movie to remove.
 * @returns {Promise<void>}
 */
export async function removeMovieFromWatchlist(userId, movieId) {
  try {
    await db.watchlist.put({
      userId: userId,
      movieIds: await getWatchlistMovieIds(userId).then(ids => ids.filter(id => id !== movieId))
    });
    console.log(`Movie ${movieId} removed from ${userId}'s watchlist.`);
  } catch (error) {
    console.error('Error removing movie from watchlist:', error);
    throw error;
  }
}

/**
 * Retrieves all movie IDs from a user's watchlist.
 * @param {string} userId - The ID of the logged-in user.
 * @returns {Promise<number[]>} An array of movie IDs.
 */
export async function getWatchlistMovieIds(userId) {
  try {
    const watchlistEntry = await db.watchlist.get(userId);
    return watchlistEntry ? watchlistEntry.movieIds : [];
  } catch (error) {
    console.error('Error getting watchlist movie IDs:', error);
    return [];
  }
}

// --- Custom List Functions ---

// Your existing createCustomList function
export async function createCustomList(userId, listName, description = '') {
  const listId = uuidv4(); // Generate a unique ID for the list
  try {
    await db.customLists.add({
      listId,
      userId,
      name: listName,
      description,
      movieIds: [] // Initialize with an empty array of movie IDs
    });
    console.log(`Custom list "${listName}" created for user ${userId} with ID ${listId}.`);
    return listId;
  } catch (error) {
    console.error('Error creating custom list:', error);
    throw error;
  }
}


/**
 * Removes a movie from an existing custom list.
 * @param {string} listId - The ID of the custom list.
 * @param {number} movieId - The ID of the movie to remove.
 * @returns {Promise<void>}
 */
export async function removeMovieFromCustomList(listId, movieId) {
  try {
    await db.customLists.update(listId, {
      movieIds: await db.customLists.get(listId).then(list =>
        (list.movieIds || []).filter(id => id !== movieId)
      )
    });
    console.log(`Movie ${movieId} removed from custom list ${listId}.`);
  } catch (error) {
    console.error('Error removing movie from custom list:', error);
    throw error;
  }
}

/**
 * Deletes an entire custom list.
 * @param {string} listId - The ID of the custom list to delete.
 * @returns {Promise<void>}
 */
export async function deleteCustomList(listId) {
  try {
    await db.customLists.delete(listId);
    console.log(`Custom list ${listId} deleted.`);
  } catch (error) {
    console.error('Error deleting custom list:', error);
    throw error;
  }
}


// Your existing getCustomListsForUser function
export async function getCustomListsForUser(userId) {
  try {
    // This correctly uses Dexie.js to query by userId
    const lists = await db.customLists.where({ userId }).toArray();
    // Ensure movieIds array exists and is properly structured
    return lists.map(list => ({
        id: list.listId, // Dexie uses the primary key 'listId' as the ID
        ...list,
        movies: list.movieIds || [] // Assuming movieIds holds an array of simple IDs
    }));
  } catch (error) {
    console.error('Error getting custom lists for user:', error);
    return [];
  }
}


/**
 * Checks if a custom list with a given name already exists for the user.
 * @param {string} userId - The ID of the logged-in user.
 * @param {string} listName - The name of the list to check.
 * @returns {Promise<boolean>} True if a list with the name exists for the user, false otherwise.
 */
export async function doesCustomListNameExist(userId, listName) {
  try {
    const existingList = await db.customLists
      .where({ userId: userId, name: listName })
      .count();
    return existingList > 0;
  } catch (error) {
    console.error('Error checking for existing custom list name:', error);
    return false; // Assume it doesn't exist if there's an error
  }
}
// It replaces the Firebase Firestore-based fetchUserCustomLists.
export const fetchUserCustomLists = async (userId) => {
  try {
    // Use your existing getCustomListsForUser, which is already set up for Dexie
    const lists = await getCustomListsForUser(userId); // Renamed to use your existing helper

    // Dexie's list objects already have 'listId' as their primary key if defined as such.
    // Ensure the structure matches what the modal expects (e.g., 'id' field, and 'movies' array)
    return lists.map(list => ({
        id: list.listId, // Use listId as the generic 'id' for modal
        name: list.name,
        description: list.description,
        movies: list.movieIds || [] // Map movieIds to 'movies' for consistency with modal prop
    }));
  } catch (error) {
    console.error("Error fetching user custom lists (Dexie):", error);
    throw new Error("Failed to fetch custom lists.");
  }
};



export const addMovieToCustomList = async (userId, movieId, listIds) => {
  if (!userId || !movieId || !listIds || listIds.length === 0) {
    throw new Error("Invalid parameters for adding movie to custom lists.");
  }

  try {
    // No need to create movieData object if you only want to store the ID
    // const movieData = { tmdb_id: movieId }; // <-- REMOVE THIS

    for (const listId of listIds) {
      const listToUpdate = await db.customLists.get(listId);

      if (listToUpdate) {
        // Use a Set for efficient duplicate checking and uniqueness
        const currentMovieIds = new Set(listToUpdate.movieIds || []);
        
        // Check if the movie ID already exists
        if (!currentMovieIds.has(movieId)) { // <-- Check for movieId directly
            currentMovieIds.add(movieId); // <-- Add movieId directly
            await db.customLists.update(listId, {
                movieIds: Array.from(currentMovieIds),
            });
            console.log(`Movie ${movieId} added to custom list ${listId}.`);
        } else {
            console.log(`Movie ${movieId} already exists in custom list ${listId}.`);
        }
      } else {
        console.warn(`Custom list with ID ${listId} not found.`);
      }
    }
  } catch (error) {
    console.error("Error adding movie to custom lists (Dexie):", error);
    throw new Error("Failed to add movie to custom lists.");
  }
};