import { useState } from 'react';
import './TopicModal.css';

export default function TopicModal({ topic, onSave, onClose }) {
  const [name, setName] = useState(topic?.name || '');
  const [query, setQuery] = useState(topic?.query || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && query.trim()) {
      onSave(name.trim(), query.trim());
    }
  };

  const isValid = name.trim() && query.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{topic ? 'Edit Topic' : 'Add Topic'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="query">Search Query</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., programming OR software"
            />
            <small>Use OR to combine terms, quotes for exact phrases</small>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={!isValid}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
