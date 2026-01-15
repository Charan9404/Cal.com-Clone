import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import EventTypesPage from "./pages/EventTypesPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import BookingPage from "./pages/BookingPage";
import PublicBookingPage from "./pages/PublicBookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/event-types" replace />} />
        <Route path="/event-types" element={<EventTypesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/bookings" element={<BookingPage />} />
      </Route>

      <Route path="/book/:slug" element={<PublicBookingPage />} />
      <Route path="/booking/:uid" element={<ConfirmationPage />} />

      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
