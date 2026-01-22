const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Will be created in Step 4

// POST /api/participants/verify
// Used by Coordinator to verify a student token
router.post('/verify', protect, authorize('COORDINATOR'), participantController.verifyParticipant);
router.get('/:eventId', protect, participantController.getParticipantsByEvent);

module.exports = router;