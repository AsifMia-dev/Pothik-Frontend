import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";

// ─── API CALLS ────────────────────────────────────────────────────────────────
const transportApi = {
  getTransports:       ()              => api.get("/transports"),
  getVehicles:         (tid)           => api.get(`/transports/${tid}/vehicles`),
  getAllBookings:       ()              => api.get("/booking"),
  addVehicle:          (tid, data)     => api.post(`/transports/${tid}/vehicles`, data),
  updateVehicle:       (vid, data)     => api.put(`/vehicles/${vid}`, data),
  updateBookingStatus: (id, status)    => api.put(`/booking/${id}/status`, { status }),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const vehicleStatusMeta = {
  available:   { label: "AVAILABLE",   color: "#4ade80", bg: "rgba(74,222,128,.12)"  },
  on_trip:     { label: "ON TRIP",     color: "#22d3ee", bg: "rgba(34,211,238,.12)"  },
  maintenance: { label: "MAINTENANCE", color: "#f97316", bg: "rgba(249,115,22,.12)"  },
};

const bookingStatusMeta = {
  confirmed: { color: "#22d3ee", bg: "rgba(34,211,238,.1)" },
  pending:   { color: "#a78bfa", bg: "rgba(167,139,250,.1)" },
  completed: { color: "#6b7280", bg: "rgba(107,114,128,.1)" },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,.1)" },
};

const Skeleton = ({ w = "100%", h = 20, mb = 0 }) => (
  <div style={{
    width: w, height: h, marginBottom: mb, borderRadius: 3,
    background: "linear-gradient(90deg,#0d1421 25%,#162035 50%,#0d1421 75%)",
    backgroundSize: "200% 100%", animation: "t-shimmer 1.4s infinite",
  }} />
);

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function TransportOwnerDashboard() {
  const { user } = useContext(AuthContext);
  // user: { user_id, full_name, email, phone, role, loyalty_points, country, created_at, auth_provider }

  const [activeTab,  setActiveTab]  = useState("overview");
  const [transports, setTransports] = useState([]);
  const [vehicles,   setVehicles]   = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Add vehicle modal
  const [showModal,  setShowModal]  = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    transport_id: "", vehicle_number: "", vehicle_type: "",
    model: "", capacity: "", price_per_day: "",
  });
  const [saving, setSaving] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [tRes, bRes] = await Promise.all([
        transportApi.getTransports(),
        transportApi.getAllBookings(),
      ]);

      const t = Array.isArray(tRes.data?.data  ?? tRes.data)  ? (tRes.data?.data  ?? tRes.data)  : [];
      const b = Array.isArray(bRes.data?.data  ?? bRes.data)  ? (bRes.data?.data  ?? bRes.data)  : [];

      setTransports(t);
      setBookings(b);

      if (t.length > 0) {
        const vResults = await Promise.all(
          t.map(tr => transportApi.getVehicles(tr.transport_id ?? tr.id))
        );
        setVehicles(vResults.flatMap(res => res.data?.data ?? res.data ?? []));
      }
    } catch (err) {
      console.error("TransportOwnerDashboard fetchAll:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddVehicle = async () => {
    if (!newVehicle.transport_id || !newVehicle.vehicle_number || !newVehicle.vehicle_type) return;
    setSaving(true);
    try {
      await transportApi.addVehicle(Number(newVehicle.transport_id), {
        vehicle_number: newVehicle.vehicle_number,
        vehicle_type:   newVehicle.vehicle_type,
        model:          newVehicle.model,
        capacity:       Number(newVehicle.capacity),
        price_per_day:  Number(newVehicle.price_per_day),
        status:         "available",
      });
      setShowModal(false);
      setNewVehicle({ transport_id: "", vehicle_number: "", vehicle_type: "", model: "", capacity: "", price_per_day: "" });
      fetchAll();
    } catch (err) {
      console.error("addVehicle error:", err);
      alert("Failed to add vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const handleVehicleStatus = async (vid, status) => {
    try {
      await transportApi.updateVehicle(vid, { status });
      setVehicles(prev => prev.map(v => (v.vehicle_id ?? v.id) === vid ? { ...v, status } : v));
    } catch (err) {
      console.error("updateVehicle error:", err);
      alert("Failed to update vehicle status.");
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await transportApi.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => (b.booking_id ?? b.id) === id ? { ...b, status } : b));
    } catch (err) {
      console.error("updateBookingStatus error:", err);
      alert("Failed to update booking status.");
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const revenue        = bookings.filter(b => ["confirmed","completed"].includes(b.status)).reduce((s,b) => s + parseFloat(b.discounted_price ?? b.total_price ?? 0), 0);
  const activeVehicles = vehicles.filter(v => v.status === "on_trip").length;
  const availVehicles  = vehicles.filter(v => v.status === "available").length;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <Layout>
      <div style={{ fontFamily: "'Space Mono',monospace", background: "#070b14", minHeight: "100vh", color: "#c8d8f0" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@400;500;600;700&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes t-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes t-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          .t-fade{animation:t-fadeUp .3s ease forwards}
          .t-tab{background:none;border:none;cursor:pointer;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.05em;padding:10px 16px;transition:all .2s;border-bottom:2px solid transparent;color:#2a4060}
          .t-tab:hover{color:#22d3ee}
          .t-tab.active{color:#22d3ee;border-bottom-color:#22d3ee}
          .t-card{background:#0d1421;border:1px solid #1a2540;border-radius:4px;transition:border-color .3s}
          .t-card:hover{border-color:#1e3050}
          .t-vcard{background:#080e1c;border:1px solid #1a2540;border-radius:4px;padding:15px 17px;margin-bottom:9px;display:flex;align-items:center;gap:16px;transition:all .3s}
          .t-vcard:hover{border-color:#22d3ee30;transform:translateX(3px)}
          .t-trow{border-bottom:1px solid #0c1220;transition:background .2s}
          .t-trow:hover{background:#0a1020}
          .t-btn{background:none;border:1px solid #1a2540;color:#3a5070;font-family:'Space Mono',monospace;font-size:9px;padding:5px 12px;border-radius:3px;cursor:pointer;transition:all .2s}
          .t-btn:hover{border-color:#22d3ee;color:#22d3ee}
          .t-add{background:#22d3ee14;border:1px solid #22d3ee35;color:#22d3ee;font-family:'Space Mono',monospace;font-size:9px;padding:7px 16px;border-radius:3px;cursor:pointer;transition:all .2s}
          .t-add:hover{background:#22d3ee22}
          .t-add:disabled{opacity:.4;cursor:not-allowed}
          .t-st-sel{background:#080e1c;border:1px solid #1a2540;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.08em;padding:3px 5px;border-radius:3px;cursor:pointer;outline:none}
          .t-inp{background:#070b14;border:1px solid #1a2540;color:#c8d8f0;font-family:'Space Mono',monospace;font-size:11px;padding:9px 12px;width:100%;border-radius:3px;outline:none;transition:border-color .3s}
          .t-inp:focus{border-color:#22d3ee}
          select.t-inp option{background:#0d1421}
          .t-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(4px)}
          .t-modal{background:#0d1421;border:1px solid #1a2540;padding:28px;width:430px;border-radius:4px}
          .t-lbl{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.18em;color:#1e3050;text-transform:uppercase;margin-bottom:5px}
        `}</style>

        {/* ── TOPBAR ── */}
        <div style={{ background: "#08101e", borderBottom: "1px solid #1a2540", padding: "0 34px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#22d3ee,#0891b2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🚌</div>
            <div>
              <div style={{ fontSize: 8, letterSpacing: ".25em", color: "#22d3ee", textTransform: "uppercase" }}>Transport Owner Portal</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, color: "#e8f0fc", letterSpacing: ".04em" }}>
                {loading ? <Skeleton w={150} h={13} /> : (transports[0]?.vehicle_type ? `${transports[0].vehicle_type} Services` : "My Fleet")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex" }}>
            {["overview","trips","fleet","profile"].map(t => (
              <button key={t} className={`t-tab${activeTab===t?" active":""}`} onClick={() => setActiveTab(t)}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9, color: loading ? "#2a4060" : "#22d3ee" }}>
              ● {loading ? "LOADING…" : "LIVE"}
            </span>
            {/* avatar from AuthContext */}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#22d3ee,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#070b14", fontSize: 13 }}>
              {user?.full_name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ background: "#0e0a04", border: "1px solid #5a3010", color: "#f97316", padding: "10px 34px", display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono',monospace", fontSize: 10 }}>
            {error}
            <button className="t-add" onClick={fetchAll}>RETRY</button>
          </div>
        )}

        <div style={{ padding: "28px 34px" }}>

          {/* ── GREETING ── */}
          <div className="t-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: ".25em", color: "#22d3ee", textTransform: "uppercase", marginBottom: 7 }}>{today}</div>
              <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 30, fontWeight: 700, color: "#e8f0fc", lineHeight: 1.15, letterSpacing: ".02em" }}>
                {greet()},<br />
                {/* AuthContext user — no extra fetch needed */}
                {user?.full_name ?? "Owner"}
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8, letterSpacing: ".2em", color: "#1e3050", textTransform: "uppercase" }}>Total Vehicles</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 42, fontWeight: 700, color: "#22d3ee", lineHeight: 1 }}>
                {loading ? "—" : vehicles.length}
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13, marginBottom: 26 }}>
            {[
              { label: "TOTAL REVENUE",    value: loading ? null : `৳${revenue.toLocaleString()}`,                                             sub: `${bookings.filter(b=>b.status==="completed").length} completed`, color: "#22d3ee" },
              { label: "ACTIVE BOOKINGS",  value: loading ? null : bookings.filter(b=>["confirmed","pending"].includes(b.status)).length,       sub: `${bookings.filter(b=>b.status==="pending").length} pending`,    color: "#a78bfa" },
              { label: "VEHICLES ON TRIP", value: loading ? null : activeVehicles,                                                              sub: `${availVehicles} available now`,                                color: "#4ade80" },
              { label: "IN MAINTENANCE",   value: loading ? null : vehicles.filter(v=>v.status==="maintenance").length,                         sub: `${transports.length} transport(s)`,                            color: "#f97316" },
            ].map((s, i) => (
              <div key={i} className="t-card t-fade" style={{ padding: "20px 18px", animationDelay: `${i*70}ms` }}>
                <div style={{ fontSize: 8, letterSpacing: ".2em", color: "#1e3050", marginBottom: 9 }}>{s.label}</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 5 }}>
                  {s.value === null ? <Skeleton w="65%" h={26} /> : s.value}
                </div>
                <div style={{ fontSize: 9, color: "#1e3050" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── OVERVIEW / TRIPS TAB ── */}
          {(activeTab === "overview" || activeTab === "trips") && (
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 18 }} className="t-fade">

              {/* Bookings */}
              <div className="t-card">
                <div style={{ padding: "15px 20px", borderBottom: "1px solid #1a2540", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#22d3ee" }}>
                    TRIP BOOKINGS {!loading && <span style={{ color: "#162035" }}>({bookings.length})</span>}
                  </div>
                  {activeTab === "overview" && (
                    <button className="t-add" onClick={() => setActiveTab("trips")}>VIEW ALL</button>
                  )}
                </div>
                {loading ? (
                  <div style={{ padding: 16 }}>{[1,2,3,4].map(i=><Skeleton key={i} h={42} mb={9}/>)}</div>
                ) : bookings.length === 0 ? (
                  <div style={{ padding: 48, textAlign: "center", fontSize: 9, letterSpacing: ".15em", color: "#162035" }}>NO BOOKINGS YET</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #0e1828" }}>
                          {["ID","TOURIST","TYPE","JOURNEY","AMOUNT","STATUS"].map(h => (
                            <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 8, letterSpacing: ".15em", color: "#162035", fontWeight: 400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTab === "trips" ? bookings : bookings.slice(0,6)).map(b => {
                          const id   = b.booking_id ?? b.id;
                          const meta = bookingStatusMeta[b.status] ?? { color: "#888", bg: "#1a2540" };
                          return (
                            <tr key={id} className="t-trow">
                              <td style={{ padding: "11px 13px", fontSize: 9, color: "#1e3050" }}>#{id}</td>
                              <td style={{ padding: "11px 13px", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 14 }}>
                                {b.User?.full_name ?? `User #${b.user_id}`}
                              </td>
                              <td style={{ padding: "11px 13px", fontSize: 9, color: "#3a5070", textTransform: "capitalize" }}>{b.package_type}</td>
                              <td style={{ padding: "11px 13px", fontSize: 9, color: "#3a5070" }}>
                                {b.journey_date ? new Date(b.journey_date).toLocaleDateString() : "—"}
                              </td>
                              <td style={{ padding: "11px 13px", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: "#22d3ee" }}>
                                ৳{parseFloat(b.discounted_price ?? b.total_price ?? 0).toLocaleString()}
                              </td>
                              <td style={{ padding: "9px 13px" }}>
                                <select
                                  className="t-st-sel"
                                  value={b.status}
                                  style={{ color: meta.color }}
                                  onChange={e => handleBookingStatus(id, e.target.value)}
                                >
                                  {["pending","confirmed","completed","cancelled"].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Fleet summary */}
              <div className="t-card">
                <div style={{ padding: "15px 20px", borderBottom: "1px solid #1a2540", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#22d3ee" }}>FLEET SUMMARY</div>
                  <button className="t-add" onClick={() => setActiveTab("fleet")}>VIEW ALL</button>
                </div>
                <div style={{ padding: 13, maxHeight: 400, overflowY: "auto" }}>
                  {loading ? [1,2,3].map(i=><Skeleton key={i} h={70} mb={9}/>) :
                  vehicles.length === 0 ? (
                    <div style={{ padding: 36, textAlign: "center", fontSize: 9, letterSpacing: ".15em", color: "#162035" }}>NO VEHICLES YET</div>
                  ) : vehicles.slice(0,5).map((v, i) => {
                    const meta = vehicleStatusMeta[v.status] ?? vehicleStatusMeta.available;
                    return (
                      <div key={v.vehicle_id ?? i} className="t-vcard">
                        <div style={{ fontSize: 24 }}>{v.vehicle_type === "Bus" || v.vehicle_type === "AC Coach" ? "🚌" : "🚐"}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14 }}>{v.vehicle_number}</div>
                            <span style={{ background: meta.bg, color: meta.color, fontSize: 7, letterSpacing: ".12em", padding: "2px 6px", borderRadius: 2 }}>{meta.label}</span>
                          </div>
                          <div style={{ fontSize: 9, color: "#1e3050" }}>{v.vehicle_type} · {v.capacity} seats · ৳{parseFloat(v.price_per_day ?? 0).toLocaleString()}/day</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── FLEET TAB ── */}
          {activeTab === "fleet" && (
            <div className="t-fade t-card">
              <div style={{ padding: "15px 20px", borderBottom: "1px solid #1a2540", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#22d3ee" }}>ALL VEHICLES ({vehicles.length})</div>
                <button className="t-add" onClick={() => setShowModal(true)}>+ ADD VEHICLE</button>
              </div>
              <div style={{ padding: 14 }}>
                {loading ? [1,2,3,4].map(i=><Skeleton key={i} h={74} mb={9}/>) :
                vehicles.length === 0 ? (
                  <div style={{ padding: 56, textAlign: "center" }}>
                    <div style={{ fontSize: 9, letterSpacing: ".15em", color: "#162035", marginBottom: 14 }}>NO VEHICLES REGISTERED</div>
                    <button className="t-add" onClick={() => setShowModal(true)}>+ ADD FIRST VEHICLE</button>
                  </div>
                ) : vehicles.map((v, i) => {
                  const meta = vehicleStatusMeta[v.status] ?? vehicleStatusMeta.available;
                  return (
                    <div key={v.vehicle_id ?? i} className="t-vcard">
                      <div style={{ fontSize: 26 }}>{v.vehicle_type === "Bus" || v.vehicle_type === "AC Coach" ? "🚌" : "🚐"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15 }}>
                            {v.vehicle_number} <span style={{ fontWeight: 400, fontSize: 11, color: "#3a5070" }}>· {v.vehicle_type}</span>
                          </div>
                          <span style={{ background: meta.bg, color: meta.color, fontSize: 8, letterSpacing: ".1em", padding: "2px 7px", borderRadius: 2 }}>{meta.label}</span>
                        </div>
                        <div style={{ fontSize: 9, color: "#1e3050", marginBottom: 7 }}>
                          {v.model ?? "—"} · {v.capacity} seats · ৳{parseFloat(v.price_per_day ?? 0).toLocaleString()}/day · Transport #{v.transport_id}
                        </div>
                        <select
                          className="t-st-sel"
                          value={v.status}
                          style={{ color: meta.color }}
                          onChange={e => handleVehicleStatus(v.vehicle_id ?? v.id, e.target.value)}
                        >
                          {["available","on_trip","maintenance"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── PROFILE TAB — from AuthContext ── */}
          {activeTab === "profile" && (
            <div className="t-fade t-card" style={{ padding: 28, maxWidth: 490 }}>
              <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#22d3ee", marginBottom: 20 }}>OWNER PROFILE</div>
              {!user ? (
                <div style={{ fontSize: 10, color: "#1e3050" }}>No user session found.</div>
              ) : (
                <div style={{ display: "grid", gap: 11 }}>
                  {[
                    ["FULL NAME",    user.full_name],
                    ["EMAIL",        user.email],
                    ["PHONE",        user.phone ?? "—"],
                    ["ROLE",         user.role],
                    ["COUNTRY",      user.country ?? "—"],
                    ["LOYALTY PTS",  user.loyalty_points ?? 0],
                    ["AUTH",         user.auth_provider],
                    ["JOINED",       user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", gap: 14, paddingBottom: 9, borderBottom: "1px solid #0e1828" }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: ".18em", color: "#1e3050", width: 95, flexShrink: 0, paddingTop: 2 }}>{label}</div>
                      <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 500 }}>{String(value)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── ADD VEHICLE MODAL ── */}
        {showModal && (
          <div className="t-overlay" onClick={() => setShowModal(false)}>
            <div className="t-modal" onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 9, letterSpacing: ".2em", color: "#22d3ee", marginBottom: 20 }}>ADD NEW VEHICLE</div>
              <div style={{ display: "grid", gap: 11 }}>
                {[
                  { label: "Transport",       field: "transport_id",  type: "select" },
                  { label: "Vehicle Number",  field: "vehicle_number",type: "text",   ph: "e.g. DHA-TA-1234" },
                  { label: "Vehicle Type",    field: "vehicle_type",  type: "text",   ph: "e.g. AC Coach" },
                  { label: "Model",           field: "model",         type: "text",   ph: "e.g. Hino 2023" },
                  { label: "Capacity",        field: "capacity",      type: "number", ph: "e.g. 42" },
                  { label: "Price / Day (৳)", field: "price_per_day", type: "number", ph: "e.g. 8000" },
                ].map(({ label, field, type, ph }) => (
                  <div key={field}>
                    <div className="t-lbl">{label}</div>
                    {type === "select" ? (
                      <select
                        className="t-inp"
                        value={newVehicle[field]}
                        onChange={e => setNewVehicle(p => ({ ...p, [field]: e.target.value }))}
                      >
                        <option value="">Select Transport</option>
                        {transports.map(t => (
                          <option key={t.transport_id} value={t.transport_id}>
                            {t.vehicle_type} (#{t.transport_id})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="t-inp"
                        type={type}
                        placeholder={ph}
                        value={newVehicle[field]}
                        onChange={e => setNewVehicle(p => ({ ...p, [field]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 9, marginTop: 20 }}>
                <button className="t-add" style={{ flex: 1, padding: "10px" }} onClick={handleAddVehicle} disabled={saving}>
                  {saving ? "SAVING…" : "ADD VEHICLE"}
                </button>
                <button className="t-btn" onClick={() => setShowModal(false)}>CANCEL</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}