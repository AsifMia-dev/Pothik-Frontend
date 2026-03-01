// src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../Helper/baseUrl.helper";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for create/edit
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer"); // default role
  const [editId, setEditId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 5;

  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data?.users || res.data || [];

      // Apply filters
      if (search) {
        data = data.filter(
          (u) =>
            u.full_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (roleFilter) data = data.filter((u) => u.role === roleFilter);

      // Pagination
      setTotalPages(Math.ceil(data.length / usersPerPage));
      const startIndex = (currentPage - 1) * usersPerPage;
      const paginatedData = data.slice(startIndex, startIndex + usersPerPage);

      setUsers(paginatedData);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, roleFilter]);

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email) return alert("Full name and email are required!");

    const payload = { full_name: fullName, email, role };

    try {
      if (editId) {
        await api.put(`/admin/users/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/admin/users", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setRole("customer");
    setEditId(null);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        User Management
      </h1>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {editId ? "Edit User" : "Create New User"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
          >
            <option value="customer">Customer</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {editId ? "Update User" : "Create User"}
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white flex-1"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Error */}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

      {/* Loading */}
      {loading ? (
        <p className="text-center text-blue-500">Loading users...</p>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-5 py-4">Full Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-5 py-4">{user.full_name}</td>
                      <td className="px-5 py-4">{user.email}</td>
                      <td className="px-5 py-4">{user.role}</td>
                      <td className="px-5 py-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditId(user.user_id);
                            setFullName(user.full_name);
                            setEmail(user.email);
                            setRole(user.role);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id)}
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
          {users.length > 0 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === page
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

export default UserManagement;
