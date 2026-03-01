import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const navLinks = [
  { to: "/destinations", label: "Destinations" },
  { to: "/packages",     label: "Packages" },
  { to: "/blog",         label: "Blog" },
  { to: "/about",        label: "About Us" },
  { to: "/contact",      label: "Contact Us" },
];

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoHovered, setLogoHovered] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-light-gray/50 bg-off-white/80 px-6 sm:px-10 lg:px-20 py-3 backdrop-blur-sm dark:bg-background-dark/80 dark:border-gray-700/50">

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 group select-none"
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        {/* Animated SVG icon */}
        <div
          className={`size-7 text-[#034D41] dark:text-primary transition-all duration-500
            ${logoHovered ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}
        >
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            {/* Animate each block path separately with staggered delays */}
            <rect
              x="4" y="4" width="13.33" height="13.33"
              fill="currentColor"
              className={`transition-all duration-300 ${logoHovered ? "opacity-100 translate-x-0" : "opacity-70"}`}
              style={{
                transformOrigin: "10.67px 10.67px",
                transform: logoHovered ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.3s ease 0s, opacity 0.3s ease",
              }}
            />
            <rect
              x="17.33" y="17.33" width="13.33" height="13.33"
              fill="currentColor"
              style={{
                transformOrigin: "24px 24px",
                transform: logoHovered ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.3s ease 0.08s, opacity 0.3s ease",
              }}
            />
            <rect
              x="30.67" y="30.67" width="13.33" height="13.33"
              fill="currentColor"
              style={{
                transformOrigin: "37.33px 37.33px",
                transform: logoHovered ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.3s ease 0.16s, opacity 0.3s ease",
              }}
            />
          </svg>
        </div>

        {/* Animated text */}
        <span className="text-xl font-bold tracking-tight text-deep-teal dark:text-off-white relative overflow-hidden">
          {/* Letter-by-letter color wave on hover */}
          {"POTHIK".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-200"
              style={{
                color: logoHovered ? "#034D41" : "",
                transform: logoHovered ? "translateY(-2px)" : "translateY(0px)",
                transitionDelay: `${i * 40}ms`,
              }}
            >
              {char}
            </span>
          ))}

          {/* Sliding underline on hover */}
          <span
            className="absolute bottom-0 left-0 h-0.5 bg-[#034D41] dark:bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: logoHovered ? "100%" : "0%" }}
          />
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex flex-1 justify-center gap-8">
        {navLinks.map(({ to, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`relative text-sm font-medium pb-1 transition-colors duration-200
                ${active
                  ? "text-[#034D41] dark:text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#034D41] dark:hover:text-primary"
                }`}
            >
              {label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#034D41] dark:bg-primary rounded-full transition-all duration-300 ease-in-out
                  ${active ? "w-full opacity-100" : "w-0 opacity-0"}`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Auth Buttons */}
      <div className="flex gap-2 items-center">
        {user ? (
          <Link
            to="/user/profile"
            className="flex items-center gap-2 text-sm font-medium text-deep-teal dark:text-off-white hover:text-[#034D41] dark:hover:text-primary transition-colors"
          >
            <span className="w-8 h-8 bg-[#034D41] text-white rounded-full flex items-center justify-center text-sm font-bold">
              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            {user.full_name}
          </Link>
        ) : (
          <Link to="/login">
            <button className="bg-[#034D41] text-sm text-white font-medium px-4 py-2 rounded-lg hover:bg-[#023830] transition-colors">
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavBar;