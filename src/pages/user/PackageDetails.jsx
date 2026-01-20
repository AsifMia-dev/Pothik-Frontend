// src/pages/user/PackageDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../Helper/baseUrl.helper";

const PackageDetails = () => {
  const { id } = useParams();

  const [packageInfo, setPackageInfo] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [services, setServices] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [transports, setTransports] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "0";
    return parseFloat(price).toLocaleString("en-BD");
  };

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch package info
        const resPackage = await api.get(`/package/packages/${id}`);
        const pkg = resPackage.data?.data;
        if (!pkg) throw new Error("Package not found");
        setPackageInfo(pkg);

        // 2️⃣ Fetch destinations (with spots included)
        const resDest = await api.get(`/packageDestination/package/${id}`);
        const packageDestinations = resDest.data?.data || [];

        if (packageDestinations.length > 0) {
          const destPromises = packageDestinations.map(async (pd) => {
            const resDestDetails = await api.get(`/destination/destinations/${pd.destination_id}`);
            const destination = resDestDetails.data?.destination || {};

            return {
              destination_id: destination.destination_id,
              name: destination.name || "Unnamed Destination",
              image: destination.image || "https://via.placeholder.com/400x300?text=No+Image",
              spots: (destination.spots || []).map(spot => ({
                spot_id: spot.spot_id,
                name: spot.name || "Unnamed Spot",
                image: spot.image || "https://via.placeholder.com/150",
                description: spot.description || ""
              }))
            };
          });

          const destinationsData = await Promise.all(destPromises);
          setDestinations(destinationsData);
        }

        // 3️⃣ Fetch all services for this package
        const resServices = await api.get(`/service/package/${id}`);
        const packageServices = resServices.data?.data || [];
        setServices(packageServices);

        // Separate by type
        const hotelServices = packageServices.filter(s => s.service_type === "hotel");
        const transportServices = packageServices.filter(s => s.service_type === "transport");
        const guideServices = packageServices.filter(s => s.service_type === "guide");

        // 4️⃣ Fetch detailed info for each service
        const hotelPromises = hotelServices.map(async (h) => {
          const res = await api.get(`/hotel/hotels/${h.service_id}`);
          return res.data || null;
        });

        const transportPromises = transportServices.map(async (t) => {
          const res = await api.get(`/transport/transports/${t.service_id}`);
          return res.data?.transport || null; // <-- fix here
        });

        const guidePromises = guideServices.map(async (g) => {
          const res = await api.get(`/guide/guides/${g.service_id}`);
          return res.data || null;
        });

        const hotelsData = (await Promise.all(hotelPromises)).filter(Boolean);
        const transportsData = (await Promise.all(transportPromises)).filter(Boolean);
        const guidesData = (await Promise.all(guidePromises)).filter(Boolean);

        setHotels(hotelsData);
        setTransports(transportsData);
        setGuides(guidesData);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch package details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading package details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!packageInfo) return <p className="text-center mt-10">Package not found.</p>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Package Image with Name Overlay */}
        <div className="relative w-full h-80 rounded-xl overflow-hidden">
          <img
            src={packageInfo.image 
              ? `http://localhost:5000/uploads/${packageInfo.image}`
              : "https://via.placeholder.com/1200x500?text=No+Image"}
            alt={packageInfo.name}
            className="w-full h-full object-cover"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white bg-black/40">
            {packageInfo.name}
          </h1>
        </div>

        {/* Package Information */}
        <div className="flex flex-col gap-6">
          <div className="p-4 border rounded-lg bg-white dark:bg-card-dark">
            <h2 className="text-xl font-bold mb-2">Package Information</h2>
            <p><strong>Duration:</strong> {packageInfo.duration_days || "N/A"} days</p>
            <p><strong>Start Date:</strong> {formatDate(packageInfo.Start_Date)}</p>
            <p><strong>Description:</strong> {packageInfo.description || "No description available."}</p>
          </div>

          {/* Destinations & Spots */}
          {destinations.map(dest => (
            <div key={dest.destination_id} className="p-4 border rounded-lg bg-white dark:bg-card-dark">
              <h2 className="text-xl font-bold mb-2">Destination: {dest.name}</h2>
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dest.spots.map(spot => (
                  <div key={spot.spot_id} className="flex flex-col items-center">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <span className="text-sm mt-1">{spot.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hotels */}
            <div className="p-4 border rounded-lg bg-white dark:bg-card-dark">
              <h2 className="text-xl font-bold mb-2">Hotels</h2>
              {hotels.length > 0 ? hotels.map(h => (
                <div key={h.hotel_id} className="mb-4">
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-sm">{h.location}</p>
                </div>
              )) : <p>No hotels available</p>}
            </div>

            {/* Transports */}
            <div className="p-4 border rounded-lg bg-white dark:bg-card-dark">
              <h2 className="text-xl font-bold mb-2">Transports</h2>
              {transports.length > 0 ? transports.map(t => (
                <div key={t.transport_id} className="mb-4">
                  <p className="font-semibold">{t.vehicle_type} - {t.model}</p>
                  <p className="text-sm">Capacity: {t.capacity}</p>
                </div>
              )) : <p>No transport services available</p>}
            </div>

            {/* Guides */}
            <div className="p-4 border rounded-lg bg-white dark:bg-card-dark">
              <h2 className="text-xl font-bold mb-2">Guides</h2>
              {guides.length > 0 ? guides.map(g => (
                <div key={g.guide_id} className="mb-4">
                  <p className="font-semibold">{g.full_name}</p>
                  <p className="text-sm">{g.experience} years experience</p>
                </div>
              )) : <p>No guides available</p>}
            </div>
          </div>
        </div>

        {/* Price & Booking */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-3xl font-bold text-primary">
            ৳{formatPrice(packageInfo.base_price)}
          </div>
          <Link
            to={`/booking/${packageInfo.package_id}`}
            className="px-6 py-3 bg-[#034D41] text-white font-bold rounded-lg hover:bg-primary/90 transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PackageDetails;
