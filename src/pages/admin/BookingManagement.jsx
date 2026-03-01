import React, { useEffect, useState } from "react";
import api from "../../Helper/baseUrl.helper";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [packageTypeFilter, setPackageTypeFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const bookingsPerPage = 5;

  // Selected bookings
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Modal for create/edit
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = res.data?.data || res.data || [];

      // Apply filters
      if (search) {
        data = data.filter(b =>
          b.booking_id?.toString().includes(search) ||
          b.User?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          b.Package?.name?.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (statusFilter) {
        data = data.filter(b => b.status === statusFilter);
      }

      if (packageTypeFilter) {
        data = data.filter(b => b.package_type === packageTypeFilter);
      }

      // Calculate pagination
      setTotalPages(Math.ceil(data.length / bookingsPerPage));

      // Get current page data
      const startIndex = (currentPage - 1) * bookingsPerPage;
      const paginatedData = data.slice(startIndex, startIndex + bookingsPerPage);

      setBookings(paginatedData);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchBookings();
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setDateRange({ start: "", end: "" });
    setStatusFilter("");
    setPackageTypeFilter("");
    setCurrentPage(1);
    fetchBookings();
  };

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBookings(bookings.map(b => b.booking_id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectOne = (bookingId) => {
    if (selectedBookings.includes(bookingId)) {
      setSelectedBookings(selectedBookings.filter(id => id !== bookingId));
    } else {
      setSelectedBookings([...selectedBookings, bookingId]);
    }
  };

  // Update booking status
  const updateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/booking/booking/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      alert("Failed to update booking status");
    }
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await api.delete(`/booking/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      alert("Failed to delete booking");
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Booking Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          <span className="text-lg">+</span> Create New Booking
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by ID, customer or package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Booking Status */}
          <div className="min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Package Type */}
          <div className="min-w-[140px]">
            <select
              value={packageTypeFilter}
              onChange={(e) => setPackageTypeFilter(e.target.value)}
              className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="prebuilt">Prebuilt</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <p className="text-center text-blue-500">Loading bookings...</p>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="px-5 py-4 text-left">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedBookings.length === bookings.length && bookings.length > 0}
                        className="rounded"
                      />
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Booking ID</th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Customer</th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Package</th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Booking Date</th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Status</th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Total Price</th>
                    <th className="px-5 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.booking_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.booking_id)}
                            onChange={() => handleSelectOne(booking.booking_id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">#BK{booking.booking_id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-800 dark:text-white">{booking.User?.full_name || "N/A"}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{booking.Package?.name || "Custom Package"}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(booking.created_at)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-800 dark:text-white">৳{parseFloat(booking.total_price || 0).toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(booking.booking_id, 'confirmed')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(booking.booking_id, 'cancelled')}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(booking.booking_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {bookings.length > 0 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 dark:text-white"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingManagement;