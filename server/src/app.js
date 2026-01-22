const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load Config
dotenv.config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const participantRoutes = require('./routes/participantRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import Middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize App
const app = express();

// Global Middleware
app.use(cors()); // Allow Cross-Origin requests from frontend
app.use(express.json()); // Parse JSON bodies

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);

// Base Route (Health Check)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware (Must be after routes)
app.use(notFound);
app.use(errorHandler);

module.exports = app;