const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const ActivityLog = require('../models/ActivityLog');
const geminiService = require('../services/geminiService');
const cacheService = require('../services/cacheService');

/**
 * @desc    Generate structured revision notes (summaries, definitions, and topics)
 * @route   POST /api/study-notes/generate
 * @access  Private
 */
const generateNotes = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      res.status(400);
      throw new Error('Please provide a documentId');
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Check cache
    const cacheKey = `notes:${documentId}`;
    const cachedNotes = await cacheService.get(cacheKey);
    if (cachedNotes) {
      console.log('Serving study notes from cache.');
      return res.json(cachedNotes);
    }

    // Fetch chunks
    const chunks = await DocumentChunk.find({ documentId }).limit(10).select('text');
    if (chunks.length === 0) {
      res.status(400);
      throw new Error('Document context not indexed');
    }

    const corpus = chunks.map((c) => c.text).join('\n\n');

    const systemInstruction = `You are an academic expert. Analyze the provided study material and extract study notes.
You must return a raw JSON object. Do not wrap in markdown or add explanations.
JSON structure:
{
  "shortSummary": "A concise 2-3 sentence overview of the document's main theme.",
  "detailedSummary": [
    "Key detailed point 1...",
    "Key detailed point 2...",
    "Key detailed point 3..."
  ],
  "keyTopics": [
    "Core topic name 1",
    "Core topic name 2"
  ],
  "importantDefinitions": [
    {
      "term": "Term/Concept Name",
      "definition": "Clear, academic definition of the term."
    }
  ]
}`;

    const prompt = `Generate study notes for the following content:\n\n${corpus.substring(0, 15000)}`;

    const rawResponse = await geminiService.generateContent(prompt, systemInstruction, true);
    
    let parsedNotes;
    try {
      parsedNotes = JSON.parse(rawResponse);
    } catch (e) {
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedNotes = JSON.parse(cleanJsonStr);
    }

    // Cache notes for 2 hours
    await cacheService.set(cacheKey, parsedNotes, 7200);

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'notes',
      details: `Generated study notes for: "${document.originalname}"`,
    });

    res.json(parsedNotes);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate exactly 20 viva questions and model answers
 * @route   POST /api/study-notes/viva
 * @access  Private
 */
const generateVivaQuestions = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      res.status(400);
      throw new Error('Please provide a documentId');
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Check cache
    const cacheKey = `viva:${documentId}`;
    const cachedViva = await cacheService.get(cacheKey);
    if (cachedViva) {
      console.log('Serving viva from cache.');
      return res.json(cachedViva);
    }

    // Fetch chunks
    const chunks = await DocumentChunk.find({ documentId }).limit(10).select('text');
    if (chunks.length === 0) {
      res.status(400);
      throw new Error('Document context not indexed');
    }

    const corpus = chunks.map((c) => c.text).join('\n\n');

    const systemInstruction = `You are a university professor preparing for an oral exam (viva voce).
Generate exactly 20 viva questions based on the provided document.
For each question, provide a detailed model answer that the student should give.
Output must be a raw JSON array of objects. Do not wrap in markdown or add explanations.
JSON structure:
[
  {
    "question": "The oral question...",
    "answer": "The model answer..."
  }
]`;

    const prompt = `Generate top 20 viva questions and model answers for the following content:\n\n${corpus.substring(0, 15000)}`;

    const rawResponse = await geminiService.generateContent(prompt, systemInstruction, true);
    
    let parsedViva;
    try {
      parsedViva = JSON.parse(rawResponse);
    } catch (e) {
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedViva = JSON.parse(cleanJsonStr);
    }

    // Cache viva questions for 2 hours
    await cacheService.set(cacheKey, parsedViva, 7200);

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'notes',
      details: `Generated 20 Viva questions for: "${document.originalname}"`,
    });

    res.json(parsedViva);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Identify exam-important topics and concepts
 * @route   POST /api/study-notes/topics
 * @access  Private
 */
const detectImportantTopics = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      res.status(400);
      throw new Error('Please provide a documentId');
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Check cache
    const cacheKey = `topics:${documentId}`;
    const cachedTopics = await cacheService.get(cacheKey);
    if (cachedTopics) {
      console.log('Serving topics from cache.');
      return res.json(cachedTopics);
    }

    // Fetch chunks
    const chunks = await DocumentChunk.find({ documentId }).limit(10).select('text');
    if (chunks.length === 0) {
      res.status(400);
      throw new Error('Document context not indexed');
    }

    const corpus = chunks.map((c) => c.text).join('\n\n');

    const systemInstruction = `You are an academic examiner and curriculum planner.
Analyze the provided text and detect the most critical topics likely to be tested in an exam.
Classify each topic by importance (High, Medium, Low) and list subtopics and a brief description.
Output must be a raw JSON array of objects. Do not wrap in markdown or add explanations.
JSON structure:
[
  {
    "topic": "Topic Name",
    "importance": "High",
    "description": "Why this topic is crucial and what it covers.",
    "subtopics": ["Subtopic A", "Subtopic B"]
  }
]`;

    const prompt = `Detect exam-important topics from the following content:\n\n${corpus.substring(0, 15000)}`;

    const rawResponse = await geminiService.generateContent(prompt, systemInstruction, true);
    
    let parsedTopics;
    try {
      parsedTopics = JSON.parse(rawResponse);
    } catch (e) {
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedTopics = JSON.parse(cleanJsonStr);
    }

    // Cache topics for 2 hours
    await cacheService.set(cacheKey, parsedTopics, 7200);

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'notes',
      details: `Detected important topics in: "${document.originalname}"`,
    });

    res.json(parsedTopics);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateNotes,
  generateVivaQuestions,
  detectImportantTopics,
};
