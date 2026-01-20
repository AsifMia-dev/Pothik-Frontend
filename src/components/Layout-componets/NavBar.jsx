import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { AuthContext } from "../../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-light-gray/50 bg-off-white/80 px-6 sm:px-10 lg:px-20 py-3 backdrop-blur-sm dark:bg-background-dark/80 dark:border-gray-700/50">

      {/* Logo */}
      <div className="flex items-center gap-4 text-deep-teal dark:text-off-white">
        <div className="size-6 text-[#034D41] dark:text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <Link to="/" className="text-xl font-bold tracking-tight">
          POTHIK
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex flex-1 justify-center gap-8">
        <Link
          to="/destinations"
          className="text-sm font-medium hover:text-deep-teal dark:hover:text-primary transition-colors"
        >
          Destinations
        </Link>

        <Link
          to="/packages"
          className="text-sm font-medium hover:text-deep-teal dark:hover:text-primary transition-colors"
        >
          Packages
        </Link>

        <Link
          to="/blog"
          className="text-sm font-medium hover:text-deep-teal dark:hover:text-primary transition-colors"
        >
          Blog
        </Link>

        <Link
          to="/about"
          className="text-sm font-medium hover:text-deep-teal dark:hover:text-primary transition-colors"
        >
          About Us
        </Link>

        <Link
          to="/contact"
          className="text-sm font-medium hover:text-deep-teal dark:hover:text-primary transition-colors"
        >
          Contact Us
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="flex gap-2 items-center">
        {user ? (
          <>
            <Link
              to="/user/profile"
              className="flex items-center gap-2 text-sm font-medium text-deep-teal dark:text-off-white mr-2 hover:text-[#034D41] dark:hover:text-primary transition-colors"
            >
              <span className="w-8 h-8 bg-[#034D41] text-white rounded-full flex items-center justify-center text-sm font-bold">
                {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              {user.full_name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-sm text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                label="Login"
                className="p-button-text text-sm font-medium text-deep-teal hover:text-primary transition-colors"
              />
            </Link>
            <Link to="/register">
              <button className="bg-[#034D41] text-sm text-white font-medium px-4 py-2 rounded-lg hover:bg-[#023830] transition-colors">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;