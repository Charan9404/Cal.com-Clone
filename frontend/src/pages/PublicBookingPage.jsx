import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPublicBooking, getPublicEventType, getSlots } from "../lib/api";

function yyyyMmDd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

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

export default function PublicBookingPage() {
  const { slug } = useParams();
  const nav = useNavigate();

  const [eventType, setEventType] = useState(null);

  const [date, setDate] = useState(() => yyyyMmDd(new Date()));
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");

  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");

  const prettyDate = useMemo(() => new Date(date).toDateString(), [date]);

  useEffect(() => {
    (async () => {
      try {
        const et = await getPublicEventType(slug);
        setEventType(et);
      } catch (e) {
        setEventType(null);
      }
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      setLoadingSlots(true);
      setSlotError("");
      setBookError("");
      try {
        const s = await getSlots(slug, date);
        setSlots(s);
        setSelected("");
      } catch (e) {
        console.error("getSlots failed:", e);
        setSlots([]);
        setSlotError(
          e?.response?.data?.detail ||
            (typeof e?.response?.data === "string" ? e.response.data : "") ||
            e?.message ||
            "Failed to load slots"
        );
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [slug, date]);

  async function onBook() {
    if (!selected || !name || !email) return;
    setSubmitting(true);
    setBookError("");
    try {
      const booking = await createPublicBooking({
        slug,
        startAt: selected,
        name,
        email,
      });
      nav(`/booking/${booking.booking_uid}`, { state: { booking } });
    } catch (e) {
      setBookError(e?.response?.data?.detail || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="text-xs font-semibold text-slate-500">Booking</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {eventType ? eventType.title : "Loading…"}
            </h1>

            {eventType ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {eventType.duration_minutes}m
                </span>
                <span className="text-slate-500">•</span>
                <span className="max-w-3xl">
                  {eventType.description || "No description."}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Fetching event details…
              </p>
            )}
          </div>

          {/* Body */}
          <div className="grid md:grid-cols-2">
            {/* Left: Date + Slots */}
            <div className="border-b border-slate-200 px-6 py-6 md:border-b-0 md:border-r">
              <div className="text-sm font-semibold text-slate-900">
                1) Select a date
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
              <div className="mt-2 text-sm text-slate-600">{prettyDate}</div>

              <div className="mt-6 text-sm font-semibold text-slate-900">
                2) Pick a time
              </div>

              {loadingSlots ? (
                <div className="mt-3 text-sm text-slate-600">Loading slots…</div>
              ) : slotError ? (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {slotError}
                </div>
              ) : slots.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  No slots available for this date.
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelected(s);
                        setBookError("");
                      }}
                      type="button"
                      className={[
                        "rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                        selected === s
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {formatTime(s)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Booker details */}
            <div className="px-6 py-6">
              <div className="text-sm font-semibold text-slate-900">
                3) Your details
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {selected ? (
                  <>
                    Selected:{" "}
                    <span className="font-semibold text-slate-900">
                      {formatDateTime(selected)}
                    </span>
                  </>
                ) : (
                  "Select a time on the left to continue."
                )}
              </div>

              <div className="mt-5 grid gap-3">
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">
                    Name
                  </div>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-600">
                    Email
                  </div>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                {bookError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {bookError}
                  </div>
                ) : null}

                <button
                  onClick={onBook}
                  disabled={!selected || !name || !email || submitting}
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                >
                  {submitting ? "Booking…" : "Confirm booking"}
                </button>

                <div className="text-xs text-slate-500">
                  You’ll receive a confirmation on the next screen.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          CalClone • Public booking page
        </div>
      </div>
    </div>
  );
}
