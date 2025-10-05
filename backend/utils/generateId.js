const { v4: uuidv4 } = require('uuid');

function generateBookingId() {
  // e.g., BKG-xxxxxxxx
  return `BKG-${uuidv4().split('-')[0].toUpperCase()}`;
}

module.exports = generateBookingId;
