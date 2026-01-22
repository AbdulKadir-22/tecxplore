const { format } = require('date-fns'); // Lightweight date formatting (or use native JS)

/**
 * Converts an array of Submission objects into a CSV string
 * @param {Array} submissions 
 * @returns {String} csvContent
 */
const generateCsv = (submissions) => {
  if (!submissions || submissions.length === 0) {
    return '';
  }

  // 1. Define CSV Headers
  const headers = [
    'Participant Name',
    'Registration ID',
    'Status',
    'Start Time',
    'End Time',
    'Elapsed Time (Seconds)',
    'Verified At',
    'Submitted By'
  ];

  // 2. Map data to rows
  const rows = submissions.map(sub => {
    // Helper to safely format dates
    const formatDate = (date) => date ? new Date(date).toLocaleString() : 'N/A';
    
    // Calculate seconds from ms
    const elapsedSeconds = sub.elapsedTimeMs ? (sub.elapsedTimeMs / 1000).toFixed(2) : '0';

    return [
      `"${sub.name}"`, // Quote strings to handle commas in names
      `"${sub.registrationId}"`,
      sub.elapsedTimeMs > 0 ? 'Completed' : 'Incomplete',
      `"${formatDate(sub.startedAt)}"`,
      `"${formatDate(sub.endedAt)}"`,
      elapsedSeconds,
      `"${formatDate(sub.verifiedAt)}"`,
      `"${sub.submittedBy}"`
    ].join(',');
  });

  // 3. Join headers and rows with newlines
  return [headers.join(','), ...rows].join('\n');
};

module.exports = { generateCsv };