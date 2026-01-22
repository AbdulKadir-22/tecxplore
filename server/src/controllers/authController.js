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