import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL,
});

export const listEventTypes = async () => (await api.get("/api/event-types/")).data;
export const createEventType = async (payload) =>
  (await api.post("/api/event-types/", payload)).data;

export const updateEventType = async (id, payload) =>
  (await api.patch(`/api/event-types/${id}/`, payload)).data;

export const deleteEventType = async (id) => api.delete(`/api/event-types/${id}/`);

export const getAvailability = async () => (await api.get("/api/availability/")).data;

export const updateAvailability = async (payload) =>
  (await api.put(`/api/availability/${payload.id}/`, payload)).data;

export const listBookings = async (type = "upcoming") =>
  (await api.get(`/api/bookings/?type=${type}`)).data;

export const cancelBooking = async (id) =>
  (await api.post(`/api/bookings/${id}/cancel/`)).data;

// public
export const getPublicEventType = async (slug) =>
  (await api.get(`/api/public/event-types/${slug}/`)).data;

export const getSlots = async (slug, date) =>
  (await api.get("/api/public/slots/", { params: { slug, date } })).data;

export const createPublicBooking = async (payload) =>
  (await api.post("/api/public/bookings/", payload)).data;

export const getPublicBooking = async (uid) =>
  (await api.get(`/api/public/bookings/${uid}/`)).data;
