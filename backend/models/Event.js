const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, required: true, min: 0 },
  bookedSeats: { type: Number, required: true, default: 0 },
  location: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
