import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
    FiHome,
    FiCalendar,
    FiStar,
    FiUser,
    FiLogOut,
    FiMapPin,
    FiList,
    FiMessageSquare,
    FiDollarSign,
    FiSettings
} from "react-icons/fi";

const OwnerLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authUser");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    // Sidebar links with icons
    const sidebarLinks = [
        { name: "Dashboard", path: "/owner/dashboard", icon: FiHome },
        { name: "My Listings", path: "/owner/listings", icon: FiList },
        { name: "Calendar", path: "/owner/calendar", icon: FiCalendar },
        { name: "Ratings", path: "/owner/ratings", icon: FiStar },
        { name: "Messages", path: "/owner/messages", icon: FiMessageSquare },
        { name: "Earnings", path: "/owner/earnings", icon: FiDollarSign },
        { name: "Profile", path: "/owner/profile", icon: FiUser },
        { name: "Settings", path: "/owner/settings", icon: FiSettings },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-full">
                <div>
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                <FiMapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">POTHIK</h2>
                                <p className="text-xs text-gray-500">Owner Dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.profile_image ? (
                                    <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-600 font-medium">{user?.full_name?.charAt(0) || "O"}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">{user?.full_name || "Owner"}</p>
                                <p className="text-xs text-gray-500">{user?.email || ""}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col p-3">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-teal-50 text-teal-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-lg font-medium transition-colors"
                    >
                        <FiLogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Owner Panel</h3>
                        <div className="flex items-center gap-4">
                            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                + Add New Listing
                            </button>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.profile_image ? (
                                    <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-600 font-medium">{user?.full_name?.charAt(0) || "O"}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
