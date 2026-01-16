import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../Helper/baseUrl.helper";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image";

const SpotDetails = () => {
  const { destinationId } = useParams(); // 🔥 comes from URL
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        console.log("Fetching spots for destination:", destinationId);

        const res = await api.get(
          `spot/destinations/${destinationId}/spots`
        );

        setSpots(res.data?.spots || []);
      } catch (error) {
        console.error("Failed to fetch spots:", error);
        setSpots([]);
      } finally {
        setLoading(false);
      }
    };

    if (destinationId) {
      fetchSpots();
    }
  }, [destinationId]);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-center mb-8">
          Tourist Spots
        </h1>

        {loading ? (
          <p className="text-center text-slate-500">
            Loading spots...
          </p>
        ) : spots.length === 0 ? (
          <p className="text-center text-slate-500">
            No spots found for this destination.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <div
                key={spot.spot_id}
                className="rounded-xl overflow-hidden shadow-md bg-[#034D41] dark:bg-[#034D41] border border-border-light dark:border-border-dark"
              >
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      spot.image
                        ? `http://localhost:5000/uploads/${spot.image}`
                        : FALLBACK_IMAGE
                    })`,
                  }}
                ></div>

                <div className="p-4">
                  <h3 className="text-lg font-bold">
                    {spot.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {spot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SpotDetails;
