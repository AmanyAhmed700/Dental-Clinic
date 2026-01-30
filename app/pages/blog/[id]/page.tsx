"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

export default function BlogDetails({ params }: { params: Promise<{ id: string }> }) {
  // Extract ID from params
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  //  Fetch single blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        const data = await res.json();
        if (data.success) setBlog(data.blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  //  Get user name from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name || "Unknown");
    }
  }, []);

  if (!blog)
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Article not found.
      </div>
    );

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {/*  Blog Image */}
        {blog.image && (
          <div className="relative w-full h-64 sm:h-96">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-contain sm:object-cover w-full h-full rounded-t-2xl"
              priority
            />
          </div>
        )}

        {/*  Blog Content */}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-4 text-center">
            {blog.title}
          </h1>

          <p className="text-gray-700 leading-relaxed text-lg sm:text-xl mb-6">
            {blog.content}
          </p>

          {/*  Footer */}
          <div className="text-gray-500 text-sm text-center border-t pt-4">
            <p>
              Author:{" "}
              <span className="font-medium text-gray-700">{userName}</span> •{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
