const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  examDate: {
    type: Date,
    required: true,
  },
  dailyPlan: [
    {
      day: {
        type: Number,
        required: true,
      },
      topic: {
        type: String,
        required: true,
      },
      tasks: {
        type: [String],
        default: [],
      },
      revisionSchedule: {
        type: String,
        default: '',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
