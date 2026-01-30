"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Blog post published successfully 🎉");
        router.push("/pages/blog");
      } else {
        toast.error(data.message || "Failed to publish the blog post");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while publishing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start md:items-center px-4 py-6 md:py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-4 md:p-8 w-full max-w-2xl space-y-4 md:space-y-6"
      >
        <h2 className="text-xl md:text-2xl font-bold text-black text-center">
          Add New Blog Post
        </h2>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Blog Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 md:p-3 focus:ring focus:ring-blue-200 text-sm md:text-base"
            placeholder="Enter the blog title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Blog Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-2 md:p-3 focus:ring focus:ring-blue-200 text-sm md:text-base"
            placeholder="Write your blog content here..."
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Blog Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm md:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 md:py-3 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}