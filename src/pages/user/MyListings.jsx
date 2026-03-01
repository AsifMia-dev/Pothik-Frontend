import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../Helper/baseUrl.helper';
import UserDashboardLayout from '../../components/UserDashboardLayout';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Fetch user bookings
    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.user_id) return;
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await api.get(`/booking/booking/user/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data?.success) {
                    // For each booking, try to fetch package info
                    const bookingsData = res.data.data || [];
                    const enriched = await Promise.all(
                        bookingsData.map(async (b) => {
                            let packageName = `Package #${b.package_id || 'N/A'}`;
                            let packageImage = null;
                            if (b.package_id) {
                                try {
                                    const pkgRes = await api.get(`/package/packages/${b.package_id}`);
                                    if (pkgRes.data?.data) {
                                        packageName = pkgRes.data.data.name;
                                        packageImage = pkgRes.data.data.image;
                                    }
                                } catch {
                                    // ignore
                                }
                            }
                            return { ...b, packageName, packageImage };
                        })
                    );
                    setBookings(enriched);
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user?.user_id]);

    // Filter bookings
    const filteredBookings = bookings.filter((b) => {
        if (filter === 'all') return true;
        return b.status === filter;
    });

    // Sort bookings
    const sortedBookings = [...filteredBookings].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === 'price-high') return (b.total_price || 0) - (a.total_price || 0);
        if (sortBy === 'price-low') return (a.total_price || 0) - (b.total_price || 0);
        return 0;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return 'pi-check-circle';
            case 'pending': return 'pi-clock';
            case 'cancelled': return 'pi-times-circle';
            case 'completed': return 'pi-flag';
            default: return 'pi-info-circle';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return parseFloat(price).toLocaleString('en-BD');
    };

    // Stats
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        completed: bookings.filter((b) => b.status === 'completed').length,
    };

    if (loading) {
        return (
            <UserDashboardLayout>
                <div className="py-12 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="mt-4 text-gray-500">Loading your bookings...</p>
                </div>
            </UserDashboardLayout>
        );
    }

    return (
        <UserDashboardLayout>
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                <p className="text-sm text-gray-500 mt-1">View and manage your bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                    <p className="text-xs text-gray-500 mt-1">Confirmed</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    <p className="text-xs text-gray-500 mt-1">Pending</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="inline-flex bg-gray-100 rounded-lg p-1">
                            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 capitalize ${filter === f
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="newest">Sort by: Newest</option>
                            <option value="oldest">Sort by: Oldest</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="price-low">Price: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="divide-y divide-gray-100">
                    {sortedBookings.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <i className="pi pi-inbox text-4xl text-gray-300 mb-4 block"></i>
                            <p className="text-gray-500 font-medium">No bookings found</p>
                            <p className="text-sm text-gray-400 mt-1">Your bookings will appear here</p>
                            <button
                                onClick={() => navigate('/packages')}
                                className="mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Browse Packages
                            </button>
                        </div>
                    ) : (
                        sortedBookings.map((booking) => (
                            <div
                                key={booking.booking_id}
                                className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Package Image */}
                                    <div className="w-full md:w-24 h-20 md:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {booking.packageImage ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${booking.packageImage}`}
                                                alt={booking.packageName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <i className="pi pi-image text-2xl"></i>
                                            </div>
                                        )}
                                    </div>

                                    {/* Booking Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {booking.packageName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    Booking #{booking.booking_id} • {booking.package_type || 'prebuilt'}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}>
                                                <i className={`pi ${getStatusIcon(booking.status)} text-[10px]`}></i>
                                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <i className="pi pi-calendar text-xs"></i>
                                                Booked: {formatDate(booking.created_at)}
                                            </span>
                                            {booking.journey_date && (
                                                <span className="flex items-center gap-1">
                                                    <i className="pi pi-map-marker text-xs"></i>
                                                    Travel: {formatDate(booking.journey_date)}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 font-semibold text-gray-800">
                                                <i className="pi pi-money-bill text-xs"></i>
                                                ৳{formatPrice(booking.total_price)}
                                            </span>
                                            {booking.loyalty_points_earned > 0 && (
                                                <span className="flex items-center gap-1 text-amber-600">
                                                    <i className="pi pi-star-fill text-xs"></i>
                                                    +{booking.loyalty_points_earned} pts
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </UserDashboardLayout>
    );
};

export default MyListings;
