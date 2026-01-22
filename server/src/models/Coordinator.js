const mongoose = require('mongoose');

const CoordinatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // CHANGED: Now an array of event IDs
  assignedEventIds: [{
    type: String,
    ref: 'Event' 
  }],
  role: {
    type: String,
    default: 'COORDINATOR',
    immutable: true
  }
});

module.exports = mongoose.model('Coordinator', CoordinatorSchema);