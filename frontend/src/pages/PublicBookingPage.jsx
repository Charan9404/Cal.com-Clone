import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPublicBooking, getPublicEventType, getSlots } from "../lib/api";

function yyyyMmDd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

  const prettyDate = useMemo(() => new Date(date).toDateString(), [date]);

  useEffect(() => {
    (async () => {
      const et = await getPublicEventType(slug);
      setEventType(et);
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      setLoadingSlots(true);
      setSlotError("");
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
    try {
      const booking = await createPublicBooking({
        slug,
        startAt: selected,
        name,
        email,
      });
      nav(`/booking/${booking.booking_uid}`, { state: { booking } });
    } catch (e) {
      alert(e?.response?.data?.detail || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-10">
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="text-xs text-gray-500">Booking</div>
            <h1 className="text-2xl font-semibold mt-1">
              {eventType ? eventType.title : "Loading..."}
            </h1>
            {eventType && (
              <p className="text-sm text-gray-600 mt-2">
                {eventType.duration_minutes} minutes • {eventType.description}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2">
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="font-medium">Select a date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-3 border border-gray-200 rounded-xl px-3 py-2"
              />
              <div className="text-sm text-gray-600 mt-3">{prettyDate}</div>

              <div className="mt-6 font-medium">Available times</div>
              {loadingSlots ? (
                <div className="text-sm text-gray-600 mt-2">Loading slots...</div>
              ) : slotError ? (
                <div className="text-sm text-red-600 mt-2">{slotError}</div>
              ) : slots.length === 0 ? (
                <div className="text-sm text-gray-600 mt-2">No slots available.</div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelected(s)}
                      className={`px-3 py-2 rounded-xl text-sm border transition ${
                        selected === s
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="font-medium">Your details</div>
              <div className="text-sm text-gray-600 mt-1">
                {selected
                  ? `Selected: ${new Date(selected).toLocaleString()}`
                  : "Select a time to continue."}
              </div>

              <div className="mt-4 grid gap-3">
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={onBook}
                  disabled={!selected || !name || !email || submitting}
                  className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "Booking..." : "Confirm booking"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          CalClone • Public booking page
        </div>
      </div>
    </div>
  );
}
