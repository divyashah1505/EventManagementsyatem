import React from "react";
import EventCard from "./EventCard";

const EventList = ({ events }) => {
  if (!events || events.length === 0) return <p>No events available.</p>;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    }}>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
