# AI Study Assistant 🎓🤖

AI Study Assistant is a production-ready, full-stack web application designed for students. It enables users to upload study materials (PDFs), extract text content, segment documents into vector-embedded chunks using **Google Gemini Embeddings (`text-embedding-004`)**, and perform semantic queries using **Retrieval-Augmented Generation (RAG)** to chat with notes.

Additionally, it generates study aids: customized interactive quizzes, revision flashcards, day-by-day exam prep calendars, verbal viva prep simulations, and detected important exam topics.

---

## 🌟 Core Features

- **JWT Authentication & Security**: Register and login securely using hashed credentials (bcryptjs), protected API gateways, and specialized rate limiters blocking API spam.
- **RAG Document Chat**: ChatGPT-style conversational assistant answering questions *strictly* using retrieved vector segments, providing complete context reference scores.
- **Interactive Quizzes**: Generates 10 MCQ quizzes with scoring grids and answer correction logs.
- **Flashcards**: Review terms and definitions using double-sided flipped cards with fluid 3D transformations.
- **Study Planner**: Daily syllabus focus schedules and evening review routines customized around a scheduled exam date.
- **Study Notes & Viva Prep**: Generate Top 20 oral viva questions and model answers, detect exam-critical topics, and compile condensed notes profiles.
- **Dashboard & Analytics**: Analytics dashboard aggregating document uploads, question volumes, quiz performance progressions (Recharts area/bar charts), and simulated study durations.
- **Redis Cache & Fallback**: Caches expensive AI generation calls (summaries, static quizzes) using `ioredis`. Automatically falls back to local in-memory caching if no Redis host is active, ensuring offline stability.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS (v4.0), React Router (v6.22), Axios, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas/Local), Mongoose.
- **AI Integration**: Google Gemini API (`@google/generative-ai` SDK).
- **Caching**: Redis (`ioredis` client) with memory-map fallback.
- **PDF Extraction**: `pdf-parse`.

---

## 📂 Project Structure

```text
AI-study/
├── backend/
│   ├── config/          # DB connections
│   ├── controllers/     # Controller handlers (auth, document, quiz, chat, planner)
│   ├── middleware/      # JWT shields, Multer parsing, Rate limiters, Error catchers
│   ├── models/          # Mongoose schemas (User, Chunk, Quiz, Flashcard, Chat)
│   ├── routes/          # Express route bindings
│   ├── services/        # Gemini API, Vector indexing (RAG), Caching (Redis)
│   ├── utils/           # Cosine similarity math, text segment chunking
│   ├── uploads/         # Temporary Multer storage
│   ├── .env.example     # Backend environmental configuration template
│   ├── server.js        # Node App entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout header/sidebar, skeleton loaders, protected shields
│   │   ├── context/     # Global AuthContext provider
│   │   ├── layouts/     # Dashboard container wrappers
│   │   ├── pages/       # Landing, login, dashboard, chat, quizzes, flashcards, profile
│   │   ├── services/    # Axios instance with request intercepts
│   │   ├── App.jsx      # Navigation routers
│   │   ├── index.css    # Tailwind styling configuration
│   │   └── main.jsx     # Vite bootstrapper
│   ├── .env.example     # Frontend environmental configuration template
│   ├── vite.config.js   # Vite plugin attachments
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16.0+)
- MongoDB (Local server or Atlas Cloud URL)
- Google Gemini API Key

### Step 1: Clone and Set Up the Backend
1. Navigate into the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install dependency packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` into a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill out the variables in `.env` (add your `GEMINI_API_KEY`, `MONGO_URI`, and define a `JWT_SECRET`).

### Step 2: Set Up the Frontend
1. Navigate into the `frontend/` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependency packages:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Copy `.env.example` into a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
4. Define your backend routing URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 🏃 Run the Application Locally

1. **Start the backend server**:
   In `/backend`, run:
   ```bash
   npm run dev
   ```
   *The server will boot on port 5000 and log database connection statuses.*

2. **Start the React frontend**:
   In `/frontend`, run:
   ```bash
   npm run dev
   ```
   *The Vite compiler will mount the application at `http://localhost:5173`.*

---

## 🌐 Deployment Instructions

### Backend (Deploy to Render)
1. Push your codebase to a GitHub repository.
2. Log in to [Render](https://render.com) and click **New Web Service**.
3. Link your GitHub repository.
4. Set configurations:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, define your production configurations:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`

### Frontend (Deploy to Vercel)
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your GitHub repository.
3. Set configurations:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Output Directory**: `dist` (default)
4. Under **Environment Variables**, define:
   - `VITE_API_URL`: Set this to your deployed Render URL (e.g. `https://your-backend-app.onrender.com/api`).
5. Click **Deploy**.
