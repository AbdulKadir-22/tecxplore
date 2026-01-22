const Participant = require('../models/Participant');
const Event = require('../models/Event');

// Verify a participant using their unique token
exports.verifyParticipant = async (req, res) => {
  try {
    const { token, eventId } = req.body;

    // 1. Find participant by token
    const participant = await Participant.findOne({ token });

    if (!participant) {
      return res.status(404).json({ error: 'Invalid token. Participant not found.' });
    }

    // 2. Check if participant belongs to this specific event
    if (participant.eventId !== eventId) {
      return res.status(403).json({ 
        error: 'Participant does not belong to this event.',
        expectedEvent: participant.eventId
      });
    }

    // 3. Check if already verified
    if (participant.verified) {
      return res.status(400).json({ 
        error: 'Participant already verified.', 
        verifiedAt: participant.verifiedAt,
        participant 
      });
    }

    // 4. Mark as verified
    participant.verified = true;
    participant.verifiedAt = new Date();
    await participant.save();

    res.status(200).json({ 
      message: 'Verification successful', 
      participant 
    });

  } catch (err) {
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
};


exports.getParticipantsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // CHANGED: Check inclusion in array
    if (req.user.role === 'COORDINATOR' && !req.user.assignedEventIds.includes(eventId)) {
      return res.status(403).json({ 
        error: 'Access denied. You can only view participants for your assigned events.' 
      });
    }

    const participants = await Participant.find({ eventId });
    if (!participants) res.status(404).json({ message: 'No participants found' });
    else res.status(200).json(participants);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch participants', details: err.message });
  }
};