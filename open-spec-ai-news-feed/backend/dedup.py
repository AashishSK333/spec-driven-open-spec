from datetime import datetime


def deduplicate_articles(articles_by_topic: dict[str, list[dict]]) -> list[dict]:
    """
    Deduplicate articles across topics by URL, merging topic tags.

    Args:
        articles_by_topic: Dict mapping topic name to list of articles

    Returns:
        List of unique articles sorted by published date (newest first),
        each with a 'topics' array of all matching topic names
    """
    url_map: dict[str, dict] = {}

    for topic_name, articles in articles_by_topic.items():
        for article in articles:
            url = article.get("url", "")
            if not url:
                continue

            if url in url_map:
                # Article already seen - add this topic to its tags
                url_map[url]["topics"].add(topic_name)
            else:
                # New article - create entry with topic set
                url_map[url] = {
                    "title": article.get("title", ""),
                    "url": url,
                    "source": article.get("source", ""),
                    "published": article.get("published", ""),
                    "snippet": article.get("snippet", ""),
                    "topics": {topic_name},
                }

    # Convert topic sets to sorted lists
    unique_articles = []
    for article in url_map.values():
        article["topics"] = sorted(article["topics"])
        unique_articles.append(article)

    # Sort by published date (newest first)
    unique_articles.sort(key=lambda a: parse_date(a.get("published", "")), reverse=True)

    return unique_articles


def parse_date(date_str: str) -> datetime:
    """Parse date string to datetime for sorting. Returns epoch for invalid dates."""
    if not date_str:
        return datetime.min

    # Try common formats
    formats = [
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue

    return datetime.min
