import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Extract filename from full path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
    
    // Extract just the filename from the full path
    const filename = imagePath.split(/[\\/]/).pop(); // Handles both / and \
    return `http://localhost:5000/uploads/blogs/${filename}`;
  };

  return (
    <Link
      to={`/blogs/${blog.blog_id}/blog`}
      className="flex flex-col gap-3 bg-[#034D41] dark:bg-[#034D41] rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Blog Image */}
      <div 
        className="w-full bg-center bg-no-repeat aspect-video bg-cover"
        style={{
          backgroundImage: `url(${getImageUrl(blog.image)})`
        }}
      />
      
      {/* Blog Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge */}
        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">
          {blog.category || 'General'}
        </p>
        
        {/* Title */}
        <p className="text-slate-900 dark:text-white text-lg font-bold leading-snug">
          {blog.title}
        </p>
        
        {/* Description/Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal mt-1 mb-4 flex-grow line-clamp-2">
          {blog.content ? blog.content.substring(0, 100) + '...' : 'Read more about this amazing story...'}
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