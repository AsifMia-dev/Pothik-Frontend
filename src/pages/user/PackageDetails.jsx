// src/pages/user/PackageDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../Helper/baseUrl.helper";
import Layout from "../../components/Layout";

const PackageDetails = () => {
  const { id } = useParams(); // package_id from URL
  const [packageData, setPackageData] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [spots, setSpots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch package + related data
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        // 1️⃣ Fetch package details
        const resPkg = await api.get(`package/packages/${id}`);
        const pkg = resPkg.data?.data;
        if (!pkg) return;
        setPackageData(pkg);

        // 2️⃣ Fetch package destinations
        const resDest = await api.get(`/packageDestination/package/${id}`);
        const packageDestinations = resDest.data?.data || [];

        if (packageDestinations.length > 0) {
          // 2️⃣ Fetch full destination details
          const destPromises = packageDestinations.map(async (pd) => {
            const resDestDetails = await api.get(`/destination/destinations/${pd.destination_id}`);
            const destination = resDestDetails.data?.data || {};

            return {
              destination_id: pd.destination_id,
              name: destination.name || "Unnamed Destination",
              image: destination.image || "https://via.placeholder.com/400x300?text=No+Image"
            };
          });

          const destinationsData = await Promise.all(destPromises);
          setDestinations(destinationsData);

          // 3️⃣ Fetch spots for each destination
          const spotPromises = packageDestinations.map(async (pd) => {
            const resSpots = await api.get(`spot/destinations/${pd.destination_id}/spots`);
            return (resSpots.data?.data || []).map(spot => ({
              spot_id: spot.spot_id,
              name: spot.name || "Unnamed Spot",
              image: spot.image || "https://via.placeholder.com/400x300?text=No+Image",
              destination_id: pd.destination_id // link spot to its destination
            }));
          });

          const spotsData = (await Promise.all(spotPromises)).flat();
          setSpots(spotsData);

        } else {
          setDestinations([]);
          setSpots([]);
        }

        // 4️⃣ Fetch services for this package
        const resServices = await api.get(`/package/${id}/services`);
        const packageServices = resServices.data?.data || [];

        // Separate services by type
        const hotelServices = packageServices.filter(s => s.service_type === "hotel");
        const transportServices = packageServices.filter(s => s.service_type === "transport");
        const guideServices = packageServices.filter(s => s.service_type === "guide");

        // 5️⃣ Fetch detailed info for each service type
        const hotelPromises = hotelServices.map(async (h) => {
          const res = await api.get(`/hotels/${h.service_id}`);
          return res.data?.data || null;
        });

        const transportPromises = transportServices.map(async (t) => {
          const res = await api.get(`/transports/${t.service_id}`);
          return res.data?.data || null;
        });

        const guidePromises = guideServices.map(async (g) => {
          const res = await api.get(`/guides/${g.service_id}`);
          return res.data?.data || null;
        });

        const hotelsData = (await Promise.all(hotelPromises)).filter(Boolean);
        const transportsData = (await Promise.all(transportPromises)).filter(Boolean);
        const guidesData = (await Promise.all(guidePromises)).filter(Boolean);

        // 6️⃣ Set state
        setServices(packageServices); // all services
        setHotels(hotelsData);       // detailed hotel info
        setTransports(transportsData); // detailed transport info
        setGuides(guidesData);       // detailed guide info

      } catch (err) {
        console.error("Failed to fetch package details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <Layout><p className="text-center mt-10">Loading package details...</p></Layout>;
  if (!packageData) return <Layout><p className="text-center mt-10">Package not found</p></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">

        {/* Package Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={packageData.image ? `http://localhost:5000/uploads/${packageData.image}` : 'https://via.placeholder.com/600x400'}
            alt={packageData.name}
            className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{packageData.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{packageData.description}</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Duration: {packageData.duration_days} days
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Starts: {formatDate(packageData.Start_Date)}
              </p>
            </div>

            {/* Booking button */}
            <div className="mt-4">
              <Link
                to={`/booking/${id}`}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Destinations */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div key={dest.destination_id} className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700">
                <img
                  src={dest.image ? `http://localhost:5000/uploads/${dest.image}` : 'https://via.placeholder.com/400x300'}
                  alt={dest.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spots */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Spots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <div key={spot.spot_id} className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700">
                <img
                  src={spot.image ? `http://localhost:5000/uploads/${spot.image}` : 'https://via.placeholder.com/400x300'}
                  alt={spot.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{spot.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          {services.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No services added for this package.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div key={srv.service_id} className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-bold capitalize">{srv.type}</h3>
                  {srv.type === "hotel" && (
                    <p>{srv.name} - {srv.location}</p>
                  )}
                  {srv.type === "transport" && (
                    <p>{srv.name} - {srv.vehicle_type}</p>
                  )}
                  {srv.type === "guide" && (
                    <p>{srv.name} - {srv.expertise}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default PackageDetails;
