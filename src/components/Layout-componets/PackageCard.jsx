import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PackageCard = ({ 
  packageId, 
  title, 
  description, 
  image, 
  price, 
  days, 
  startDate,
  capacity
}) => {
  const titleRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${baseURL}/uploads/${imagePath}`;
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return '0';
    return numPrice.toLocaleString('en-BD');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if title text is wider than its container
  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [title]);

  return (
    <div className="bg-[#034D41] dark:bg-[#034D41] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700">
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={getImageUrl(image)}
          alt={title || 'Package'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />
        
        {/* Duration Badge */}
        {days && (
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {days} {days === 1 ? 'Day' : 'Days'}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Title — marquee only if text overflows */}
        <div className="overflow-hidden w-full mb-2 min-h-[1.75rem]">
          <h3
            ref={titleRef}
            className={`text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap ${
              isOverflowing ? "animate-marquee" : ""
            }`}
          >
            {title || 'Untitled Package'}
          </h3>
        </div>

        {/* 1-line Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-1 flex-grow">
          {description || 'No description available'}
        </p>

        {/* Start Date */}
        {startDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Starts: {formatDate(startDate)}</span>
          </div>
        )}

        {/* Capacity */}
        {capacity != null && (
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Available Seats: <span className="font-semibold">{capacity}</span>
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
            <p className="text-2xl font-bold text-primary">
              ৳{formatPrice(price)}
            </p>
          </div>
          
          <Link
            to={`/user/package/${packageId}`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;