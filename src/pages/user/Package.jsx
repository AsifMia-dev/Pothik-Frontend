import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PackageCard from "../../components/Layout-componets/PackageCard"; // create this like DestinationCard
import api from "../../Helper/baseUrl.helper";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState([500, 2500]); // min-max default
  const [duration, setDuration] = useState("1 Week");

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/packages");
        const packagesData = res.data?.data || [];
        setPackages(packagesData);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages based on search, budget, and duration
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(search.toLowerCase());
    const matchesBudget = pkg.price >= budget[0] && pkg.price <= budget[1];
    const matchesDuration =
      (duration === "3-5 Days" && pkg.days >= 3 && pkg.days <= 5) ||
      (duration === "1 Week" && pkg.days >= 6 && pkg.days <= 7) ||
      (duration === "2+ Weeks" && pkg.days > 7);

    return matchesSearch && matchesBudget && matchesDuration;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Heading */}
        <div className="mb-10 flex flex-wrap justify-between gap-4 items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-text-headings-light dark:text-text-headings-dark">
              Find Your Next Adventure
            </h1>
            <p className="text-lg text-text-body-light dark:text-text-body-dark">
              Explore our curated travel packages and find the perfect getaway.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-8">
              {/* Search */}
              <div className="bg-white dark:bg-background-dark/50 p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                <h3 className="text-lg font-bold text-text-headings-light dark:text-text-headings-dark mb-6">
                  Filter By
                </h3>

                {/* Keyword Search */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search by keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-border-light dark:border-border-dark px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Budget */}
                <div className="mb-6 border-t border-border-light dark:border-border-dark pt-6">
                  <p className="text-base font-bold text-text-headings-light dark:text-text-headings-dark mb-2">Budget</p>
                  <input
                    type="range"
                    min="500"
                    max="2500"
                    value={budget[1]}
                    onChange={(e) => setBudget([budget[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-text-body-light dark:text-text-body-dark mt-1">
                    <span>${budget[0]}</span>
                    <span>${budget[1]}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6 border-t border-border-light dark:border-border-dark pt-6">
                  <h4 className="text-base font-bold text-text-headings-light dark:text-text-headings-dark mb-3">
                    Duration
                  </h4>
                  <div className="space-y-2 text-sm">
                    {["3-5 Days", "1 Week", "2+ Weeks"].map((d) => (
                      <label key={d} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="duration"
                          checked={duration === d}
                          onChange={() => setDuration(d)}
                          className="form-radio text-primary"
                        />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-border-light dark:border-border-dark pt-6 flex flex-col gap-3">
                  <button
                    onClick={() => {}}
                    className="w-full bg-primary text-white h-11 rounded-lg font-bold hover:bg-primary/90 transition"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setSearch("");
                      setBudget([500, 2500]);
                      setDuration("1 Week");
                    }}
                    className="w-full border border-border-light dark:border-border-dark rounded-lg h-11 bg-background-light dark:bg-background-dark/50 text-text-body-light dark:text-text-body-dark hover:bg-border-light/50 dark:hover:bg-border-dark/50 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Package Cards */}
          <div className="lg:col-span-9">
            {loading ? (
              <p className="text-center mt-8">Loading packages...</p>
            ) : filteredPackages.length === 0 ? (
              <p className="text-center mt-8">No packages found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    packageId={pkg.id}
                    title={pkg.title}
                    location={pkg.location}
                    description={pkg.description}
                    image={pkg.image || "https://via.placeholder.com/400x300"}
                    price={pkg.price}
                    days={pkg.days}
                    nights={pkg.nights}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Packages;
