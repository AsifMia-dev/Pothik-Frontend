import React, { useState } from "react";
import api from "../../Helper/baseUrl.helper";
import { AuthContext } from "../../context/AuthContext";  
import Layout from "../../components/Layout";

const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const BlogPost = () => {
  const { user } = React.useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", generateSlug(title));
      formData.append("content", content);
      formData.append("image", image);
      formData.append("user_id", user.user_id);

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
      setContent("");
      setImage(null);
      setImagePreview(null);
      
      // Reset file input
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
  };

  return (
    <Layout>
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
              <input 
                type="file" 
                onChange={handleImageChange} 
                accept="image/*" 
                required 
                className="w-full text-sm"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-48 object-cover rounded-lg border border-light-gray"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                YOUR STORY
              </label>
              <textarea
                rows="8"
                placeholder="Once upon a time in the heart of the mountains..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
                {loading ? "Publishing..." : "Publish Story"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;