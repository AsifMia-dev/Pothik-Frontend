import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User Management</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", backgroundColor: "white" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
