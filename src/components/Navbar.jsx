// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import GoogleLoginButton from './GoogleLoginButton'; // Assuming GoogleLoginButton is robust enough to handle its own UI based on props
import '../styles/Navbar.css'; // Don't forget to create/update this CSS file

function Navbar({ currentUser, onLogin, onLogout }) {
  const location = useLocation(); // Now useLocation is called within the Navbar component itself

  // Function to determine if a link is active (for styling)
  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Placeholder for search functionality for now
  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value;
    console.log('Searching for:', searchTerm);
    // TODO: Implement actual search functionality here, e.g., navigate('/search?q=' + searchTerm);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Movie Library</Link>
        <ul className="nav-links">
          {/* Always show Home */}
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          {/* Only show Watchlist, My Lists, Create List if user is logged in */}
          {currentUser && <li><Link to="/watchlist" className={isActive('/watchlist')}>Watchlist</Link></li>}
          {currentUser && <li><Link to="/mylists" className={isActive('/mylists')}>My Lists</Link></li>}
          {/* Create List will now navigate and App.jsx's useEffect handles the modal */}
          {currentUser && <li><Link to="/create-list" className={isActive('/create-list')}>Create List</Link></li>}
        </ul>
      </div>

      <div className="navbar-right">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input type="text" name="search" placeholder="Search movies..." />
          <button type="submit">Search</button>
        </form>

        {/* Google Login/Logout Button */}
        {/* Pass props directly to GoogleLoginButton, it will handle its own display */}
        <GoogleLoginButton onLoginSuccess={onLogin} onLogout={onLogout} currentUser={currentUser} />
      </div>
    </nav>
  );
}

export default Navbar;