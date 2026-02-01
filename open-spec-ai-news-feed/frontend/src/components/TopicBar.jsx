import { useState } from 'react';
import TopicModal from './TopicModal';
import './TopicBar.css';

export default function TopicBar({ topics, onToggle, onAdd, onUpdate, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAdd = () => {
    setEditingTopic(null);
    setModalOpen(true);
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setModalOpen(true);
  };

  const handleSave = (name, query) => {
    if (editingTopic) {
      onUpdate(editingTopic.id, { name, query });
    } else {
      onAdd(name, query);
    }
    setModalOpen(false);
    setEditingTopic(null);
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="topic-bar">
      <div className="topic-chips">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`topic-chip ${topic.enabled ? 'enabled' : 'disabled'}`}
          >
            <span className="chip-name" onClick={() => onToggle(topic.id)}>
              {topic.name}
            </span>
            <button
              className="chip-edit"
              onClick={() => handleEdit(topic)}
              title="Edit topic"
            >
              ✎
            </button>
            <button
              className={`chip-delete ${deleteConfirm === topic.id ? 'confirm' : ''}`}
              onClick={() => handleDelete(topic.id)}
              title={deleteConfirm === topic.id ? 'Click again to confirm' : 'Delete topic'}
            >
              ×
            </button>
          </div>
        ))}
        <button className="add-topic-btn" onClick={handleAdd}>
          + Add
        </button>
      </div>

      {modalOpen && (
        <TopicModal
          topic={editingTopic}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingTopic(null);
          }}
        />
      )}
    </div>
  );
}
