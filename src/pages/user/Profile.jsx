import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [activeMenu, setActiveMenu] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    streetAddress: user?.street_address || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        streetAddress: user.street_address || '',
      });
    }
  }, [user]);

  // Fetch latest profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.user) {
          // Update user context with fresh data
          login(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/user/profile`,
        {
          full_name: formData.fullName,
          phone: formData.phone,
          country: formData.country,
          street_address: formData.streetAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user in context with new data
      if (response.data.user) {
        login(response.data.user);
      }

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully!',
        life: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Failed to update profile',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match',
        life: 3000,
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Password must be at least 8 characters long',
        life: 3000,
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/user/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Password updated successfully!',
        life: 3000,
      });

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.error || 'Failed to update password',
        life: 3000,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Sidebar menu items
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'pi-user', path: '/user/profile' },
    { id: 'loyalty', label: 'Loyalty Points', icon: 'pi-star', path: '/user/loyalty-points' },
    { id: 'listings', label: 'My Listings', icon: 'pi-list', path: null },
    { id: 'payouts', label: 'Payouts', icon: 'pi-wallet', path: null },
    { id: 'settings', label: 'Settings', icon: 'pi-cog', path: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      {/* Simple Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-light-gray/50 bg-off-white/80 px-6 sm:px-10 lg:px-20 py-3 backdrop-blur-sm dark:bg-background-dark/80 dark:border-gray-700/50">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 text-deep-teal dark:text-off-white">
          <div className="size-6 text-[#034D41] dark:text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">POTHIK</span>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <i className="pi pi-bell text-lg"></i>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <i className="pi pi-question-circle text-lg"></i>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Navigation Menu */}
              <nav className="p-3">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item.path) {
                            navigate(item.path);
                          } else {
                            setActiveMenu(item.id);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeMenu === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <i className={`pi ${item.icon}`}></i>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Photo Section - Separate Card */}
            {activeMenu === 'profile' && (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user?.full_name || 'User'}</h3>
                        <p className="text-sm text-gray-500">Update your photo. It will be displayed on your public profile.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                        Delete
                      </button>
                      <button className="px-6 py-2.5 bg-[#3b82f6] rounded-full text-white text-sm font-medium hover:bg-[#2563eb] transition-colors">
                        Upload...
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Section - Separate Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Tabs */}
                  <div className="px-6 border-b border-gray-100">
                    <div className="flex gap-8">
                      <button
                        onClick={() => setActiveTab('personal')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Personal Info
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Password & Security
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'personal' ? (
                      <div className="space-y-6">
                        {/* Full Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                              placeholder="Enter your email"
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Phone & Country Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <div className="relative">
                              <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                              >
                                <option value="United States">United States</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="India">India</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <i className="pi pi-chevron-down text-gray-400"></i>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Street Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your street address"
                          />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-6 mt-6">
                          {/* Action Buttons */}
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setFormData({
                                fullName: user?.full_name || '',
                                email: user?.email || '',
                                phone: user?.phone || '',
                                country: user?.country || '',
                                streetAddress: user?.street_address || '',
                              })}
                              disabled={loading}
                              className="px-6 py-2.5 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveChanges}
                              disabled={loading}
                              className="px-6 py-2.5 bg-[#3b82f6] text-white text-sm font-medium rounded-full hover:bg-[#2563eb] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {loading && (
                                <i className="pi pi-spinner pi-spin"></i>
                              )}
                              {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your current password"
                          />
                        </div>

                        {/* New Password & Confirm Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                          <ul className="text-sm text-gray-500 space-y-1">
                            <li className="flex items-center gap-2">
                              <i className="pi pi-check-circle text-green-500"></i>
                              At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                              <i className="pi pi-check-circle text-green-500"></i>
                              Contains at least one uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                              <i className="pi pi-check-circle text-green-500"></i>
                              Contains at least one number
                            </li>
                            <li className="flex items-center gap-2">
                              <i className="pi pi-check-circle text-green-500"></i>
                              Contains at least one special character
                            </li>
                          </ul>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-6 mt-6">
                          {/* Action Buttons */}
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              })}
                              disabled={passwordLoading}
                              className="px-6 py-2.5 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSavePassword}
                              disabled={passwordLoading}
                              className="px-6 py-2.5 bg-[#3b82f6] text-white text-sm font-medium rounded-full hover:bg-[#2563eb] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {passwordLoading && (
                                <i className="pi pi-spinner pi-spin"></i>
                              )}
                              {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t border-gray-200 bg-white">
          © 2024 POTHIK. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Profile;
