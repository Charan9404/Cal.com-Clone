import { useEffect, useMemo, useState } from "react";
import {
  createEventType,
  deleteEventType,
  listEventTypes,
  updateEventType,
} from "../lib/api";

export default function EventTypesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(15);
  const [slug, setSlug] = useState("");

  // edit modal
  const [editing, setEditing] = useState(null); // event object or null
  const [eTitle, setETitle] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eDuration, setEDuration] = useState(15);
  const [eSlug, setESlug] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [copiedId, setCopiedId] = useState(null);
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
      title: title.trim(),
      description: description?.trim() || "",
      duration_minutes: Number(duration),
      slug: slug.trim(),
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

  function openEdit(ev) {
    setEditing(ev);
    setETitle(ev.title || "");
    setEDescription(ev.description || "");
    setEDuration(ev.duration_minutes || 15);
    setESlug(ev.slug || "");
  }

  async function saveEdit() {
    if (!editing) return;
    setSavingEdit(true);
    try {
      await updateEventType(editing.id, {
        title: eTitle.trim(),
        description: eDescription?.trim() || "",
        duration_minutes: Number(eDuration),
        slug: eSlug.trim(),
        active: true,
      });
      setEditing(null);
      refresh();
    } finally {
      setSavingEdit(false);
    }
  }

  async function copyLink(ev) {
    const link = `${publicBase}/book/${ev.slug}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 1000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Event Types</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create events people can book using a public link.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
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
            className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium w-fit hover:bg-black"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="font-medium">Your event types</div>
          <div className="text-xs text-gray-500">
            {loading ? "Loading..." : `${items.length} total`}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((ev) => (
            <div key={ev.id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{ev.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {ev.duration_minutes} minutes •{" "}
                  <span className="font-mono">{ev.slug}</span>
                </div>

                <div className="text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2">
                  <span>Public link:</span>
                  <a
                    className="text-gray-900 underline"
                    href={`${publicBase}/book/${ev.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {publicBase}/book/{ev.slug}
                  </a>
                  <button
                    className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
                    onClick={() => copyLink(ev)}
                    type="button"
                  >
                    {copiedId === ev.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  onClick={() => openEdit(ev)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  onClick={() => onDelete(ev.id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="p-4 text-sm text-gray-600">No event types yet.</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="font-medium">Edit Event Type</div>
              <button
                className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                onClick={() => setEditing(null)}
                type="button"
              >
                Close
              </button>
            </div>

            <div className="p-4 grid gap-3">
              <input
                className="border border-gray-200 rounded-xl px-3 py-2"
                value={eTitle}
                onChange={(e) => setETitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="border border-gray-200 rounded-xl px-3 py-2 min-h-[90px]"
                value={eDescription}
                onChange={(e) => setEDescription(e.target.value)}
                placeholder="Description"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="number"
                  min="5"
                  step="5"
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  value={eDuration}
                  onChange={(e) => setEDuration(e.target.value)}
                  placeholder="Duration"
                />
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2"
                  value={eSlug}
                  onChange={(e) => setESlug(e.target.value)}
                  placeholder="Slug"
                />
              </div>

              <button
                className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium w-fit hover:bg-black disabled:opacity-60"
                disabled={savingEdit}
                onClick={saveEdit}
                type="button"
              >
                {savingEdit ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
