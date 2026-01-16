import { useEffect, useMemo, useState } from "react";
import { getAvailability, updateAvailability } from "../lib/api";
import TimezonePicker from "../components/TimezonePicker";
import { Clock, CheckCircle2 } from "lucide-react";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Availability
        </h1>
        <p className="text-sm text-slate-600">
          Set when you're available for bookings.
        </p>
      </div>

      {/* Card */}
      <div className="max-w-2xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg backdrop-blur-sm">
        <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Weekly schedule
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                These hours are used to generate available slots on your public
                booking page.
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-sm font-medium text-slate-600">Loading…</div>
        ) : (
          <div className="px-6 py-6 space-y-6">
            {/* Timezone */}
            <div>
              <div className="mb-2 text-xs font-semibold text-slate-700">Timezone</div>
              <div className="mt-2">
                <TimezonePicker value={timezone} onChange={setTimezone} />
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Changing timezone shifts how slot times are displayed.
              </div>
            </div>

            {/* Days */}
            <div>
              <div className="mb-2 text-xs font-bold text-slate-700">Days</div>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {weekdays.map((d) => {
                  const active = selectedDays.has(d.val);
                  return (
                    <button
                      key={d.val}
                      onClick={() => toggleDay(d.val)}
                      type="button"
                      className={[
                        "rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all shadow-sm",
                        active
                          ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-900 shadow-md shadow-slate-900/20"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow",
                      ].join(" ")}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-xs font-bold text-slate-700">From</div>
                <input
                  type="time"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 text-xs font-bold text-slate-700">To</div>
                <input
                  type="time"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>

            {/* Error / Saved */}
            {error ? (
              <div className="rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                {error}
              </div>
            ) : null}

            {savedToast ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-emerald-50/50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onSave}
                disabled={saving || !isValid}
                className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-all hover:from-slate-800 hover:to-slate-700 hover:shadow-lg disabled:opacity-60 disabled:hover:from-slate-900 disabled:hover:to-slate-800"
              >
                {saving ? "Saving…" : "Save Schedule"}
              </button>

              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow"
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
