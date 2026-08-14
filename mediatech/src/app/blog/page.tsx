"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import { BLOG_CATEGORIES, TOP_ARTICLES, BlogPost } from "@/lib/blog-data";
import { getCombinedBlogPosts } from "@/lib/blog-store";
import {
  DEFAULT_BLOG_PAGE_CONTENT,
  BlogPageContent,
} from "@/lib/page-content-data";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "View all": "Explore all startup growth, SEO strategy, link building, and digital PR articles.",
  "Blogging & Copywriting": "Actionable copywriting blueprints to write high-converting articles and pitch drafts.",
  "Guest Posting Tips": "Battle-tested guest posting strategies to acquire high-DA contextual backlinks.",
  "Content Marketing": "Topic cluster frameworks and content distribution systems for scaling organic reach.",
  "MediaHub Tutorials & News": "Guides on using MediaHub escrow payments, verified publisher metrics, and platform updates.",
  "Influencer Marketing": "YouTube and Instagram sponsorship strategies to drive high-ROI user acquisition.",
  "SEO Articles": "Technical SEO audits, domain migrations, and Core Web Vitals optimization guides.",
  "AI & Technologies": "Generative Engine Optimization (GEO), AI search visibility, and agency reporting tools.",
  "Expert Interviews": "Exclusive Q&A insights with SEO industry leaders and SaaS startup founders.",
};

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("View all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => getCombinedBlogPosts());
  const [blogContent, setBlogContent] = useState<BlogPageContent>(DEFAULT_BLOG_PAGE_CONTENT);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          setAllPosts(data.posts);
        }
      })
      .catch((err) => console.error("Failed to fetch live blogs", err));

    fetch("/api/cms/page?key=blog_page_data")
      .then((res) => res.json())
      .then((data) => {
        if (data.html) {
          try {
            const parsed = JSON.parse(data.html);
            setBlogContent((prev) => ({ ...prev, ...parsed }));
          } catch (e) {}
        }
      })
      .catch((e) => {});
  }, []);

  const featuredPost = allPosts.find((post) => post.featured) || allPosts[0] || getCombinedBlogPosts()[0];

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = selectedCategory === "View all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedPosts = allPosts.filter((p) => p.featured || p.readTime);
  const currentRecommended = recommendedPosts[recommendedIndex % (recommendedPosts.length || 1)] || allPosts[0];

  const nextRecommended = () => {
    setRecommendedIndex((prev) => (prev + 1) % (recommendedPosts.length || 1));
  };
  const prevRecommended = () => {
    setRecommendedIndex((prev) => (prev - 1 + (recommendedPosts.length || 1)) % (recommendedPosts.length || 1));
  };

  const c = blogContent;

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white">
      {/* Header */}
      <PublicHeader activePage="blog" />

      {/* Main Container */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 max-w-[1600px] mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─────────────────────────────────────────────
             LEFT SIDEBAR (Search, Categories, SERP Promo Widget, Top Articles)
             ───────────────────────────────────────────── */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* 1. Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-11 py-3.5 bg-white rounded-full text-sm text-[#112C3E] placeholder-[#677F9B] border border-[#EAF1F6] focus:border-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 transition shadow-xs font-medium"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-[#677F9B] absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* 2. Categories List */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAF1F6] shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#112C3E] font-space">Categories</h3>
              <div className="space-y-1">
                {BLOG_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count =
                    cat === "View all"
                      ? allPosts.length
                      : allPosts.filter((p) => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? "bg-[#FEF3C7] text-[#D97706] shadow-xs"
                          : "text-[#677F9B] hover:bg-[#F8FAFC] hover:text-[#112C3E]"
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        isActive ? "bg-[#F59E0B] text-white" : "bg-[#EAF0F5] text-[#677F9B]"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SERP Rankings Dark Promo Card Widget (Exact Design As Is) */}
            <div className="bg-[#0B1E2E] rounded-3xl p-6 text-white space-y-4 shadow-xl border border-[#1E3A52] relative overflow-hidden group">
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold font-space leading-tight">
                  {c.serpPromoTitle}
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {c.serpPromoSubtitle}
                </p>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F59E0B] text-[#0B1E2E] font-extrabold text-xs hover:bg-white transition-all shadow-md group-hover:scale-105"
              >
                <span>{c.serpPromoBtn}</span>
                <ArrowUpRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* 4. Top Articles */}
            <div className="space-y-3 pt-2 border-t border-[#EAF1F6]">
              <h3 className="text-base font-bold text-[#112C3E] font-space">Top articles</h3>
              <div className="space-y-2">
                {TOP_ARTICLES.slice(0, 4).map((art, idx) => (
                  <Link
                    key={idx}
                    href={`/blog/${art.slug}`}
                    className="block p-3 rounded-2xl bg-white border border-[#EAF1F6] hover:border-amber-300 hover:shadow-xs transition group"
                  >
                    <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider block mb-1">
                      TOP ARTICLE
                    </span>
                    <h5 className="text-xs font-bold text-[#112C3E] group-hover:text-[#F59E0B] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ─────────────────────────────────────────────
             RIGHT MAIN CONTENT (Page Title, Featured Card, Recommended Carousel, Articles Grid)
             ───────────────────────────────────────────── */}
          <section className="lg:col-span-9 space-y-10">
            
            {/* 1. Page Header (Exact Design As Is) */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#112C3E] tracking-tight font-space leading-[1.12]">
                {c.heroHeadline}
              </h1>
            </div>

            {/* 2. Featured Article Spotlight Card (Visible when View All & no search) */}
            {featuredPost && !searchQuery && selectedCategory === "View all" && (
              <div className="bg-white rounded-3xl border border-[#EAF1F6] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-12 group">
                {/* Image */}
                <div className="md:col-span-7 relative min-h-[280px] md:min-h-[360px] overflow-hidden bg-[#E2E8F0]">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-black/90 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {featuredPost.category}
                  </span>
                </div>

                {/* Details */}
                <div className="md:col-span-5 p-6 md:p-10 flex flex-col justify-center space-y-4 bg-white">
                  <span className="text-xs font-semibold text-[#677F9B]">
                    {featuredPost.publishDate}
                  </span>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#112C3E] font-space group-hover:text-[#F59E0B] transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#677F9B] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] hover:text-amber-700 transition"
                    >
                      <span>Read Full Article</span>
                      <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Recommended Articles Carousel (Header + Nav Arrows) */}
            {currentRecommended && !searchQuery && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAF1F6] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <h3 className="text-lg font-bold text-[#112C3E] font-space">Recommended Articles</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevRecommended}
                      className="p-2 rounded-full border border-[#EAF1F6] hover:bg-[#F8FAFC] text-[#677F9B] hover:text-[#112C3E] transition"
                      aria-label="Previous recommended article"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextRecommended}
                      className="p-2 rounded-full border border-[#EAF1F6] hover:bg-[#F8FAFC] text-[#677F9B] hover:text-[#112C3E] transition"
                      aria-label="Next recommended article"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 h-40 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={currentRecommended.featuredImage}
                      alt={currentRecommended.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-1 rounded-md">
                      {currentRecommended.category}
                    </span>
                    <Link href={`/blog/${currentRecommended.slug}`}>
                      <h4 className="text-base sm:text-lg font-bold text-[#112C3E] hover:text-[#F59E0B] transition font-space">
                        {currentRecommended.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-[#677F9B] line-clamp-2 leading-relaxed">
                      {currentRecommended.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Active Filter / Category Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#112C3E] font-space">
                  {selectedCategory === "View all" ? "All Articles" : selectedCategory}
                </h3>
                <p className="text-xs sm:text-sm text-[#677F9B]">
                  {CATEGORY_DESCRIPTIONS[selectedCategory] || `Articles related to ${selectedCategory}.`}
                </p>
              </div>

              <div className="text-xs font-bold text-[#677F9B] bg-white px-3.5 py-1.5 rounded-full border border-[#EAF1F6] self-start sm:self-auto">
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
              </div>
            </div>

            {/* 5. Articles Grid */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAF1F6] p-12 text-center space-y-3">
                <p className="text-base font-bold text-[#112C3E]">No articles found</p>
                <p className="text-xs text-[#677F9B]">
                  Try adjusting your search keywords or pick a different category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("View all");
                    setSearchQuery("");
                  }}
                  className="px-5 py-2 rounded-full bg-[#F59E0B] text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-3xl border border-[#EAF1F6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Image */}
                      <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#112C3E] to-[#1E3A52] flex items-center justify-center text-white font-bold text-lg font-space">
                            MediaHub Blog
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="text-[11px] font-semibold text-[#677F9B]">
                          {post.publishDate}
                        </div>

                        <h4 className="text-base font-bold text-[#112C3E] font-space group-hover:text-[#F59E0B] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>

                        <p className="text-xs text-[#677F9B] leading-relaxed line-clamp-3 font-normal">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-[#F8FAFC] flex items-center justify-between text-xs font-bold text-[#F59E0B]">
                      <span>Read article</span>
                      <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </section>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
