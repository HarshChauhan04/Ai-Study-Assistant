const Chat = require('../models/Chat');
const Document = require('../models/Document');
const ActivityLog = require('../models/ActivityLog');
const ragService = require('../services/ragService');
const geminiService = require('../services/geminiService');

/**
 * @desc    Ask a question about an uploaded document using RAG (Retrieval-Augmented Generation)
 * @route   POST /api/chat
 * @access  Private
 */
const askQuestion = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      res.status(400);
      throw new Error('Please provide documentId and question');
    }

    // Check if document exists and belongs to user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    // Step 1: Retrieve top 4 most relevant chunks
    const relevantChunks = await ragService.retrieveRelevantChunks(documentId, question, 4);

    if (relevantChunks.length === 0) {
      res.status(400);
      throw new Error('No indexed context found for this document. Please re-upload.');
    }

    // Step 2: Combine chunks to form RAG context
    const contextText = relevantChunks
      .map((chunk, idx) => `[Source Chunk ${idx + 1}]:\n${chunk.text}`)
      .join('\n\n');

    // Step 3: Build the system instruction and user prompt
    const systemInstruction = `You are a professional academic tutor and AI Study Assistant.
Your task is to answer the user's question using ONLY the provided text context from their uploaded document.
Follow these rules strictly:
1. Base your answer ONLY on the provided context. Do not use external knowledge or make assumptions.
2. If the answer cannot be found in the context, explicitly state: "I cannot find the answer in the uploaded document."
3. Keep your response clear, accurate, and properly formatted using markdown (bullet points, bold text, code blocks if necessary).`;

    const prompt = `Context from document "${document.originalname}":
----------------------------------
${contextText}
----------------------------------

User Question: ${question}

Provide your answer below based strictly on the context. If the answer is not present in the context above, state that you cannot find it.`;

    // Step 4: Call Gemini
    const answer = await geminiService.generateContent(prompt, systemInstruction, false);

    // Step 5: Save chat message to DB
    const chat = await Chat.create({
      userId: req.user.id,
      documentId,
      question,
      answer,
      sources: relevantChunks.map(c => ({ text: c.text, score: c.score })),
    });

    // Step 6: Log activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'chat',
      details: `Asked question on: "${document.originalname}"`,
    });

    res.status(201).json({
      _id: chat._id,
      documentId: chat.documentId,
      question: chat.question,
      answer: chat.answer,
      timestamp: chat.timestamp,
      sources: relevantChunks.map(c => ({ text: c.text, score: c.score })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history for a specific document
 * @route   GET /api/chat/:documentId
 * @access  Private
 */
const getChatHistory = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      userId: req.user.id,
      documentId: req.params.documentId,
    }).sort({ timestamp: 1 });

    res.json(chats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getChatHistory,
};
