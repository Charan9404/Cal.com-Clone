import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getPublicBooking } from "../lib/api";
import { CheckCircle2, Calendar, Clock, User } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-200/60 bg-gradient-to-r from-emerald-50 to-white px-8 py-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-gradient-to-r from-emerald-100 to-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmed
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            Booking successful
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This meeting is confirmed. You can safely refresh this page.
          </p>
        </div>

        <div className="px-8 py-7 space-y-5">
          <div className="rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-slate-50/50 px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-600">
              Booking ID
            </div>
            <div className="mt-2 font-mono text-sm font-medium text-slate-900 break-all">
              {uid}
            </div>
          </div>

          {loading ? (
            <div className="text-sm font-medium text-slate-600">Loading booking…</div>
          ) : error ? (
            <div className="rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          ) : booking ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-600">Event</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {booking.event_type_slug}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-600">Time</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-900">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {formatDateTime(booking.start_at)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
                <div className="text-xs font-semibold text-slate-600">Booker</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <User className="h-4 w-4 text-slate-400" />
                  {booking.booker_name}
                </div>
                <div className="mt-1 text-xs font-mono font-medium text-slate-500">
                  {booking.booker_email}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
              Booking not found.
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-200/60">
            <Link
              to="/event-types"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              ← Back to dashboard
            </Link>

            <Link
              to="/bookings"
              className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-all hover:from-slate-800 hover:to-slate-700 hover:shadow-lg"
            >
              View bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
