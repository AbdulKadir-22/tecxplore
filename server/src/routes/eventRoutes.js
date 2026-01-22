const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Will be created in Step 4

// GET /api/events (System Admin only)
router.get('/', protect, authorize('SYSTEM_ADMIN', 'COORDINATOR'), eventController.getAllEvents);

// GET /api/events/:eventId (Coordinator + Admin)
router.get('/:eventId', protect, eventController.getEventById);

// PATCH /api/events/:eventId/status (Coordinator updates their own event)
router.patch('/:eventId/status', protect, authorize('COORDINATOR'), eventController.updateEventStatus);

module.exports = router;