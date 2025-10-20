import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="text-xl font-semibold text-green-700">
              HCM Timesheet
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/register"
              className="bg-accent hover:bg-green-500 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-20 text-center bg-gradient-to-t from-green-100 to-white">
        <div className="max-w-3xl mx-auto transform transition-all duration-700 ease-out opacity-100 translate-y-0">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Simplify Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-500">
              Time Tracking
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10">
            Manage attendance, monitor employee hours, and generate insightful
            reports — all in one simple and powerful dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-accent hover:bg-green-500 text-white text-lg font-medium px-8 py-3 rounded-xl shadow-md transition-all"
            >
              Track Your Time Now
            </Link>
            <Link
              to="/login"
              className="text-accent hover:text-green-500 font-medium text-lg px-8 py-3 border border-accent rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} HCM Timesheet. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
