const express = require('express');
const router = express.Router();
const {
  generateNotes,
  generateVivaQuestions,
  detectImportantTopics,
} = require('../controllers/studyNotesController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

router.use(protect);

router.post('/generate', aiLimiter, generateNotes);
router.post('/viva', aiLimiter, generateVivaQuestions);
router.post('/topics', aiLimiter, detectImportantTopics);

module.exports = router;
