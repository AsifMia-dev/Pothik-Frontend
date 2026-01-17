// src/components/PackageCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image";

const PackageCard = ({ pkg }) => {
  return (
    <Link
      to={`/user/package/${pkg.id}`} // Navigate to PackageDetails
      state={{ packageTitle: pkg.title }}
      className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-card-dark shadow-md transition-all hover:shadow-lg hover:-translate-y-1 border border-border-light dark:border-border-dark cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <div
          className="aspect-video w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${pkg.image ? `http://localhost:5000/uploads/${pkg.image}` : FALLBACK_IMAGE})` }}
        ></div>

        {/* Optional tag like Bestseller / Luxury */}
        {pkg.tag && (
          <div className="absolute top-3 left-3 rounded-full bg-accent px-2 py-1 text-xs font-bold text-white uppercase">
            {pkg.tag}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold line-clamp-1">{pkg.title}</h3>
        <p className="text-sm text-primary font-medium mt-1">{pkg.location}</p>
        <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {pkg.description || "No description available."}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{pkg.duration || "N/A"}</p>
            <p className="text-lg font-bold text-text-headings-light dark:text-text-headings-dark">
              ${pkg.price || 0}
            </p>
          </div>
          <div className="h-9 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center px-4 hover:bg-primary/90 transition">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
