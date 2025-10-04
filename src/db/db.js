import Dexie from "dexie";

// Create DB
const db = new Dexie("MovieAppDB");

// Define stores (tables) - declared fields will be used to query the data
db.version(1).stores({
  watchlist: "++id,movieId,title", // default watchlist
  lists: "++id,name"               // user-created lists
});

export default db;