import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserDashboardLayout from "../../components/UserDashboardLayout";
import API from "../../Helper/baseUrl.helper";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const getToken = () =>
        localStorage.getItem("token") || sessionStorage.getItem("token");

    // Fetch all notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = getToken();
                const res = await API.get("/notification/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setNotifications(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = getToken();
            await API.put(`/notification/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === id ? { ...n, is_read: true } : n
                )
            );
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = getToken();
            await API.put("/notification/read-all", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = getToken();
            await API.delete(`/notification/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) =>
                prev.filter((n) => n.notification_id !== id)
            );
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    // Time-ago helper
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
        const days = Math.floor(hrs / 24);
        if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    // Format date
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Icon based on type
    const getIcon = (type) => {
        switch (type) {
            case "booking": return "pi pi-calendar";
            case "payment": return "pi pi-credit-card";
            case "loyalty": return "pi pi-star";
            case "promo": return "pi pi-tag";
            default: return "pi pi-info-circle";
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case "booking": return "bg-blue-100 text-blue-600";
            case "payment": return "bg-green-100 text-green-600";
            case "loyalty": return "bg-yellow-100 text-yellow-600";
            case "promo": return "bg-purple-100 text-purple-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <UserDashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {unreadCount > 0
                                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                    : "You're all caught up!"}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#034D41] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-200"
                            >
                                <i className="pi pi-check-circle"></i>
                                Mark All as Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <i className="pi pi-spin pi-spinner text-3xl text-gray-400 mb-3"></i>
                            <p className="text-sm text-gray-500">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="pi pi-bell text-3xl opacity-40"></i>
                            </div>
                            <p className="text-base font-medium text-gray-500">No notifications yet</p>
                            <p className="text-sm mt-1">
                                When you receive notifications, they'll appear here
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((n) => (
                                <div
                                    key={n.notification_id}
                                    className={`flex items-start gap-4 px-6 py-4 transition-all duration-200 hover:bg-gray-50 group ${!n.is_read ? "bg-blue-50/30 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                                        }`}
                                >
                                    {/* Type Icon */}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${getIconBg(
                                            n.type
                                        )}`}
                                    >
                                        <i className={`${getIcon(n.type)} text-base`}></i>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3
                                                className={`text-sm ${!n.is_read
                                                        ? "font-bold text-gray-900"
                                                        : "font-medium text-gray-700"
                                                    }`}
                                            >
                                                {n.title}
                                            </h3>
                                            {!n.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <i className="pi pi-clock text-[10px]"></i>
                                            {timeAgo(n.created_at)} · {formatDate(n.created_at)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        {!n.is_read && (
                                            <button
                                                onClick={() => markAsRead(n.notification_id)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Mark as read"
                                            >
                                                <i className="pi pi-check text-sm"></i>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n.notification_id)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <i className="pi pi-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserDashboardLayout>
    );
};

export default Notifications;
