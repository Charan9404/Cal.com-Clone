import { NavLink, Outlet } from "react-router-dom";
import { Calendar, Clock, FileText } from "lucide-react";

const navItem = ({ isActive }) =>
  [
    "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
    isActive
      ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/20"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
  ].join(" ");

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-slate-200/80 bg-white/70 backdrop-blur-sm px-4 py-6 shadow-sm md:flex md:flex-col">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-md">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <div>
            <div className="text-sm font-semibold leading-tight text-slate-900">CalClone</div>
            <div className="text-xs font-medium text-slate-500">Admin dashboard</div>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5">
            <NavLink to="/event-types" className={navItem}>
              <Calendar className="h-4 w-4" />
              Event Types
            </NavLink>
            <NavLink to="/availability" className={navItem}>
              <Clock className="h-4 w-4" />
              Availability
            </NavLink>
            <NavLink to="/bookings" className={navItem}>
              <FileText className="h-4 w-4" />
              Bookings
            </NavLink>
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100/50 px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-700">
                  A
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900">Admin</div>
                  <div className="text-[10px] text-slate-500">Default user</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-white/40 backdrop-blur-sm">
          <header className="sticky top-0 z-10 h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
            <div className="flex h-full items-center justify-between px-4 md:px-8">
              <div className="text-base font-medium text-slate-900">Dashboard</div>

              {/* optional placeholder for future: user menu / buttons */}
              <div className="text-xs font-medium text-slate-500 hidden sm:block">
                CalClone • Local
              </div>
            </div>
          </header>

          <div className="px-4 py-8 md:px-8 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
