// import React, { useState } from "react";

// /**
//  * BookingForm
//  * Props:
//  * - maxSeats: maximum seats available
//  * - defaultSeats: starting value
//  * - onSubmit: async function({ seats }) => Promise
//  */
// export default function BookingForm({ maxSeats = 1, defaultSeats = 1, onSubmit }) {
//   const [seats, setSeats] = useState(defaultSeats);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     let v = Number(e.target.value);
//     if (!v || v < 1) v = 1;
//     if (v > maxSeats) v = maxSeats;
//     setSeats(v);
//   };

//   const submit = async () => {
//     if (seats < 1) return alert("Choose at least 1 seat.");
//     setLoading(true);
//     try {
//       await onSubmit({ seats });
//     } catch (err) {
//       // pass error up (caller may also show alert)
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//       <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
//         Seats
//         <input
//           type="number"
//           min="1"
//           max={maxSeats}
//           value={seats}
//           onChange={handleChange}
//           style={{ width: 70, padding: 6 }}
//         />
//         <span style={{ fontSize: 12, color: "#666" }}>/ {maxSeats}</span>
//       </label>

//       <button onClick={submit} disabled={loading} style={{
//         padding: "8px 12px",
//         borderRadius: 6,
//         cursor: loading ? "not-allowed" : "pointer"
//       }}>
//         {loading ? "Booking..." : "Confirm Booking"}
//       </button>
//     </div>
//   );
// }
import React, { useState } from "react";
import { bookSeats } from "../services/api";

const BookingForm = ({ event, onBookComplete }) => {
  const [step, setStep] = useState(1); // Step 1 = seat selection, Step 2 = user details
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);

  const seatsAvailable = event.totalSeats - event.bookedSeats;

  // Toggle seat selection
  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else if (selectedSeats.length < seatsAvailable) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Proceed to next step
  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    setStep(2);
  };

  // Handle user details change
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, age, gender, email, contact } = userDetails;
    if (!name || !age || !gender || !email || !contact) {
      alert("Please fill all fields.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("No seats selected.");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        userId: "testuser123", 
        eventId: event._id,
        seatsBooked: selectedSeats, 
        name,
        age,
        gender,
        email,
        contact,
      };

      const { data } = await bookSeats(bookingData);
      alert(`🎉 Booking successful!\nBooking ID: ${data.booking.id}`);
      onBookComplete(data.booking);
    } catch (err) {
      console.error(err);
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {step === 1 && (
        <>
          <h2 style={headingStyle}>Select Your Seats</h2>
          <p style={subTextStyle}>
            {selectedSeats.length}/{seatsAvailable} selected
          </p>
          <div style={gridStyle}>
            {Array.from({ length: event.totalSeats }, (_, i) => i + 1).map(
              (seat) => {
                const isBooked = event.bookedSeatsArray?.includes(seat) || false;
                const isSelected = selectedSeats.includes(seat);
                return (
                  <div
                    key={seat}
                    onClick={() => !isBooked && toggleSeat(seat)}
                    style={{
                      ...seatStyle,
                      background: isBooked
                        ? "#ddd"
                        : isSelected
                        ? "#27ae60"
                        : "#f8f8f8",
                      color: isBooked || isSelected ? "#fff" : "#333",
                      border: isSelected
                        ? "2px solid #27ae60"
                        : "1px solid #ddd",
                      cursor: isBooked ? "not-allowed" : "pointer",
                    }}
                  >
                    {seat}
                  </div>
                );
              }
            )}
          </div>

          <button onClick={handleNext} style={nextButtonStyle}>
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={headingStyle}>Enter Your Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            value={userDetails.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={userDetails.age}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <select
            name="gender"
            value={userDetails.gender}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={userDetails.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            name="contact"
            placeholder="Contact Number"
            value={userDetails.contact}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={backButtonStyle}
              disabled={loading}
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              style={submitButtonStyle}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const containerStyle = {
  border: "2px solid #f1c40f",
  borderRadius: "12px",
  padding: "2rem",
  maxWidth: "600px",
  margin: "30px auto",
  background: "#fffbea",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
};

const headingStyle = {
  textAlign: "center",
  color: "#333",
  marginBottom: "1rem",
};

const subTextStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "15px",
  color: "#555",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gap: "8px",
  justifyItems: "center",
  marginBottom: "20px",
};

const seatStyle = {
  width: "40px",
  height: "40px",
  lineHeight: "40px",
  textAlign: "center",
  borderRadius: "6px",
  fontWeight: "600",
  userSelect: "none",
  transition: "all 0.2s ease",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
  width: "100%",
};

const nextButtonStyle = {
  width: "100%",
  padding: "12px",
  background: "#f1c40f",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const backButtonStyle = {
  flex: 1,
  padding: "12px",
  background: "#ddd",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  cursor: "pointer",
};

const submitButtonStyle = {
  flex: 2,
  padding: "12px",
  background: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

export default BookingForm;
