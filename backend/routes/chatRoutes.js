const express = require('express');
const router = express.Router();
const { askQuestion, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

router.use(protect);

router.post('/', aiLimiter, askQuestion);
router.get('/:documentId', getChatHistory);

module.exports = router;
