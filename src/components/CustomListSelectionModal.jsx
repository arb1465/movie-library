// src/components/CustomListSelectionModal.jsx
import React from 'react';
import '../styles/CustomListSelectionModal.css'; // Path to the CSS file

const CustomListSelectionModal = ({ lists, selectedLists, onListSelect, onConfirm, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add to Custom Lists</h2>
        {lists.length === 0 ? (
          <p>You don't have any custom lists yet. Create one on the "Create List" page!</p>
        ) : (
          <div className="list-options">
            {lists.map(list => (
              <div key={list.id} className="list-item">
                <input
                  type="checkbox"
                  id={`list-${list.id}`}
                  checked={selectedLists.includes(list.id)}
                  onChange={() => onListSelect(list.id)}
                />
                <label htmlFor={`list-${list.id}`}>{list.name} ({list.movies ? list.movies.length : 0} movies)</label>
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button onClick={onConfirm} disabled={selectedLists.length === 0 && lists.length > 0}>Add Movie</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomListSelectionModal;