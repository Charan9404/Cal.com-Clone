import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPublicBooking, getPublicEventType, getSlots } from "../lib/api";
import { Clock, Calendar, CheckCircle2, User } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-8 py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              {eventType ? eventType.title : "Loading…"}
            </h1>

            {eventType ? (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                  <Clock className="h-3.5 w-3.5" />
                  {eventType.duration_minutes}m
                </span>
                {eventType.description && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="max-w-3xl text-gray-600">
                      {eventType.description}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                Loading event details…
              </p>
            )}
          </div>

          {/* Body */}
          <div className="grid md:grid-cols-2">
            {/* Left: Date + Slots */}
            <div className="border-b border-slate-200/60 px-8 py-8 md:border-b-0 md:border-r md:border-slate-200/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">1</div>
                <div className="text-sm font-semibold text-slate-900">
                  Select a date
                </div>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              />
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                {prettyDate}
              </div>

              <div className="mt-8 flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">2</div>
                <div className="text-sm font-bold text-slate-900">
                  Pick a time
                </div>
              </div>

              {loadingSlots ? (
                <div className="mt-3 text-sm font-medium text-slate-600">Loading slots…</div>
              ) : slotError ? (
                <div className="mt-3 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                  {slotError}
                </div>
              ) : slots.length === 0 ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50/50 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  No slots available for this date.
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelected(s);
                        setBookError("");
                      }}
                      type="button"
                      className={[
                        "rounded-md border px-4 py-2.5 text-sm font-medium transition-all",
                        selected === s
                          ? "bg-black text-white border-black"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {formatTime(s)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Booker details */}
            <div className="px-8 py-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">3</div>
                <div className="text-sm font-bold text-slate-900">
                  Your details
                </div>
              </div>
              <div className="mt-3 mb-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    {selected ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Selected: <span className="font-semibold text-gray-900">{formatDateTime(selected)}</span></span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select a time on the left to continue.</span>
                )}
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-700">
                    Name
                  </div>
                  <input
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <div className="mb-2 text-xs font-bold text-slate-700">
                    Email
                  </div>
                  <input
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                {bookError ? (
                  <div className="rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                    {bookError}
                  </div>
                ) : null}

                <button
                  onClick={onBook}
                  disabled={!selected || !name || !email || submitting}
                  className="mt-2 flex w-full items-center justify-center rounded-md bg-black px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                >
                  {submitting ? "Booking…" : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>

                <div className="text-xs font-medium text-slate-500">
                  You'll receive a confirmation on the next screen.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-block text-xs text-gray-400">
            CalClone
          </div>
        </div>
      </div>
    </div>
  );
}
