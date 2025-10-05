// const Event = require('../models/Event');
// const Booking = require('../models/Booking');
// const generateBookingId = require('../utils/generateId');
// const mongoose = require('mongoose');

// /**
//  * Book seats for an event (atomic)
//  * Request body: { userId, eventId, seats }
//  */
// exports.bookSeats = async (req, res) => {
//   const { userId, eventId, seats } = req.body;
//   const seatsRequested = parseInt(seats, 10);

//   if (!userId || !eventId || !seatsRequested || seatsRequested <= 0) {
//     return res.status(400).json({ message: 'Invalid input' });
//   }

//   try {
//     // Approach 1 (recommended for single-node or simple deployments):
//     // Use findOneAndUpdate with a condition that prevents overbooking.
//     const updatedEvent = await Event.findOneAndUpdate(
//       {
//         _id: eventId,
//         // ensure bookedSeats + seatsRequested <= totalSeats
//         $expr: { $lte: [{ $add: ['$bookedSeats', seatsRequested] }, '$totalSeats'] }
//       },
//       {
//         $inc: { bookedSeats: seatsRequested }
//       },
//       { new: true }
//     );

//     if (!updatedEvent) {
//       return res.status(409).json({ message: 'Not enough seats available' });
//     }

//     // Create booking record
//     const booking = new Booking({
//       id: generateBookingId(),
//       userId,
//       eventId,
//       seatsBooked: seatsRequested
//     });

//     await booking.save();

//     return res.status(201).json({
//       message: 'Booking confirmed',
//       booking: {
//         id: booking.id,
//         userId: booking.userId,
//         eventId: booking.eventId,
//         seatsBooked: booking.seatsBooked,
//         bookingTime: booking.bookingTime
//       },
//       remainingSeats: updatedEvent.totalSeats - updatedEvent.bookedSeats
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// /**
//  * Cancel booking:
//  * - decrement bookedSeats atomically
//  * - delete booking record or mark cancelled
//  */
// exports.cancelBooking = async (req, res) => {
//   const { bookingId } = req.params;
//   try {
//     const booking = await Booking.findOne({ id: bookingId });
//     if (!booking) return res.status(404).json({ message: 'Booking not found' });

//     // Atomically decrement event bookedSeats
//     const updatedEvent = await Event.findOneAndUpdate(
//       { _id: booking.eventId },
//       { $inc: { bookedSeats: -booking.seatsBooked } },
//       { new: true }
//     );

//     // remove booking
//     await Booking.deleteOne({ id: bookingId });

//     return res.json({ message: 'Booking cancelled', remainingSeats: updatedEvent.totalSeats - updatedEvent.bookedSeats });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Fetch bookings for a user
//  * GET /api/bookings/user/:userId
//  */
// exports.getUserBookings = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const bookings = await Booking.find({ userId }).populate('eventId').lean();
//     res.json(bookings);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// backend/controllers/bookingController.js
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const generateBookingId = require("../utils/generateId");
const sendBookingMail = require("../utils/mailer"); // for sending emails

const bookSeats = async (req, res) => {
  const { userId, eventId, seatsBooked, name, age, gender, email, contact } = req.body;
  const seatsRequested = Array.isArray(seatsBooked) ? seatsBooked.length : parseInt(seatsBooked, 10);

  if (!userId || !eventId || !seatsRequested || seatsRequested <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lte: [{ $add: ["$bookedSeats", seatsRequested] }, "$totalSeats"] },
      },
      { $inc: { bookedSeats: seatsRequested } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(409).json({ message: "Not enough seats available" });
    }

    const booking = new Booking({
      id: generateBookingId(),
      userId,
      eventId,
      seatsBooked: seatsRequested,
      seatNumbers: seatsBooked,
      name,
      age,
      gender,
      email,
      contact,
    });

    await booking.save();

    const html = `
      <div style="font-family: Arial; color: #333;">
        <h2 style="color: #f1c40f;">Booking Confirmation</h2>
        <p>Hi <b>${name}</b>, your booking is confirmed!</p>
        <p><b>Event:</b> ${updatedEvent.name || "N/A"}</p>
        <p><b>Date:</b> ${updatedEvent.date ? new Date(updatedEvent.date).toLocaleDateString() : "N/A"}</p>
        <p><b>Seats:</b> ${seatsRequested}</p>
        <p><b>Booking ID:</b> ${booking.id}</p>
      </div>
    `;

    await sendBookingMail(email, "Your Event Booking Confirmation", html);

    return res.status(201).json({
      message: "Booking confirmed",
      booking: {
        id: booking.id,
        userId,
        eventId,
        seatsBooked: booking.seatsBooked,
        bookingTime: booking.bookingTime,
      },
      remainingSeats: updatedEvent.totalSeats - updatedEvent.bookedSeats,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId); // Use _id
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const updatedEvent = await Event.findByIdAndUpdate(
      booking.eventId,
      { $inc: { bookedSeats: -booking.seatsBooked } },
      { new: true }
    );

    await Booking.findByIdAndDelete(bookingId);

    return res.json({
      message: "Booking cancelled",
      remainingSeats: updatedEvent.totalSeats - updatedEvent.bookedSeats,
    });
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ userId })
      .populate({ path: "eventId", select: "name location date" })
      .lean();

    const safeBookings = bookings.map((b) => ({
      ...b,
      eventId: b.eventId || { name: "Unknown Event", location: "N/A", date: null },
    }));

    res.json(safeBookings);
  } catch (err) {
    console.error("Get User Bookings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  bookSeats,
  cancelBooking,
  getUserBookings,
};
