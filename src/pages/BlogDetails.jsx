import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import api from "../Helper/baseUrl.helper";

const BlogDetails = () => {
  const { slugOrId } = useParams();
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blog/blogs/${slugOrId}/blog`);
        const data = response.data;
        setBlog({...data.blog});
        
      
        console.log("Fetched blog details:", data.blog);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slugOrId]);

  if (loading) return <p className="text-center mt-10">Loading blog...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <Layout>
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Blog Image */}
      <div 
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl mb-6"
        style={{
          backgroundImage: blog.image 
            ? `url(http://localhost:5000/uploads/${blog.image})` 
            : `url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200)`
        }}
      />

      {/* Blog Content */}
      <div className="flex flex-col gap-4">
        {/* Category */}
        <p className="text-primary text-sm font-bold uppercase tracking-wider">
          {blog.category || 'General'}
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 ">
          {blog.title}
        </h1>

        {/* Author & Date */}
        <p className="text-slate-500  text-sm">
          By {blog.User?.full_name || "Anonymous"} • {formatDate(blog.created_at)}
        </p>

        {/* Full Content */}
        <div className="text-slate-700  mt-6 leading-relaxed">
          {blog.content || "No content available for this blog."}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default BlogDetails;
