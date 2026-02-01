import { useState, useEffect } from 'react';

const STORAGE_KEY = 'news-feed-topics';

const defaultTopics = [
  { id: crypto.randomUUID(), name: 'Tech', query: 'programming OR software technology', enabled: true },
  { id: crypto.randomUUID(), name: 'India', query: 'India news', enabled: true },
  { id: crypto.randomUUID(), name: 'Agentic AI', query: 'AI agents OR agentic AI', enabled: true },
];

export function useTopics() {
  const [topics, setTopics] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultTopics;
      }
    }
    return defaultTopics;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  }, [topics]);

  const addTopic = (name, query) => {
    const newTopic = {
      id: crypto.randomUUID(),
      name,
      query,
      enabled: true,
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const updateTopic = (id, updates) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, ...updates } : topic
      )
    );
  };

  const deleteTopic = (id) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  const toggleTopic = (id) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, enabled: !topic.enabled } : topic
      )
    );
  };

  const enabledTopics = topics.filter((t) => t.enabled);

  return {
    topics,
    enabledTopics,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleTopic,
  };
}
