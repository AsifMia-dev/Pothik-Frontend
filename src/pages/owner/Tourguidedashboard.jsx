import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";

// ─── API CALLS ────────────────────────────────────────────────────────────────
const guideApi = {
  getMyGuides:         ()           => api.get("/guides"),
  getAllBookings:       ()           => api.get("/booking"),
  getPackages:         ()           => api.get("/packages"),
  addGuide:            (data)       => api.post("/guides", data),
  updateGuide:         (id, data)   => api.put(`/guides/${id}`, data),
  updateBookingStatus: (id, status) => api.put(`/booking/${id}/status`, { status }),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusStyle = {
  confirmed: { bg: "#d1fae528", color: "#34d399", border: "#34d39938" },
  pending:   { bg: "#fef3c728", color: "#fbbf24", border: "#fbbf2438" },
  completed: { bg: "#6b728018", color: "#9ca3af", border: "#9ca3af28" },
  cancelled: { bg: "#fca5a528", color: "#f87171", border: "#f8717138" },
};

const Skeleton = ({ w = "100%", h = 20, mb = 0 }) => (
  <div style={{
    width: w, height: h, marginBottom: mb, borderRadius: 8,
    background: "linear-gradient(90deg,#e8f0e8 25%,#d4e8d4 50%,#e8f0e8 75%)",
    backgroundSize: "200% 100%", animation: "g-shimmer 1.4s infinite",
  }} />
);

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
};

const initials = (name = "") =>
  name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function TourGuideDashboard() {
  const { user } = useContext(AuthContext);
  // user: { user_id, full_name, email, phone, role, loyalty_points, country, created_at, auth_provider }

  const [activeTab, setActiveTab] = useState("overview");
  const [guides,    setGuides]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [packages,  setPackages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Add guide modal
  const [showModal, setShowModal] = useState(false);
  const [newGuide,  setNewGuide]  = useState({ full_name: "", experience: "", price_per_day: "" });
  const [saving,    setSaving]    = useState(false);

  // Edit guide modal
  const [editGuide, setEditGuide] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [gRes, bRes, pkRes] = await Promise.all([
        guideApi.getMyGuides(),
        guideApi.getAllBookings(),
        guideApi.getPackages(),
      ]);

      setGuides(   Array.isArray(gRes.data?.data  ?? gRes.data)  ? (gRes.data?.data  ?? gRes.data)  : []);
      setBookings( Array.isArray(bRes.data?.data  ?? bRes.data)  ? (bRes.data?.data  ?? bRes.data)  : []);
      setPackages( Array.isArray(pkRes.data?.data ?? pkRes.data) ? (pkRes.data?.data ?? pkRes.data) : []);
    } catch (err) {
      console.error("TourGuideDashboard fetchAll:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddGuide = async () => {
    if (!newGuide.full_name || !newGuide.price_per_day) return;
    setSaving(true);
    try {
      await guideApi.addGuide({
        full_name:     newGuide.full_name,
        experience:    Number(newGuide.experience),
        price_per_day: Number(newGuide.price_per_day),
      });
      setShowModal(false);
      setNewGuide({ full_name: "", experience: "", price_per_day: "" });
      fetchAll();
    } catch (err) {
      console.error("addGuide error:", err);
      alert("Failed to add guide profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateGuide = async () => {
    if (!editGuide) return;
    setSaving(true);
    try {
      await guideApi.updateGuide(editGuide.guide_id ?? editGuide.id, {
        full_name:     editGuide.full_name,
        experience:    Number(editGuide.experience),
        price_per_day: Number(editGuide.price_per_day),
      });
      setEditGuide(null);
      fetchAll();
    } catch (err) {
      console.error("updateGuide error:", err);
      alert("Failed to update guide profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await guideApi.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => (b.booking_id ?? b.id) === id ? { ...b, status } : b));
    } catch (err) {
      console.error("updateBookingStatus error:", err);
      alert("Failed to update booking status.");
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const revenue     = bookings.filter(b => ["confirmed","completed"].includes(b.status)).reduce((s,b) => s + parseFloat(b.discounted_price ?? b.total_price ?? 0), 0);
  const activeCount = bookings.filter(b => ["confirmed","pending"].includes(b.status)).length;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const primaryGuide = guides[0];

  return (
    <Layout>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#f0f4f0", minHeight: "100vh", color: "#1a2e1a" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes g-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes g-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          .g-fade{animation:g-fadeUp .3s ease forwards}
          .g-sidebar-btn{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;border:none;cursor:pointer;text-align:left;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;transition:all .2s;width:100%;background:transparent;color:#5a8a5a}
          .g-sidebar-btn:hover{background:#e0ede0;color:#1e4d1e}
          .g-sidebar-btn.active{background:#4ade80;color:#1a3a1a}
          .g-stat{background:white;border-radius:14px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
          .g-guide-card{background:white;border-radius:13px;padding:17px;box-shadow:0 2px 8px rgba(0,0,0,.04);margin-bottom:11px;transition:all .3s;border:1.5px solid transparent}
          .g-guide-card:hover{box-shadow:0 6px 22px rgba(0,0,0,.08);border-color:#a3c9a3;transform:translateY(-2px)}
          .g-brow{padding:12px 0;border-bottom:1px solid #edf4ed;display:flex;align-items:center;gap:13px;transition:all .2s;border-radius:8px}
          .g-brow:hover{background:#f7fbf7;padding:12px 7px}
          .g-pill{background:none;border:1.5px solid #cce8cc;color:#2d6a2d;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;padding:6px 14px;border-radius:100px;cursor:pointer;transition:all .2s}
          .g-pill:hover{background:#2d6a2d;color:white;border-color:#2d6a2d}
          .g-add{background:#1e4d1e;color:white;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:600;padding:9px 20px;border-radius:100px;border:none;cursor:pointer;transition:all .2s}
          .g-add:hover{background:#2d6a2d;transform:scale(1.02)}
          .g-add:disabled{opacity:.5;cursor:not-allowed;transform:none}
          .g-inp{background:#f7fbf7;border:1.5px solid #cce8cc;color:#1a2e1a;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;padding:10px 13px;width:100%;border-radius:10px;outline:none;transition:border-color .3s}
          .g-inp:focus{border-color:#16a34a;background:white}
          .g-st-sel{background:#f0f8f0;border:1.5px solid #cce8cc;color:#2d6a2d;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:600;padding:3px 7px;border-radius:100px;cursor:pointer;outline:none}
          .g-overlay{position:fixed;inset:0;background:rgba(0,0,0,.38);display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(6px)}
          .g-modal{background:white;border-radius:18px;padding:30px;width:410px;box-shadow:0 20px 60px rgba(0,0,0,.14)}
          .g-lbl{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;color:#94b894;margin-bottom:5px;text-transform:uppercase;letter-spacing:.05em}
          .g-trow{border-bottom:1px solid #edf4ed;transition:background .2s}
          .g-trow:hover{background:#f7fbf7}
        `}</style>

        <div style={{ display: "flex", minHeight: "100vh" }}>

          {/* ── SIDEBAR ── */}
          <div style={{ width: 236, background: "#1a3a1a", padding: "26px 16px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
            {/* Identity — from AuthContext */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ width: 46, height: 46, background: "linear-gradient(135deg,#4ade80,#16a34a)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 13 }}>🧭</div>
              <div style={{ fontSize: 8, letterSpacing: ".2em", color: "#4ade80", textTransform: "uppercase", marginBottom: 3 }}>Tour Guide Portal</div>
              {loading ? (
                <>
                  <div style={{ height: 18, width: 150, background: "#2a4a2a", borderRadius: 4, marginBottom: 5 }} />
                  <div style={{ height: 12, width: 100, background: "#2a4a2a", borderRadius: 4 }} />
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.25 }}>
                    {/* Primary guide name or fall back to auth user */}
                    {primaryGuide?.full_name ?? user?.full_name ?? "Guide"}
                  </div>
                  <div style={{ marginTop: 5, fontSize: 11, color: "#4ade80", fontWeight: 600 }}>
                    {primaryGuide ? `${primaryGuide.experience ?? 0} yrs experience` : user?.role ?? "Owner"}
                  </div>
                </>
              )}
            </div>

            {[
              { label: "Overview",  icon: "📊", tab: "overview"  },
              { label: "Profiles",  icon: "🧭", tab: "guides"    },
              { label: "Bookings",  icon: "📋", tab: "bookings"  },
              { label: "Packages",  icon: "🗺️", tab: "packages"  },
              { label: "Profile",   icon: "👤", tab: "profile"   },
            ].map(item => (
              <button
                key={item.tab}
                className={`g-sidebar-btn${activeTab === item.tab ? " active" : ""}`}
                onClick={() => setActiveTab(item.tab)}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}

            <div style={{ marginTop: "auto", background: "#0f2a0f", borderRadius: 11, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#4ade80", fontWeight: 700, marginBottom: 3 }}>Account</div>
              <div style={{ fontSize: 11, color: "#5a8a5a", textTransform: "capitalize" }}>{user?.role ?? "owner"}</div>
              <div style={{ fontSize: 11, color: "#5a8a5a" }}>{guides.length} guide profile(s)</div>
              <div style={{ fontSize: 11, color: "#5a8a5a" }}>{user?.loyalty_points ?? 0} loyalty pts</div>
            </div>
          </div>

          {/* ── MAIN ── */}
          <div style={{ flex: 1, padding: "30px 26px", overflowY: "auto" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
              <div>
                <div style={{ fontSize: 12, color: "#94b894", marginBottom: 3 }}>{today}</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#1a2e1a" }}>
                  {greet()},&nbsp;
                  {/* First name from AuthContext — no fetch needed */}
                  {user?.full_name?.split(" ")[0] ?? "Owner"}
                </h1>
              </div>
              <button className="g-add" onClick={() => setShowModal(true)}>+ Add Guide Profile</button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 11, padding: "11px 18px", marginBottom: 18, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500 }}>
                {error}
                <button className="g-pill" onClick={fetchAll}>Retry</button>
              </div>
            )}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13, marginBottom: 22 }}>
              {[
                { label: "Revenue",         value: loading ? null : `৳${revenue.toLocaleString()}`,  sub: `${bookings.filter(b=>b.status==="completed").length} completed`, icon: "💰", accent: "#16a34a" },
                { label: "Active Bookings", value: loading ? null : activeCount,                       sub: `${bookings.filter(b=>b.status==="pending").length} pending`,   icon: "🎒", accent: "#2563eb" },
                { label: "Guide Profiles",  value: loading ? null : guides.length,                     sub: "registered profiles",                                          icon: "🧭", accent: "#d97706" },
                { label: "Packages Linked", value: loading ? null : packages.length,                   sub: "via package services",                                         icon: "🗺️", accent: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} className="g-stat g-fade" style={{ animationDelay: `${i*70}ms` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
                    <div style={{ fontSize: 11, color: "#94b894", fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 20 }}>{s.icon}</div>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#1a2e1a", marginBottom: 3 }}>
                    {s.value === null ? <Skeleton w="70%" h={22} /> : s.value}
                  </div>
                  <div style={{ fontSize: 11, color: s.accent, fontWeight: 600 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="g-fade">

                {/* Guide profiles preview */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700 }}>Guide Profiles</h2>
                    <button className="g-pill" onClick={() => setActiveTab("guides")}>View All</button>
                  </div>
                  {loading ? [1,2,3].map(i=><Skeleton key={i} h={76} mb={11}/>) :
                  guides.length === 0 ? (
                    <div style={{ background: "white", borderRadius: 13, padding: 36, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                      <div style={{ fontSize: 13, color: "#94b894", marginBottom: 14 }}>No guide profiles yet</div>
                      <button className="g-add" onClick={() => setShowModal(true)}>+ Add Profile</button>
                    </div>
                  ) : guides.slice(0, 3).map((g, i) => (
                    <div key={g.guide_id ?? i} className="g-guide-card">
                      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 11, background: "linear-gradient(135deg,#4ade80,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a3a1a", fontWeight: 800, fontSize: 15 }}>
                          {initials(g.full_name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 1 }}>{g.full_name}</div>
                          <div style={{ fontSize: 11, color: "#94b894" }}>{g.experience ?? 0} yrs experience</div>
                        </div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#16a34a" }}>
                          ৳{parseFloat(g.price_per_day ?? 0).toLocaleString()}<span style={{ fontSize: 10, fontWeight: 400, color: "#94b894" }}>/day</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent bookings preview */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700 }}>Recent Bookings</h2>
                    <button className="g-pill" onClick={() => setActiveTab("bookings")}>View All</button>
                  </div>
                  <div style={{ background: "white", borderRadius: 14, padding: "16px 16px 4px", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                    {loading ? [1,2,3,4].map(i=><Skeleton key={i} h={50} mb={10}/>) :
                    bookings.length === 0 ? (
                      <div style={{ padding: 30, textAlign: "center", fontSize: 13, color: "#94b894" }}>No bookings yet</div>
                    ) : bookings.slice(0, 5).map(b => {
                      const id = b.booking_id ?? b.id;
                      const s  = statusStyle[b.status] ?? statusStyle.pending;
                      return (
                        <div key={id} className="g-brow">
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f0f8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2d6a2d", fontSize: 11, flexShrink: 0 }}>
                            {initials(b.User?.full_name ?? "")}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a" }}>{b.User?.full_name ?? `User #${b.user_id}`}</div>
                            <div style={{ fontSize: 11, color: "#94b894", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {b.package_type} · {b.journey_date ? new Date(b.journey_date).toLocaleDateString() : "No date"}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: "#16a34a", marginBottom: 2 }}>
                              ৳{parseFloat(b.discounted_price ?? b.total_price ?? 0).toLocaleString()}
                            </div>
                            <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 8, fontWeight: 700, letterSpacing: ".1em", padding: "2px 7px", borderRadius: 100 }}>
                              {(b.status ?? "").toUpperCase()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── GUIDES TAB ── */}
            {activeTab === "guides" && (
              <div className="g-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14 }}>
                {loading ? [1,2,3].map(i=><Skeleton key={i} h={140}/>) :
                guides.length === 0 ? (
                  <div style={{ background: "white", borderRadius: 13, padding: 56, textAlign: "center", gridColumn: "1/-1" }}>
                    <div style={{ fontSize: 14, color: "#94b894", marginBottom: 14 }}>No guide profiles registered</div>
                    <button className="g-add" onClick={() => setShowModal(true)}>+ Add First Profile</button>
                  </div>
                ) : guides.map((g, i) => (
                  <div key={g.guide_id ?? i} className="g-guide-card">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 13, marginBottom: 13 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 13, background: "linear-gradient(135deg,#4ade80,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a3a1a", fontWeight: 800, fontSize: 17 }}>
                        {initials(g.full_name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 1 }}>{g.full_name}</div>
                        <div style={{ fontSize: 11, color: "#94b894" }}>{g.experience ?? 0} yrs experience · Guide #{g.guide_id ?? g.id}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 11, borderTop: "1px solid #edf4ed" }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: "#16a34a" }}>
                        ৳{parseFloat(g.price_per_day ?? 0).toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: "#94b894" }}>/day</span>
                      </div>
                      <button className="g-pill" onClick={() => setEditGuide({ ...g })}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {activeTab === "bookings" && (
              <div className="g-fade" style={{ background: "white", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,.04)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #edf4ed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700 }}>All Bookings ({bookings.length})</h2>
                </div>
                {loading ? (
                  <div style={{ padding: 18 }}>{[1,2,3,4,5].map(i=><Skeleton key={i} h={54} mb={10}/>)}</div>
                ) : bookings.length === 0 ? (
                  <div style={{ padding: 56, textAlign: "center", fontSize: 14, color: "#94b894" }}>No bookings found</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f7fbf7" }}>
                        {["#","Tourist","Type","Journey","Amount","Loyalty","Status"].map(h => (
                          <th key={h} style={{ padding: "11px 15px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94b894", textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => {
                        const id = b.booking_id ?? b.id;
                        const s  = statusStyle[b.status] ?? statusStyle.pending;
                        return (
                          <tr key={id} className="g-trow">
                            <td style={{ padding: "13px 15px", fontSize: 11, color: "#94b894", fontWeight: 600 }}>#{id}</td>
                            <td style={{ padding: "13px 15px" }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a" }}>
                                {b.User?.full_name ?? `User #${b.user_id}`}
                              </div>
                            </td>
                            <td style={{ padding: "13px 15px", fontSize: 12, color: "#94b894", textTransform: "capitalize" }}>{b.package_type}</td>
                            <td style={{ padding: "13px 15px", fontSize: 12, color: "#94b894" }}>
                              {b.journey_date ? new Date(b.journey_date).toLocaleDateString() : "—"}
                            </td>
                            <td style={{ padding: "13px 15px" }}>
                              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#16a34a" }}>
                                ৳{parseFloat(b.discounted_price ?? b.total_price ?? 0).toLocaleString()}
                              </div>
                            </td>
                            <td style={{ padding: "13px 15px", fontSize: 12, color: "#94b894" }}>
                              {b.loyalty_points_earned ?? 0} pts
                            </td>
                            <td style={{ padding: "13px 15px" }}>
                              <select
                                className="g-st-sel"
                                value={b.status}
                                style={{ color: s.color }}
                                onChange={e => handleBookingStatus(id, e.target.value)}
                              >
                                {["pending","confirmed","completed","cancelled"].map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── PACKAGES TAB ── */}
            {activeTab === "packages" && (
              <div className="g-fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
                {loading ? [1,2,3].map(i=><Skeleton key={i} h={160}/>) :
                packages.length === 0 ? (
                  <div style={{ background: "white", borderRadius: 13, padding: 56, textAlign: "center", gridColumn: "1/-1" }}>
                    <div style={{ fontSize: 14, color: "#94b894" }}>No packages linked yet</div>
                  </div>
                ) : packages.map((pk, i) => (
                  <div key={pk.package_id ?? pk.id ?? i} style={{ background: "white", borderRadius: 13, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1.5px solid transparent", transition: "all .3s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#a3c9a3"; e.currentTarget.style.transform="translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.transform="none"; }}
                  >
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, marginBottom: 5, color: "#1a2e1a" }}>{pk.name}</div>
                    <div style={{ fontSize: 11, color: "#94b894", marginBottom: 11 }}>
                      {pk.duration_days ?? "?"} days · {pk.is_active ? "Active" : "Inactive"}
                    </div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: "#16a34a", marginBottom: 7 }}>
                      ৳{parseFloat(pk.base_price ?? 0).toLocaleString()}
                    </div>
                    <p style={{ fontSize: 12, color: "#94b894", lineHeight: 1.6 }}>
                      {(pk.description ?? "No description.").slice(0, 90)}…
                    </p>
                    {pk.Start_Date && (
                      <div style={{ marginTop: 9, fontSize: 11, color: "#4ade80", fontWeight: 600 }}>
                        Starts: {new Date(pk.Start_Date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── PROFILE TAB — from AuthContext ── */}
            {activeTab === "profile" && (
              <div className="g-fade" style={{ background: "white", borderRadius: 14, padding: 28, maxWidth: 500, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700, marginBottom: 22 }}>My Profile</h2>
                {!user ? (
                  <div style={{ color: "#94b894", fontSize: 13 }}>No user session found.</div>
                ) : (
                  <div style={{ display: "grid", gap: 13 }}>
                    {[
                      ["Full Name",    user.full_name],
                      ["Email",        user.email],
                      ["Phone",        user.phone ?? "—"],
                      ["Role",         user.role],
                      ["Country",      user.country ?? "—"],
                      ["Loyalty Pts",  user.loyalty_points ?? 0],
                      ["Auth",         user.auth_provider],
                      ["Joined",       user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", gap: 14, paddingBottom: 11, borderBottom: "1px solid #edf4ed" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#94b894", textTransform: "uppercase", letterSpacing: ".05em", width: 105, flexShrink: 0, paddingTop: 2 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#1a2e1a" }}>{String(value)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── ADD GUIDE MODAL ── */}
        {showModal && (
          <div className="g-overlay" onClick={() => setShowModal(false)}>
            <div className="g-modal" onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700, marginBottom: 20, color: "#1a2e1a" }}>Add Guide Profile</h3>
              <div style={{ display: "grid", gap: 13 }}>
                {[
                  { label: "Full Name",        field: "full_name",    type: "text",   ph: "e.g. Md. Rafiqul Islam" },
                  { label: "Experience (yrs)", field: "experience",   type: "number", ph: "e.g. 5" },
                  { label: "Price / Day (৳)",  field: "price_per_day",type: "number", ph: "e.g. 2500" },
                ].map(({ label, field, type, ph }) => (
                  <div key={field}>
                    <div className="g-lbl">{label}</div>
                    <input className="g-inp" type={type} placeholder={ph} value={newGuide[field]} onChange={e => setNewGuide(p => ({ ...p, [field]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="g-add" style={{ flex: 1 }} onClick={handleAddGuide} disabled={saving}>{saving ? "Saving…" : "Add Profile"}</button>
                <button className="g-pill" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT GUIDE MODAL ── */}
        {editGuide && (
          <div className="g-overlay" onClick={() => setEditGuide(null)}>
            <div className="g-modal" onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700, marginBottom: 20, color: "#1a2e1a" }}>Edit Guide Profile</h3>
              <div style={{ display: "grid", gap: 13 }}>
                {[
                  { label: "Full Name",        field: "full_name",    type: "text"   },
                  { label: "Experience (yrs)", field: "experience",   type: "number" },
                  { label: "Price / Day (৳)",  field: "price_per_day",type: "number" },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <div className="g-lbl">{label}</div>
                    <input className="g-inp" type={type} value={editGuide[field] ?? ""} onChange={e => setEditGuide(p => ({ ...p, [field]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="g-add" style={{ flex: 1 }} onClick={handleUpdateGuide} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
                <button className="g-pill" onClick={() => setEditGuide(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}