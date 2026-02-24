import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../components/Layout";

// ─── API CALLS (using project's axios/fetch instance) ────────────────────────
// `api` is the pre-configured axios instance with baseURL + auth headers already set
const hotelApi = {
  getMyHotels:         ()          => api.get("/hotels"),
  getRoomsByHotel:     (hotelId)   => api.get(`/rooms?hotel_id=${hotelId}`),
  getAllBookings:       ()          => api.get("/booking"),
  addRoom:             (data)      => api.post("/rooms", data),
  updateBookingStatus: (id, status) => api.put(`/booking/${id}/status`, { status }),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusColors = {
  confirmed: { bg: "#d4f5e2", color: "#1a7a4a" },
  pending:   { bg: "#fff3cd", color: "#856404" },
  completed: { bg: "#e8e8e8", color: "#555"    },
  cancelled: { bg: "#fde8e8", color: "#9b1c1c" },
};

const Skeleton = ({ w = "100%", h = 20, mb = 0 }) => (
  <div style={{
    width: w, height: h, marginBottom: mb, borderRadius: 2,
    background: "linear-gradient(90deg,#1e2332 25%,#2a3148 50%,#1e2332 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
  }} />
);

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function HotelOwnerDashboard() {
  // ── Get logged-in user from AuthContext instead of calling /profile ──────
  const { user } = useContext(AuthContext);
  // user shape (from your User model): { user_id, full_name, email, phone, role,
  //   auth_provider, firebase_uid, loyalty_points, country, created_at }

  const [activeTab, setActiveTab] = useState("overview");
  const [hotels,    setHotels]    = useState([]);
  const [rooms,     setRooms]     = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Add Room modal
  const [showModal, setShowModal] = useState(false);
  const [newRoom,   setNewRoom]   = useState({ hotel_id: "", room_type: "", total_rooms: "", price: "" });
  const [saving,    setSaving]    = useState(false);

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Parallel: hotels + bookings
      const [hotelsRes, bookingsRes] = await Promise.all([
        hotelApi.getMyHotels(),
        hotelApi.getAllBookings(),
      ]);

      // Support both { data: [...] } (axios) and direct array responses
      const hotelsData   = hotelsRes.data?.data   ?? hotelsRes.data   ?? [];
      const bookingsData = bookingsRes.data?.data  ?? bookingsRes.data ?? [];

      const h = Array.isArray(hotelsData)   ? hotelsData   : [];
      const b = Array.isArray(bookingsData) ? bookingsData : [];

      setHotels(h);
      setBookings(b);

      // Fetch rooms for each hotel in parallel
      if (h.length > 0) {
        const roomResults = await Promise.all(
          h.map(hotel => hotelApi.getRoomsByHotel(hotel.hotel_id ?? hotel.id))
        );
        const allRooms = roomResults.flatMap(res => res.data?.data ?? res.data ?? []);
        setRooms(allRooms);
      }
    } catch (err) {
      console.error("HotelOwnerDashboard fetchAll error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddRoom = async () => {
    if (!newRoom.hotel_id || !newRoom.room_type || !newRoom.total_rooms || !newRoom.price) return;
    setSaving(true);
    try {
      await hotelApi.addRoom({
        hotel_id:    Number(newRoom.hotel_id),
        room_type:   newRoom.room_type,
        total_rooms: Number(newRoom.total_rooms),
        price:       Number(newRoom.price),
      });
      setShowModal(false);
      setNewRoom({ hotel_id: "", room_type: "", total_rooms: "", price: "" });
      fetchAll();
    } catch (err) {
      console.error("addRoom error:", err);
      alert("Failed to add room.");
    } finally {
      setSaving(false);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await hotelApi.updateBookingStatus(bookingId, status);
      setBookings(prev =>
        prev.map(b => (b.booking_id ?? b.id) === bookingId ? { ...b, status } : b)
      );
    } catch (err) {
      console.error("updateBookingStatus error:", err);
      alert("Failed to update booking status.");
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const revenue     = bookings
    .filter(b => ["confirmed", "completed"].includes(b.status))
    .reduce((sum, b) => sum + parseFloat(b.discounted_price ?? b.total_price ?? 0), 0);
  const activeCount = bookings.filter(b => ["confirmed", "pending"].includes(b.status)).length;
  const totalRooms  = rooms.reduce((sum, r) => sum + (r.total_rooms ?? 0), 0);
  const primaryHotel = hotels[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", background: "#0d1117", minHeight: "100vh", color: "#e8dcc8" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .fade{animation:fadeUp .35s ease forwards}
          .h-nav-btn{background:none;border:none;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:10px 20px;transition:all .3s;color:#666;border-bottom:2px solid transparent}
          .h-nav-btn:hover{color:#c9a96e}
          .h-nav-btn.active{color:#c9a96e;border-bottom-color:#c9a96e}
          .h-stat{background:linear-gradient(135deg,#1a1f2e,#151820);border:1px solid #2a2f3e;padding:26px;border-radius:2px;transition:border-color .3s}
          .h-stat:hover{border-color:#c9a96e}
          .h-room-card{background:#0f1420;border:1px solid #2a2f3e;padding:16px 18px;border-radius:2px;display:flex;align-items:center;gap:14px;margin-bottom:10px;transition:all .3s}
          .h-room-card:hover{border-color:#c9a96e;transform:translateX(3px)}
          .h-trow{border-bottom:1px solid #1a2030;transition:background .2s}
          .h-trow:hover{background:#131826}
          .h-pbar{height:3px;background:#2a2f3e;border-radius:2px;overflow:hidden;margin:5px 0}
          .h-pfill{height:100%;background:linear-gradient(90deg,#c9a96e,#e8c98a);border-radius:2px}
          .h-btn{font-family:'Josefin Sans',sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;border:none;cursor:pointer;padding:9px 20px;border-radius:1px;transition:all .3s}
          .h-gold{background:#c9a96e;color:#0d1117}.h-gold:hover{background:#e8c98a}
          .h-outline{background:transparent;color:#c9a96e;border:1px solid #c9a96e}.h-outline:hover{background:#c9a96e;color:#0d1117}
          .h-inp{background:#0d1117;border:1px solid #2a2f3e;color:#e8dcc8;font-family:'Josefin Sans',sans-serif;font-size:12px;padding:10px 14px;width:100%;border-radius:1px;outline:none;transition:border-color .3s}
          .h-inp:focus{border-color:#c9a96e}
          select.h-inp option{background:#151820}
          .h-st-sel{background:#0d1117;border:1px solid #2a2f3e;font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:.08em;padding:3px 6px;border-radius:1px;cursor:pointer;outline:none}
          .h-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(4px)}
          .h-modal{background:#151820;border:1px solid #2a2f3e;padding:30px;width:420px;border-radius:2px}
          .h-lbl{font-family:'Josefin Sans',sans-serif;font-size:9px;letter-spacing:.2em;color:#555;text-transform:uppercase;margin-bottom:5px}
        `}</style>

        {/* ── TOPBAR ── */}
        <div style={{ background: "#0a0d14", borderBottom: "1px solid #2a2f3e", padding: "0 36px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#c9a96e,#a67c52)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏨</div>
              <div>
                <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".3em", color: "#c9a96e", textTransform: "uppercase" }}>Hotel Owner Portal</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#e8dcc8", lineHeight: 1.2 }}>
                  {loading ? <Skeleton w={140} h={13} /> : (primaryHotel?.name ?? "My Hotel")}
                </div>
              </div>
            </div>

            {/* Nav tabs */}
            <nav style={{ display: "flex" }}>
              {["overview", "bookings", "listings", "profile"].map(t => (
                <button
                  key={t}
                  className={`h-nav-btn${activeTab === t ? " active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >{t}</button>
              ))}
            </nav>

            {/* User avatar — from AuthContext */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: loading ? "#555" : "#4ade80", display: "inline-block" }} />
              <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".1em", color: "#555" }}>
                {loading ? "LOADING" : "LIVE"}
              </span>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#a67c52)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#0d1117", marginLeft: 6, fontSize: 13 }}>
                {user?.full_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            </div>
          </div>
        </div>

        {/* ── ERROR BAR ── */}
        {error && (
          <div style={{ background: "#1c0f0f", border: "1px solid #6a2020", color: "#f87171", padding: "11px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Josefin Sans',sans-serif", fontSize: 11 }}>
            {error}
            <button className="h-btn h-outline" style={{ padding: "5px 14px" }} onClick={fetchAll}>Retry</button>
          </div>
        )}

        <div style={{ padding: "34px 36px" }}>

          {/* ── GREETING — uses user from AuthContext ── */}
          <div className="fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".3em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 8 }}>{today}</div>
              <h1 style={{ fontSize: 32, fontWeight: 300, color: "#e8dcc8", lineHeight: 1.15 }}>
                {greet()},<br />
                <span style={{ fontWeight: 600 }}>
                  {/* user comes from AuthContext — no extra API call needed */}
                  {user?.full_name ?? "Owner"}
                </span>
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".2em", color: "#555", textTransform: "uppercase" }}>Properties</div>
              <div style={{ fontSize: 42, fontWeight: 300, color: "#c9a96e", lineHeight: 1 }}>
                {loading ? "—" : hotels.length}
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 30 }}>
            {[
              { label: "Total Revenue",   value: loading ? null : `৳${revenue.toLocaleString()}`,    sub: `${bookings.filter(b => b.status === "completed").length} completed` },
              { label: "Active Bookings", value: loading ? null : activeCount,                         sub: `${bookings.filter(b => b.status === "pending").length} pending` },
              { label: "Total Rooms",     value: loading ? null : totalRooms,                          sub: `${rooms.length} room type(s)` },
              { label: "My Hotels",       value: loading ? null : hotels.length,                       sub: `${user?.loyalty_points ?? 0} loyalty pts` },
            ].map((s, i) => (
              <div key={i} className="h-stat fade" style={{ animationDelay: `${i * 70}ms` }}>
                <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".2em", color: "#555", textTransform: "uppercase", marginBottom: 10 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#e8dcc8", marginBottom: 8 }}>
                  {s.value === null ? <Skeleton w="70%" h={26} /> : s.value}
                </div>
                <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, color: "#c9a96e" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── OVERVIEW / BOOKINGS ── */}
          {(activeTab === "overview" || activeTab === "bookings") && (
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }} className="fade">

              {/* Bookings table */}
              <div style={{ background: "#111720", border: "1px solid #2a2f3e", borderRadius: 2 }}>
                <div style={{ padding: "17px 22px", borderBottom: "1px solid #2a2f3e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a96e" }}>
                    Bookings {!loading && <span style={{ color: "#333" }}>({bookings.length})</span>}
                  </div>
                  {activeTab === "overview" && (
                    <button className="h-btn h-outline" onClick={() => setActiveTab("bookings")}>View All</button>
                  )}
                </div>

                {loading ? (
                  <div style={{ padding: 18 }}>{[1,2,3,4].map(i => <Skeleton key={i} h={42} mb={10} />)}</div>
                ) : bookings.length === 0 ? (
                  <div style={{ padding: 48, textAlign: "center", fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".15em", color: "#2a2f3e" }}>
                    NO BOOKINGS YET
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #1e2332" }}>
                          {["#", "Guest", "Type", "Journey", "Amount", "Status"].map(h => (
                            <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".2em", color: "#3a3f50", textTransform: "uppercase", fontWeight: 400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTab === "bookings" ? bookings : bookings.slice(0, 5)).map(b => {
                          const id = b.booking_id ?? b.id;
                          return (
                            <tr key={id} className="h-trow">
                              <td style={{ padding: "12px 14px", fontSize: 10, color: "#3a3f50" }}>#{id}</td>
                              <td style={{ padding: "12px 14px", fontSize: 13 }}>
                                {b.User?.full_name ?? `User #${b.user_id}`}
                              </td>
                              <td style={{ padding: "12px 14px", fontSize: 10, color: "#888", textTransform: "capitalize" }}>
                                {b.package_type}
                              </td>
                              <td style={{ padding: "12px 14px", fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, color: "#888" }}>
                                {b.journey_date ? new Date(b.journey_date).toLocaleDateString() : "—"}
                              </td>
                              <td style={{ padding: "12px 14px", fontSize: 14, color: "#c9a96e", fontWeight: 500 }}>
                                ৳{parseFloat(b.discounted_price ?? b.total_price ?? 0).toLocaleString()}
                              </td>
                              <td style={{ padding: "10px 14px" }}>
                                <select
                                  className="h-st-sel"
                                  value={b.status}
                                  style={{ color: statusColors[b.status]?.color ?? "#888" }}
                                  onChange={e => handleBookingStatus(id, e.target.value)}
                                >
                                  {["pending", "confirmed", "completed", "cancelled"].map(s => (
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

              {/* Rooms panel */}
              <div style={{ background: "#111720", border: "1px solid #2a2f3e", borderRadius: 2 }}>
                <div style={{ padding: "17px 22px", borderBottom: "1px solid #2a2f3e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a96e" }}>Room Listings</div>
                  <button className="h-btn h-gold" onClick={() => setShowModal(true)}>+ Add Room</button>
                </div>
                <div style={{ padding: 14, maxHeight: 420, overflowY: "auto" }}>
                  {loading ? (
                    [1,2,3].map(i => <Skeleton key={i} h={70} mb={10} />)
                  ) : rooms.length === 0 ? (
                    <div style={{ padding: 36, textAlign: "center" }}>
                      <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".15em", color: "#2a2f3e", marginBottom: 14 }}>NO ROOMS YET</div>
                      <button className="h-btn h-gold" onClick={() => setShowModal(true)}>+ Add First Room</button>
                    </div>
                  ) : rooms.map((r, i) => (
                    <div key={r.room_id ?? i} className="h-room-card">
                      <div style={{ fontSize: 24 }}>🛏️</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{r.room_type}</div>
                          <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, color: "#c9a96e" }}>
                            ৳{parseFloat(r.price ?? 0).toLocaleString()}/night
                          </div>
                        </div>
                        <div className="h-pbar"><div className="h-pfill" style={{ width: "100%" }} /></div>
                        <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".12em", color: "#3a3f50", textTransform: "uppercase" }}>
                          {r.total_rooms} rooms · Hotel #{r.hotel_id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LISTINGS TAB ── */}
          {activeTab === "listings" && (
            <div className="fade" style={{ display: "grid", gap: 14 }}>
              {loading ? [1,2].map(i => <Skeleton key={i} h={110} />) :
              hotels.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", fontFamily: "'Josefin Sans',sans-serif", fontSize: 11, letterSpacing: ".15em", color: "#2a2f3e" }}>
                  NO HOTELS REGISTERED
                </div>
              ) : hotels.map((h, i) => (
                <div key={h.hotel_id ?? i} style={{ background: "#111720", border: "1px solid #2a2f3e", borderRadius: 2, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 3 }}>{h.name}</div>
                      <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, color: "#555" }}>📍 {h.location ?? "Location not set"}</div>
                    </div>
                    <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 8, letterSpacing: ".15em", padding: "3px 9px", background: "#d4f5e2", color: "#1a7a4a", borderRadius: 1 }}>ACTIVE</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{h.description ?? "No description."}</p>
                  <div style={{ marginTop: 12, fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, color: "#3a3f50", letterSpacing: ".1em" }}>
                    {rooms.filter(r => r.hotel_id === (h.hotel_id ?? h.id)).length} room type(s) · Owner: {user?.full_name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PROFILE TAB — pulls from AuthContext ── */}
          {activeTab === "profile" && (
            <div className="fade" style={{ background: "#111720", border: "1px solid #2a2f3e", borderRadius: 2, padding: 30, maxWidth: 520 }}>
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 22 }}>Owner Profile</div>
              {!user ? (
                <div style={{ color: "#444", fontFamily: "'Josefin Sans',sans-serif", fontSize: 12 }}>No user session found.</div>
              ) : (
                <div style={{ display: "grid", gap: 13 }}>
                  {[
                    ["Full Name",    user.full_name],
                    ["Email",        user.email],
                    ["Phone",        user.phone ?? "—"],
                    ["Role",         user.role],
                    ["Country",      user.country ?? "—"],
                    ["Loyalty Pts",  user.loyalty_points ?? 0],
                    ["Auth Method",  user.auth_provider],
                    ["Joined",       user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", gap: 16, paddingBottom: 11, borderBottom: "1px solid #1a1f2e" }}>
                      <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".2em", color: "#3a3f50", textTransform: "uppercase", width: 100, flexShrink: 0, paddingTop: 2 }}>{label}</div>
                      <div style={{ fontSize: 14 }}>{String(value)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── ADD ROOM MODAL ── */}
        {showModal && (
          <div className="h-overlay" onClick={() => setShowModal(false)}>
            <div className="h-modal" onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 22 }}>Add New Room</div>
              <div style={{ display: "grid", gap: 13 }}>
                {[
                  { label: "Hotel",           field: "hotel_id",    type: "select" },
                  { label: "Room Type",        field: "room_type",   type: "text",   ph: "e.g. Deluxe Suite" },
                  { label: "Total Rooms",      field: "total_rooms", type: "number", ph: "e.g. 10" },
                  { label: "Price / Night (৳)",field: "price",       type: "number", ph: "e.g. 2500" },
                ].map(({ label, field, type, ph }) => (
                  <div key={field}>
                    <div className="h-lbl">{label}</div>
                    {type === "select" ? (
                      <select
                        className="h-inp"
                        value={newRoom[field]}
                        onChange={e => setNewRoom(p => ({ ...p, [field]: e.target.value }))}
                      >
                        <option value="">Select Hotel</option>
                        {hotels.map(h => (
                          <option key={h.hotel_id} value={h.hotel_id}>{h.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="h-inp"
                        type={type}
                        placeholder={ph}
                        value={newRoom[field]}
                        onChange={e => setNewRoom(p => ({ ...p, [field]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                <button className="h-btn h-gold" style={{ flex: 1 }} onClick={handleAddRoom} disabled={saving}>
                  {saving ? "Saving…" : "Add Room"}
                </button>
                <button className="h-btn h-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}