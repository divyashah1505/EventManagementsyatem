import React, { useEffect, useState } from "react";
import { getEvents } from "../services/api";
import EventList from "../components/EventList";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading events...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", textAlign: "left", color: "#333" }}>Upcoming Events</h1>
      <EventList events={events} />
    </div>
  );
};

export default EventsPage;
