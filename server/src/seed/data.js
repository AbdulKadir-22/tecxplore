const events = [
  {
    eventId: 'evt_001',
    name: 'RoboWars 2024',
    category: 'Robotics',
    status: 'upcoming'
  },
  {
    eventId: 'evt_002',
    name: 'CodeMarathon',
    category: 'Tech',
    status: 'live'
  },
  {
    eventId: 'evt_003',
    name: 'Debate Championship',
    category: 'Non-Tech',
    status: 'upcoming'
  }
];

const admins = [
  {
    name: 'Super Admin',
    email: 'admin@college.edu',
    password: 'adminpassword123', // Plain text as requested
    role: 'SYSTEM_ADMIN'
  }
];

const coordinators = [
  {
    name: 'John Doe',
    email: 'john@college.edu',
    password: 'password123',
    assignedEventIds: ['evt_001'], // Now an array
    role: 'COORDINATOR'
  },
  {
    name: 'Jane Smith',
    email: 'abc@tecxp',
    password: 'password123',
    assignedEventIds: ['evt_002', 'evt_003'], // Example: Jane manages TWO events
    role: 'COORDINATOR'
  }
];

const participants = [
  {
    participantId: 'p_001',
    name: 'Alice Cooper',
    registrationId: 'REG_1001',
    token: 'TKN_ABC1',
    eventId: 'evt_001',
    verified: false
  },
  {
    participantId: 'p_002',
    name: 'Bob Marley',
    registrationId: 'REG_1002',
    token: 'TKN_ABC2',
    eventId: 'evt_001',
    verified: false
  },
  {
    participantId: 'p_003',
    name: 'Charlie Puth',
    registrationId: 'REG_2001',
    token: 'TKN_XYZ1',
    eventId: 'evt_002',
    verified: false
  }
];

module.exports = { events, admins, coordinators, participants };