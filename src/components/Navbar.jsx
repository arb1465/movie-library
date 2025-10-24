// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/Navbar.css';

function Navbar({ currentUser, onLogin, onLogout }) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Movie Library</Link>
      </div>

      <div className="navbar-right">
        {/* Desktop Links */}
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          {currentUser && <li><Link to="/watchlist" className={isActive('/watchlist')}>Watchlist</Link></li>}
          {currentUser && <li><Link to="/mylists" className={isActive('/mylists')}>My Lists</Link></li>}
          {currentUser && <li><Link to="/create-list" className={isActive('/create-list')}>Create List</Link></li>}
        </ul>

        {/* Desktop Search Bar */}
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        {/* Google Login Button */}
        <GoogleLoginButton
          onLoginSuccess={onLogin}
          onLogout={onLogout}
          currentUser={currentUser}
        />

        {/* Hamburger (visible on mobile only) */}
        <div
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {currentUser && <Link to="/watchlist" onClick={() => setIsMenuOpen(false)}>Watchlist</Link>}
          {currentUser && <Link to="/mylists" onClick={() => setIsMenuOpen(false)}>My Lists</Link>}
          {currentUser && <Link to="/create-list" onClick={() => setIsMenuOpen(false)}>Create List</Link>}

          <form className="mobile-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <GoogleLoginButton
            onLoginSuccess={onLogin}
            onLogout={onLogout}
            currentUser={currentUser}
          />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
