// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
// Assuming you have a GoogleLoginButton component
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/Navbar.css'; // Ensure you're importing the consolidated CSS

function Navbar({ currentUser, onLogout, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false); // Function to close menu, e.g., after clicking a link
  };

  return (
    // Use the 'header' class for the main navbar container
    <header className="header">
      <div className="header-left">
        <div className="brand">
          <Link to="/" onClick={closeMobileMenu}>Movie Library</Link> {/* Close menu on brand click */}
        </div>

        {/* Hamburger Icon - Only visible on mobile */}
        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        <div className={`nav-and-controls ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="main-nav">
            <ul>
              <li>
                <Link
                  to="/"
                  className={location.pathname === '/' ? 'active' : ''}
                  onClick={closeMobileMenu}
                >Home</Link>
              </li>
              {currentUser && (
                <li>
                  <Link
                    to="/watchlist"
                    className={location.pathname === '/watchlist' ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >Watchlist</Link>
                </li>
              )}
              {currentUser && (
                <li>
                  <Link
                    to="/custom-lists"
                    className={location.pathname === '/custom-lists' ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >My Lists</Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-right"> 
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search movies..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-button">Search</button>
            </form>

            <div className="user-controls">
              {currentUser ? (
                <div className="user-info">
                  <span>Hello, {currentUser.displayName || 'User'}!</span>
                  <button onClick={() => { onLogout(); closeMobileMenu(); }} className="logout-button">Logout</button>
                </div>
              ) : (
                <GoogleLoginButton onLoginSuccess={closeMobileMenu} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;