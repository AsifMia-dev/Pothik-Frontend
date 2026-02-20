import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activePackages: 0,
    pendingBookings: 0,
    ongoingTours: 0,
    customRequests: 0,
    availableGuides: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard stats
  const getDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // Only allow admin
      if (!token || role !== "admin") {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = {
    labels: ["Users", "Packages", "Pending Bookings", "Ongoing Tours", "Custom Requests", "Guides"],
    datasets: [
      {
        label: "Counts",
        data: [
          stats.totalUsers,
          stats.activePackages,
          stats.pendingBookings,
          stats.ongoingTours,
          stats.customRequests,
          stats.availableGuides
        ],
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
          "#858796"
        ]
      }
    ]
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Arial, sans-serif" },
    title: { textAlign: "center", marginBottom: "20px", color: "#4e73df" },
    cardsContainer: { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginBottom: "40px" },
    card: { backgroundColor: "#f8f9fc", borderRadius: "10px", padding: "20px", flex: "1 1 200px", textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
    cardTitle: { color: "#858796", marginBottom: "10px" },
    cardNumber: { color: "#4e73df", fontSize: "2em" },
    loading: { textAlign: "center", fontSize: "1.2em", color: "#4e73df" },
    error: { textAlign: "center", fontSize: "1.2em", color: "#e74a3b" },
    chartContainer: { maxWidth: "800px", margin: "0 auto" }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <>
          <div style={styles.cardsContainer}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Users</h3>
              <h2 style={styles.cardNumber}>{stats.totalUsers}</h2>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Active Packages</h3>
              <h2 style={styles.cardNumber}>{stats.activePackages}</h2>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Pending Bookings</h3>
              <h2 style={styles.cardNumber}>{stats.pendingBookings}</h2>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Ongoing Tours</h3>
              <h2 style={styles.cardNumber}>{stats.ongoingTours}</h2>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Custom Requests</h3>
              <h2 style={styles.cardNumber}>{stats.customRequests}</h2>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Available Guides</h3>
              <h2 style={styles.cardNumber}>{stats.availableGuides}</h2>
            </div>
          </div>

          <div style={styles.chartContainer}>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Overall Stats</h3>
            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
