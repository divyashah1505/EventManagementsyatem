import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvents, bookSeats } from "../services/api";
import BookingForm from "../components/BookingForm";

const BookingPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await getEvents();
        const selected = data.find((e) => e._id === eventId);
        setEvent(selected);
      } catch (err) {
        console.error("Error fetching event:", err);
        alert("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleBookingComplete = async (bookingData) => {
    if (!bookingData || !bookingData.name || !bookingData.email || !bookingData.seatsBooked || bookingData.seatsBooked.length === 0) {
      alert("Please fill all required details and select seats.");
      return;
    }

    try {
      // Make sure backend receives proper payload
      const payload = {
        userId: "testuser123", // replace with actual user id when auth added
        eventId: event._id,
        seatsBooked: bookingData.seatsBooked,
        name: bookingData.name,
        age: bookingData.age || "",
        gender: bookingData.gender || "",
        email: bookingData.email,
        contact: bookingData.contact || "",
      };

      const { data } = await bookSeats(payload);

      alert("Booking successful!");
      navigate(`/confirmation/${data.booking.id}`);
    } catch (err) {
      console.error("Booking error:", err);
      const message = err.response?.data?.message || "Booking failed. Try again.";
      alert(message);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading event...</p>;
  if (!event) return <p style={{ textAlign: "center", marginTop: "50px" }}>Event not found.</p>;

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: "40px",
      margin: "50px auto",
      maxWidth: "1000px"
    }}>
      {/* Left: Event Details */}
      <div style={{
        flex: 1,
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>{event.name}</h2>
        <p style={{ color: "#555", marginBottom: "10px" }}>{event.description}</p>
        <p style={{ fontSize: "14px", color: "#777" }}><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p style={{ fontSize: "14px", color: "#777" }}><strong>Location:</strong> {event.location}</p>
        <p style={{ fontSize: "14px", color: "#777" }}>
          <strong>Available Seats:</strong> {event.totalSeats - event.bookedSeats}
        </p>
      </div>

      {/* Right: Seat Selection & User Form */}
      <div style={{
        flex: 1,
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
      }}>
        <BookingForm event={event} onBookComplete={handleBookingComplete} />
      </div>
    </div>
  );
};

export default BookingPage;
