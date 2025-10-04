import React, { useState } from "react";
import "../styles/Navbar.css";

const Navbar = ({ onSearch, onCreateList }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => window.location.href = "/"}>
        🎬 MovieApp
      </div>

      {/* Search Bar */}
      <form className="navbar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Links */}
      <div className="navbar-links">
        <button onClick={() => window.location.href = "/watchlist"}>
          Watchlist
        </button>
        <button onClick={() => window.location.href = "/mylist"}>
          My Lists
        </button>
        <button onClick={onCreateList}>
          ➕ Create List
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
