const mongoose = require('mongoose');

const DocumentChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  chunkIndex: {
    type: Number,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
});

// Index documentId for fast retrieval
DocumentChunkSchema.index({ documentId: 1 });

module.exports = mongoose.model('DocumentChunk', DocumentChunkSchema);
