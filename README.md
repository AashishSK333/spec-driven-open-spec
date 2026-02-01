# OpenSpec Demo Projects

A collection of demonstration projects showcasing the **OpenSpec framework** and its core capabilities for spec-driven design and development.

## 📋 Project Overview

This repository contains multiple demo projects built using the [OpenSpec framework](https://openspec.io/), illustrating how to design, specify, and build applications following spec-driven development principles. Each project demonstrates different aspects and capabilities of OpenSpec.

## 🎯 Purpose & Goals

- **Learn OpenSpec**: Understand the core concepts and capabilities of the OpenSpec framework
- **Spec-Driven Design**: Demonstrate how to design systems using specifications and proposals
- **Best Practices**: Show practical examples of organizing specs, designs, and implementation
- **Framework Exploration**: Explore OpenSpec features through real-world demo projects

## 📁 Repository Structure

```
sdd-open-spec-demo-projects/
├── open-spec-ai-news-feed/          # Demo: AI-powered news feed application
│   ├── backend/                     # Python Flask backend
│   │   ├── main.py                 # Main application entry
│   │   ├── requirements.txt        # Python dependencies
│   │   ├── tavily_client.py       # News API integration
│   │   └── dedup.py               # Deduplication logic
│   ├── frontend/                    # React/Vite frontend
│   │   ├── src/
│   │   │   ├── components/         # React components (NewsCard, NewsFeed, TopicBar, etc.)
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   └── api/                # API integration
│   │   └── package.json
│   └── openspec/
│       ├── config.yaml             # OpenSpec configuration
│       └── changes/personal-news-feed/
│           ├── design.md           # Design document
│           ├── proposal.md         # Implementation proposal
│           ├── tasks.md            # Task breakdown
│           └── specs/              # Detailed specifications
│               ├── news-aggregation/
│               ├── news-display/
│               └── topic-management/
│
└── open-spec-demo-1/                # Additional demo project
    └── openspec/                    # OpenSpec configuration
```

## 🚀 Demo Projects

### 1. **AI News Feed** (`open-spec-ai-news-feed/`)

A full-stack application demonstrating spec-driven development for a modern news aggregation system.

**Features:**
- Real-time news aggregation using AI
- Topic-based filtering and management
- Deduplication of articles
- Responsive React frontend
- Python Flask backend

**Core Capabilities Demonstrated:**
- Multi-layer specification (design → proposal → specs)
- Frontend and backend separation with clear contracts
- API-driven architecture
- State management and custom hooks

## 🛠️ Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Git
- OpenSpec CLI (optional, for advanced features)

## 📖 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sdd-open-spec-demo-projects
```

### 2. Backend Setup (AI News Feed)

```bash
cd open-spec-ai-news-feed/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup (AI News Feed)

```bash
cd open-spec-ai-news-feed/frontend
npm install
npm run dev
```

### 4. Run the Application

**Backend:**
```bash
cd backend
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## 🎓 Understanding OpenSpec Structure

Each demo project includes:

- **`config.yaml`**: OpenSpec configuration and metadata
- **`design.md`**: High-level design decisions and architecture
- **`proposal.md`**: Detailed implementation proposal
- **`tasks.md`**: Breakdown of tasks and milestones
- **`specs/`**: Detailed specifications organized by feature area

### Specification Organization

Specs are organized hierarchically by feature:
- `news-aggregation/`: How news data is collected and processed
- `news-display/`: How news is presented to users
- `topic-management/`: How users manage topics and preferences

## 🔑 Core Capabilities Explored

✅ **Specification Hierarchy**: From high-level design to granular specs  
✅ **Multi-layer Architecture**: Backend and frontend specifications  
✅ **API Contracts**: Clear specification of API endpoints and data models  
✅ **Task Breakdown**: Converting specifications into actionable tasks  
✅ **Design Documentation**: Capturing design decisions and rationale  

## 🧪 Testing

To run tests (when available):

```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm run test
```

## 📝 Adding New Demo Projects

To add a new demo project:

1. Create a new directory following the naming convention: `open-spec-<project-name>/`
2. Create the `openspec/` directory structure with `config.yaml`
3. Organize specs in `changes/<feature-name>/specs/`
4. Add implementation code alongside the specs
5. Document the project's purpose in this README

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow the OpenSpec structure for new projects
2. Document specs thoroughly
3. Keep implementation aligned with specifications
4. Update this README with new demo projects

## 📚 Resources

- [OpenSpec Documentation](https://openspec.io/)
- [Spec-Driven Design Guide](https://openspec.io/guide/)
- Project-specific documentation in each `openspec/` directory

## 📄 License

[Add your license information here]

---

**Last Updated**: February 2026

For questions or issues, please refer to individual project documentation or create an issue in the repository.
