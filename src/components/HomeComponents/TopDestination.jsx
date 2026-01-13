import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Helper/baseUrl.helper";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x600?text=No+Image";

const TopDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get("/destination/destinations");
        setDestinations(res.data?.destinations || []);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-slate-500 py-10">
        Loading destinations...
      </p>
    );
  }

  return (
    <section className="py-14">
      {/* Section Header */}
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
        Explore Top Destinations
      </h2>

      {/* Centered Scroll Container */}
      <div className="flex justify-center">
        <div className="flex gap-6 overflow-x-auto px-6 max-w-6xl">
          {destinations.map((destination) => (
            <Link
              key={destination.destination_id}
              to={`/destinations/${destination.destination_id}/spots`}
              state={{ destinationName: destination.name }}
              className="group relative min-w-[160px] h-[220px] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition flex-shrink-0"
            >
              {/* Image */}
              <img
                src={
                  destination.image
                    ? `http://localhost:5000/uploads/${destination.image}`
                    : FALLBACK_IMAGE
                }
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Text */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                  {destination.name}
                </h3>
                <p className="text-xs opacity-90">
                  {destination.spots?.length || 0} Spots
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDestination;
