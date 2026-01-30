"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
}

export default function DoctorBlogsDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); //  بدأنا التحميل بحالة true
  const [searchTerm, setSearchTerm] = useState("");

  //  Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
        } else {
          toast.error("Failed to load blogs");
        }
      } catch (err) {
        toast.error("An error occurred while loading blogs");
      } finally {
        
        setTimeout(() => setLoading(false),100); // delay بسيط لتحسين السلاسة
      }
    };

    fetchBlogs();
  }, []);

  //  Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, image: reader.result as string } : b))
      );
    };
    reader.readAsDataURL(file);
  };

  //  Delete a blog
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Blog deleted successfully");
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else toast.error("Failed to delete blog");
    } catch {
      toast.error("An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  //  Save blog edits
  const handleSave = async (blog: Blog) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Changes saved successfully");
        setEditingBlog(null);
      } else toast.error("Failed to save changes");
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  //  تصفية المدونات حسب البحث
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  أثناء التحميل
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <div className="w-10 h-10  mb-4"></div>
        <p className="text-lg font-medium">Loading blogs...</p>
      </div>
    );
  }

  //  بعد انتهاء التحميل — لو مفيش بيانات
  if (!loading && blogs.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500 text-lg">
        No blogs found.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* العنوان والإحصائيات */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Blog Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage and edit your blog posts
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-blue-600">{blogs.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Blogs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {blogs.filter(b => b.image).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">With Images</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-lg sm:text-xl font-bold text-purple-600">
            {blogs.filter(b => !b.image).length}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Without Images</div>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search blogs by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {filteredBlogs.length} of {blogs.length} blogs
          </div>
        </div>
      </div>

      {/* جدول المدونات - للشاشات المتوسطة والكبيرة */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Content
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    {blogs.length === 0 ? "No blogs found" : "No blogs match your search"}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="p-4">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      {editingBlog === blog.id && (
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, blog.id)}
                            className="block w-full text-xs text-gray-600"
                          />
                        </div>
                      )}
                    </td>

                    {/* العنوان */}
                    <td className="p-4">
                      {editingBlog === blog.id ? (
                        <input
                          type="text"
                          value={blog.title}
                          onChange={(e) =>
                            setBlogs((prev) =>
                              prev.map((b) =>
                                b.id === blog.id ? { ...b, title: e.target.value } : b
                              )
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Blog title"
                        />
                      ) : (
                        <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                          {blog.title}
                        </p>
                      )}
                    </td>

                    {/* المحتوى */}
                    <td className="p-4">
                      {editingBlog === blog.id ? (
                        <textarea
                          value={blog.content}
                          onChange={(e) =>
                            setBlogs((prev) =>
                              prev.map((b) =>
                                b.id === blog.id
                                  ? { ...b, content: e.target.value }
                                  : b
                              )
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-32"
                          placeholder="Blog content"
                        />
                      ) : (
                        <p className="text-gray-700 text-sm line-clamp-4">
                          {blog.content}
                        </p>
                      )}
                    </td>

                    {/* الإجراءات */}
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {editingBlog === blog.id ? (
                          <>
                            <button
                              onClick={() => handleSave(blog)}
                              disabled={loading}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingBlog(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingBlog(blog.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              disabled={loading}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* بطاقات المدونات - للشاشات الصغيرة والمتوسطة */}
      <div className="lg:hidden space-y-6">
        {filteredBlogs.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-500">
              {blogs.length === 0 ? "No blogs found" : "No blogs match your search"}
            </div>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              {/* رأس البطاقة */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                {/* الصورة */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 96px, 128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  {editingBlog === blog.id && (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, blog.id)}
                        className="block w-full text-xs text-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* المحتوى */}
                <div className="flex-1 min-w-0">
                  {editingBlog === blog.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={blog.title}
                        onChange={(e) =>
                          setBlogs((prev) =>
                            prev.map((b) =>
                              b.id === blog.id ? { ...b, title: e.target.value } : b
                            )
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Blog title"
                      />
                      <textarea
                        value={blog.content}
                        onChange={(e) =>
                          setBlogs((prev) =>
                            prev.map((b) =>
                              b.id === blog.id
                                ? { ...b, content: e.target.value }
                                : b
                            )
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-24"
                        placeholder="Blog content"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {blog.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {editingBlog === blog.id ? (
                  <>
                    <button
                      onClick={() => handleSave(blog)}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 min-w-[120px]"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditingBlog(null)}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium min-w-[120px]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingBlog(blog.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-w-[100px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium min-w-[100px] disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}