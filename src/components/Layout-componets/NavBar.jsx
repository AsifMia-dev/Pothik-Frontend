import React from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-light-gray/50 bg-off-white/80 px-6 sm:px-10 lg:px-20 py-3 backdrop-blur-sm dark:bg-background-dark/80 dark:border-gray-700/50">

      {/* Logo */}
      <div className="flex items-center gap-4 text-deep-teal dark:text-off-white">
        <div className="size-6 text-deep-teal dark:text-primary">
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
          to="/about"
          className="text-sm font-medium hover:text-deep-teal dark:hover:text-primary transition-colors"
        >
          About
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="flex gap-2">
        <Button
          label="Log In"
          className="flex min-w-[84px] items-center justify-center cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-white text-dark-slate dark:text-off-white text-sm font-bold hover:bg-green-800/10 transition-colors"
        />

        <Button
          label="Sign Up"
          className="flex min-w-[84px] items-center justify-center cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-green-800 text-white text-sm font-bold hover:bg-green-700 transition-colors"
        />
      </div>
    </header>
  );
};

export default NavBar;