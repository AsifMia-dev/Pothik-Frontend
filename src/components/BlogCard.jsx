import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const titleRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
    const filename = imagePath.split(/[\\/]/).pop();
    return `http://localhost:5000/uploads/blogs/${filename}`;
  };

  // Check if title text is wider than its container
  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [blog.title]);

  return (
    <Link
      to={`/blogs/${blog.blog_id}/blog`}
      className="flex flex-col gap-3 bg-[#034D41] dark:bg-[#034D41] rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Blog Image */}
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover"
        style={{ backgroundImage: `url(${getImageUrl(blog.image)})` }}
      />

      {/* Blog Content */}
      <div className="p-4 flex flex-col flex-grow">

        {/* Category Badge */}
        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">
          {blog.category || 'General'}
        </p>

        {/* Title — marquee only if text overflows */}
        <div className="overflow-hidden w-full mb-1">
          <p
            ref={titleRef}
            className={`text-slate-900 dark:text-white text-lg font-bold leading-snug whitespace-nowrap ${
              isOverflowing ? "animate-marquee" : ""
            }`}
          >
            {blog.title}
          </p>
        </div>

        {/* 1-line Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal mt-1 mb-4 flex-grow line-clamp-1">
          {blog.content
            ? blog.content.substring(0, 100) + '...'
            : 'Read more about this amazing story...'}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
            {blog.User?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
            {blog.User?.full_name || 'Anonymous'} • {formatDate(blog.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;