import { NavLink, Outlet } from "react-router-dom";
import { Calendar, Clock, FileText } from "lucide-react";

const navItem = ({ isActive }) =>
  [
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-gray-100 text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
  ].join(" ");

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-gray-200 bg-white px-4 py-6 md:flex md:flex-col">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              C
            </div>
            <div>
            <div className="text-sm font-semibold leading-tight text-gray-900">CalClone</div>
            <div className="text-xs font-medium text-gray-500">Admin dashboard</div>
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
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                  A
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900">Admin</div>
                  <div className="text-[10px] text-gray-500">Default user</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-gray-50">
          <header className="sticky top-0 z-10 h-16 border-b border-gray-200 bg-white">
            <div className="flex h-full items-center justify-between px-4 md:px-8">
              <div className="text-base font-semibold text-gray-900">Dashboard</div>

              {/* optional placeholder for future: user menu / buttons */}
              <div className="text-xs font-medium text-gray-500 hidden sm:block">
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
