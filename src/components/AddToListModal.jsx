// src/components/AddToListModal.jsx
import React, { useState, useEffect } from 'react';
import { getCustomListsForUser, addMovieToCustomList } from '../db/dbHelpers';
import '../styles/AddToListModal.css';

function AddToListModal({ isOpen, onClose, currentUser, movieToAdd }) {
  const [userCustomLists, setUserCustomLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      const fetchLists = async () => {
        setLoading(true);
        setError('');
        try {
          const lists = await getCustomListsForUser(currentUser.id);
          setUserCustomLists(lists);
          if (lists.length > 0) {
            setSelectedListId(lists[0].listId); // Select the first list by default
          } else {
            setSelectedListId('');
          }
        } catch (err) {
          console.error('Error fetching custom lists for modal:', err);
          setError('Failed to load your custom lists.');
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !movieToAdd) return null;

  const handleAddMovie = async () => {
    setError('');
    if (!selectedListId) {
      setError('Please select a list.');
      return;
    }

    setLoading(true);
    try {
      // Check if the movie is already in the selected list
      const selectedList = userCustomLists.find(list => list.listId === selectedListId);
      if (selectedList && selectedList.movieIds.includes(movieToAdd.id)) {
        setError(`${movieToAdd.title} is already in this list!`);
        return;
      }

      await addMovieToCustomList(selectedListId, movieToAdd.id);
      alert(`${movieToAdd.title} added to your selected list!`);
      onClose(); // Close after success
    } catch (err) {
      console.error('Error adding movie to custom list:', err);
      setError('Failed to add movie to list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Add "{movieToAdd.title}" to a List</h3>
        {loading ? (
          <p className="modal-message">Loading lists...</p>
        ) : userCustomLists.length === 0 ? (
          <p className="modal-message">
            You don't have any custom lists yet. Please create one first!
            <br />
            (You can click "Create List" in the navigation bar)
          </p>
        ) : (
          <div className="form-group">
            <label htmlFor="selectList">Choose a list:</label>
            <select
              id="selectList"
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              disabled={loading}
            >
              {userCustomLists.map(list => (
                <option key={list.listId} value={list.listId}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="modal-error-message">{error}</p>}

        <div className="modal-actions">
          <button
            onClick={handleAddMovie}
            className="btn-add-movie"
            disabled={loading || userCustomLists.length === 0 || !selectedListId}
          >
            {loading ? 'Adding...' : 'Add Movie'}
          </button>
          <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToListModal;