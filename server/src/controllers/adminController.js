const Submission = require('../models/Submission');
const { generateCsv } = require('../utils/csvGenerator');

// Get all submissions for a specific event (Data source for CSV export)
exports.getEventSubmissions = async (req, res) => {
  try {
    const { eventId } = req.params;

    const submissions = await Submission.find({ eventId }).sort({ elapsedTimeMs: 1 }); // Sorted by fastest time

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: 'No submissions found for this event' });
    }

    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions', details: err.message });
  }
};

exports.exportEventCsv = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Fetch Submissions
    const submissions = await Submission.find({ eventId }).sort({ elapsedTimeMs: 1 });

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: 'No data to export' });
    }

    // 2. Generate CSV String
    const csvData = generateCsv(submissions);

    // 3. Set Headers for Download
    res.header('Content-Type', 'text/csv');
    res.attachment(`event-${eventId}-export.csv`);
    
    // 4. Send CSV
    return res.send(csvData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'CSV Export failed', details: err.message });
  }
};