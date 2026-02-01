from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from tavily_client import search_news
from dedup import deduplicate_articles

load_dotenv()

app = FastAPI(title="Personal News Feed API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Topic(BaseModel):
    name: str
    query: str


class FeedRequest(BaseModel):
    topics: list[Topic]


class Article(BaseModel):
    title: str
    url: str
    source: str
    published: str
    snippet: str
    topics: list[str]


class FeedResponse(BaseModel):
    articles: list[Article]


@app.post("/feed", response_model=FeedResponse)
async def get_feed(request: FeedRequest):
    """
    Fetch news for multiple topics and return deduplicated results.
    """
    if not request.topics:
        return FeedResponse(articles=[])

    articles_by_topic: dict[str, list[dict]] = {}

    for topic in request.topics:
        try:
            articles = await search_news(topic.query)
            articles_by_topic[topic.name] = articles
        except Exception as e:
            error_msg = str(e).lower()
            if "rate" in error_msg or "429" in error_msg:
                raise HTTPException(
                    status_code=429,
                    detail="Tavily API rate limit exceeded. Please try again later."
                )
            elif "5" in str(type(e).__name__) or "server" in error_msg:
                raise HTTPException(
                    status_code=502,
                    detail="Tavily API is currently unavailable. Please try again later."
                )
            else:
                raise HTTPException(
                    status_code=502,
                    detail=f"Error fetching news for topic '{topic.name}': {str(e)}"
                )

    deduplicated = deduplicate_articles(articles_by_topic)

    return FeedResponse(articles=[Article(**a) for a in deduplicated])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
