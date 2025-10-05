require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Event.deleteMany({});

  const events = [
    { name: 'Music Concert', date: new Date('2025-11-10'), totalSeats: 100, bookedSeats: 0, location: 'Arena A', description: 'Live music event.' },
    { name: 'Tech Talk', date: new Date('2025-10-20'), totalSeats: 50, bookedSeats: 0, location: 'Hall B', description: 'Talk on MERN stack.' },
    { name: 'Comedy Night', date: new Date('2025-12-05'), totalSeats: 80, bookedSeats: 0, location: 'Club C', description: 'Stand up comedy.' }
  ];

  await Event.insertMany(events);
  console.log('Seeded events.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
