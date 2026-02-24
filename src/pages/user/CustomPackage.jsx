import React, { useState, useEffect } from "react";
import {
  Calendar, Users, MapPin, Car, Bus, Bike,
  Hotel, UserCheck, ChevronDown, Plus, Minus, Check, Loader2,
  X, BedDouble, Building2,
} from "lucide-react";
import api from "../../Helper/baseUrl.helper";

// ─── helpers ─────────────────────────────────────────────────────────────────
const calcNights = (start, end) => {
  if (!start || !end) return 0;
  return Math.max(0, Math.floor((new Date(end) - new Date(start)) / 86400000));
};

// ─── Room Selection Modal ─────────────────────────────────────────────────────
const RoomModal = ({ hotel, onSelect, onClose, selectedRoomId, nights }) => {
  if (!hotel) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{hotel.name}</h3>
            <p className="text-xs text-gray-400">{hotel.location} · {hotel.description}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* rooms */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Select Room Type</p>
          {hotel.HotelRooms?.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No rooms available</p>
          ) : (
            hotel.HotelRooms?.map((room) => {
              const active = selectedRoomId === room.room_id;
              const price  = Number(room.price || 0);
              return (
                <button
                  key={room.room_id}
                  onClick={() => onSelect(room)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${
                    active
                      ? "bg-emerald-50 border-emerald-600"
                      : "bg-gray-50 border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <BedDouble className={`w-5 h-5 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{room.room_type}</p>
                      <p className="text-xs text-gray-400">{room.total_rooms} rooms available</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700">
                      ৳{Number(price).toLocaleString()}
                      <span className="text-xs font-normal text-gray-400">/night</span>
                    </p>
                    {nights > 0 && (
                      <p className="text-xs text-gray-400">৳{(price * nights).toLocaleString()} total</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

// ─── component ───────────────────────────────────────────────────────────────
const CustomPackage = () => {

  /* remote data */
  const [destinations, setDestinations] = useState([]);
  const [transports,   setTransports]   = useState([]);
  const [allHotels,    setAllHotels]    = useState([]);
  const [guides,       setGuides]       = useState([]);

  /* loading */
  const [loadDest,      setLoadDest]      = useState(true);
  const [loadTransport, setLoadTransport] = useState(true);
  const [loadHotels,    setLoadHotels]    = useState(true);
  const [loadGuides,    setLoadGuides]    = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [submitError,   setSubmitError]   = useState("");

  /* form */
  const [startDate,          setStartDate]          = useState("");
  const [endDate,            setEndDate]            = useState("");
  const [adults,             setAdults]             = useState(2);
  const [children,           setChildren]           = useState(0);
  const [destId,             setDestId]             = useState("");
  const [selectedSpotNames,  setSelectedSpotNames]  = useState([]);
  const [transportId,        setTransportId]        = useState("");
  const [hotelId,            setHotelId]            = useState("");
  const [selectedRoom,       setSelectedRoom]       = useState(null);
  const [guideId,            setGuideId]            = useState("");

  /* modal */
  const [modalHotel, setModalHotel] = useState(null);

  /* fetch destinations */
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/destination/destinations");
        setDestinations(res.data?.destinations || []);
      } catch (e) { console.error(e); }
      finally { setLoadDest(false); }
    };
    run();
  }, []);

  /* fetch transports */
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/transport/transports");
        const data = res.data?.transports || [];
        setTransports(data.map(({ User, ...rest }) => rest));
      } catch (e) { console.error(e); }
      finally { setLoadTransport(false); }
    };
    run();
  }, []);

  /* fetch all hotels once */
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/hotel/hotels");
        setAllHotels(res.data?.hotels || res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoadHotels(false); }
    };
    run();
  }, []);

  /* fetch guides */
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/guide/guides");
        setGuides(res.data?.guides || res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoadGuides(false); }
    };
    run();
  }, []);

  /* reset spots + hotel when destination changes */
  const handleDestChange = (id) => {
    setDestId(id);
    setSelectedSpotNames([]);
    setHotelId("");
    setSelectedRoom(null);
  };

  /* deselect transport if already selected */
  const handleTransportClick = (id, tooFew) => {
    if (tooFew) return;
    setTransportId((prev) => prev === id ? "" : id);
  };

  /* deselect hotel if already selected */
  const handleHotelClick = (hotel) => {
    const id = hotel.hotel_id;
    if (hotelId === id) {
      setHotelId("");
      setSelectedRoom(null);
    } else {
      setHotelId(id);
      setSelectedRoom(null);
      setModalHotel(hotel);
    }
  };

  /* room selected from modal */
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  /* derived */
  const nights         = calcNights(startDate, endDate);
  const totalTravelers = adults + children;
  const destObj        = destinations.find((d) => d.destination_id == destId);
  const spots          = destObj?.spots || [];

  /* hotels filtered by selected destination location (or show all if no match) */
  const hotels = destObj
    ? allHotels.filter((h) =>
        h.location?.toLowerCase().includes(destObj.name?.toLowerCase()) ||
        h.destination_id == destId
      )
    : allHotels;

  const hotelObj     = allHotels.find((h) => h.hotel_id === hotelId);
  const transportObj = transports.find((t) => t.transport_id === transportId);
  const guideObj     = guides.find((g) => g.guide_id === guideId);

  const roomPrice      = Number(selectedRoom?.price || 0);
  const transportPrice = Number(transportObj?.price_per_day || 0);
  const guidePrice     = Number(guideObj?.price_per_day || 0);

  const hotelCost   = roomPrice      * nights;
  const vehicleCost = transportPrice * nights;
  const guideCost   = guidePrice     * nights;
  const totalCost   = hotelCost + vehicleCost + guideCost;

  const toggleSpot = (name) =>
    setSelectedSpotNames((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  /* submit */
  const handleSubmit = async () => {
    if (!destId || !startDate || !endDate || nights <= 0) {
      setSubmitError("Please select a destination and valid travel dates.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      await api.post("/package/custom", {
        destinationId:  destId,
        spots:          selectedSpotNames,
        transportId,
        hotelId,
        roomId:         selectedRoom?.room_id,
        guideId,
        guideIncluded:  !!guideId,
        startDate,
        endDate,
        adults,
        children,
        estimatedCost:  totalCost,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* Room Modal */}
      {modalHotel && (
        <RoomModal
          hotel={modalHotel}
          onSelect={handleRoomSelect}
          onClose={() => setModalHotel(null)}
          selectedRoomId={selectedRoom?.room_id}
          nights={nights}
        />
      )}

      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-6xl bg-gray-100 rounded-2xl shadow-xl p-10 space-y-10">

          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Trip Configuration</h2>
            <p className="text-sm text-gray-500">Step-by-step customization for your dream journey</p>
          </div>

          {/* ── Dates & Travelers ── */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Dates */}
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Calendar className="w-4 h-4 text-emerald-600" /> Travel Dates
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Departure", val: startDate, set: setStartDate, icon: "✈️", min: undefined },
                  { label: "Return",    val: endDate,   set: setEndDate,   icon: "🛬", min: startDate || undefined },
                ].map(({ label, val, set, icon, min }) => (
                  <div key={label} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">{icon}</span>
                    <input
                      type="date"
                      value={val}
                      min={min}
                      onChange={(e) => set(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
              {nights > 0 && (
                <p className="text-xs text-emerald-600 font-medium">{nights} night{nights !== 1 ? "s" : ""}</p>
              )}
            </div>

            {/* Travelers */}
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Users className="w-4 h-4 text-emerald-600" /> Travelers
              </p>
              <div className="flex gap-6 items-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm">
                {[
                  { label: "Adults",   val: adults,   set: setAdults,   min: 1 },
                  { label: "Children", val: children, set: setChildren, min: 0 },
                ].map(({ label, val, set, min }, i) => (
                  <div key={label} className={`flex items-center gap-3 ${i > 0 ? "ml-4 pl-4 border-l" : ""}`}>
                    <span className="text-gray-600 w-14">{label}</span>
                    <button onClick={() => set(Math.max(min, val - 1))} className="w-7 h-7 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-semibold">{val}</span>
                    <button onClick={() => set(val + 1)} className="w-7 h-7 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">{totalTravelers} total traveler{totalTravelers !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* ── Destination & Spots ── */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Destination */}
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <MapPin className="w-4 h-4 text-emerald-600" /> Destination
              </p>
              {loadDest ? (
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={destId}
                    onChange={(e) => handleDestChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">— Select a destination —</option>
                    {destinations.map((d) => (
                      <option key={d.destination_id} value={d.destination_id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Spots */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Tourist Spots</p>
              {!destId ? (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 italic">
                  Select a destination first
                </div>
              ) : spots.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 italic">
                  No spots available
                </div>
              ) : (
                <div className="bg-white border border-gray-300 rounded-lg p-3 flex flex-wrap gap-2">
                  {spots.map((spot, i) => {
                    const active = selectedSpotNames.includes(spot.name);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleSpot(spot.name)}
                        className={`text-xs px-3 py-1 rounded-full border transition font-medium ${
                          active
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:border-emerald-400"
                        }`}
                      >
                        {active && <Check className="w-3 h-3 inline mr-1" />}
                        {spot.name}
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedSpotNames.length > 0 && (
                <p className="text-xs text-emerald-600">
                  {selectedSpotNames.length} spot{selectedSpotNames.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {/* ── Transport ── */}
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
              <Car className="w-4 h-4 text-emerald-600" /> Select Vehicle
              {transportId && (
                <span className="ml-auto text-[10px] normal-case text-gray-400 font-normal cursor-pointer hover:text-red-500"
                  onClick={() => setTransportId("")}>
                  ✕ deselect
                </span>
              )}
            </p>
            {loadTransport ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading vehicles…
              </div>
            ) : transports.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No vehicles available</p>
            ) : (
              <div className="space-y-2">
                {transports.map((t) => {
                  const id       = t.transport_id;
                  const active   = transportId === id;
                  const capacity = Number(t.capacity || 0);
                  const tooFew   = capacity > 0 && totalTravelers > capacity;
                  const price    = Number(t.price_per_day || 0);
                  const type     = t.vehicle_type || "";
                  const Icon     = type === "Bike" ? Bike : type === "Microbus" ? Bus : Car;

                  return (
                    <button
                      key={id}
                      onClick={() => handleTransportClick(id, tooFew)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition text-left ${
                        active   ? "bg-emerald-50 border-emerald-600"
                        : tooFew ? "bg-red-50 border-red-200 opacity-60 cursor-not-allowed"
                                 : "bg-white border-gray-200 hover:border-emerald-300 cursor-pointer"
                      }`}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 ${active ? "bg-emerald-100" : tooFew ? "bg-red-100" : "bg-gray-100"}`}>
                        <Icon className={`w-5 h-5 ${active ? "text-emerald-600" : tooFew ? "text-red-400" : "text-gray-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-800">{t.model}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {type}
                          </span>
                          {tooFew && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-500">Too few seats</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{capacity} seats · {t.total_vehicles} available</p>
                      </div>
                      <p className="text-sm font-bold text-emerald-700 flex-shrink-0">
                        ৳{Number(price).toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">/day</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Hotel & Guide ── */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Hotels */}
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Building2 className="w-4 h-4 text-emerald-600" /> Select Hotel
                {!destId && <span className="ml-1 normal-case text-[10px] text-gray-400 font-normal">(select destination first)</span>}
              </p>

              {loadHotels ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading hotels…
                </div>
              ) : !destId ? (
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 italic">
                  Select a destination first
                </div>
              ) : hotels.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No hotels available for this destination</p>
              ) : (
                <div className="space-y-2">
                  {hotels.map((h) => {
                    const id     = h.hotel_id;
                    const active = hotelId === id;
                    const minRoomPrice = h.HotelRooms?.length
                      ? Math.min(...h.HotelRooms.map((r) => Number(r.price || 0)))
                      : 0;

                    return (
                      <button
                        key={id}
                        onClick={() => handleHotelClick(h)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 text-left transition ${
                          active ? "bg-emerald-50 border-emerald-600" : "bg-white border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        {/* hotel icon / image */}
                        <div className={`p-2 rounded-lg flex-shrink-0 ${active ? "bg-emerald-100" : "bg-gray-100"}`}>
                          <Hotel className={`w-5 h-5 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{h.name}</p>
                          <p className="text-xs text-gray-400">{h.location}</p>
                          {active && selectedRoom && (
                            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              {selectedRoom.room_type} selected
                            </span>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          {minRoomPrice > 0 && (
                            <p className="text-sm font-bold text-emerald-700">
                              from ৳{minRoomPrice.toLocaleString()}
                              <span className="text-xs font-normal text-gray-400">/night</span>
                            </p>
                          )}
                          <p className="text-xs text-emerald-600 mt-0.5">
                            {active ? (selectedRoom ? "change room →" : "pick room →") : "view rooms →"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Guide */}
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Tour Guide
                {guideId && (
                  <span
                    className="ml-auto text-[10px] normal-case text-gray-400 font-normal cursor-pointer hover:text-red-500"
                    onClick={() => setGuideId("")}
                  >
                    ✕ deselect
                  </span>
                )}
              </p>

              {loadGuides ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading guides…
                </div>
              ) : guides.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No guides available</p>
              ) : (
                <div className="space-y-2">
                  {guides.map((g) => {
                    const id     = g.guide_id;
                    const active = guideId === id;
                    const price  = Number(g.price_per_day || 0);
                    return (
                      <button
                        key={id}
                        onClick={() => setGuideId((prev) => prev === id ? "" : id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition text-left ${
                          active
                            ? "bg-emerald-50 border-emerald-600"
                            : "bg-white border-gray-200 hover:border-emerald-300 cursor-pointer"
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${active ? "bg-emerald-100" : "bg-gray-100"}`}>
                          <UserCheck className={`w-5 h-5 ${active ? "text-emerald-600" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{g.full_name}</p>
                          <p className="text-xs text-gray-400">{g.experience} yr{g.experience !== 1 ? "s" : ""} experience</p>
                        </div>
                        <p className="text-sm font-bold text-emerald-700 flex-shrink-0">
                          ৳{price.toLocaleString()}
                          <span className="text-xs font-normal text-gray-400">/day</span>
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Summary ── */}
          <div className="bg-gray-200 rounded-xl p-6 flex flex-wrap justify-between items-start gap-6">
            <div className="flex flex-wrap gap-8 text-sm text-gray-600">
              {[
                { label: "Destination", value: destObj?.name },
                { label: "Duration",    value: nights > 0 ? `${nights} Night${nights !== 1 ? "s" : ""}` : null },
                { label: "Travelers",   value: `${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}` },
                { label: "Hotel",       value: hotelObj ? `${hotelObj.name}${selectedRoom ? ` · ${selectedRoom.room_type}` : ""}` : null },
                { label: "Vehicle",     value: transportObj ? `${transportObj.vehicle_type} · ${transportObj.model}` : null },
                guideObj && { label: "Guide", value: guideObj.full_name, green: true },
              ].filter(Boolean).map(({ label, value, green }) => (
                <div key={label}>
                  <p className="text-xs uppercase text-gray-400">{label}</p>
                  <p className={`font-semibold ${green ? "text-emerald-700" : "text-gray-800"}`}>{value || "—"}</p>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Total Estimated Cost</p>
              <p className="text-3xl font-bold text-emerald-600">৳{totalCost > 0 ? totalCost.toLocaleString() : "0"}</p>
              {nights > 0 && totalCost > 0 && (
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  {hotelCost   > 0 && <p>Hotel: ৳{hotelCost.toLocaleString()}</p>}
                  {vehicleCost > 0 && <p>Vehicle: ৳{vehicleCost.toLocaleString()}</p>}
                  {guideCost   > 0 && <p>Guide: ৳{guideCost.toLocaleString()}</p>}
                </div>
              )}
            </div>
          </div>

          {/* error */}
          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {submitError}
            </p>
          )}

          {/* Submit */}
          {submitted ? (
            <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-800 py-5 rounded-xl text-center space-y-1">
              <p className="text-lg font-semibold">🎉 Package Generated Successfully!</p>
              <p className="text-sm">
                Trip to <strong>{destObj?.name}</strong> · {nights} night{nights !== 1 ? "s" : ""} · Total: <strong>৳{totalCost.toLocaleString()}</strong>
              </p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Generating…" : "Generate My Package →"}
            </button>
          )}

        </div>
      </section>
    </>
  );
};

export default CustomPackage;