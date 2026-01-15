import { NavLink, Outlet } from "react-router-dom";

const navItem = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-gray-900 text-white"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  }`;

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex">
        <aside className="w-64 border-r border-gray-200 p-4 hidden md:block">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="h-8 w-8 rounded-lg bg-gray-900" />
            <div className="font-semibold">CalClone</div>
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

          <div className="mt-6 text-xs text-gray-500 px-2">
            Admin (default user)
          </div>
        </aside>

        <main className="flex-1">
          <header className="h-14 border-b border-gray-200 flex items-center px-4">
            <div className="font-medium">Dashboard</div>
          </header>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
