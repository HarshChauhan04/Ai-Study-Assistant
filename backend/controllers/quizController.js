const Quiz = require('../models/Quiz');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const ActivityLog = require('../models/ActivityLog');
const geminiService = require('../services/geminiService');
const cacheService = require('../services/cacheService');

/**
 * @desc    Generate a multiple-choice quiz based on document contents
 * @route   POST /api/quizzes
 * @access  Private
 */
const generateQuiz = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      res.status(400);
      throw new Error('Please provide a documentId');
    }

    // Check document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Check cache first to avoid re-generating the exact same quiz
    const cacheKey = `quiz:${documentId}`;
    const cachedQuiz = await cacheService.get(cacheKey);
    if (cachedQuiz) {
      console.log('Serving quiz from cache.');
      return res.status(200).json(cachedQuiz);
    }

    // Step 1: Fetch document chunks to compile a representative corpus
    const chunks = await DocumentChunk.find({ documentId }).limit(10).select('text');
    if (chunks.length === 0) {
      res.status(400);
      throw new Error('Document context is not indexed. Please re-upload.');
    }

    const corpus = chunks.map((c) => c.text).join('\n\n');

    // Step 2: System instruction and prompt for structured JSON quiz
    const systemInstruction = `You are a professional examiner. Your job is to create an educational multiple choice quiz based ONLY on the text provided by the user.
Generate exactly 10 multiple-choice questions (MCQs).
Each question must have exactly 4 plausible options and exactly 1 correct answer (which must match one of the options exactly).
Output must be a raw JSON array. Do not wrap it in markdown. Do not add explanation.
JSON format requirements:
[
  {
    "question": "The question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]`;

    const prompt = `Based on this document content, generate a 10-question MCQ quiz:
----------------------------------
${corpus.substring(0, 15000)}
----------------------------------
Generate the quiz in JSON format as specified.`;

    // Step 3: Call Gemini in JSON Mode
    const rawResponse = await geminiService.generateContent(prompt, systemInstruction, true);
    
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(rawResponse);
    } catch (e) {
      // Fallback clean-up if JSON response contains wrapper
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedQuestions = JSON.parse(cleanJsonStr);
    }

    if (!Array.isArray(parsedQuestions)) {
      throw new Error('Gemini response did not return a valid quiz array');
    }

    // Step 4: Create Quiz entry in DB
    const quiz = await Quiz.create({
      userId: req.user.id,
      documentId,
      questions: parsedQuestions,
    });

    // Cache the created quiz for 2 hours
    await cacheService.set(cacheKey, quiz, 7200);

    // Step 5: Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'quiz',
      details: `Generated quiz for: "${document.originalname}"`,
    });

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit student's score for a completed quiz
 * @route   POST /api/quizzes/:id/score
 * @access  Private
 */
const submitQuizScore = async (req, res, next) => {
  try {
    const { score } = req.body;

    if (score === undefined) {
      res.status(400);
      throw new Error('Please provide the quiz score');
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('documentId');

    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    quiz.score = score;
    await quiz.save();

    // Log score submission
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'quiz',
      details: `Scored ${score}/${quiz.maxScore} on quiz for "${quiz.documentId.originalname}"`,
    });

    res.json({ message: 'Quiz score updated successfully', quiz });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quizzes generated for a specific document
 * @route   GET /api/quizzes/document/:documentId
 * @access  Private
 */
const getQuizzesByDocument = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user.id,
      documentId: req.params.documentId,
    }).sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuiz,
  submitQuizScore,
  getQuizzesByDocument,
};
