// src/db/db.js
import Dexie from 'dexie';

const db = new Dexie('MovieLibraryDB');

db.version(1).stores({
  watchlist: '&userId, movieIds',
  customLists: '&listId, userId, name, movieIds',
});

export default db;