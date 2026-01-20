import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image";

const DestinationCard = ({
  destinationId,
  name = "Unknown Destination",
  description = "No description available.",
  image,
  spots = [],
}) => {
  // Extract filename from full path and construct proper URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return FALLBACK_IMAGE;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Extract just the filename from the full path
    const filename = imagePath.split(/[\\/]/).pop(); // Handles both / and \
    return `http://localhost:5000/uploads/destinations/${filename}`;
  };

  return (
    <Link
      to={`/destinations/${destinationId}/spots`}
      state={{ destinationName: name }}
      className="group flex flex-col overflow-hidden rounded-xl bg-[#034D41] dark:bg-[#034D41] shadow-md transition-all hover:shadow-lg hover:-translate-y-1 border border-border-light dark:border-border-dark cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <div
          className="aspect-video w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(image)})` }}
        ></div>

        {/* Spots count */}
        <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          {spots.length} Spots
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold line-clamp-1">{name}</h3>

        <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {description}
        </p>

        <div className="mt-4 h-9 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center hover:bg-primary/90 transition">
          View Spots
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;