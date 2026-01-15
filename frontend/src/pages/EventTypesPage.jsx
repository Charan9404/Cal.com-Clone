import { useEffect, useMemo, useState } from "react";
import { createEventType, deleteEventType, listEventTypes } from "../lib/api";

export default function EventTypesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(15);
  const [slug, setSlug] = useState("");

  const publicBase = useMemo(() => window.location.origin, []);

  async function refresh() {
    setLoading(true);
    try {
      const data = await listEventTypes();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!title || !slug) return;

    await createEventType({
      title,
      description,
      duration_minutes: Number(duration),
      slug,
      active: true,
    });

    setTitle("");
    setDescription("");
    setDuration(15);
    setSlug("");
    refresh();
  }

  async function onDelete(id) {
    if (!confirm("Delete this event type?")) return;
    await deleteEventType(id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Event Types</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create events people can book using a public link.
        </p>
      </div>

      <div className="border border-gray-200 rounded-2xl p-4">
        <h2 className="font-medium">Create Event Type</h2>
        <form onSubmit={onCreate} className="mt-4 grid gap-3 max-w-xl">
          <input
            className="border border-gray-200 rounded-xl px-3 py-2"
            placeholder="Title (e.g., Quick Chat)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border border-gray-200 rounded-xl px-3 py-2 min-h-[90px]"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              min="5"
              step="5"
              className="border border-gray-200 rounded-xl px-3 py-2"
              placeholder="Duration minutes"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <input
              className="border border-gray-200 rounded-xl px-3 py-2"
              placeholder="Slug (e.g., quick-chat-15)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <button
            className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium w-fit"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="font-medium">Your event types</div>
          <div className="text-xs text-gray-500">
            {loading ? "Loading..." : `${items.length} total`}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((e) => (
            <div key={e.id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {e.duration_minutes} minutes • <span className="font-mono">{e.slug}</span>
                </div>

                <div className="text-sm text-gray-600 mt-2">
                  Public link:{" "}
                  <a
                    className="text-gray-900 underline"
                    href={`${publicBase}/book/${e.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publicBase}/book/{e.slug}
                  </a>
                </div>
              </div>

              <button
                className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                onClick={() => onDelete(e.id)}
              >
                Delete
              </button>
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="p-4 text-sm text-gray-600">No event types yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
