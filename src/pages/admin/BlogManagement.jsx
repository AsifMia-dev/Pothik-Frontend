// src/pages/admin/BlogManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../Helper/baseUrl.helper";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for create/edit
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 5;

  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/blogs", { headers: { Authorization: `Bearer ${token}` } });
      let data = res.data?.blogs || [];

      // Apply search filter
      if (search) {
        data = data.filter(
          (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.User?.full_name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Pagination
      setTotalPages(Math.ceil(data.length / blogsPerPage));
      const startIndex = (currentPage - 1) * blogsPerPage;
      const paginatedData = data.slice(startIndex, startIndex + blogsPerPage);

      setBlogs(paginatedData);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, search]);

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !slug) return alert("Title, content, and slug are required!");

    const payload = { title, content, slug };

    try {
      if (editId) {
        await api.put(`/admin/blogs/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post("/admin/blogs", payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSlug("");
    setEditId(null);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/admin/blogs/${blogId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Blog Management</h1>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {editId ? "Edit Blog" : "Create New Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            rows={5}
          ></textarea>

          <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              {editId ? "Update Blog" : "Create Blog"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white flex-1"
        />
      </div>

      {/* Error */}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

      {/* Loading */}
      {loading ? (
        <p className="text-center text-blue-500">Loading blogs...</p>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Author</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-5 py-4">{blog.title}</td>
                      <td className="px-5 py-4">{blog.User?.full_name || "N/A"}</td>
                      <td className="px-5 py-4">{blog.slug}</td>
                      <td className="px-5 py-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditId(blog.id);
                            setTitle(blog.title);
                            setSlug(blog.slug);
                            setContent(blog.content);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {blogs.length > 0 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 dark:text-white"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogManagement;
