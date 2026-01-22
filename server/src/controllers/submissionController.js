const Submission = require('../models/Submission');
const Participant = require('../models/Participant');

// Save final event data for a participant (Called by Coordinator)
exports.submitEventData = async (req, res) => {
  try {
    const { 
      eventId, 
      participantId, 
      elapsedTimeMs, 
      startedAt, 
      endedAt, 
      submittedBy // Email of coordinator
    } = req.body;

    // 1. Fetch participant details to ensure data integrity
    const participant = await Participant.findOne({ participantId, eventId });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found for this event' });
    }

    // 2. Create Submission Record
    const newSubmission = new Submission({
      eventId,
      participantId,
      name: participant.name,
      registrationId: participant.registrationId,
      verifiedAt: participant.verifiedAt || new Date(), // Fallback if manually entered
      startedAt,
      endedAt,
      elapsedTimeMs,
      submittedBy
    });

    await newSubmission.save();

    res.status(201).json({ message: 'Submission recorded successfully', submission: newSubmission });

  } catch (err) {
    res.status(500).json({ error: 'Submission failed', details: err.message });
  }
};