const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  registrationId: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Participant', ParticipantSchema);