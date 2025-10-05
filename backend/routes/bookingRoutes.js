const express = require("express");
const router = express.Router();
const { bookSeats, cancelBooking, getUserBookings } = require("../controllers/bookingController");

// Routes
router.post("/book", bookSeats);
router.delete("/cancel/:bookingId", cancelBooking);
router.get("/user/:userId", getUserBookings);

module.exports = router;
