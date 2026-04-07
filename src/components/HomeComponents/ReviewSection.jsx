import React, { useEffect, useState } from "react";
import api from "../../Helper/baseUrl.helper";
import { useNavigate } from "react-router-dom";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch reviews with user names and profile images
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/review");
        setReviews(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Responsive slider
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // Keep currentIndex within bounds
  useEffect(() => {
    setCurrentIndex((i) =>
      Math.min(i, Math.max(0, reviews.length - visibleCount))
    );
  }, [visibleCount, reviews.length]);

  const maxIndex = Math.max(0, reviews.length - visibleCount);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;
  const GAP = 24;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  if (loading) return <p className="text-center py-10">Loading reviews...</p>;
  if (reviews.length === 0) return <p className="text-center py-10">No reviews yet.</p>;

  return (
    <section className="py-14 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
      <div className="container mx-auto px-4">
        <div className="relative">

          {/* Prev Button */}
          <button
            onClick={prev}
            disabled={!canGoPrev}
            className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow border flex items-center justify-center
              ${canGoPrev ? "hover:bg-gray-100" : "opacity-30 cursor-not-allowed"}`}
          >
            ◀
          </button>

          {/* Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{
                gap: `${GAP}px`,
                transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount} + ${GAP / visibleCount}px)))`,
              }}
            >
              {reviews.map((review) => {
                const isOwner = user && user.user_id === review.user_id;
                return (
                  <div
                    key={review.review_id}
                    className={`flex-shrink-0 cursor-${isOwner ? "pointer" : "default"} ${
                      isOwner ? "hover:shadow-lg transition" : ""
                    }`}
                    style={{
                      width: `calc(${100 / visibleCount}% - ${(GAP * (visibleCount - 1)) / visibleCount}px)`,
                    }}
                    onClick={() => {
                      if (isOwner) navigate(`/user/edit-review/${review.review_id}`);
                    }}
                  >
                    <div className="bg-white p-5 rounded-2xl shadow-md h-full flex flex-col justify-between">
                      
                      {/* User Info */}
                      <div className="flex items-center mb-3 gap-3">
                        {review.profile_image ? (
                          <img
                            src={review.profile_image}
                            alt={review.user_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                            {review.user_name?.[0] || "U"}
                          </div>
                        )}
                        <p className="font-semibold text-gray-800">{review.user_name}</p>
                      </div>

                      {/* Rating */}
                      <p className="text-yellow-500 mb-2">{"⭐".repeat(review.rating)}</p>

                      {/* Comment */}
                      <p className="text-gray-700">{review.comment}</p>

                      {/* Edit Hint */}
                      {isOwner && (
                        <p className="text-xs text-gray-400 mt-2">Click to edit your review</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={next}
            disabled={!canGoNext}
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow border flex items-center justify-center
              ${canGoNext ? "hover:bg-gray-100" : "opacity-30 cursor-not-allowed"}`}
          >
            ▶
          </button>
        </div>

        {/* Dots */}
        {reviews.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full ${i === currentIndex ? "bg-blue-600 w-5" : "bg-gray-300 w-2"}`}
              />
            ))}
          </div>
        )}

        {/* Give Review Button */}
        {user && (
          <div className="flex justify-center mt-8">
            <a
              href="/user/give-review"
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Give Review →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;