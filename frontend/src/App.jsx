import { Routes, Route, Navigate, Link } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";

import HomePage from "./pages/HomePage";
import EventTypesPage from "./pages/EventTypesPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import BookingPage from "./pages/BookingPage";

import PublicBookingPage from "./pages/PublicBookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <div className="text-xs font-bold tracking-wider uppercase text-slate-500">404</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm font-medium text-slate-600">
          The page you're looking for doesn't exist.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            to="/event-types"
            className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition-all hover:from-slate-800 hover:to-slate-700 hover:shadow-lg"
          >
            Go to dashboard
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
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
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Admin */}
      <Route element={<AdminLayout />}>
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
