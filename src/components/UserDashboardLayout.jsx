import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavBar from './Layout-componets/NavBar';
import Footer from './Layout-componets/Footer';

const menuItems = [
    { id: 'profile',   label: 'Profile',        icon: 'pi-user',   path: '/user/profile' },
    { id: 'loyalty',   label: 'Loyalty Points', icon: 'pi-star',   path: '/user/loyalty-points' },
    { id: 'listings',  label: 'My Listings',    icon: 'pi-list',   path: '/user/my-listings' },
    { id: 'payouts',   label: 'Payouts',        icon: 'pi-wallet', path: '/user/payouts' },
];

const UserDashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveMenu = () => {
        const path = location.pathname;
        const match = menuItems.find((item) => item.path && path.startsWith(item.path));
        return match ? match.id : 'profile';
    };

    const activeMenu = getActiveMenu();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <div className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar */}
                        <div className="w-64 flex-shrink-0">
                            <div className="sticky top-20 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <nav className="p-3">
                                    <ul className="space-y-1">
                                        {menuItems.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => navigate(item.path)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                        activeMenu === item.id
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <i className={`pi ${item.icon}`}></i>
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}

                                        {/* Logout button */}
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-50"
                                            >
                                                <i className="pi pi-sign-out"></i>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserDashboardLayout;