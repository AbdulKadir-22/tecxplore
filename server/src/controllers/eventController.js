const Event = require('../models/Event');

// Get all events (For System Admin)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
};

// Get single event details (For Coordinator dashboard)
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
};

// Update event status (e.g., Upcoming -> Live -> Completed)
exports.updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;

    const event = await Event.findOneAndUpdate(
      { eventId },
      { status },
      { new: true } // Return updated document
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Status updated', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};