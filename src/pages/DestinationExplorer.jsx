import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import api from "../Helper/baseUrl.helper";

const DestinationExplorer = () => {
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get("/destination/destinations");
        const destinationsData = res.data?.destinations || [];
        setDestinations(destinationsData);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="flex flex-col items-center gap-6">

          {/* Header */}
          <div className="text-center w-full max-w-3xl">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Explore Amazing Destinations
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Discover places to visit in Bangladesh
            </p>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark px-4 py-2 focus:ring-2 focus:ring-primary outline-none shadow-sm transition"
          />

          {/* Loading / Empty / Cards */}
          {loading ? (
            <p className="text-center text-slate-500 mt-8">Loading destinations...</p>
          ) : filteredDestinations.length === 0 ? (
            <p className="text-center text-slate-500 mt-8">No destinations found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 justify-center">
              {filteredDestinations.map((destination) => (
                <Card
                  key={destination.destination_id}
                  name={destination.name}
                  description={destination.description}
                  image={
                    destination.image
                      ? `http://localhost:5000/uploads/${destination.image}`
                      : null
                  }
                  spots={destination.spots || []}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default DestinationExplorer;
