import React, { useEffect, useState } from "react";
import api from "../../Helper/baseUrl.helper";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("published");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  // Get token from sessionStorage (where Login saves it)
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/admin/blogs", {
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

  // Handle Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category)
      return alert("All fields are required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await api.put(`/admin/blogs/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/admin/blogs", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      alert("Failed to save blog");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?"))
      return;

    try {
      await api.delete(`/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setStatus("published");
    setImage(null);
    setEditId(null);
  };

  // Search Filter
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Blog Management (Admin Panel)
      </h1>

      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
          {editId ? "Edit Blog" : "Create New Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />

          <textarea
            placeholder="Blog Content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {editId ? "Update Blog" : "Create Blog"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            All Blogs
          </h2>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {loading ? (
          <p>Loading blogs...</p>
        ) : currentBlogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <div className="space-y-4">
            {currentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="border p-4 rounded-xl flex justify-between items-start dark:border-gray-600"
              >
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category: {blog.category} | Status: {blog.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(blog._id);
                      setTitle(blog.title);
                      setContent(blog.content);
                      setCategory(blog.category);
                      setStatus(blog.status);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-lg ${currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
