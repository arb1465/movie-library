import React, { useEffect, useState } from "react";
import { getLists, createList, removeMovieFromList } from "../db/dbHelpers";
import Movies from "./Movies";
import "../styles/Lists.css";

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    const data = await getLists();
    setLists(data);
  }

  async function handleCreateList() {
    if (!newListName) return;

    await createList(newListName);
    setNewListName("");
    loadLists();
  }

  async function handleRemoveMovie(listId, movieId) {
    await removeMovieFromList(listId, movieId);
    loadLists();
  }

  return (
    <div>
      <h2>My Lists</h2>
      <input 
        type="text" 
        value={newListName} 
        onChange={(e) => setNewListName(e.target.value)} 
        placeholder="New List Name"
      />
      <button onClick={handleCreateList}>Create List</button>

      {lists.map((list) => (
        <div key={list.id} style={{ marginTop: "20px" }}>
          <h3>{list.name}</h3>
          <Movies listId={list.id} /> {/* Add movies to this list */}
          <ul>
            {list.movies?.map((m) => (
              <li key={m.movieId}>
                {m.title}
                <button onClick={() => handleRemoveMovie(list.id, m.movieId)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}