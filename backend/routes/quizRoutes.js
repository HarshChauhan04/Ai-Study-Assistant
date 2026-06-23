const express = require('express');
const router = express.Router();
const {
  generateQuiz,
  submitQuizScore,
  getQuizzesByDocument,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

router.use(protect);

router.post('/', aiLimiter, generateQuiz);
router.post('/:id/score', submitQuizScore);
router.get('/document/:documentId', getQuizzesByDocument);

module.exports = router;
