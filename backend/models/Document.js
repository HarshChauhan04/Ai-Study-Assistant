const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  extractedText: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
