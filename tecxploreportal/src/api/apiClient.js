const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

// Helper to get fresh headers every time a request is made
const getHeaders = () => {
  const email = localStorage.getItem('user_email');
  return {
    'Content-Type': 'application/json',
    'x-auth-email': email || '', // If empty, backend returns 403
  };
};

export const apiClient = {
  // --- AUTHENTICATION ---
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // --- EVENTS MANAGEMENT ---
  getAllEvents: async () => {
    const response = await fetch(`${BASE_URL}/api/events`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  getEventDetails: async (eventId) => {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch event details');
    return response.json();
  },

  updateEventStatus: async (eventId, status) => {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  },

  // --- PARTICIPANT MANAGEMENT ---
  getParticipantsByEvent: async (eventId) => {
    const response = await fetch(`${BASE_URL}/api/participants/${eventId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch participants');
    return response.json();
  },

  verifyToken: async (token, eventId) => {
    const response = await fetch(`${BASE_URL}/api/participants/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ token, eventId }),
    });
    if (!response.ok) throw new Error('Verification Failed');
    return response.json();
  },

  submitParticipantData: async (data) => {
    const response = await fetch(`${BASE_URL}/api/submissions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Submission failed');
    return response.json();
  },

  // --- ADMIN FEATURES ---
  exportEventCSV: async (eventId) => {
    const response = await fetch(`${BASE_URL}/api/admin/events/${eventId}/export`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Export failed');
    // Important: We return the BLOB (binary file) here, not JSON
    return response.blob();
  }
};