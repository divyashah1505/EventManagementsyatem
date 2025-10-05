import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { getEvents } from "../services/api";

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents();
        console.log("Fetched events:", data);
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p style={{ textAlign: "left", marginTop: "50px", marginLeft: "40px" }}>Loading events...</p>;

  // Events for selected date
  const eventsForDate = events.filter(
    (e) => new Date(e.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div style={{ maxWidth: "900px", margin: "40px 0 40px 40px", padding: "20px" }}>
      <h1 style={{ textAlign: "left", marginBottom: "20px", color: "#333" }}>
        Calendar View
      </h1>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const dayEvents = events.filter(
              (e) => new Date(e.date).toDateString() === date.toDateString()
            );
            return dayEvents.length > 0 ? (
              <div style={{ fontSize: "10px", color: "#f1c40f" }}>
                {dayEvents.map((ev) => (
                  <div key={ev._id}>{ev.name}</div>
                ))}
              </div>
            ) : null;
          }
        }}
      />

      <div style={{ marginTop: "20px" }}>
        <h3>Events on {selectedDate.toDateString()}:</h3>
        {eventsForDate.length === 0 ? (
          <p>No events scheduled</p>
        ) : (
          <ul>
            {eventsForDate.map((ev) => (
              <li key={ev._id}>
                {ev.name} @ {ev.location}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
