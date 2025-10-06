// src/components/CreateListModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomList, doesCustomListNameExist } from '../db/dbHelpers';
import '../styles/CreateListModal.css';

function CreateListModal({ isOpen, onClose, currentUser }) {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null; // Don't render if not open

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!currentUser) {
      setError('You must be logged in to create a list.');
      return;
    }
    if (!listName.trim()) {
      setError('List name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      // Check if list name already exists for this user
      const nameExists = await doesCustomListNameExist(currentUser.id, listName.trim());
      if (nameExists) {
        setError(`A list named "${listName.trim()}" already exists. Please choose a different name.`);
        return;
      }

      await createCustomList(currentUser.id, listName.trim(), description.trim());
      alert(`Custom list "${listName.trim()}" created successfully!`);
      setListName(''); // Clear form fields
      setDescription('');
      onClose(); // Close the modal
      navigate('/'); // Redirect to the home page
    } catch (err) {
      console.error('Error creating custom list:', err);
      setError('Failed to create list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Prevent click from closing modal */}
        <h3>Create New Movie List</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="listName">List Name:</label>
            <input
              type="text"
              id="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional):</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              disabled={loading}
            ></textarea>
          </div>
          {error && <p className="modal-error-message">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? 'Creating...' : 'Create List'}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListModal;