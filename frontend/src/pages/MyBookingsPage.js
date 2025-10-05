import React, { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../services/api";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "testuser123"; // replace with actual user ID

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getMyBookings(userId);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        alert("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(bookingId);

      setBookings((prev) => prev.filter((b) => b.id !== bookingId && b._id !== bookingId));
      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error("Cancel booking failed:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
        Loading your bookings...
      </p>
    );

  if (!Array.isArray(bookings) || bookings.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
        No bookings yet.
      </p>
    );

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1
        style={{
          marginBottom: "30px",
          textAlign: "left",
          color: "#333",
          borderBottom: "3px solid #f1c40f",
          display: "inline-block",
          paddingBottom: "8px",
        }}
      >
<h1 style={{ margin: 0, padding: 0, textAlign: "left" }}>
  My Bookings
</h1>
      </h1>
<div style={{ width: "100%", display: "block", marginLeft: -650 }}>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#fff9e6", color: "#333" }}>
            <th style={thStyle}>Event Name</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Seats</th>
            <th style={thStyle}>Booking Time</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id || b.id} style={{ background: "#fff" }}>
              <td style={tdStyle}>{b.eventId?.name || "Unknown Event"}</td>
              <td style={tdStyle}>{b.eventId?.location || "N/A"}</td>
              <td style={tdStyle}>
                {b.eventId?.date
                  ? new Date(b.eventId.date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td style={tdStyle}>{b.seatsBooked || 0}</td>
              <td style={tdStyle}>
                {b.bookingTime ? new Date(b.bookingTime).toLocaleString() : "N/A"}
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <button
                  onClick={() => handleCancel(b._id || b.id)}
                  style={{
                    padding: "8px 14px",
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#c0392b")}
                  onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

    </div>
  );
};

// Styling helpers
const thStyle = {
  padding: "14px",
  borderBottom: "2px solid #f1c40f",
  fontWeight: "bold",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  color: "#333",
};

export default MyBookingsPage;
