const Coordinator = require('../models/Coordinator');
const SystemAdmin = require('../models/SystemAdmin');

// 1. Protect Middleware: Identifies the user via header (No JWT)
exports.protect = async (req, res, next) => {
  let email;

  // The frontend must send the logged-in user's email in this header
  if (req.headers['x-auth-email']) {
    email = req.headers['x-auth-email'];
  }

  if (!email) {
    return res.status(401).json({ error: 'Not authorized, no email header provided' });
  }

  try {
    // Check if user is Admin
    const admin = await SystemAdmin.findOne({ email });
    if (admin) {
      req.user = admin;
      return next();
    }

    // Check if user is Coordinator
    const coordinator = await Coordinator.findOne({ email });
    if (coordinator) {
      req.user = coordinator;
      return next();
    }

    // User not found
    return res.status(401).json({ error: 'Not authorized, user not found' });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Not authorized, server error' });
  }
};

// 2. Authorize Middleware: Checks if user has the required role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route` 
      });
    }
    next();
  };
};

// 3. Event Restriction Middleware: Ensures Coordinator only touches their event
// Usage: Apply this AFTER 'protect' on routes involving event modifications
exports.restrictToAssignedEvent = (req, res, next) => {
  // If user is Admin, bypass restriction
  if (req.user.role === 'SYSTEM_ADMIN') {
    return next();
  }

  // Get eventId from Body or Params
  const targetEventId = req.body.eventId || req.params.eventId;

  if (!targetEventId) {
    return res.status(400).json({ error: 'Event ID missing in request' });
  }

  // Strict Check
  if (req.user.assignedEventId !== targetEventId) {
    return res.status(403).json({ 
      error: 'Access Denied: You are not assigned to this event.',
      assignedTo: req.user.assignedEventId,
      attempted: targetEventId
    });
  }

  next();
};

// ... (protect and authorize functions remain the same)

// 3. Event Restriction Middleware: Updated for Multiple Events
exports.restrictToAssignedEvent = (req, res, next) => {
  // If user is Admin, bypass restriction
  if (req.user.role === 'SYSTEM_ADMIN') {
    return next();
  }

  // Get eventId from Body or Params
  const targetEventId = req.body.eventId || req.params.eventId;

  if (!targetEventId) {
    return res.status(400).json({ error: 'Event ID missing in request' });
  }

  // CHANGED: Check if the array includes the target ID
  if (!req.user.assignedEventIds.includes(targetEventId)) {
    return res.status(403).json({ 
      error: 'Access Denied: You are not assigned to this event.',
      assignedTo: req.user.assignedEventIds,
      attempted: targetEventId
    });
  }

  next();
};