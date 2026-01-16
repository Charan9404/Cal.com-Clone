import { Routes, Route, Navigate, Link } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";

import EventTypesPage from "./pages/EventTypesPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import BookingPage from "./pages/BookingPage";

import PublicBookingPage from "./pages/PublicBookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold text-slate-500">404</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The page you’re looking for doesn’t exist.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            to="/event-types"
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            Go to dashboard
          </Link>
          <Link
            to="/"
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/event-types" replace />} />
        <Route path="/event-types" element={<EventTypesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/bookings" element={<BookingPage />} />
      </Route>

      {/* Public */}
      <Route path="/book/:slug" element={<PublicBookingPage />} />
      <Route path="/booking/:uid" element={<ConfirmationPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
