import { useEffect, useState } from "react";
import { getAvailability, updateAvailability } from "../lib/api";

const weekdays = [
  { label: "Mon", val: 0 },
  { label: "Tue", val: 1 },
  { label: "Wed", val: 2 },
  { label: "Thu", val: 3 },
  { label: "Fri", val: 4 },
  { label: "Sat", val: 5 },
  { label: "Sun", val: 6 },
];

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(null);

  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [selectedDays, setSelectedDays] = useState(new Set([0, 1, 2, 3, 4]));
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAvailability();
      setAvailability(data);
      setTimezone(data.timezone || "Asia/Kolkata");

      // If rules exist, hydrate from first rule + which days present
      if (data.rules?.length) {
        setSelectedDays(new Set(data.rules.map((r) => r.weekday)));
        setStart(data.rules[0].start_time?.slice(0, 5) || "09:00");
        setEnd(data.rules[0].end_time?.slice(0, 5) || "17:00");
      }
      setLoading(false);
    })();
  }, []);

  function toggleDay(d) {
    const next = new Set(selectedDays);
    if (next.has(d)) next.delete(d);
    else next.add(d);
    setSelectedDays(next);
  }

  async function onSave() {
    if (!availability) return;
    setSaving(true);
    try {
      const rules = Array.from(selectedDays).sort().map((d) => ({
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
      alert("Saved!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Availability</h1>
        <p className="text-sm text-gray-600 mt-1">
          Set when you’re available for bookings.
        </p>
      </div>

      <div className="border border-gray-200 rounded-2xl p-4 max-w-2xl">
        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Timezone</div>
              <input
                className="mt-2 border border-gray-200 rounded-xl px-3 py-2 w-full"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Asia/Kolkata"
              />
            </div>

            <div>
              <div className="text-sm font-medium">Days</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {weekdays.map((d) => {
                  const active = selectedDays.has(d.val);
                  return (
                    <button
                      key={d.val}
                      onClick={() => toggleDay(d.val)}
                      className={`px-3 py-2 rounded-xl text-sm border transition ${
                        active
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium">From</div>
                <input
                  type="time"
                  className="mt-2 border border-gray-200 rounded-xl px-3 py-2 w-full"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div>
                <div className="text-sm font-medium">To</div>
                <input
                  type="time"
                  className="mt-2 border border-gray-200 rounded-xl px-3 py-2 w-full"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onSave}
              disabled={saving}
              className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
