"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: {
    name: string;
    role: string;
  };
}

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    //  Simulate checking login (replace with real check from context or API)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (data.success) setBlogs(data.blogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleShowMore = () => {
    if (!user) {
      alert("Please log in to view all articles.");
      router.push("/login");
    } else {
      router.push("/pages/blog");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading articles...
      </div>
    );

  return (
    <section className="relative bg-gray-100 py-16 px-6 md:px-20">
      {/* ===== Section Title ===== */}
      <div className="text-center mb-12">
        <h2 className="flex items-center justify-center gap-3 text-3xl md:text-5xl font-extrabold text-blue-700 mb-3 drop-shadow-lg">
          Our Blog
        </h2>
      </div>

      {/* ===== Blog Preview (first 4 only) ===== */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No articles yet.</p>
      ) : (
        <>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {blog.image && (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className="object-cover w-full h-56"
                  />
                )}
                <div className="p-5 text-left">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <span> {blog.author?.name}</span>
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Show More Button ===== */}
          <div className="text-center mt-10">
            <button
              onClick={handleShowMore}
              className="inline-block bg-blue-700 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition"
            >
              Show More
            </button>
          </div>
        </>
      )}
    </section>
  );
}
