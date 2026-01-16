import React, { useState } from "react";
import api from "../Helper/baseUrl.helper";

const BlogPost = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle image file select
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("image", image);
      formData.append("user_id", "123"); // Replace with actual logged-in user ID

      // Replace token with the one from your authentication context or localStorage
      const token = sessionStorage.getItem("token");

      const res = await api.post("/blog/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Blog posted successfully!");
      // Clear form
      setTitle("");
      setSlug("");
      setContent("");
      setCategory("");
      setTags("");
      setImage(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background-light py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <a
          href="#"
          className="inline-flex items-center text-sm text-primary font-medium hover:underline mb-6"
        >
          ← Back to Blogs
        </a>

        <h1 className="text-2xl font-bold text-dark-slate">Create a New Story</h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">
          Share your latest travel adventure with our community.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              STORY TITLE
            </label>
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-light-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              COVER IMAGE
            </label>
            <input type="file" onChange={handleImageChange} accept="image/*" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-light-gray px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              >
                <option value="">Select a category</option>
                <option>Adventure</option>
                <option>Travel Guide</option>
                <option>Culture</option>
                <option>Food</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">TAGS</label>
              <input
                type="text"
                placeholder="#Add tags e.g. Hiking, Bali"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-light-gray px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">YOUR STORY</label>
            <textarea
              rows="8"
              placeholder="Once upon a time in the heart of the mountains..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-light-gray rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setTitle(""); setSlug(""); setContent(""); setCategory(""); setTags(""); setImage(null);
              }}
              className="px-5 py-2 text-sm font-medium border border-light-gray rounded-lg hover:bg-light-gray/40 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-semibold text-white bg-deep-teal rounded-lg hover:opacity-90 transition"
            >
              {loading ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BlogPost;
