// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events - list all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // sort by date ascending
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
