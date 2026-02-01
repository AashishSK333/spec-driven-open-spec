import { formatRelativeTime } from '../utils/time';
import './NewsCard.css';

export default function NewsCard({ article }) {
  const { title, url, source, published, snippet, topics } = article;

  return (
    <article className="news-card">
      <div className="card-header">
        <a href={url} target="_blank" rel="noopener noreferrer" className="card-title">
          {title}
        </a>
      </div>
      <div className="card-meta">
        <span className="card-source">{source}</span>
        <span className="card-separator">•</span>
        <span className="card-time">{formatRelativeTime(published)}</span>
        <div className="card-topics">
          {topics.map((topic) => (
            <span key={topic} className="topic-tag">
              {topic}
            </span>
          ))}
        </div>
      </div>
      {snippet && <p className="card-snippet">{snippet}</p>}
    </article>
  );
}
