import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { NavLink } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activePackages: 0,
    pendingBookings: 0,
    ongoingTours: 0,
    customRequests: 0,
    availableGuides: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const chartData = {
    labels: [
      "Users",
      "Packages",
      "Pending Bookings",
      "Ongoing Tours",
      "Custom Requests",
      "Guides",
    ],
    datasets: [
      {
        label: "Counts",
        data: [
          stats.totalUsers,
          stats.activePackages,
          stats.pendingBookings,
          stats.ongoingTours,
          stats.customRequests,
          stats.availableGuides,
        ],
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
          "#858796",
        ],
      },
    ],
  };

  return (
    <div className="flex h-screen w-full font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="flex h-full w-64 flex-col justify-between border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
              <span className="material-symbols-outlined text-2xl">explore</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">POTHIK</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
           <NavLink
              to="/admin/Dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                  isActive
                    ? "bg-blue-100 text-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`
              }
            >
              <p className="text-sm font-semibold">Dashboard</p>
            </NavLink>
            <NavLink
            to="/admin/BlogManagement"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                isActive
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`
            }
          >
            <p className="text-sm font-medium">BlogManagement</p>
          </NavLink>
          <NavLink
            to="/admin/DiscountManagement"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                isActive
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`
            }
          >
            <p className="text-sm font-medium">DiscountManagement</p>
          </NavLink>
          <NavLink
            to="/admin/PackageManagement"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                isActive
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`
            }
          >
            <p className="text-sm font-medium">PackageManagement</p>
          </NavLink>
          
           
            <NavLink
              to="/admin/UserManagement"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                  isActive
                    ? "bg-blue-100 text-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`
              }
            >
              <p className="text-sm font-medium">UserManagement</p>
            </NavLink>
          </nav>
        </div>
        <div>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
            <p className="text-sm font-medium">Logout</p>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex h-full w-full flex-1 flex-col overflow-y-auto p-6">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search..."
              className="rounded-lg border-none bg-gray-100 dark:bg-gray-700 py-2 px-3 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined text-2xl">help_outline</span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        {loading ? (
          <p className="text-center text-blue-500 mt-10">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-blue-500">{stats.totalUsers}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Packages</p>
              <p className="text-2xl font-bold text-blue-500">{stats.activePackages}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Bookings</p>
              <p className="text-2xl font-bold text-blue-500">{stats.pendingBookings}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Ongoing Tours</p>
              <p className="text-2xl font-bold text-blue-500">{stats.ongoingTours}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Custom Requests</p>
              <p className="text-2xl font-bold text-blue-500">{stats.customRequests}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Available Guides</p>
              <p className="text-2xl font-bold text-blue-500">{stats.availableGuides}</p>
            </div>
          </div>
        )}

        {/* Chart */}
        {!loading && !error && (
          <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Overall Stats</h3>
            <Bar data={chartData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
