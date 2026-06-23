const Flashcard = require('../models/Flashcard');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const ActivityLog = require('../models/ActivityLog');
const geminiService = require('../services/geminiService');
const cacheService = require('../services/cacheService');

/**
 * @desc    Generate a set of educational flashcards from document contents
 * @route   POST /api/flashcards
 * @access  Private
 */
const generateFlashcards = async (req, res, next) => {
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

    // Check cache
    const cacheKey = `flashcards:${documentId}`;
    const cachedCards = await cacheService.get(cacheKey);
    if (cachedCards) {
      console.log('Serving flashcards from cache.');
      return res.status(200).json(cachedCards);
    }

    // Step 1: Fetch document chunks
    const chunks = await DocumentChunk.find({ documentId }).limit(10).select('text');
    if (chunks.length === 0) {
      res.status(400);
      throw new Error('Document context is not indexed. Please re-upload.');
    }

    const corpus = chunks.map((c) => c.text).join('\n\n');

    // Step 2: Set up System instruction and prompt
    const systemInstruction = `You are an academic flashcard generator.
Based on the provided document text, extract key definitions, concepts, and questions.
Generate exactly 12 flashcards.
Keep both questions and answers concise (question under 15 words, answer under 30 words).
Output must be a raw JSON array. Do not wrap in markdown or add explanations.
JSON format:
[
  {
    "question": "Front of the card (Question/Concept)",
    "answer": "Back of the card (Concise Answer/Definition)"
  }
]`;

    const prompt = `Based on this document content, generate a 12-card study deck:
----------------------------------
${corpus.substring(0, 15000)}
----------------------------------
Generate the deck in JSON format as specified.`;

    // Step 3: Generate via Gemini
    const rawResponse = await geminiService.generateContent(prompt, systemInstruction, true);
    
    let parsedCards;
    try {
      parsedCards = JSON.parse(rawResponse);
    } catch (e) {
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedCards = JSON.parse(cleanJsonStr);
    }

    if (!Array.isArray(parsedCards)) {
      throw new Error('Gemini response did not return a valid flashcard array');
    }

    // Step 4: Save to DB
    const flashcardDeck = await Flashcard.create({
      userId: req.user.id,
      documentId,
      cards: parsedCards,
    });

    // Cache the deck for 2 hours
    await cacheService.set(cacheKey, flashcardDeck, 7200);

    // Step 5: Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'flashcard',
      details: `Generated flashcards for: "${document.originalname}"`,
    });

    res.status(201).json(flashcardDeck);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get flashcards generated for a specific document
 * @route   GET /api/flashcards/document/:documentId
 * @access  Private
 */
const getFlashcardsByDocument = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user.id,
      documentId: req.params.documentId,
    }).sort({ createdAt: -1 });

    res.json(flashcards);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateFlashcards,
  getFlashcardsByDocument,
};
