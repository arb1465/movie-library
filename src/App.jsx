// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import CreateListModal from './components/CreateListModal';
import AddToListModal from './components/AddToListModal'; // Import AddToListModal
import Navbar from './components/Navbar'; // Import the new Navbar component

import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import MyListsPage from './pages/MyListsPage';
import SearchResultsPage from './pages/SearchResultPage';

import './App.css';

function AppContentManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [movieToAdd, setMovieToAdd] = useState(null);

  const location = useLocation(); // Now correctly within the BrowserRouter context (from main.jsx)
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Effect for /create-list redirection and modal opening
  useEffect(() => {
    if (location.pathname === '/create-list') {
      if (currentUser) {
        setIsCreateListModalOpen(true);
      } else {
        navigate('/');
        alert('Please log in to create a custom list.');
      }
    } else {
      setIsCreateListModalOpen(false);
    }

    if (location.pathname !== '/') {
        setIsAddToListModalOpen(false);
        setMovieToAdd(null);
    }
  }, [location.pathname, currentUser, navigate]);


  // Login function
  const handleLogin = useCallback((userInfo) => {
    setCurrentUser(userInfo);
    localStorage.setItem('currentUser', JSON.stringify(userInfo)); // Persist user
    console.log('User logged in:', userInfo);
    // If user logs in while on '/create-list', open the modal
    if (location.pathname === '/create-list') {
      setIsCreateListModalOpen(true);
    }
  }, [location.pathname]);

  // Logout function
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear user from storage
    console.log('User logged out.');
    setIsCreateListModalOpen(false);
    setIsAddToListModalOpen(false);
    // Redirect relevant pages to home on logout
    if (location.pathname === '/watchlist' || location.pathname === '/mylists' || location.pathname === '/create-list') {
        navigate('/');
    }
  }, [location.pathname, navigate]);


  const closeCreateListModal = useCallback(() => {
    setIsCreateListModalOpen(false);
    navigate('/'); // Always redirect to home after closing modal
  }, [navigate]);

  const openAddToListModal = useCallback((movie) => {
    if (!currentUser) {
      alert('Please log in to add movies to custom lists.');
      return;
    }
    setMovieToAdd(movie);
    setIsAddToListModalOpen(true);
  }, [currentUser]);

  const closeAddToListModal = useCallback(() => {
    setIsAddToListModalOpen(false);
    setMovieToAdd(null);
  }, []);


  return (
    <div className="app-container">
      {/* Render the new Navbar component here, passing necessary props */}
      <Navbar
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} onAddToListCustom={openAddToListModal}/>} />
          <Route path="/movie/:id" element={<MovieDetailPage currentUser={currentUser} />} />
          <Route path="/watchlist" element={<WatchlistPage currentUser={currentUser} />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/mylists" element={<MyListsPage currentUser={currentUser} />} />
          <Route path="/create-list" element={null} /> 

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>

      {/* Modals remain here as they need access to the App's state */}
      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={closeCreateListModal}
        currentUser={currentUser}
      />
      <AddToListModal
        isOpen={isAddToListModalOpen}
        onClose={closeAddToListModal}
        currentUser={currentUser}
        movieToAdd={movieToAdd}
      />
    </div>
  );
}

// This is the component that main.jsx will import and render directly inside BrowserRouter
function App() {
  return <AppContentManager />;
}

export default App;