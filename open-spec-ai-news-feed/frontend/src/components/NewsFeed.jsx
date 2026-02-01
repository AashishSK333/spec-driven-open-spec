import NewsCard from './NewsCard';
import './NewsFeed.css';

export default function NewsFeed({ articles, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="feed-status">
        <div className="loading-spinner"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-status error">
        <p className="error-message">{error}</p>
        <button className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="feed-status empty">
        <p>No articles found</p>
        <p className="empty-hint">Try enabling more topics or adjusting your queries</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      {articles.map((article, index) => (
        <NewsCard key={article.url || index} article={article} />
      ))}
    </div>
  );
}
