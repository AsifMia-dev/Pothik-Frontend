import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../Helper/baseUrl.helper';
import UserDashboardLayout from '../../components/UserDashboardLayout';

const Payouts = () => {
    const { user } = useContext(AuthContext);

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch user payments via bookings
    useEffect(() => {
        const fetchPayments = async () => {
            if (!user?.user_id) return;
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                // First, get all user bookings
                const bookingsRes = await api.get(`/booking/booking/user/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (bookingsRes.data?.success) {
                    const bookings = bookingsRes.data.data || [];

                    // For each booking, fetch payments and package name
                    const allPayments = [];
                    for (const booking of bookings) {
                        try {
                            const payRes = await api.get(`/payments/booking/${booking.booking_id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            const paymentsList = payRes.data?.data || (payRes.data ? [payRes.data] : []);

                            // Get package name
                            let packageName = `Booking #${booking.booking_id}`;
                            if (booking.package_id) {
                                try {
                                    const pkgRes = await api.get(`/package/packages/${booking.package_id}`);
                                    if (pkgRes.data?.data) packageName = pkgRes.data.data.name;
                                } catch { /* ignore */ }
                            }

                            for (const p of paymentsList) {
                                if (p && p.payment_id) {
                                    allPayments.push({
                                        ...p,
                                        packageName,
                                        booking_status: booking.status,
                                        journey_date: booking.journey_date,
                                    });
                                }
                            }
                        } catch {
                            // If no payments found for this booking, create a virtual entry
                            let packageName = `Booking #${booking.booking_id}`;
                            if (booking.package_id) {
                                try {
                                    const pkgRes = await api.get(`/package/packages/${booking.package_id}`);
                                    if (pkgRes.data?.data) packageName = pkgRes.data.data.name;
                                } catch { /* ignore */ }
                            }
                            allPayments.push({
                                payment_id: `b-${booking.booking_id}`,
                                booking_id: booking.booking_id,
                                amount: booking.total_price || booking.discounted_price,
                                method: 'bkash',
                                status: booking.status === 'confirmed' || booking.status === 'completed' ? 'paid' : 'pending',
                                created_at: booking.created_at,
                                packageName,
                                booking_status: booking.status,
                                journey_date: booking.journey_date,
                            });
                        }
                    }
                    setPayments(allPayments);
                }
            } catch (err) {
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [user?.user_id]);

    // Filter
    const filteredPayments = payments.filter((p) => {
        if (filter === 'all') return true;
        return p.status === filter;
    });

    // Sort
    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === 'amount-high') return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
        if (sortBy === 'amount-low') return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
    const paginatedPayments = sortedPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'refunded': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getMethodIcon = (method) => {
        if (method === 'bkash') return '📱';
        if (method === 'card') return '💳';
        if (method === 'bank') return '🏦';
        return '💰';
    };

    // Stats
    const totalPaid = payments.filter(p => p.status === 'paid' || p.status === 'completed').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    if (loading) {
        return (
            <UserDashboardLayout>
                <div className="py-12 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="mt-4 text-gray-500">Loading your payment history...</p>
                </div>
            </UserDashboardLayout>
        );
    }

    return (
        <UserDashboardLayout>
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
                <p className="text-sm text-gray-500 mt-1">View your payment history and transaction details</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">৳{formatPrice(totalPaid)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="pi pi-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">৳{formatPrice(totalPending)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <i className="pi pi-clock text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Refunded</p>
                            <p className="text-2xl font-bold text-purple-600 mt-1">৳{formatPrice(totalRefunded)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <i className="pi pi-replay text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="inline-flex bg-gray-100 rounded-lg p-1">
                                {['all', 'paid', 'pending', 'refunded'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => { setFilter(f); setCurrentPage(1); }}
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
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="amount-high">Amount: High → Low</option>
                                <option value="amount-low">Amount: Low → High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <i className="pi pi-wallet text-4xl text-gray-300 mb-4 block"></i>
                                        <p className="text-gray-500 font-medium">No payments found</p>
                                        <p className="text-sm text-gray-400 mt-1">Your payment history will appear here</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedPayments.map((payment) => (
                                    <tr key={payment.payment_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {formatDate(payment.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{payment.packageName}</p>
                                            <p className="text-xs text-gray-500">Booking #{payment.booking_id}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            <span className="flex items-center gap-1.5">
                                                {getMethodIcon(payment.method)}
                                                <span className="capitalize">{payment.method || 'N/A'}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                                                {payment.status || 'unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-gray-900">
                                            ৳{formatPrice(payment.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sortedPayments.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedPayments.length)} of {sortedPayments.length} results
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
};

export default Payouts;
