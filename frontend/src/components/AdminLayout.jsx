import { NavLink, Outlet } from "react-router-dom";

const navItem = ({ isActive }) =>
  [
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
  ].join(" ");

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-slate-200 bg-white px-4 py-5 md:block">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-2xl bg-slate-900" />
            <div>
              <div className="text-sm font-semibold leading-tight">CalClone</div>
              <div className="text-xs text-slate-500">Admin dashboard</div>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            <NavLink to="/event-types" className={navItem}>
              Event Types
            </NavLink>
            <NavLink to="/availability" className={navItem}>
              Availability
            </NavLink>
            <NavLink to="/bookings" className={navItem}>
              Bookings
            </NavLink>
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="text-xs font-semibold text-slate-600">
              Admin (default user)
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Manage event types, availability, and bookings.
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <header className="sticky top-0 z-10 h-14 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex h-full items-center justify-between px-4 md:px-8">
              <div className="font-semibold text-slate-900">Dashboard</div>

              {/* optional placeholder for future: user menu / buttons */}
              <div className="text-xs text-slate-500 hidden sm:block">
                CalClone • Local
              </div>
            </div>
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
