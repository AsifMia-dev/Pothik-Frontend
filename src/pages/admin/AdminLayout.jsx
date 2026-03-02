import React, { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    logout();
    localStorage.removeItem("token");
  };

  // Sidebar links
  const sidebarLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Blog Management", path: "/admin/blogs" },
    { name: "Booking Management", path: "/admin/bookings" },
    { name: "Destination Management", path: "/admin/destinations" },
    { name: "Package Management", path: "/admin/packages" },
    { name: "User Management", path: "/admin/users" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold p-6 border-b border-gray-700">
            POTHIK Admin
          </h2>
          <nav className="flex flex-col mt-4">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-6 py-3 text-sm font-medium hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Topbar */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow flex justify-between items-center">
          <h3 className="text-lg font-bold">Admin Panel</h3>
        </div>

        {/* Dynamic Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;