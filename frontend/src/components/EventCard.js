import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book/${event._id}`);
  };

  const availableSeats = event.totalSeats - event.bookedSeats;
  const isSoldOut = availableSeats <= 0;

  return (
    <div
      style={{
        border: "1px solid #f1c40f",
        borderRadius: "12px",
        padding: "1.2rem",
        background: "#fff",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
      }}
    >
      <div>
        <h2 style={{ marginBottom: "8px", color: "#333", fontSize: "1.3rem" }}>
          {event.name}
        </h2>
        <p style={{ color: "#555", marginBottom: "12px", lineHeight: "1.4" }}>
          {event.description}
        </p>
        <p style={{ fontSize: "14px", color: "#777", marginBottom: "4px" }}>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p style={{ fontSize: "14px", color: "#777", marginBottom: "4px" }}>
          <strong>Location:</strong> {event.location}
        </p>
        <p style={{ fontSize: "14px", color: availableSeats > 0 ? "#27ae60" : "#e74c3c", fontWeight: "bold" }}>
          {availableSeats > 0 ? `Available Seats: ${availableSeats}` : "Sold Out"}
        </p>
      </div>

      <button
        onClick={handleBookNow}
        disabled={isSoldOut}
        style={{
          marginTop: "12px",
          padding: "10px",
          background: isSoldOut ? "#ccc" : "linear-gradient(90deg, #f1c40f, #f39c12)",
          color: isSoldOut ? "#666" : "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: isSoldOut ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => {
          if (!isSoldOut) e.currentTarget.style.background = "linear-gradient(90deg, #f39c12, #f1c40f)";
        }}
        onMouseOut={(e) => {
          if (!isSoldOut) e.currentTarget.style.background = "linear-gradient(90deg, #f1c40f, #f39c12)";
        }}
      >
        {isSoldOut ? "Sold Out" : "Book Now"}
      </button>
    </div>
  );
};

export default EventCard;
