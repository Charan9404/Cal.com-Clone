import { useEffect, useMemo, useState } from "react";
import { cancelBooking, listBookings } from "../lib/api";
import { CheckCircle2, Calendar, User } from "lucide-react";

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

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function BookingsPage() {
  const [tab, setTab] = useState("upcoming"); // upcoming | past
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const headerTitle = useMemo(
    () => (tab === "upcoming" ? "Upcoming bookings" : "Past bookings"),
    [tab]
  );

  async function refresh(t = tab) {
    setLoading(true);
    setError("");
    try {
      const data = await listBookings(t);
      setItems(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Could not load bookings. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh(tab);
  }, [tab]);

  async function onCancel(id) {
    if (!confirm("Cancel this booking?")) return;
    setCancelingId(id);
    setError("");
    try {
      await cancelBooking(id);
      setToast("Booking canceled.");
      setTimeout(() => setToast(""), 1200);
      await refresh(tab);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Could not cancel booking. Try again."
      );
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Bookings
        </h1>
        <p className="text-sm text-slate-600">View and manage bookings.</p>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-slate-200/80 bg-white/90 p-1.5 shadow-md backdrop-blur-sm">
        <button
          onClick={() => setTab("upcoming")}
          type="button"
          className={[
            "rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
            tab === "upcoming"
              ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/20"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("past")}
          type="button"
          className={[
            "rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
            tab === "past"
              ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/20"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          Past
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="text-sm font-semibold text-slate-900">
            {headerTitle}
          </div>
          <div className="text-xs text-slate-500">
            {loading ? "Loading…" : `${items.length} items`}
          </div>
        </div>

        {/* Toast */}
        {toast ? (
          <div className="px-6 pt-5">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-emerald-50/50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              {toast}
            </div>
          </div>
        ) : null}

        {/* Error */}
        {error ? (
          <div className="px-6 pt-5">
            <div className="rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="px-6 py-12 text-sm font-medium text-slate-600">
            Fetching bookings…
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-12">
            <div className="text-sm font-semibold text-slate-900">
              No {tab === "upcoming" ? "upcoming" : "past"} bookings
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Once someone books your event, it will appear here.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/60">
            {items.map((b) => {
              const isConfirmed = b.status === "CONFIRMED";
              const isCanceled = b.status === "CANCELED";
              const canCancel = isConfirmed && tab === "upcoming";

              return (
                <div
                  key={b.id}
                  className="px-6 py-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="text-sm font-semibold text-slate-900">
                        {b.event_type_slug}
                      </div>

                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm",
                          isConfirmed
                            ? "border-slate-200 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700"
                            : isCanceled
                            ? "border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 text-red-700"
                            : "border-slate-200 bg-white text-slate-700",
                        ].join(" ")}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{formatDateTime(b.start_at)} → {formatTime(b.end_at)}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>{b.booker_name} • <span className="font-mono text-slate-700">{b.booker_email}</span></span>
                    </div>
                  </div>

                  {canCancel ? (
                    <button
                      className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-all hover:bg-red-50 hover:shadow disabled:opacity-60"
                      onClick={() => onCancel(b.id)}
                      disabled={cancelingId === b.id}
                      type="button"
                    >
                      {cancelingId === b.id ? "Canceling…" : "Cancel"}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
