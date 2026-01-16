import { useEffect, useMemo, useState } from "react";
import { cancelBooking, listBookings } from "../lib/api";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Bookings
        </h1>
        <p className="text-sm text-slate-600">View and manage bookings.</p>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => setTab("upcoming")}
          type="button"
          className={[
            "rounded-xl px-3 py-2 text-sm font-semibold transition",
            tab === "upcoming"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50",
          ].join(" ")}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("past")}
          type="button"
          className={[
            "rounded-xl px-3 py-2 text-sm font-semibold transition",
            tab === "past"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50",
          ].join(" ")}
        >
          Past
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">
            {headerTitle}
          </div>
          <div className="text-xs text-slate-500">
            {loading ? "Loading…" : `${items.length} items`}
          </div>
        </div>

        {/* Toast */}
        {toast ? (
          <div className="px-5 pt-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {toast}
            </div>
          </div>
        ) : null}

        {/* Error */}
        {error ? (
          <div className="px-5 pt-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="px-5 py-10 text-sm text-slate-600">
            Fetching bookings…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10">
            <div className="text-sm font-semibold text-slate-900">
              No {tab === "upcoming" ? "upcoming" : "past"} bookings
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Once someone books your event, it will appear here.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {items.map((b) => {
              const isConfirmed = b.status === "CONFIRMED";
              const isCanceled = b.status === "CANCELED";
              const canCancel = isConfirmed && tab === "upcoming";

              return (
                <div
                  key={b.id}
                  className="px-5 py-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-slate-900">
                        {b.event_type_slug}
                      </div>

                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                          isConfirmed
                            ? "border-slate-200 bg-slate-50 text-slate-700"
                            : isCanceled
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-slate-200 bg-white text-slate-700",
                        ].join(" ")}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      {formatDateTime(b.start_at)} → {formatTime(b.end_at)}
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {b.booker_name} •{" "}
                      <span className="font-mono">{b.booker_email}</span>
                    </div>
                  </div>

                  {canCancel ? (
                    <button
                      className="shrink-0 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
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
