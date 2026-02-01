import { useState, useCallback, useEffect } from 'react';
import { useTopics } from './hooks/useTopics';
import { fetchFeed } from './api/feed';
import TopicBar from './components/TopicBar';
import NewsFeed from './components/NewsFeed';
import './App.css';

function App() {
  const { topics, enabledTopics, addTopic, updateTopic, deleteTopic, toggleTopic } = useTopics();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRefresh = useCallback(async () => {
    if (enabledTopics.length === 0) {
      setArticles([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFeed(enabledTopics);
      setArticles(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [enabledTopics]);

  // Initial load
  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>My News Feed</h1>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={loading || enabledTopics.length === 0}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      <TopicBar
        topics={topics}
        onToggle={toggleTopic}
        onAdd={addTopic}
        onUpdate={updateTopic}
        onDelete={deleteTopic}
      />

      <main className="app-main">
        <NewsFeed
          articles={articles}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
        />
      </main>
    </div>
  );
}

export default App;
