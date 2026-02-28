import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [activeMenu, setActiveMenu] = useState('settings');

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailBooking: true,
        emailPromotions: false,
        emailNewsletter: true,
        smsBooking: true,
        smsPromotions: false,
        pushBooking: true,
        pushDeals: true,
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showLoyaltyPoints: false,
        shareBookingHistory: false,
    });

    // Theme
    const [theme, setTheme] = useState('light');

    // Language
    const [language, setLanguage] = useState('en');

    // Currency
    const [currency, setCurrency] = useState('BDT');

    // Delete account modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Saving state
    const [saving, setSaving] = useState(false);

    // Sidebar menu items (same as Profile page)
    const menuItems = [
        { id: 'profile', label: 'Profile', icon: 'pi-user', path: '/user/profile' },
        { id: 'loyalty', label: 'Loyalty Points', icon: 'pi-star', path: '/user/loyalty-points' },
        { id: 'listings', label: 'My Listings', icon: 'pi-list', path: null },
        { id: 'payouts', label: 'Payouts', icon: 'pi-wallet', path: null },
        { id: 'settings', label: 'Settings', icon: 'pi-cog', path: '/user/settings' },
    ];

    const handleToggle = (section, key) => {
        if (section === 'notifications') {
            setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        } else if (section === 'privacy') {
            setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            // Simulate saving (in a real app, you'd send to backend)
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.current.show({
                severity: 'success',
                summary: 'Saved',
                detail: 'Settings updated successfully!',
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save settings',
                life: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        try {
            toast.current.show({
                severity: 'info',
                summary: 'Account Deletion',
                detail: 'Account deletion request submitted. You will receive a confirmation email.',
                life: 5000,
            });
            setShowDeleteModal(false);
            setDeleteConfirmText('');
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to process request',
                life: 3000,
            });
        }
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem('token');
        navigate('/');
    };

    const ToggleSwitch = ({ enabled, onToggle }) => (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast ref={toast} />

            {/* Header — same as Profile */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-light-gray/50 bg-off-white/80 px-6 sm:px-10 lg:px-20 py-3 backdrop-blur-sm dark:bg-background-dark/80 dark:border-gray-700/50">
                <Link to="/" className="flex items-center gap-4 text-deep-teal dark:text-off-white">
                    <div className="size-6 text-[#034D41] dark:text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight">POTHIK</span>
                </Link>
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

                    {/* Sidebar — same as Profile */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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

                        {/* Page Title */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage your preferences and account settings</p>
                        </div>

                        {/* ========================= */}
                        {/* NOTIFICATION PREFERENCES  */}
                        {/* ========================= */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <i className="pi pi-bell text-blue-600"></i>
                                    Notification Preferences
                                </h2>
                            </div>
                            <div className="p-6 space-y-0">
                                {/* Email Notifications */}
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Email Notifications</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between py-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Booking Confirmations</p>
                                            <p className="text-xs text-gray-500">Get notified when a booking is confirmed or updated</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={notifications.emailBooking}
                                            onToggle={() => handleToggle('notifications', 'emailBooking')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Promotional Offers</p>
                                            <p className="text-xs text-gray-500">Receive special deals and discount offers</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={notifications.emailPromotions}
                                            onToggle={() => handleToggle('notifications', 'emailPromotions')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Newsletter</p>
                                            <p className="text-xs text-gray-500">Weekly travel tips and destination highlights</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={notifications.emailNewsletter}
                                            onToggle={() => handleToggle('notifications', 'emailNewsletter')}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">SMS Notifications</h3>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between py-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Booking Updates via SMS</p>
                                                <p className="text-xs text-gray-500">Receive booking & payment confirmations via SMS</p>
                                            </div>
                                            <ToggleSwitch
                                                enabled={notifications.smsBooking}
                                                onToggle={() => handleToggle('notifications', 'smsBooking')}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">SMS Promotions</p>
                                                <p className="text-xs text-gray-500">Get flash sale alerts and last-minute deals</p>
                                            </div>
                                            <ToggleSwitch
                                                enabled={notifications.smsPromotions}
                                                onToggle={() => handleToggle('notifications', 'smsPromotions')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Push Notifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Booking Reminders</p>
                                                <p className="text-xs text-gray-500">Get reminders before your upcoming trips</p>
                                            </div>
                                            <ToggleSwitch
                                                enabled={notifications.pushBooking}
                                                onToggle={() => handleToggle('notifications', 'pushBooking')}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Hot Deals & Flash Sales</p>
                                                <p className="text-xs text-gray-500">Be the first to know about limited-time offers</p>
                                            </div>
                                            <ToggleSwitch
                                                enabled={notifications.pushDeals}
                                                onToggle={() => handleToggle('notifications', 'pushDeals')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========================= */}
                        {/* PRIVACY SETTINGS          */}
                        {/* ========================= */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <i className="pi pi-shield text-blue-600"></i>
                                    Privacy & Visibility
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Public Profile</p>
                                        <p className="text-xs text-gray-500">Allow other users to view your profile</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={privacy.profileVisible}
                                        onToggle={() => handleToggle('privacy', 'profileVisible')}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Show Loyalty Points</p>
                                        <p className="text-xs text-gray-500">Display your loyalty tier on your public profile</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={privacy.showLoyaltyPoints}
                                        onToggle={() => handleToggle('privacy', 'showLoyaltyPoints')}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Share Booking History</p>
                                        <p className="text-xs text-gray-500">Let others see your recent trips and reviews</p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={privacy.shareBookingHistory}
                                        onToggle={() => handleToggle('privacy', 'shareBookingHistory')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ========================= */}
                        {/* PREFERENCES               */}
                        {/* ========================= */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <i className="pi pi-sliders-h text-blue-600"></i>
                                    Preferences
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Language */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Language</p>
                                        <p className="text-xs text-gray-500">Select your preferred language</p>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 cursor-pointer"
                                    >
                                        <option value="en">English</option>
                                        <option value="bn">বাংলা (Bangla)</option>
                                        <option value="hi">हिन्दी (Hindi)</option>
                                        <option value="ar">العربية (Arabic)</option>
                                    </select>
                                </div>

                                {/* Currency */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Currency</p>
                                        <p className="text-xs text-gray-500">Preferred currency for prices</p>
                                    </div>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8 cursor-pointer"
                                    >
                                        <option value="BDT">৳ BDT (Taka)</option>
                                        <option value="USD">$ USD (Dollar)</option>
                                        <option value="EUR">€ EUR (Euro)</option>
                                        <option value="GBP">£ GBP (Pound)</option>
                                        <option value="INR">₹ INR (Rupee)</option>
                                    </select>
                                </div>

                                {/* Theme */}
                                <div>
                                    <p className="text-sm font-medium text-gray-800 mb-3">Appearance</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'light', label: 'Light', icon: 'pi-sun' },
                                            { value: 'dark', label: 'Dark', icon: 'pi-moon' },
                                            { value: 'system', label: 'System', icon: 'pi-desktop' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setTheme(opt.value)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${theme === opt.value
                                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <i className={`pi ${opt.icon} text-xl`}></i>
                                                <span className="text-sm font-medium">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========================= */}
                        {/* SAVE BUTTON               */}
                        {/* ========================= */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/20"
                            >
                                {saving && <i className="pi pi-spinner pi-spin"></i>}
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>

                        {/* ========================= */}
                        {/* DANGER ZONE               */}
                        {/* ========================= */}
                        <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                                <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                                    <i className="pi pi-exclamation-triangle"></i>
                                    Danger Zone
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Log Out of All Devices</p>
                                        <p className="text-xs text-gray-500">Sign out from all active sessions everywhere</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2 border border-orange-300 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-50 transition-colors"
                                    >
                                        Log Out All
                                    </button>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Delete Account</p>
                                        <p className="text-xs text-gray-500">Permanently delete your account and all associated data</p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-5 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t border-gray-200 bg-white">
                    © 2024 POTHIK. All rights reserved.
                </footer>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in">
                        <div className="p-6">
                            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-exclamation-triangle text-2xl text-red-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Your Account?</h3>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                This action is <strong>permanent</strong> and cannot be undone. All your bookings, loyalty points, and personal data will be deleted forever.
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="font-bold text-red-600">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type DELETE here"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                                className="px-5 py-2.5 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                                className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
