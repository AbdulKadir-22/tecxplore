const Coordinator = require('../models/Coordinator');
const SystemAdmin = require('../models/SystemAdmin');

// Unified login for both roles
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user is a System Admin
    const admin = await SystemAdmin.findOne({ email });
    if (admin && admin.password === password) {
      return res.status(200).json({
        message: 'Admin login successful',
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      });
    }
    

    // 2. Check if user is a Coordinator
    const coordinator = await Coordinator.findOne({ email });
    if (coordinator && coordinator.password === password) {
      return res.status(200).json({
        message: 'Coordinator login successful',
        user: {
          id: coordinator._id,
          name: coordinator.name,
          email: coordinator.email,
          assignedEventIds: coordinator.assignedEventIds, // CHANGED
          role: coordinator.role
        }
      });
    }

    // 3. Invalid credentials
    return res.status(401).json({ error: 'Invalid email or password' });

  } catch (err) {
    res.status(500).json({ error: 'Server error during login', details: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is already set by the 'protect' middleware
    const user = req.user;

    // If user is a Coordinator, we want to expand the 'assignedEventIds' 
    // to show actual event names, not just IDs.
    if (user.role === 'COORDINATOR') {
      const detailedCoordinator = await Coordinator.findById(user._id)
        .select('-password') // Don't send password back
        .populate('assignedEventIds', 'eventId name category status'); // Get these fields from Event model
      
      return res.status(200).json(detailedCoordinator);
    }

    // If user is Admin, just send their info (no events to populate)
    const admin = await SystemAdmin.findById(user._id).select('-password');
    res.status(200).json(admin);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
};