const express = require('express');
const router = express.Router();
const {
  generateStudyPlan,
  getStudyPlansByDocument,
} = require('../controllers/studyPlanController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimitMiddleware');

router.use(protect);

router.post('/', aiLimiter, generateStudyPlan);
router.get('/document/:documentId', getStudyPlansByDocument);

module.exports = router;
