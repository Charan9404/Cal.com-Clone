import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getPublicBooking } from "../lib/api";

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ConfirmationPage() {
  const { uid } = useParams();
  const loc = useLocation();
  const [booking, setBooking] = useState(loc.state?.booking || null);
  const [loading, setLoading] = useState(!loc.state?.booking);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking) {
      (async () => {
        try {
          setError("");
          const b = await getPublicBooking(uid);
          setBooking(b);
        } catch (e) {
          setError("Booking not found.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [uid, booking]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Confirmed
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Booking successful
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            This meeting is confirmed. You can safely refresh this page.
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-semibold text-slate-600">
              Booking ID
            </div>
            <div className="mt-1 font-mono text-sm text-slate-900 break-all">
              {uid}
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-slate-600">Loading booking…</div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : booking ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="text-xs font-semibold text-slate-600">Event</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {booking.event_type_slug}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="text-xs font-semibold text-slate-600">Time</div>
                <div className="mt-1 text-sm text-slate-900">
                  {formatDateTime(booking.start_at)}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="text-xs font-semibold text-slate-600">Booker</div>
                <div className="mt-1 text-sm text-slate-900">
                  {booking.booker_name}
                </div>
                <div className="mt-1 text-xs font-mono text-slate-500">
                  {booking.booker_email}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Booking not found.
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/event-types"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              ← Back to dashboard
            </Link>

            <Link
              to="/bookings"
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
            >
              View bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
