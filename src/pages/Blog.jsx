import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import api from "../Helper/baseUrl.helper";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    "All Posts",
    "Destinations",
    "Travel Tips",
    "Culture & Food",
    "Adventure Travel"
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blog/blogs");
        const blogsData = res.data?.blogs || [];
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    activeCategory === "All Posts" 
      ? true 
      : blog.category === activeCategory
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        {/* Hero Section */}
        <div className="@container">
          <div 
            className="flex min-h-[400px] md:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200")`
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tighter md:text-5xl">
                The POTHIK Travel Journal
              </h1>
              <h2 className="text-white/90 text-base font-normal leading-normal max-w-xl mx-auto md:text-lg">
                Inspiration for your next great adventure, from our explorers to you.
              </h2>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="py-8">
          <div className="flex gap-2 md:gap-3 p-1 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-medium'
                }`}
              >
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <p className="text-center text-slate-500 mt-8">
            Loading blogs...
          </p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-slate-500 mt-8">
            No blog posts found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.blog_id}
                blog={blog}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center p-4 pt-12">
          <button 
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
              chevron_left
            </span>
          </button>
          
          <button className="text-sm font-bold flex size-10 items-center justify-center text-white rounded-full bg-primary">
            {currentPage}
          </button>
          
          <button 
            className="text-sm font-medium flex size-10 items-center justify-center text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setCurrentPage(2)}
          >
            2
          </button>
          
          <button 
            className="text-sm font-medium flex size-10 items-center justify-center text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setCurrentPage(3)}
          >
            3
          </button>
          
          <span className="text-sm font-medium flex size-10 items-center justify-center text-slate-500 dark:text-slate-400 rounded-full">
            ...
          </span>
          
          <button 
            className="text-sm font-medium flex size-10 items-center justify-center text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setCurrentPage(10)}
          >
            10
          </button>
          
          <button 
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;