const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Will be created in Step 4

// GET /api/admin/events/:eventId/submissions
// View data for specific event
router.get('/events/:eventId/submissions', protect, authorize('SYSTEM_ADMIN'), adminController.getEventSubmissions);

// GET /api/admin/events/:eventId/export
// Download CSV
router.get('/events/:eventId/export', protect, authorize('SYSTEM_ADMIN'), adminController.exportEventCsv);

module.exports = router;