import React, { useEffect, useState } from "react";
import Card from "../components/DestinationCard";
import Layout from "../components/Layout";
import api from "../Helper/baseUrl.helper";

const ITEMS_PER_PAGE = 6;

const DestinationExplorer = () => {
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Pagination derived values ─────────────────────────────────────────────
  const totalPages       = Math.max(1, Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE));
  const safePage         = Math.min(currentPage, totalPages);
  const startIndex       = (safePage - 1) * ITEMS_PER_PAGE;
  const currentItems     = filteredDestinations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, totalPages, safePage]);
    if (safePage - 1 > 1)          pages.add(safePage - 1);
    if (safePage + 1 < totalPages)  pages.add(safePage + 1);

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  };

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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 justify-center">
                {currentItems.map((destination) => (
                  <Card
                    key={destination.destination_id}
                    destinationId={destination.destination_id}
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

              {/* Results count */}
              <p className="text-sm text-slate-500">
                Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredDestinations.length)} of {filteredDestinations.length} destinations
              </p>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2 pb-6">

                  {/* LEFT */}
                  <button
                    disabled={safePage === 1}
                    onClick={() => goToPage(safePage - 1)}
                    className={`flex size-10 items-center justify-center rounded-full transition-colors
                      ${safePage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-slate-200 dark:hover:bg-slate-800"}`}
                  >
                    <svg className={`w-5 h-5 ${safePage === 1 ? "text-slate-400" : "text-slate-600 dark:text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* PAGE NUMBERS */}
                  {getPageNumbers().map((item, idx) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="text-sm font-medium flex size-10 items-center justify-center text-slate-500 dark:text-slate-400 rounded-full"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goToPage(item)}
                        className={`text-sm font-bold flex size-10 items-center justify-center rounded-full transition-colors
                          ${item === safePage
                            ? "text-white bg-primary"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  {/* RIGHT */}
                  <button
                    disabled={safePage === totalPages}
                    onClick={() => goToPage(safePage + 1)}
                    className={`flex size-10 items-center justify-center rounded-full transition-colors
                      ${safePage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-slate-200 dark:hover:bg-slate-800"}`}
                  >
                    <svg className={`w-5 h-5 ${safePage === totalPages ? "text-slate-400" : "text-slate-600 dark:text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                </div>
              )}
            </>
          )}

        </section>
      </div>
    </Layout>
  );
};

export default DestinationExplorer;