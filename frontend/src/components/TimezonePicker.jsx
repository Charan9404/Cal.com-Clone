import { useMemo } from "react";

const STANDARD_TIMEZONES = [
  "Asia/Kolkata",
  "UTC",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Seoul",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Rome",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

function prettyTzLabel(tz) {
  try {
    // Shows current offset label; good enough for UI polish
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(new Date());

    const offset = parts.find((p) => p.type === "timeZoneName")?.value || "";
    return offset ? `${tz} (${offset})` : tz;
  } catch {
    return tz;
  }
}

export default function TimezonePicker({ value, onChange }) {
  const timezones = useMemo(() => STANDARD_TIMEZONES, []);

  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={value || "Asia/Kolkata"}
        onChange={(e) => onChange(e.target.value)}
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>
            {prettyTzLabel(tz)}
          </option>
        ))}
      </select>

      {/* caret */}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.5 7.5a1 1 0 0 1 1.4 0L10 10.6l3.1-3.1a1 1 0 1 1 1.4 1.4l-3.8 3.8a1 1 0 0 1-1.4 0L5.5 8.9a1 1 0 0 1 0-1.4Z" />
        </svg>
      </div>
    </div>
  );
}
