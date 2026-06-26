const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Allowed origins — comma-separated in CORS_ORIGIN env var, or wildcard
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    
    // Dynamically allow localhost and vercel deployments
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const isVercel = origin.endsWith('.vercel.app');
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin) || isLocalhost || isVercel) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Global API rate limiting
app.use('/api', apiLimiter);

// Health Check Route
app.get('/', (req, res) => {
  res.json({ status: 'AI Study Assistant API is running smoothly.' });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/study-plans', require('./routes/studyPlanRoutes'));
app.use('/api/study-notes', require('./routes/studyNotesRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
