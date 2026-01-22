const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  participantId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  registrationId: {
    type: String,
    required: true
  },
  verifiedAt: {
    type: Date,
    required: true
  },
  startedAt: {
    type: Date,
    default: null
  },
  endedAt: {
    type: Date,
    default: null
  },
  elapsedTimeMs: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  submittedBy: {
    type: String,
    required: true 
    // Email of the coordinator who submitted this
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);