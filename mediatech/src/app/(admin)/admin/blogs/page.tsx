"use client";

import { useState, useEffect } from "react";
import { BLOG_CATEGORIES, BlogPost } from "@/lib/blog-data";
import { PlusIcon, CheckCircleIcon, SparklesIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/solid";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<{
    title: string;
    excerpt: string;
    category: string;
    authorName: string;
    authorRole: string;
    featuredImage: string;
    contentHtml: string;
  }>({
    title: "",
    excerpt: "",
    category: BLOG_CATEGORIES[1],
    authorName: "MediaHub Admin",
    authorRole: "Chief Content Strategist",
    featuredImage: "",
    contentHtml: "",
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, featuredImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setDeletingSlug(slug);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post.");
      }

      setSuccessMsg("Blog post deleted successfully.");
      fetchPosts();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete post.");
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish blog post.");
      }

      setSuccessMsg("Blog post published successfully! It is now live in the AI Engine (/blog).");
      setForm({
        title: "",
        excerpt: "",
        category: BLOG_CATEGORIES[1],
        authorName: "MediaHub Admin",
        authorRole: "Chief Content Strategist",
        featuredImage: "",
        contentHtml: "",
      });
      fetchPosts();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish post.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-space tracking-tight text-slate-950">
            Admin Blog Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and delete blog posts. Posts will immediately sync with the AI Engine (/blog).
          </p>
        </div>

        <a
          href="/blog"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-[#F59E0B] transition shadow-md"
        >
          <SparklesIcon className="w-4 h-4 text-amber-400" />
          <span>View Live AI Engine Blog →</span>
        </a>
      </div>

      {/* Create New Post Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
        <h2 className="text-xl font-bold font-space text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-[#F59E0B]" />
          <span>Post New Article to AI Engine</span>
        </h2>

        {successMsg && (
          <div className="p-4 bg-amber-50 text-[#D97706] border border-amber-200 rounded-2xl text-sm font-semibold flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-[#D97706]" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Article Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 AI SEO Strategies for Scaling Organic Reach"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 font-semibold"
              >
                {BLOG_CATEGORIES.filter((c) => c !== "View all").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Excerpt / Short Description *</label>
            <textarea
              required
              rows={2}
              placeholder="Brief summary of the article for blog cards..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900"
            />
          </div>

          {/* Featured Image Section (Upload & URL) */}
          <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <PhotoIcon className="w-4 h-4 text-[#F59E0B]" />
              <span>Blog Featured Image (Upload or Image URL)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Option A: Upload Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-[#D97706] hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Option B: Or Enter Image URL</span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#F59E0B] text-slate-900"
                />
              </div>
            </div>

            {/* Image Preview */}
            {form.featuredImage && (
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold">Preview:</span>
                <img
                  src={form.featuredImage}
                  alt="Blog Preview"
                  className="h-16 w-28 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Author Name</label>
              <input
                type="text"
                placeholder="MediaHub Admin"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Author Role</label>
              <input
                type="text"
                placeholder="Chief Content Strategist"
                value={form.authorRole}
                onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Article Full Content (HTML / Text)</label>
            <textarea
              rows={5}
              placeholder="Full article body content..."
              value={form.contentHtml}
              onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F59E0B] text-slate-900 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-extrabold text-sm hover:shadow-lg transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {creating ? "Publishing..." : "Publish Article to AI Engine"}
          </button>
        </form>
      </div>

      {/* Published Posts List with Delete Button */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold font-space text-slate-900 border-b border-slate-100 pb-3">
          All Published Articles ({posts.length})
        </h2>

        {loading ? (
          <p className="text-sm text-slate-400 py-4">Loading articles...</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <div key={post.slug} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-md bg-amber-100 text-[#D97706]">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{post.publishDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-space">{post.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{post.excerpt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:border-amber-400 hover:text-[#D97706] transition"
                  >
                    View Post →
                  </a>

                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deletingSlug === post.slug}
                    className="px-3 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>{deletingSlug === post.slug ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
