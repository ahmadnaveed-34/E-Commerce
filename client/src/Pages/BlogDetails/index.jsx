import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchDataFromApi(`/api/blog/${id}`).then((res) => {
      if (res?.error !== true) {
        setBlog(res?.blog);
      }
    });
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white mb-4 mt-4 rounded-md">
      {/* Blog Header Image */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg mb-8 group">
        <img
          src={blog?.images[0]}
          alt="Blog Cover"
          className="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4 text-white">
          <p className="text-sm font-medium">
            Published on{" "}
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {blog?.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center text-gray-500 text-sm gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-2A5 5 0 0012 4a5 5 0 00-5 5v1a5 5 0 0010 0v-1z" />
            </svg>
            <span className="text-gray-700 font-medium">By Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3m8 4V3m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(blog?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Blog Description */}
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog?.description }}
        />
      </div>
    </div>
  );
};

export default BlogDetails;
