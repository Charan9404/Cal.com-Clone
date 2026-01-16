import { useEffect, useMemo, useState } from "react";
import { getAvailability, updateAvailability } from "../lib/api";
import TimezonePicker from "../components/TimezonePicker";

const weekdays = [
  { label: "Mon", val: 0 },
  { label: "Tue", val: 1 },
  { label: "Wed", val: 2 },
  { label: "Thu", val: 3 },
  { label: "Fri", val: 4 },
  { label: "Sat", val: 5 },
  { label: "Sun", val: 6 },
];

function toMinutes(t) {
  const [hh, mm] = (t || "00:00").split(":").map((x) => Number(x));
  return hh * 60 + mm;
}

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(null);

  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [selectedDays, setSelectedDays] = useState(new Set([0, 1, 2, 3, 4]));
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAvailability();
      setAvailability(data);
      setTimezone(data.timezone || "Asia/Kolkata");

      if (data.rules?.length) {
        setSelectedDays(new Set(data.rules.map((r) => r.weekday)));
        setStart(data.rules[0].start_time?.slice(0, 5) || "09:00");
        setEnd(data.rules[0].end_time?.slice(0, 5) || "17:00");
      }
      setLoading(false);
    })();
  }, []);

  const isValid = useMemo(() => {
    if (!timezone) return false;
    if (!selectedDays.size) return false;
    if (toMinutes(end) <= toMinutes(start)) return false;
    return true;
  }, [timezone, selectedDays, start, end]);

  function toggleDay(d) {
    const next = new Set(selectedDays);
    if (next.has(d)) next.delete(d);
    else next.add(d);
    setSelectedDays(next);
    setError("");
  }

  async function onSave() {
    if (!availability) return;

    setError("");
    setSavedToast(false);

    if (!timezone) return setError("Timezone is required.");
    if (!selectedDays.size) return setError("Select at least one day.");
    if (toMinutes(end) <= toMinutes(start))
      return setError("End time must be after start time.");

    setSaving(true);
    try {
      const rules = Array.from(selectedDays)
        .sort((a, b) => a - b)
        .map((d) => ({
          weekday: d,
          start_time: start,
          end_time: end,
        }));

      const updated = await updateAvailability({
        id: availability.id,
        timezone,
        rules,
      });

      setAvailability(updated);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.detail || "Could not save availability.";
      setError(String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Availability
        </h1>
        <p className="text-sm text-slate-600">
          Set when you’re available for bookings.
        </p>
      </div>

      {/* Card */}
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">
            Weekly schedule
          </div>
          <div className="mt-1 text-xs text-slate-500">
            These hours are used to generate available slots on your public
            booking page.
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-slate-600">Loading…</div>
        ) : (
          <div className="px-5 py-5 space-y-5">
            {/* Timezone */}
            <div>
              <div className="text-xs font-semibold text-slate-600">Timezone</div>
              <div className="mt-2">
                <TimezonePicker value={timezone} onChange={setTimezone} />
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Changing timezone shifts how slot times are displayed.
              </div>
            </div>

            {/* Days */}
            <div>
              <div className="text-xs font-semibold text-slate-600">Days</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {weekdays.map((d) => {
                  const active = selectedDays.has(d.val);
                  return (
                    <button
                      key={d.val}
                      onClick={() => toggleDay(d.val)}
                      type="button"
                      className={[
                        "rounded-2xl px-3 py-2 text-sm font-semibold border transition",
                        active
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-600">From</div>
                <input
                  type="time"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600">To</div>
                <input
                  type="time"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>

            {/* Error / Saved */}
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {savedToast ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Saved!
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSave}
                disabled={saving || !isValid}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>

              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setTimezone(availability?.timezone || "Asia/Kolkata");
                  if (availability?.rules?.length) {
                    setSelectedDays(new Set(availability.rules.map((r) => r.weekday)));
                    setStart(availability.rules[0].start_time?.slice(0, 5) || "09:00");
                    setEnd(availability.rules[0].end_time?.slice(0, 5) || "17:00");
                  } else {
                    setSelectedDays(new Set([0, 1, 2, 3, 4]));
                    setStart("09:00");
                    setEnd("17:00");
                  }
                  setError("");
                  setSavedToast(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
