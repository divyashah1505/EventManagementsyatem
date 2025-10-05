import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const getEvents = () => axios.get(`${API_URL}/events`);

// Change this to match backend route
export const bookSeats = (data) => axios.post(`${API_URL}/bookings/book`, data);

export const getBookingById = (id) => axios.get(`${API_URL}/bookings/${id}`);
export const getMyBookings = (userId) => axios.get(`${API_URL}/bookings/user/${userId}`);
export const cancelBooking = (id) => axios.delete(`${API_URL}/bookings/cancel/${id}`);
