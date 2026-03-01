import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiCamera, FiSave, FiLock, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import axios from "axios";

const API_URL = import.meta.env.VITE_POTHIK_BACKEND_URL || "http://localhost:5000/api";

const OwnerProfile = () => {
    const { user, login } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState("personal");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        streetAddress: "",
        bio: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.full_name || "",
                email: user.email || "",
                phone: user.phone || "",
                country: user.country || "",
                streetAddress: user.street_address || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await axios.put(
                `${API_URL}/user/profile`,
                {
                    full_name: formData.fullName,
                    phone: formData.phone,
                    country: formData.country,
                    street_address: formData.streetAddress,
                    bio: formData.bio,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.user) {
                login(response.data.user);
                setMessage({ type: "success", text: "Profile updated successfully!" });
            }
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords don't match" });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            await axios.put(
                `${API_URL}/user/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("profile_image", file);

        try {
            const token = sessionStorage.getItem("token") || localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/user/upload-profile-image`, formDataUpload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.user) {
                login(response.data.user);
                setMessage({ type: "success", text: "Profile image updated!" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to upload image" });
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
            </div>

            {/* Message */}
            {message.text && (
                <div
                    className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left - Profile Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col items-center">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                                {user?.profile_image ? (
                                    <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500 font-bold">
                                        {user?.full_name?.charAt(0) || "O"}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors"
                            >
                                <FiCamera className="w-5 h-5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-gray-800">{user?.full_name || "Owner Name"}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="mt-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                            Property Owner
                        </span>

                        {/* Stats */}
                        <div className="w-full mt-6 pt-6 border-t border-gray-100">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">12</p>
                                    <p className="text-xs text-gray-500">Listings</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">48</p>
                                    <p className="text-xs text-gray-500">Bookings</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">4.8</p>
                                    <p className="text-xs text-gray-500">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Forms */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "personal"
                                        ? "text-teal-600 border-b-2 border-teal-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <FiUser className="inline-block w-4 h-4 mr-2" />
                                Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "security"
                                        ? "text-teal-600 border-b-2 border-teal-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <FiLock className="inline-block w-4 h-4 mr-2" />
                                Security
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === "personal" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiUser className="inline-block w-4 h-4 mr-1" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiMail className="inline-block w-4 h-4 mr-1" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiPhone className="inline-block w-4 h-4 mr-1" />
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiMapPin className="inline-block w-4 h-4 mr-1" />
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                            placeholder="Tell guests about yourself..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        <FiSave className="w-5 h-5" />
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    <button
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        <FiLock className="w-5 h-5" />
                                        {loading ? "Updating..." : "Change Password"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;
