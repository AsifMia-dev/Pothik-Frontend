import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "250px",
        backgroundColor: "#1e293b",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "30px" }}>Pothik Admin</h2>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/admin/users")}>
          User Management
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/admin/packages")}>
          Packages
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
        
        {/* Topbar */}
        <div style={{
          backgroundColor: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3>Admin Panel</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>

        {/* Dynamic Page Content */}
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;
