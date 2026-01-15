import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getPublicBooking } from "../lib/api";

export default function ConfirmationPage() {
  const { uid } = useParams();
  const loc = useLocation();
  const [booking, setBooking] = useState(loc.state?.booking || null);
  const [loading, setLoading] = useState(!loc.state?.booking);

  useEffect(() => {
    if (!booking) {
      (async () => {
        try {
          const b = await getPublicBooking(uid);
          setBooking(b);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [uid, booking]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full border border-gray-200 rounded-2xl p-6">
        <div className="text-xs text-gray-500">Confirmed</div>
        <h1 className="text-2xl font-semibold mt-1">Booking successful</h1>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <div>
            Booking ID: <span className="font-mono text-gray-900">{uid}</span>
          </div>

          {loading ? (
            <div>Loading booking…</div>
          ) : booking ? (
            <>
              <div>
                Event: <span className="text-gray-900">{booking.event_type_slug}</span>
              </div>
              <div>
                Time:{" "}
                <span className="text-gray-900">
                  {new Date(booking.start_at).toLocaleString()}
                </span>
              </div>
              <div>
                Booker: <span className="text-gray-900">{booking.booker_name}</span>
              </div>
            </>
          ) : (
            <div className="text-red-600">Booking not found.</div>
          )}
        </div>

        <div className="mt-6">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm inline-block"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
