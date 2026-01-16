import { Link } from "react-router-dom";
import { Calendar, Clock, FileText, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                C
              </div>
              <span className="text-lg font-semibold text-gray-900">CalClone</span>
            </div>
            <div className="text-sm text-gray-500">Scheduling made simple</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            The better way to schedule
            <br />
            <span className="text-gray-600">your meetings</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            A fully customizable scheduling platform for managing your availability,
            creating event types, and letting others book time with you seamlessly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-3">
          <Link
            to="/event-types"
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white transition-transform group-hover:scale-110">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Create Event</h3>
            <p className="mt-2 text-sm text-gray-600">
              Set up event types with custom durations and descriptions for people to book.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-gray-900">
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/availability"
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white transition-transform group-hover:scale-110">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Set Availability</h3>
            <p className="mt-2 text-sm text-gray-600">
              Configure when you're available for bookings with timezone support.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-gray-900">
              Configure
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/bookings"
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white transition-transform group-hover:scale-110">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Manage Bookings</h3>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all your upcoming and past bookings in one place.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-gray-900">
              View all
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">Simple</div>
              <p className="mt-2 text-sm text-gray-600">
                Easy-to-use interface for creating and managing your schedule
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">Flexible</div>
              <p className="mt-2 text-sm text-gray-600">
                Customize event types, availability, and timezone settings
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">Reliable</div>
              <p className="mt-2 text-sm text-gray-600">
                Double-booking prevention and secure booking management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="text-center text-sm text-gray-500">
            CalClone • Scheduling Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
