import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../Helper/baseUrl.helper";

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const getToken = () =>
        localStorage.getItem("token") || sessionStorage.getItem("token");

    // Fetch latest notifications
    useEffect(() => {
        if (!isOpen) return;

        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const res = await API.get("/notification/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setNotifications(res.data.data.slice(0, 10));
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

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

    // Time-ago helper
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    // Icon based on notification type
    const getIcon = (type) => {
        switch (type) {
            case "booking":
                return "pi pi-calendar";
            case "payment":
                return "pi pi-credit-card";
            case "loyalty":
                return "pi pi-star";
            case "promo":
                return "pi pi-tag";
            default:
                return "pi pi-info-circle";
        }
    };

    // Icon background color based on type
    const getIconBg = (type) => {
        switch (type) {
            case "booking":
                return "bg-blue-100 text-blue-600";
            case "payment":
                return "bg-green-100 text-green-600";
            case "loyalty":
                return "bg-yellow-100 text-yellow-600";
            case "promo":
                return "bg-purple-100 text-purple-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    if (!isOpen) return null;

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden"
            style={{ maxHeight: "480px" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#034D41] to-[#056b5a]">
                <h3 className="text-base font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-emerald-200 hover:text-white transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-all duration-200"
                        title="Close"
                    >
                        <i className="pi pi-times text-sm"></i>
                    </button>
                </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <i className="pi pi-bell text-4xl mb-3 opacity-30"></i>
                        <p className="text-sm font-medium">No notifications yet</p>
                        <p className="text-xs mt-1">We'll notify you when something arrives</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.notification_id}
                            onClick={() => !n.is_read && markAsRead(n.notification_id)}
                            className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-50 ${!n.is_read ? "bg-blue-50/40" : ""
                                }`}
                        >
                            {/* Icon */}
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBg(
                                    n.type
                                )}`}
                            >
                                <i className={`${getIcon(n.type)} text-sm`}></i>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p
                                        className={`text-sm leading-tight ${!n.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-600"
                                            }`}
                                    >
                                        {n.title}
                                    </p>
                                    {!n.is_read && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                                <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50">
                <Link
                    to="/user/notifications"
                    onClick={onClose}
                    className="block text-center text-sm font-semibold text-[#034D41] hover:text-[#023830] transition-colors"
                >
                    View All Notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationDropdown;
