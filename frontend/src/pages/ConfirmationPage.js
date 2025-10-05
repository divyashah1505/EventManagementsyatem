import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookingById } from "../services/api";

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading confirmation...</p>;
  if (!booking) return <p style={{ textAlign: "center", marginTop: "50px" }}>Booking not found.</p>;

  return (
    <div style={{
      maxWidth: "600px",
      margin: "50px auto",
      padding: "30px",
      borderRadius: "12px",
      background: "#fff",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h1 style={{ marginBottom: "20px", color: "#27ae60" }}>Booking Confirmed!</h1>
      <p style={{ fontSize: "15px", color: "#555" }}><strong>Event:</strong> {booking.eventId}</p>
      <p style={{ fontSize: "15px", color: "#555" }}><strong>Seats Booked:</strong> {booking.seatsBooked}</p>
      <p style={{ fontSize: "15px", color: "#555" }}><strong>Seat Numbers:</strong> {booking.seatNumbers?.join(", ")}</p>
      <p style={{ fontSize: "15px", color: "#555" }}><strong>Name:</strong> {booking.name}</p>
      <p style={{ fontSize: "15px", color: "#555" }}><strong>Email:</strong> {booking.email}</p>
      <p style={{ fontSize: "15px", color: "#555" }}><strong>Contact:</strong> {booking.contact}</p>
      <p style={{ fontSize: "14px", color: "#777" }}><strong>Booking Time:</strong> {new Date(booking.bookingTime).toLocaleString()}</p>
      <Link to="/" style={{
        display: "inline-block",
        marginTop: "20px",
        padding: "12px 25px",
        background: "#ffb400",
        color: "#fff",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Back to Events
      </Link>
    </div>
  );
};

export default ConfirmationPage;
