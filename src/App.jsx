// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
// We remove 'Router' here, as it should only be in main.jsx
// Keep 'Routes', 'Route', 'useLocation', 'useNavigate'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import GoogleLoginButton from './components/GoogleLoginButton'; // Keep this for now, but will move its logic
import CreateListModal from './components/CreateListModal';
import AddToListModal from './components/AddToListModal'; // Import AddToListModal
import Navbar from './components/Navbar'; // Import the new Navbar component

import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import MyListsPage from './pages/MyListsPage';

import './App.css';

// Renaming AppContent to App as this will be your main app component
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
      // Ensure modal is closed if navigating away from /create-list
      setIsCreateListModalOpen(false);
    }

    // Close AddToListModal if navigating away from '/' (HomePage)
    // This logic might need refinement if you want to open AddToListModal from other pages
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
        // If Navbar needs to know about create list modal directly for a button:
        // onOpenCreateListModal={() => {
        //   if (currentUser) {
        //     navigate('/create-list'); // This will trigger the useEffect to open modal
        //   } else {
        //     alert('Please log in to create a custom list.');
        //   }
        // }}
      />

      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} onAddToListCustom={openAddToListModal}/>} />
          <Route path="/movie/:id" element={<MovieDetailPage currentUser={currentUser} />} />
          <Route path="/watchlist" element={<WatchlistPage currentUser={currentUser} />} />
          <Route path="/mylists" element={<MyListsPage currentUser={currentUser} />} />
          {/* create-list route is handled by the useEffect above to open modal */}
          <Route path="/create-list" element={null} /> 
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