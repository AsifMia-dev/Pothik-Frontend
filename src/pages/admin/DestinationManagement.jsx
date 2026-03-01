import React, { useEffect, useState } from "react";
import api from "../../Helper/baseUrl.helper";

const DestinationManagement = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("destinations");

  // Destination state
  const [destinations, setDestinations] = useState([]);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinationPage, setDestinationPage] = useState(1);
  const destinationsPerPage = 5;

  // Spot state
  const [spots, setSpots] = useState([]);
  const [spotSearch, setSpotSearch] = useState("");
  const [spotPage, setSpotPage] = useState(1);
  const spotsPerPage = 5;

  // Form state for destination
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [destinationForm, setDestinationForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Form state for spot
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [spotForm, setSpotForm] = useState({
    name: "",
    description: "",
    image: "",
    destination_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch destinations
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/destination/destinations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestinations(res.data?.destinations || []);
    } catch (err) {
      console.error("Fetch destinations error:", err);
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch spots
  const fetchSpots = async () => {
    setLoading(true);
    try {
      const res = await api.get("/spot/spots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpots(res.data?.spots || []);
    } catch (err) {
      console.error("Fetch spots error:", err);
      setError("Failed to load spots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchSpots();
  }, []);

  // Filter destinations
  const filteredDestinations = destinations.filter((d) =>
    d.name?.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  // Pagination for destinations
  const totalDestinationPages = Math.ceil(filteredDestinations.length / destinationsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (destinationPage - 1) * destinationsPerPage,
    destinationPage * destinationsPerPage
  );

  // Filter spots
  const filteredSpots = spots.filter((s) =>
    s.name?.toLowerCase().includes(spotSearch.toLowerCase())
  );

  // Pagination for spots
  const totalSpotPages = Math.ceil(filteredSpots.length / spotsPerPage);
  const paginatedSpots = filteredSpots.slice(
    (spotPage - 1) * spotsPerPage,
    spotPage * spotsPerPage
  );

  // Handle destination submit
  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    if (!destinationForm.name) return alert("Name is required!");

    try {
      if (editingDestination) {
        await api.put(
          `/destination/destinations/${editingDestination.destination_id}`,
          destinationForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post("/destination/destinations", destinationForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowDestinationModal(false);
      setEditingDestination(null);
      setDestinationForm({ name: "", description: "", image: "" });
      fetchDestinations();
    } catch (err) {
      alert("Failed to save destination");
    }
  };

  // Handle spot submit
  const handleSpotSubmit = async (e) => {
    e.preventDefault();
    if (!spotForm.name || !spotForm.destination_id) return alert("Name and destination are required!");

    try {
      if (editingSpot) {
        await api.put(`/spot/spots/${editingSpot.spot_id}`, spotForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/spot/destinations/${spotForm.destination_id}/spots`, spotForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowSpotModal(false);
      setEditingSpot(null);
      setSpotForm({ name: "", description: "", image: "", destination_id: "" });
      fetchSpots();
    } catch (err) {
      alert("Failed to save spot");
    }
  };

  // Delete destination
  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      await api.delete(`/destination/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDestinations();
    } catch (err) {
      alert("Failed to delete destination");
    }
  };

  // Delete spot
  const handleDeleteSpot = async (id) => {
    if (!window.confirm("Are you sure you want to delete this spot?")) return;
    try {
      await api.delete(`/spot/spots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSpots();
    } catch (err) {
      alert("Failed to delete spot");
    }
  };

  // Edit destination
  const handleEditDestination = (destination) => {
    setEditingDestination(destination);
    setDestinationForm({
      name: destination.name,
      description: destination.description || "",
      image: destination.image || "",
    });
    setShowDestinationModal(true);
  };

  // Edit spot
  const handleEditSpot = (spot) => {
    setEditingSpot(spot);
    setSpotForm({
      name: spot.name,
      description: spot.description || "",
      image: spot.image || "",
      destination_id: spot.destination_id,
    });
    setShowSpotModal(true);
  };

  // Format ID
  const formatId = (prefix, id) => `${prefix}-${String(id).padStart(3, "0")}`;

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Destination & Spot Management
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("destinations")}
          className={`px-6 py-2.5 rounded-lg font-medium transition ${activeTab === "destinations"
              ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
        >
          Manage Destinations
        </button>
        <button
          onClick={() => setActiveTab("spots")}
          className={`px-6 py-2.5 rounded-lg font-medium transition ${activeTab === "spots"
              ? "bg-gray-200 dark:bg-gray-700 text-cyan-500"
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
        >
          Manage Spots
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Destinations Tab */}
      {activeTab === "destinations" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Search & Add */}
          <div className="p-6 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={destinationSearch}
                  onChange={(e) => {
                    setDestinationSearch(e.target.value);
                    setDestinationPage(1);
                  }}
                  className="pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button className="p-2.5 border rounded-lg dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <span>☰</span>
              </button>
            </div>
            <button
              onClick={() => {
                setEditingDestination(null);
                setDestinationForm({ name: "", description: "", image: "" });
                setShowDestinationModal(true);
              }}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
            >
              <span>+</span> Add New Destination
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p className="p-6 text-center text-blue-500">Loading destinations...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Destination ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Destination Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Number of Spots
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {paginatedDestinations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No destinations found
                      </td>
                    </tr>
                  ) : (
                    paginatedDestinations.map((dest) => (
                      <tr key={dest.destination_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                          {formatId("D", dest.destination_id)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white font-semibold">
                          {dest.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                          {dest.spots?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEditDestination(dest)}
                            className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDestination(dest.destination_id)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredDestinations.length > 0 && (
            <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing <strong>{(destinationPage - 1) * destinationsPerPage + 1}</strong> to{" "}
                <strong>{Math.min(destinationPage * destinationsPerPage, filteredDestinations.length)}</strong> of{" "}
                <strong>{filteredDestinations.length}</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDestinationPage(Math.max(1, destinationPage - 1))}
                  disabled={destinationPage === 1}
                  className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalDestinationPages, 3) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setDestinationPage(page)}
                    className={`px-3 py-1.5 rounded-lg ${destinationPage === page
                        ? "bg-cyan-500 text-white"
                        : "border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setDestinationPage(Math.min(totalDestinationPages, destinationPage + 1))}
                  disabled={destinationPage === totalDestinationPages}
                  className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Spots Tab */}
      {activeTab === "spots" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Search & Add */}
          <div className="p-6 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search spots..."
                  value={spotSearch}
                  onChange={(e) => {
                    setSpotSearch(e.target.value);
                    setSpotPage(1);
                  }}
                  className="pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button className="p-2.5 border rounded-lg dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <span>☰</span>
              </button>
            </div>
            <button
              onClick={() => {
                setEditingSpot(null);
                setSpotForm({ name: "", description: "", image: "", destination_id: "" });
                setShowSpotModal(true);
              }}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
            >
              <span>+</span> Add New Spot
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p className="p-6 text-center text-blue-500">Loading spots...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Spot ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Spot Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {paginatedSpots.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No spots found
                      </td>
                    </tr>
                  ) : (
                    paginatedSpots.map((spot) => (
                      <tr key={spot.spot_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                          {formatId("S", spot.spot_id)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white font-semibold">
                          {spot.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {spot.destination?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEditSpot(spot)}
                            className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSpot(spot.spot_id)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredSpots.length > 0 && (
            <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing <strong>{(spotPage - 1) * spotsPerPage + 1}</strong> to{" "}
                <strong>{Math.min(spotPage * spotsPerPage, filteredSpots.length)}</strong> of{" "}
                <strong>{filteredSpots.length}</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSpotPage(Math.max(1, spotPage - 1))}
                  disabled={spotPage === 1}
                  className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalSpotPages, 3) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setSpotPage(page)}
                    className={`px-3 py-1.5 rounded-lg ${spotPage === page
                        ? "bg-cyan-500 text-white"
                        : "border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setSpotPage(Math.min(totalSpotPages, spotPage + 1))}
                  disabled={spotPage === totalSpotPages}
                  className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Destination Modal */}
      {showDestinationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </h2>
            <form onSubmit={handleDestinationSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Destination Name"
                value={destinationForm.name}
                onChange={(e) => setDestinationForm({ ...destinationForm, name: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={destinationForm.description}
                onChange={(e) => setDestinationForm({ ...destinationForm, description: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={destinationForm.image}
                onChange={(e) => setDestinationForm({ ...destinationForm, image: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-lg font-medium"
                >
                  {editingDestination ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDestinationModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2.5 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spot Modal */}
      {showSpotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              {editingSpot ? "Edit Spot" : "Add New Spot"}
            </h2>
            <form onSubmit={handleSpotSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Spot Name"
                value={spotForm.name}
                onChange={(e) => setSpotForm({ ...spotForm, name: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <select
                value={spotForm.destination_id}
                onChange={(e) => setSpotForm({ ...spotForm, destination_id: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">Select Destination</option>
                {destinations.map((d) => (
                  <option key={d.destination_id} value={d.destination_id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Description"
                rows="3"
                value={spotForm.description}
                onChange={(e) => setSpotForm({ ...spotForm, description: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={spotForm.image}
                onChange={(e) => setSpotForm({ ...spotForm, image: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-lg font-medium"
                >
                  {editingSpot ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSpotModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2.5 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationManagement