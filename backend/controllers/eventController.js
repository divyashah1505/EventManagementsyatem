const Event = require("../models/Event");

// List all events with remaining seats
exports.listEvents = async (req, res) => {
  try {
    const events = await Event.find().lean();
    const enriched = events.map((ev) => ({
      ...ev,
      remainingSeats: ev.totalSeats - ev.bookedSeats,
    }));
    res.json(enriched);
  } catch (err) {
    console.error("❌ List Events Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
