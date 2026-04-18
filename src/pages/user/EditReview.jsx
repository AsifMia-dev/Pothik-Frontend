import React, { useState, useEffect } from "react";
import api from "../../Helper/baseUrl.helper";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const EditReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [review, setReview] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await api.get(`/review/${reviewId}`);
        if (res.data.data.user_id !== user.user_id) {
          navigate("/user/give-review"); // redirect if not owner
          return;
        }
        setReview(res.data.data);
        setComment(res.data.data.comment);
        setRating(res.data.data.rating);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch review");
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [reviewId, user.user_id, navigate]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const token = sessionStorage.getItem("token");
    await api.put(
      `/review/${reviewId}`,
      { comment, rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Navigate back to homepage after successful update
    navigate("/");
  } catch (err) {
    console.error(err);
    setError("Failed to update review");
  }
};

const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this review?")) return;

  try {
    const token = sessionStorage.getItem("token");
    await api.delete(`/review/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Navigate back to homepage after successful deletion
    navigate("/");
  } catch (err) {
    console.error(err);
    setError("Failed to delete review");
  }
};

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!review) return <p className="text-center py-10">Review not found.</p>;

  return (
    <Layout>
      <section className="min-h-screen bg-background-light py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Your Review</h1>

          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-lg border border-light-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {"⭐".repeat(r)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                Comment
              </label>
              <textarea
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-light-gray rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 text-sm font-medium border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-black bg-deep-teal rounded-lg hover:opacity-90 transition"
              >
                Update Review
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default EditReview;