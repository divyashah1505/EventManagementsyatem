import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import CalendarView from "./pages/CalendarView";


const App = () => {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#282c34", color: "white" }}>
        <Link to="/" style={{ margin: "0 1rem", color: "white" }}>Events</Link>
        <Link to="/bookings" style={{ margin: "0 1rem", color: "white" }}>My Bookings</Link>
<Link to="/calendar-view" style={{ margin: "0 1rem", color: "white" }}>
  Calendar View
</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/book/:eventId" element={<BookingPage />} />
        <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/calendar-view" element={<CalendarView />} />

      </Routes>
    </Router>
  );
};

export default App;
