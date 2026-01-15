import { useEffect, useState } from "react";
import { cancelBooking, listBookings } from "../lib/api";

export default function BookingsPage() {
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh(t = tab) {
    setLoading(true);
    try {
      const data = await listBookings(t);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh(tab);
  }, [tab]);

  async function onCancel(id) {
    if (!confirm("Cancel this booking?")) return;
    await cancelBooking(id);
    refresh(tab);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage bookings.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-3 py-2 rounded-xl text-sm border ${
            tab === "upcoming"
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-3 py-2 rounded-xl text-sm border ${
            tab === "past"
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          Past
        </button>
      </div>

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="font-medium">{tab === "upcoming" ? "Upcoming" : "Past"} bookings</div>
          <div className="text-xs text-gray-500">{loading ? "Loading..." : `${items.length} items`}</div>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((b) => (
            <div key={b.id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{b.event_type_slug}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(b.start_at).toLocaleString()} → {new Date(b.end_at).toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {b.booker_name} • {b.booker_email}
                </div>
                <div className="text-xs mt-1">
                  <span
                    className={`inline-flex px-2 py-1 rounded-lg border ${
                      b.status === "CONFIRMED"
                        ? "border-gray-200 text-gray-700"
                        : "border-red-200 text-red-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              {b.status === "CONFIRMED" && tab === "upcoming" && (
                <button
                  className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  onClick={() => onCancel(b.id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="p-4 text-sm text-gray-600">No bookings.</div>
          )}
        </div>
      </div>
    </div>
  );
}
