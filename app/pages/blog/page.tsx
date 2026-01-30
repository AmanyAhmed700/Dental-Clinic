"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiArticleLine } from "react-icons/ri";

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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/login");
        return;
      }

      try {
        const [res] = await Promise.all([
          fetch("/api/blog", { cache: "no-store" }),
          new Promise((resolve) => setTimeout(resolve, 500)), // delay UI flicker
        ]);

        const data = await res.json();
        if (data.success) setBlogs(data.blogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
        setCheckingAuth(false);
      }
    };

    checkUserAndFetch();
  }, [router]);

  if (checkingAuth)
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Checking login...
      </div>
    );

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 text-lg animate-pulse">
        Loading articles...
      </div>
    );

  return (
    <section className="relative ">
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h2 className="flex items-center justify-center gap-3 text-3xl md:text-5xl font-extrabold text-blue-700 mb-3 drop-shadow-lg">
            <RiArticleLine className="text-blue-600 text-4xl md:text-6xl" />
            Our Blog
          </h2>
        </div>
      </div>

      <div className="-mt-20 md:-mt-28 relative z-10 px-6 md:px-20 pb-16">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No articles yet.</p>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => {
              const shortContent =
                blog.content.split(" ").slice(0, 10).join(" ") + "...";
              return (
                <div
                  key={blog.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
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
                    <p className="text-gray-700 text-sm mb-3">{shortContent}</p>

                    <button
                      onClick={() => router.push(`/pages/blog/${blog.id}`)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Read More →
                    </button>

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <span>{blog.author?.name}</span>
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
