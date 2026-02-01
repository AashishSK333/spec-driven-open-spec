import os
from tavily import TavilyClient

client = None


def get_client() -> TavilyClient:
    global client
    if client is None:
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            raise ValueError("TAVILY_API_KEY environment variable not set")
        client = TavilyClient(api_key=api_key)
    return client


async def search_news(query: str, max_results: int = 10) -> list[dict]:
    """
    Search for news articles using Tavily API.

    Args:
        query: Search query string
        max_results: Maximum number of results to return

    Returns:
        List of article dictionaries with title, url, source, published_date, content
    """
    tavily = get_client()

    response = tavily.search(
        query=query,
        search_depth="basic",
        topic="news",
        max_results=max_results,
    )

    articles = []
    for result in response.get("results", []):
        articles.append({
            "title": result.get("title", ""),
            "url": result.get("url", ""),
            "source": extract_source(result.get("url", "")),
            "published": result.get("published_date", ""),
            "snippet": result.get("content", "")[:200] if result.get("content") else "",
        })

    return articles


def extract_source(url: str) -> str:
    """Extract domain name as source from URL."""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc
        # Remove www. prefix
        if domain.startswith("www."):
            domain = domain[4:]
        # Get the main domain name
        parts = domain.split(".")
        if len(parts) >= 2:
            return parts[-2].capitalize()
        return domain.capitalize()
    except Exception:
        return "Unknown"
