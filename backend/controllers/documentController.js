const fs = require('fs');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const Chat = require('../models/Chat');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const StudyPlan = require('../models/StudyPlan');
const ActivityLog = require('../models/ActivityLog');
const ragService = require('../services/ragService');

/**
 * @desc    Upload study material PDF and index it for RAG
 * @route   POST /api/documents/upload
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF file');
    }

    const filePath = req.file.path;
    let extractedText = '';

    try {
      // Step 1: Read PDF and parse text
      const dataBuffer = fs.readFileSync(filePath);
      const parsedPdf = await pdfParse(dataBuffer);
      extractedText = parsedPdf.text;
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Could not extract any readable text from this PDF file.');
      }
    } catch (parseError) {
      // Remove temp file
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      res.status(400);
      throw new Error(`PDF Parsing failed: ${parseError.message}`);
    }

    // Step 2: Save document metadata in DB
    const document = await Document.create({
      userId: req.user.id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      extractedText,
      fileSize: req.file.size,
    });

    // Step 3: Trigger RAG indexing in the background or synchronously
    // Let's do it synchronously for verification, but wait, it might take time if the file is huge.
    // For stability, let's index it and handle errors.
    try {
      await ragService.indexDocument(document._id, req.user.id, extractedText);
    } catch (indexingError) {
      // Clean up document metadata if indexing failed completely
      await Document.findByIdAndDelete(document._id);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      res.status(500);
      throw new Error(`Embedding index generation failed: ${indexingError.message}`);
    }

    // Step 4: Clean up temp file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Step 5: Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'upload',
      details: `Uploaded document: "${document.originalname}"`,
    });

    res.status(201).json({
      _id: document._id,
      originalname: document.originalname,
      uploadDate: document.uploadDate,
      fileSize: document.fileSize,
      message: 'Document uploaded and indexed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all documents for logged-in user
 * @route   GET /api/documents
 * @access  Private
 */
const getDocuments = async (req, res, next) => {
  try {
    // Exclude full text field for performance when listing docs
    const documents = await Document.find({ userId: req.user.id })
      .select('-extractedText')
      .sort({ uploadDate: -1 });

    res.json(documents);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single document metadata
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete document and all associated data (chunks, chats, quizzes, flashcards)
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    const documentName = document.originalname;

    // Delete document metadata
    await Document.findByIdAndDelete(req.params.id);

    // Cascade delete all relational items
    await DocumentChunk.deleteMany({ documentId: req.params.id });
    await Chat.deleteMany({ documentId: req.params.id });
    await Quiz.deleteMany({ documentId: req.params.id });
    await Flashcard.deleteMany({ documentId: req.params.id });
    await StudyPlan.deleteMany({ documentId: req.params.id });

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'upload',
      details: `Deleted document: "${documentName}"`,
    });

    res.json({ message: 'Document and all associated study tools deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
