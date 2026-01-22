const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Will be created in Step 4

// POST /api/submissions
// Coordinator submits final data
router.post('/', protect, authorize('COORDINATOR'), submissionController.submitEventData);

module.exports = router;