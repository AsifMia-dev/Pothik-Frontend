import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiFilter, FiHome } from "react-icons/fi";

const Calendar = () => {
    const { user } = useContext(AuthContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedProperty, setSelectedProperty] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [showBulkModal, setShowBulkModal] = useState(false);

    // Mock booking data - replace with API call
    useEffect(() => {
        const mockBookings = [
            { id: 1, propertyId: 1, startDate: "2026-03-05", endDate: "2026-03-08", status: "confirmed" },
            { id: 2, propertyId: 1, startDate: "2026-03-08", endDate: "2026-03-10", status: "pending" },
            { id: 3, propertyId: 2, startDate: "2026-03-15", endDate: "2026-03-16", status: "confirmed" },
            { id: 4, propertyId: 1, startDate: "2026-03-18", endDate: "2026-03-19", status: "pending" },
            { id: 5, propertyId: 2, startDate: "2026-03-19", endDate: "2026-03-21", status: "blocked" },
            { id: 6, propertyId: 1, startDate: "2026-04-05", endDate: "2026-04-09", status: "confirmed" },
            { id: 7, propertyId: 2, startDate: "2026-04-06", endDate: "2026-04-08", status: "pending" },
        ];
        setBookings(mockBookings);

        const mockProperties = [
            { id: 1, name: "Beach Resort Villa" },
            { id: 2, name: "Mountain View Lodge" },
            { id: 3, name: "City Center Hotel" },
        ];
        setProperties(mockProperties);
    }, []);

    const getMonthData = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { year, month, firstDay, daysInMonth };
    };

    const getNextMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    };

    const getDayStatus = (year, month, day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const booking = bookings.find((b) => {
            if (selectedProperty !== "all" && b.propertyId !== parseInt(selectedProperty)) return false;
            if (selectedStatus !== "all" && b.status !== selectedStatus) return false;
            return dateStr >= b.startDate && dateStr <= b.endDate;
        });
        return booking?.status || null;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-emerald-400 text-white";
            case "pending":
                return "bg-amber-400 text-white";
            case "blocked":
                return "bg-gray-400 text-white";
            default:
                return "hover:bg-gray-100";
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const renderCalendar = (date) => {
        const { year, month, firstDay, daysInMonth } = getMonthData(date);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const status = getDayStatus(year, month, day);
            days.push(
                <div
                    key={day}
                    className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all ${getStatusColor(status)}`}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setCurrentDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {monthNames[month]} {year}
                    </h3>
                    <button
                        onClick={() => setCurrentDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <div key={i} className="h-10 w-10 flex items-center justify-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">{days}</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex gap-8">
                {/* Left Sidebar - Filters */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Filters</h2>
                        <p className="text-sm text-gray-500 mb-6">Manage your calendar view</p>

                        {/* Property Filter */}
                        <div className="mb-4">
                            <button
                                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                                className="w-full flex items-center space-x-3 px-4 py-3 bg-teal-50 text-teal-700 rounded-lg font-medium"
                            >
                                <FiHome className="w-5 h-5" />
                                <span>Property</span>
                            </button>
                            {showPropertyDropdown && (
                                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                    <button
                                        onClick={() => { setSelectedProperty("all"); setShowPropertyDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedProperty === "all" ? "bg-teal-50 text-teal-700" : ""}`}
                                    >
                                        All Properties
                                    </button>
                                    {properties.map((prop) => (
                                        <button
                                            key={prop.id}
                                            onClick={() => { setSelectedProperty(prop.id.toString()); setShowPropertyDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedProperty === prop.id.toString() ? "bg-teal-50 text-teal-700" : ""}`}
                                        >
                                            {prop.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Date Range Filter */}
                        <div className="mb-4">
                            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                                <FiCalendar className="w-5 h-5" />
                                <span>Date Range</span>
                            </button>
                        </div>

                        {/* Status Filter */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            >
                                <FiFilter className="w-5 h-5" />
                                <span>Status</span>
                            </button>
                            {showStatusDropdown && (
                                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                    <button
                                        onClick={() => { setSelectedStatus("all"); setShowStatusDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedStatus === "all" ? "bg-teal-50 text-teal-700" : ""}`}
                                    >
                                        All Status
                                    </button>
                                    <button
                                        onClick={() => { setSelectedStatus("confirmed"); setShowStatusDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 ${selectedStatus === "confirmed" ? "bg-teal-50 text-teal-700" : ""}`}
                                    >
                                        <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                                        <span>Confirmed</span>
                                    </button>
                                    <button
                                        onClick={() => { setSelectedStatus("pending"); setShowStatusDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 ${selectedStatus === "pending" ? "bg-teal-50 text-teal-700" : ""}`}
                                    >
                                        <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                                        <span>Pending</span>
                                    </button>
                                    <button
                                        onClick={() => { setSelectedStatus("blocked"); setShowStatusDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 ${selectedStatus === "blocked" ? "bg-teal-50 text-teal-700" : ""}`}
                                    >
                                        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                                        <span>Blocked</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bulk Update Button */}
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                        >
                            Bulk Update Availability
                        </button>
                    </div>
                </div>

                {/* Main Calendar Area */}
                <div className="flex-1">
                    {/* Title and Legend */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Your Booking Calendar</h1>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">Confirmed</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">Pending</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">Blocked</span>
                            </div>
                        </div>
                    </div>

                    {/* Two Month Calendar View */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {renderCalendar(currentDate)}
                        {renderCalendar(getNextMonth(currentDate))}
                    </div>
                </div>
            </div>

            {/* Bulk Update Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Bulk Update Availability</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                                    <option value="">All Properties</option>
                                    {properties.map((prop) => (
                                        <option key={prop.id} value={prop.id}>{prop.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                                    <option value="available">Available</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowBulkModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowBulkModal(false)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
