const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // Optional: for colored console logs

// Load env vars
dotenv.config();

// Load Models
const Event = require('../models/Event');
const Coordinator = require('../models/Coordinator');
const SystemAdmin = require('../models/SystemAdmin');
const Participant = require('../models/Participant');
const Submission = require('../models/Submission');

// Load Data
const { events, admins, coordinators, participants } = require('./data');

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding...'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // 1. Clear existing data
    await Event.deleteMany();
    await Coordinator.deleteMany();
    await SystemAdmin.deleteMany();
    await Participant.deleteMany();
    await Submission.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // 2. Insert new data
    await Event.insertMany(events);
    await SystemAdmin.insertMany(admins);
    await Coordinator.insertMany(coordinators);
    await Participant.insertMany(participants);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Event.deleteMany();
    await Coordinator.deleteMany();
    await SystemAdmin.deleteMany();
    await Participant.deleteMany();
    await Submission.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}