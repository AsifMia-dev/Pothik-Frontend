import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BlogManagement = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirect if not admin
  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate, token, role]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Create blog
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !content) return alert("All fields are required!");

    try {
      await axios.post(
        "http://localhost:5000/api/admin/blogs",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setContent("");
      fetchBlogs();
    } catch (err) {
      alert("Failed to create blog");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/blogs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Blog Management
      </h1>

      {/* Create Blog Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Create New Blog
        </h2>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />

          <textarea
            placeholder="Blog Content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Create Blog
          </button>
        </form>
      </div>

      {/* Blog List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          All Blogs
        </h2>

        {loading ? (
          <p>Loading blogs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="border p-4 rounded-lg flex justify-between items-start dark:border-gray-600"
              >
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {blog.content}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
