import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import api from "../Helper/baseUrl.helper";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from 'primereact/icons/chevronleft';
import { ChevronRightIcon } from 'primereact/icons/chevronright';

const BLOGS_PER_PAGE = 6;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blog/blogs");
        const blogsData = res.data?.blogs || [];
        console.log("Fetched blogs:", blogsData);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error.response || error.message || error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredBlogs = blogs.filter((blog) => {
    const search = searchTerm.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(search) ||
      blog.content?.toLowerCase().includes(search)
    );
  });

  // ── Pagination derived values ──────────────────────────────────────────────
  const totalPages   = Math.max(1, Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const startIndex   = (safePage - 1) * BLOGS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);

  const goToPage = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build the page number buttons: always show first, last, current ± 1, with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set([1, totalPages, safePage]);
    if (safePage - 1 > 1)          pages.add(safePage - 1);
    if (safePage + 1 < totalPages)  pages.add(safePage + 1);

    const sorted = [...pages].sort((a, b) => a - b);

    // Insert ellipsis markers
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  };

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

        {/* Search Bar */}
        <div className="py-8 flex justify-center">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-[#034D41] text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Blog Grid */}
        {loading ? (
          <p className="text-center text-slate-500 mt-8">Loading blogs...</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-slate-500 mt-8">No blog posts found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentBlogs.map((blog) => (
                <BlogCard key={blog.blog_id} blog={blog} />
              ))}
            </div>

            {/* Results count */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Showing {startIndex + 1}–{Math.min(startIndex + BLOGS_PER_PAGE, filteredBlogs.length)} of {filteredBlogs.length} posts
            </p>
          </>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 p-4 pt-6">

            {/* LEFT */}
            <button
              disabled={safePage === 1}
              onClick={() => goToPage(safePage - 1)}
              className={`flex size-10 items-center justify-center rounded-full transition-colors
                ${safePage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-200 dark:hover:bg-slate-800"}`}
            >
              <ChevronLeftIcon className={`w-5 h-5 ${safePage === 1 ? "text-slate-400 dark:text-slate-600" : "text-slate-600 dark:text-slate-400"}`} />
            </button>

            {/* PAGE NUMBERS */}
            {getPageNumbers().map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="text-sm font-medium flex size-10 items-center justify-center text-slate-500 dark:text-slate-400 rounded-full"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item)}
                  className={`text-sm font-bold flex size-10 items-center justify-center rounded-full transition-colors
                    ${item === safePage
                      ? "text-white bg-primary"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
                >
                  {item}
                </button>
              )
            )}

            {/* RIGHT */}
            <button
              disabled={safePage === totalPages}
              onClick={() => goToPage(safePage + 1)}
              className={`flex size-10 items-center justify-center rounded-full transition-colors
                ${safePage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-200 dark:hover:bg-slate-800"}`}
            >
              <ChevronRightIcon className={`w-5 h-5 ${safePage === totalPages ? "text-slate-400 dark:text-slate-600" : "text-slate-600 dark:text-slate-400"}`} />
            </button>

          </div>
        )}

        <Link to="/user/blog-post">
          <button
            className="mx-auto flex items-center justify-center 
                      w-2xl mt-12 px-10 py-4 
                      bg-violet-400/10 text-lg font-semibold 
                      text-black bg-sunset-orange rounded-xl shadow-md 
                      hover:bg-sunset-orange/90 hover:shadow-lg 
                      transition-all duration-200 cursor-pointer"
          >
            Post Your Story
          </button>
        </Link>

      </div>
    </Layout>
  );
};

export default Blog;