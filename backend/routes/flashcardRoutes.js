const express = require('express');
const router = express.Router();
const {
  generateFlashcards,
  getFlashcardsByDocument,
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

router.use(protect);

router.post('/', aiLimiter, generateFlashcards);
router.get('/document/:documentId', getFlashcardsByDocument);

module.exports = router;
