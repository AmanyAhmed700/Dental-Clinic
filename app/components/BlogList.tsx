"use client";
import { useEffect, useState } from "react";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  author: { name: string };
  createdAt: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {blogs.map(blog => (
        <div key={blog.id} className="border rounded-md shadow-md p-4">
          {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-md mb-2" />}
          <h3 className="font-bold">{blog.title}</h3>
          <p className="text-sm text-gray-600">by {blog.author.name} - {new Date(blog.createdAt).toLocaleDateString()}</p>
          <p className="mt-2">{blog.content.slice(0, 120)}...</p>
        </div>
      ))}
    </div>
  );
}
