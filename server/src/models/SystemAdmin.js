const mongoose = require('mongoose');

const SystemAdminSchema = new mongoose.Schema({
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
    // Storing plain text as requested
  },
  role: {
    type: String,
    default: 'SYSTEM_ADMIN',
    immutable: true
  }
});

module.exports = mongoose.model('SystemAdmin', SystemAdminSchema);