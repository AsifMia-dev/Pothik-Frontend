import React, { useEffect, useState, useRef } from "react";
import Card from "../../components/DestinationCard";
import api from "../../Helper/baseUrl.helper";

const TopDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

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

  // Responsive visible count
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640)       setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else                               setVisibleCount(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // Clamp currentIndex when visibleCount changes
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, destinations.length - visibleCount)));
  }, [visibleCount, destinations.length]);

  const maxIndex  = Math.max(0, destinations.length - visibleCount);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  if (loading) {
    return <p className="text-center text-slate-500 py-10">Loading destinations...</p>;
  }

  if (destinations.length === 0) {
    return <p className="text-center text-slate-500 py-10">No destinations found.</p>;
  }

  // Gap between cards in px
  const GAP = 24;

  return (
    <section className="py-14">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
        Explore Top Destinations
      </h2>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">

          {/* Prev Button */}
          <button
            onClick={prev}
            disabled={!canGoPrev}
            className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center transition
              ${canGoPrev ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider Window */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                gap: `${GAP}px`,
                transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount} + ${GAP / visibleCount}px)))`,
              }}
            >
              {destinations.map((destination) => (
                <div
                  key={destination.destination_id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / visibleCount}% - ${(GAP * (visibleCount - 1)) / visibleCount}px)`,
                  }}
                >
                  <Card
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
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={next}
            disabled={!canGoNext}
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center transition
              ${canGoNext ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        {destinations.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-primary w-5"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2"
                }`}
              />
            ))}
          </div>
        )}
        {/* View All Link */}
        <div className="flex justify-center mt-8">
          <a
            href="/destinations"
            className="px-6 py-2.5 border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
          >
            View All Destinations →
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopDestination;