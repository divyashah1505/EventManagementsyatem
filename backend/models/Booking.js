const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // human-friendly booking id
  userId: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seatsBooked: { type: Number, required: true, min: 1 },
  bookingTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
