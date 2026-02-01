## 1. Backend Setup

- [x] 1.1 Create backend/ directory structure
- [x] 1.2 Create requirements.txt with fastapi, uvicorn, tavily-python, python-dotenv
- [x] 1.3 Create .env.example with TAVILY_API_KEY placeholder
- [x] 1.4 Add backend/.gitignore for .env and __pycache__

## 2. Backend Implementation

- [x] 2.1 Create tavily_client.py with async search function
- [x] 2.2 Create dedup.py with URL-based deduplication logic
- [x] 2.3 Create main.py with FastAPI app and CORS config
- [x] 2.4 Implement POST /feed endpoint accepting topics array
- [x] 2.5 Add error handling for Tavily API failures (502, 429 responses)

## 3. Frontend Setup

- [x] 3.1 Initialize React app with Vite in frontend/ directory
- [x] 3.2 Install dependencies (axios or fetch wrapper)
- [x] 3.3 Set up project structure (components/, hooks/, api/)
- [x] 3.4 Configure proxy or CORS for backend API calls

## 4. Topic Management (Frontend)

- [x] 4.1 Create useTopics.js hook with localStorage CRUD operations
- [x] 4.2 Create TopicBar.jsx component with topic chips
- [x] 4.3 Create TopicModal.jsx for add/edit topic dialog
- [x] 4.4 Implement topic enable/disable toggle on chip click
- [x] 4.5 Add delete functionality with confirmation

## 5. News Display (Frontend)

- [x] 5.1 Create api/feed.js wrapper for POST /feed calls
- [x] 5.2 Create NewsCard.jsx component with headline, source, age, tags
- [x] 5.3 Create NewsFeed.jsx container with card list
- [x] 5.4 Implement relative time display (e.g., "2h ago")
- [x] 5.5 Add loading state with spinner/skeleton
- [x] 5.6 Add error state with retry button
- [x] 5.7 Add empty state message when no articles

## 6. Main App Integration

- [x] 6.1 Create App.jsx with TopicBar and NewsFeed layout
- [x] 6.2 Add Refresh button triggering feed fetch
- [x] 6.3 Wire up topic selection to feed API calls
- [x] 6.4 Apply light mode styling

## 7. Testing and Polish

- [ ] 7.1 Test backend with multiple topics and verify deduplication
- [ ] 7.2 Test frontend topic CRUD persists across reload
- [ ] 7.3 Test error handling when backend unavailable
- [ ] 7.4 Verify topic tags display correctly on merged articles
