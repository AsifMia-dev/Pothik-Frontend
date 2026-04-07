import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";  
import Layout from "../../components/Layout";

const GiveReview = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to give a review.");
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      await api.post(
        "/review",
        {
          user_id: user.user_id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Review submitted successfully!");

      // Navigate to homepage after successful submission
      navigate("/");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear form
    setComment("");
    setRating(5);
    setError("");
    setSuccess("");

    // Navigate to homepage
    navigate("/");
  };

  return (
    <Layout>
      <section className="min-h-screen bg-background-light py-10 px-4">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-2xl font-bold text-dark-slate">Give Your Review</h1>
          <p className="text-sm text-gray-500 mt-1 mb-8">
            Share your experience with our services.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                RATING
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-lg border border-light-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {[5,4,3,2,1].map((r) => (
                  <option key={r} value={r}>
                    {"⭐".repeat(r)} ({r})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                YOUR REVIEW
              </label>
              <textarea
                rows="6"
                placeholder="Write your honest review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-light-gray rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-medium border border-light-gray rounded-lg hover:bg-light-gray/40 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-semibold text-black bg-deep-teal rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default GiveReview;