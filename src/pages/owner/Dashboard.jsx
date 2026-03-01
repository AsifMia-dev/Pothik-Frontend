// src/pages/owner/Dashboard.jsx

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    upcomingPayouts: 0,
    newBookings: 0,
    averageRating: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsRes = await api.get("/booking/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingsData = bookingsRes.data?.data || [];
      setBookings(bookingsData.slice(0, 5));

      // Calculate stats
      const totalEarnings = bookingsData.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
      const confirmedBookings = bookingsData.filter(b => b.status === "confirmed");
      const pendingPayouts = confirmedBookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
      const last30Days = bookingsData.filter(b => {
        const created = new Date(b.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return created >= thirtyDaysAgo;
      });

      setStats({
        totalEarnings,
        upcomingPayouts: pendingPayouts,
        newBookings: last30Days.length,
        averageRating: 4.8,
      });

      // Mock reviews for now
      setReviews([
        { name: "Alex Johnson", rating: 5, comment: "Fantastic location and a beautiful property. Everything was clean and well-maintained." },
        { name: "Maria Garcia", rating: 5, comment: "Absolutely perfect stay! The host was incredibly responsive and helpful. Highly recommend." },
        { name: "Chen Wei", rating: 4, comment: "A wonderful experience from start to finish. The apartment exceeded our expectations." },
      ]);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "pending": return "bg-orange-100 text-orange-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-orange-400" : "text-gray-300"}`}>★</span>
    ));
  };

  // Simple area chart SVG
  const AreaChart = () => {
    const points = [40, 65, 45, 80, 55, 90, 50, 75, 60, 85, 45, 70];
    const maxY = 100;
    const width = 500;
    const height = 150;
    const stepX = width / (points.length - 1);

    const pathD = points.map((y, i) => {
      const x = i * stepX;
      const yPos = height - (y / maxY) * height;
      return (i === 0 ? "M" : "L") + `${x},${yPos}`;
    }).join(" ");

    const areaD = pathD + ` L${width},${height} L0,${height} Z`;

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, <span className="text-orange-600">{user?.full_name || "Owner"}!</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's a summary of your business performance.</p>
        </div>
        <Link
          to="/owner/calendar"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Booking Calendar
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-blue-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-gray-800">৳{stats.totalEarnings.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">+5.2% vs last month</p>
        </div>

        {/* Upcoming Payouts */}
        <div className="bg-orange-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">Upcoming Payouts</p>
          <p className="text-3xl font-bold text-gray-800">৳{stats.upcomingPayouts.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">+1.8% vs last month</p>
        </div>

        {/* New Bookings */}
        <div className="bg-green-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">New Bookings (30d)</p>
          <p className="text-3xl font-bold text-gray-800">{stats.newBookings}</p>
          <p className="text-xs text-green-600 mt-2">+12% vs last month</p>
        </div>

        {/* Average Rating */}
        <div className="bg-purple-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">Average Rating</p>
          <p className="text-3xl font-bold text-gray-800">{stats.averageRating}</p>
          <p className="text-xs text-green-600 mt-2">+0.1 vs last month</p>
        </div>
      </div>

      {/* Revenue Overview & Guest Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Earnings over the last 90 days</p>
            </div>
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Last 90 days</option>
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
          </div>
          <AreaChart />
        </div>

        {/* Latest Guest Feedback */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Latest Guest Feedback</h2>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">{review.name}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Stays */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Upcoming Stays</h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
            View All Bookings
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Guest Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Check-in / Check-out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No upcoming bookings
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.booking_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {booking.User?.full_name || "Guest"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(booking.created_at)} - {formatDate(booking.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.Package?.name || "Custom Package"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                        ৳{parseFloat(booking.total_price || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
