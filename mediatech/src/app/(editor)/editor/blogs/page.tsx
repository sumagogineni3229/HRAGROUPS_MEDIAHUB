"use client";

import { useState, useEffect } from "react";
import { BLOG_CATEGORIES, BlogPost } from "@/lib/blog-data";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PlusIcon, CheckCircleIcon, TrashIcon, PhotoIcon, EyeIcon } from "@heroicons/react/24/solid";

export default function EditorBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPreview, setIsPreview] = useState(false);

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
    authorName: "MediaHub Content Team",
    authorRole: "Senior Editor",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { compressImage } = await import("@/lib/image-utils");
        const compressed = await compressImage(file, 1200, 900, 0.82);
        setForm((prev) => ({ ...prev, featuredImage: compressed }));
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm((prev) => ({ ...prev, featuredImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
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
        throw new Error(data.error || "Failed to create blog post.");
      }

      setSuccessMsg("Blog post published successfully!");
      setForm({
        title: "",
        excerpt: "",
        category: BLOG_CATEGORIES[1],
        authorName: "MediaHub Content Team",
        authorRole: "Senior Editor",
        featuredImage: "",
        contentHtml: "",
      });
      fetchPosts();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create post.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-inter">
      <div>
        <h1 className="text-2xl font-bold font-space text-slate-900">Blog Editor & Content Publishing</h1>
        <p className="text-sm text-slate-500 font-inter mt-1">
          Create, edit, and publish blog posts. Insert inline images anywhere inside paragraphs and preview before publishing.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Create New Post Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-lg font-bold font-space text-slate-900 flex items-center gap-2">
            <PlusIcon className="w-5 h-5 text-amber-500" />
            Create & Publish Blog Post
          </h2>

          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <EyeIcon className="w-4 h-4 text-slate-500" />
            <span>{isPreview ? "Back to Editor" : "Preview Article"}</span>
          </button>
        </div>

        {isPreview ? (
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 space-y-4">
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Article Preview
            </span>
            <h1 className="text-3xl font-bold font-space text-slate-900">{form.title || "Untitled Article"}</h1>
            {form.featuredImage && (
              <img src={form.featuredImage} alt="Featured" className="w-full max-h-80 object-cover rounded-xl" />
            )}
            <div dangerouslySetInnerHTML={{ __html: form.contentHtml }} className="prose max-w-none text-slate-800" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 10 Link Building Strategies That Work in 2026"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  {BLOG_CATEGORIES.filter((c) => c !== "View all").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Author Name & Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    placeholder="Author Name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={form.authorRole}
                    onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                    placeholder="Author Role"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Excerpt *
              </label>
              <textarea
                rows={2}
                required
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A brief summary shown on blog cards and search results..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Featured Cover Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="https://images.unsplash.com/... or upload image"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                />
                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition">
                  <PhotoIcon className="w-4 h-4 text-slate-500" />
                  <span>Upload File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {form.featuredImage && (
                <div className="mt-2.5 relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={form.featuredImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Word-like Rich Content Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Article Body Content (Word-style Editor with Inline Image Insertion) *
              </label>
              <RichTextEditor
                value={form.contentHtml}
                onChange={(html) => setForm((prev) => ({ ...prev, contentHtml: html }))}
                minHeight="350px"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="px-6 py-3 bg-[#112C3E] text-white rounded-xl text-sm font-bold font-space hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
            >
              {creating ? "Publishing Post..." : "Publish Blog Post"}
            </button>
          </form>
        )}
      </div>

      {/* Published Posts Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl">
        <h2 className="text-lg font-bold font-space text-slate-900 mb-4">Published Articles ({posts.length})</h2>
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading articles...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <div key={post.slug} className="py-4 flex items-center justify-between gap-4">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 group flex-1"
                >
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt="" className="w-16 h-12 object-cover rounded-lg border border-slate-200 group-hover:opacity-90" />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-bold">
                      MH
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm group-hover:text-[#F59E0B] transition-colors flex items-center gap-1.5">
                      <span>{post.title}</span>
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        View ↗
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {post.category} · {post.publishDate}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    View Live
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.slug)}
                    disabled={deletingSlug === post.slug}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
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
