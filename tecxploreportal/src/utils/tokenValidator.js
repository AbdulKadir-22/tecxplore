import Papa from 'papaparse';
import csvData from '../data/tokens.csv?raw';

/**
 * Parses the CSV file and returns a Set of valid tokens for O(1) lookup.
 */
export const loadValidTokens = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Create a Set for O(1) lookup. 
        const tokens = new Set(results.data.map(row => row.otp?.trim()));
        resolve(tokens);
      },
      error: (err) => reject(err)
    });
  });
};

/**
 * THIS WAS MISSING
 * Validates a single token against the loaded list.
 */
export const validateToken = (token, validTokenSet) => {
  if (!token || !validTokenSet) return false;
  return validTokenSet.has(token.trim());
};

/**
 * Formats seconds into HH:MM:SS
 */
export const formatTime = (seconds) => {
  if (!seconds) return "00:00:00";
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};