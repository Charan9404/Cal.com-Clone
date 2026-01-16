import { useEffect, useMemo, useState } from "react";
import {
  createEventType,
  deleteEventType,
  listEventTypes,
  updateEventType,
} from "../lib/api";

function slugify(input = "") {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ModalShell({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <button
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>

          <div className="px-5 py-5">{children}</div>

          {footer ? (
            <div className="border-t border-slate-200 px-5 py-4">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function EventTypesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(15);
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // edit modal
  const [editing, setEditing] = useState(null); // event object or null
  const [eTitle, setETitle] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eDuration, setEDuration] = useState(15);
  const [eSlug, setESlug] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

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

  // Auto-suggest slug as you type title (only if slug is empty OR matches old slug suggestion)
  useEffect(() => {
    if (!title) return;
    if (!slug) {
      setSlug(slugify(title));
    }
  }, [title]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onCreate(e) {
    e.preventDefault();
    setCreateError("");

    const t = title.trim();
    const s = slug.trim();

    if (!t) return setCreateError("Title is required.");
    if (!s) return setCreateError("Slug is required.");
    if (!Number(duration) || Number(duration) < 5)
      return setCreateError("Duration must be at least 5 minutes.");

    setCreating(true);
    try {
      await createEventType({
        title: t,
        description: description?.trim() || "",
        duration_minutes: Number(duration),
        slug: s,
        active: true,
      });

      setTitle("");
      setDescription("");
      setDuration(15);
      setSlug("");
      await refresh();
    } catch (err) {
      // DRF usually sends {detail: "..."} or field errors
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.slug?.[0] ||
        err?.response?.data?.title?.[0] ||
        "Could not create event type. Please check inputs.";
      setCreateError(String(msg));
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this event type?")) return;
    await deleteEventType(id);
    refresh();
  }

  function openEdit(ev) {
    setEditError("");
    setEditing(ev);
    setETitle(ev.title || "");
    setEDescription(ev.description || "");
    setEDuration(ev.duration_minutes || 15);
    setESlug(ev.slug || "");
  }

  async function saveEdit() {
    if (!editing) return;
    setEditError("");

    const t = eTitle.trim();
    const s = eSlug.trim();

    if (!t) return setEditError("Title is required.");
    if (!s) return setEditError("Slug is required.");
    if (!Number(eDuration) || Number(eDuration) < 5)
      return setEditError("Duration must be at least 5 minutes.");

    setSavingEdit(true);
    try {
      await updateEventType(editing.id, {
        title: t,
        description: eDescription?.trim() || "",
        duration_minutes: Number(eDuration),
        slug: s,
        active: true,
      });
      setEditing(null);
      refresh();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.slug?.[0] ||
        err?.response?.data?.title?.[0] ||
        "Could not save changes. Please check inputs.";
      setEditError(String(msg));
    } finally {
      setSavingEdit(false);
    }
  }

  async function copyLink(ev) {
    const link = `${publicBase}/book/${ev.slug}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 900);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Event Types
        </h1>
        <p className="text-sm text-slate-600">
          Create events people can book using a public link.
        </p>
      </div>

      {/* Create */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">
            Create Event Type
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Tip: keep slugs short and unique (e.g., quick-chat-15).
          </div>
        </div>

        <form onSubmit={onCreate} className="px-5 py-5">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Title
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                placeholder="Quick Chat"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Description (optional)
              </label>
              <textarea
                className="w-full min-h-[96px] rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                placeholder="What this meeting is about…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Slug
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                placeholder="quick-chat-15"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <div className="mt-1 text-[11px] text-slate-500">
                Public URL:{" "}
                <span className="font-mono">
                  {publicBase}/book/{slug || "<slug>"}
                </span>
              </div>
            </div>
          </div>

          {createError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </div>
          ) : null}

          <div className="mt-5 flex items-center gap-3">
            <button
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
              type="submit"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create"}
            </button>
            <button
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                setDuration(15);
                setSlug("");
                setCreateError("");
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">
            Your event types
          </div>
          <div className="text-xs text-slate-500">
            {loading ? "Loading…" : `${items.length} total`}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-slate-600">
            Fetching event types…
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-10">
            <div className="text-sm font-semibold text-slate-900">
              No event types yet
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Create your first event type above to generate a public booking
              link.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {items.map((ev) => (
              <div
                key={ev.id}
                className="px-5 py-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">
                      {ev.title}
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {ev.duration_minutes}m
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-mono text-slate-600">
                      {ev.slug}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="text-slate-500">Public link:</span>
                    <a
                      className="truncate font-mono text-slate-900 underline decoration-slate-300 hover:decoration-slate-900"
                      href={`${publicBase}/book/${ev.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`${publicBase}/book/${ev.slug}`}
                    >
                      {publicBase}/book/{ev.slug}
                    </a>
                    <button
                      className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => copyLink(ev)}
                      type="button"
                    >
                      {copiedId === ev.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => openEdit(ev)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => onDelete(ev.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <ModalShell
          title="Edit Event Type"
          onClose={() => setEditing(null)}
          footer={
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Changes apply to the public booking page immediately.
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setEditing(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                  disabled={savingEdit}
                  onClick={saveEdit}
                  type="button"
                >
                  {savingEdit ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          }
        >
          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Title
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                value={eTitle}
                onChange={(e) => setETitle(e.target.value)}
                placeholder="Title"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Description
              </label>
              <textarea
                className="w-full min-h-[96px] rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                value={eDescription}
                onChange={(e) => setEDescription(e.target.value)}
                placeholder="Description"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={eDuration}
                  onChange={(e) => setEDuration(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Slug
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={eSlug}
                  onChange={(e) => setESlug(e.target.value)}
                />
                <div className="mt-1 text-[11px] text-slate-500">
                  Public URL:{" "}
                  <span className="font-mono">
                    {publicBase}/book/{eSlug || "<slug>"}
                  </span>
                </div>
              </div>
            </div>

            {editError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {editError}
              </div>
            ) : null}
          </div>
        </ModalShell>
      )}
    </div>
  );
}
