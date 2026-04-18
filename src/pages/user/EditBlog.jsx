import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../Helper/baseUrl.helper";

const generateSlug = (title) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const EditBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blog/blogs/${blogId}/blog`);
        const blog = res.data.blog;

        if (!user || user.user_id !== blog.User.user_id) {
          navigate("/"); // redirect if not author
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setImagePreview(blog.image ? `http://localhost:5000/uploads/${blog.image}` : null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, navigate, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", generateSlug(title));
      formData.append("content", content);
      if (image) formData.append("image", image);

      const token = sessionStorage.getItem("token");

      // **Updated route**
      await api.put(`blog/blogs/${blogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Blog updated successfully!");
      setTimeout(() => navigate("/blog"), 1000); // navigate to homepage
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = sessionStorage.getItem("token");

      // **Updated route**
      await api.delete(`blog/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/blog"); // navigate to blog page
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog");
    }
  };

  const handleCancel = () => {
    navigate("/blog"); // navigate to blog page
  };

  if (loading) return <p className="text-center py-10">Loading blog...</p>;

  return (
    <Layout>
      <section className="min-h-screen bg-background-light py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-dark-slate">Edit Blog</h1>
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                BLOG TITLE
              </label>
              <input
                type="text"
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
              <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-sm" />
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
                BLOG CONTENT
              </label>
              <textarea
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-light-gray rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-medium border border-light-gray rounded-lg hover:bg-light-gray/40 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 text-sm font-medium border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-semibold text-black bg-deep-teal rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Blog"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default EditBlog;