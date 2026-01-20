import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PackageCard from "../../components/Layout-componets/PackageCard";
import api from "../../Helper/baseUrl.helper";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [duration, setDuration] = useState("");

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const timestamp = new Date().getTime();
        const res = await api.get(`/package/packages?ts=${timestamp}`);
        
        // Your API returns: { success: true, count: 1, data: [...] }
        const packagesData = res.data?.data || [];
        
        console.log('Packages loaded:', packagesData.length);
        setPackages(packagesData);
        
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setError(error.response?.data?.message || error.message || "Failed to load packages");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter logic
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = search
      ? pkg.name?.toLowerCase().includes(search.toLowerCase())
      : true;

    const days = Number(pkg.duration_days) || 0;
    const matchesDuration =
      duration === "3-5 Days"
        ? days >= 3 && days <= 5
        : duration === "1 Week"
        ? days >= 6 && days <= 7
        : duration === "2+ Weeks"
        ? days > 7
        : true;

    return matchesSearch && matchesDuration;
  });

  const clearFilters = () => {
    setSearch("");
    setDuration("");
  };

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
                    className="w-full rounded-lg border border-border-light dark:border-border-dark px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Duration */}
                <div className="mb-6 border-t border-border-light dark:border-border-dark pt-6">
                  <h4 className="text-base font-bold text-text-headings-light dark:text-text-headings-dark mb-3">
                    Duration
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
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

                {/* Clear Filters */}
                <div className="border-t border-border-light dark:border-border-dark pt-6 flex flex-col gap-3">
                  <button
                    onClick={clearFilters}
                    className="w-full border border-border-light dark:border-border-dark rounded-lg h-11
                    bg-background-light dark:bg-background-dark/50 text-text-body-light dark:text-text-body-dark 
                    hover:bg-border-light/50 dark:hover:bg-border-dark/50 transition"
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
              <div className="text-center mt-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">Loading packages...</p>
              </div>
            ) : error ? (
              <div className="text-center mt-8 p-8 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-lg text-red-600 dark:text-red-400 font-semibold">Error Loading Packages</p>
                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{error}</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center mt-8 p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">No packages available</p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Please check back later</p>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center mt-8 p-8">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">No packages match your filters</p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">Try adjusting or clearing your search criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.package_id}
                    packageId={pkg.package_id}
                    title={pkg.name}
                    description={pkg.description}
                    image={pkg.image}
                    price={pkg.base_price}
                    days={pkg.duration_days}
                    startDate={pkg.Start_Date}
                    capacity={pkg.capacity} // ✅ pass capacity prop
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
