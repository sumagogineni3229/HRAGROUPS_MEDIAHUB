"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import { BLOG_CATEGORIES, TOP_ARTICLES, BlogPost } from "@/lib/blog-data";
import { getCombinedBlogPosts } from "@/lib/blog-store";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/solid";

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

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          setAllPosts(data.posts);
        }
      })
      .catch((err) => console.error("Failed to fetch live blogs", err));
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

  const recommendedPosts = allPosts.filter((post) => post.slug !== featuredPost?.slug);

  const handleNextRecommended = () => {
    setRecommendedIndex((prev) => (prev + 1) % Math.max(1, recommendedPosts.length - 2));
  };

  const handlePrevRecommended = () => {
    setRecommendedIndex((prev) => (prev - 1 + Math.max(1, recommendedPosts.length - 2)) % Math.max(1, recommendedPosts.length - 2));
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#112C3E] font-sans antialiased selection:bg-[#F59E0B] selection:text-white">
      {/* Public Header with NEW Badge on Blog */}
      <PublicHeader activePage="blog" />

      {/* FULLSCREEN MAIN CONTAINER */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ─────────────────────────────────────────────
             LEFT SIDEBAR (Search, Categories, SERP Promo, Top Articles)
             ───────────────────────────────────────────── */}
          <aside className="lg:col-span-3 space-y-8">
            
            {/* 1. Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-3 bg-[#E9F0F5] rounded-full text-sm text-[#112C3E] placeholder-[#677F9B] border border-[#D5E1EA] focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition shadow-inner"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-[#677F9B] absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* 2. Categories */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#112C3E] font-space">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {BLOG_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  const count = category === "View all" 
                    ? allPosts.length 
                    : allPosts.filter(p => p.category === category).length;
                    
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#FEF3C7] text-[#D97706] border border-[#F59E0B]/40 font-bold shadow-sm"
                          : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F0F4F8] hover:text-[#112C3E]"
                      }`}
                    >
                      <span>{category}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-[#112C3E] text-white" : "bg-[#F0F4F8] text-[#677F9B]"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SERP Rankings Dark Promo Card Widget */}
            <div className="bg-[#0B1E2E] rounded-3xl p-6 text-white space-y-4 shadow-xl border border-[#1E3A52] relative overflow-hidden group">
              <div className="space-y-1">
                <h4 className="text-xl font-extrabold font-space leading-tight">
                  Grow your <br />
                  <span className="text-[#F59E0B]">SERP Rankings</span>
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Place content on DA40+ guest posting sites
                </p>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F59E0B] text-[#0B1E2E] font-extrabold text-xs hover:bg-white transition-all shadow-md group-hover:scale-105"
              >
                <span>Sign Up for Free</span>
                <ArrowUpRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* 4. Top Articles */}
            <div className="space-y-3 pt-2 border-t border-[#EAF1F6]">
              <h3 className="text-base font-bold text-[#112C3E] font-space">Top articles</h3>
              <div className="space-y-3.5">
                {TOP_ARTICLES.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="block text-xs font-semibold text-[#475569] hover:text-[#F59E0B] leading-relaxed transition hover:underline"
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ─────────────────────────────────────────────
             RIGHT MAIN CONTENT (Page Title, Featured Card, Recommended Carousel, Articles Grid)
             ───────────────────────────────────────────── */}
          <section className="lg:col-span-9 space-y-10">
            
            {/* 1. Page Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#112C3E] tracking-tight font-space leading-[1.12]">
                MediaHub Blog: Your SEO & Marketing Trends and Insights
              </h1>
            </div>

            {/* 2. Featured Article Spotlight Card (Visible when View All & no search) */}
            {featuredPost && !searchQuery && selectedCategory === "View all" && (
              <div className="bg-white rounded-3xl border border-[#EAF1F6] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-12 group">
                {/* Image (Left side) */}
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

                {/* Details (Right side) */}
                <div className="md:col-span-5 p-6 md:p-10 flex flex-col justify-center space-y-4 bg-white">
                  <span className="text-xs font-semibold text-[#677F9B]">
                    {featuredPost.publishDate}
                  </span>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#112C3E] font-space group-hover:text-[#F59E0B] transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-[#677F9B] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-2.5 pt-2">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#EAF1F6]"
                    />
                    <span className="text-xs font-semibold text-[#475569]">
                      {featuredPost.author.name}
                    </span>
                    <span className="text-xs text-[#94A3B8]">• {featuredPost.readTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Recommended Articles Section with Arrows */}
            {!searchQuery && selectedCategory === "View all" && (
              <div className="space-y-6 pt-4 border-t border-[#EAF1F6]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112C3E] font-space">
                    Recommended Articles
                  </h2>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevRecommended}
                      className="w-9 h-9 rounded-full border border-[#D9E2EC] bg-white flex items-center justify-center text-[#112C3E] hover:bg-[#EAF1F6] transition shadow-sm"
                      aria-label="Previous Recommended Article"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextRecommended}
                      className="w-9 h-9 rounded-full border border-[#D9E2EC] bg-[#112C3E] flex items-center justify-center text-white hover:bg-[#F59E0B] transition shadow-sm"
                      aria-label="Next Recommended Article"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recommended Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedPosts.slice(recommendedIndex, recommendedIndex + 3).map((post) => (
                    <div
                      key={post.slug}
                      className="bg-white rounded-3xl border border-[#EAF1F6] shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image */}
                        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-[#E2E8F0]">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-black/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            {post.category}
                          </span>
                        </Link>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          <span className="text-[11px] font-semibold text-[#677F9B]">
                            {post.publishDate}
                          </span>

                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="text-base font-bold text-[#112C3E] font-space group-hover:text-[#F59E0B] transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-[#677F9B] line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Footer author */}
                      <div className="px-5 py-3.5 border-t border-[#EAF1F6] flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-[#EAF1F6]"
                        />
                        <span className="text-xs font-semibold text-[#475569]">{post.author.name}</span>
                        <span className="text-xs text-[#94A3B8]">• {post.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Filtered Articles Section */}
            <div className="space-y-6 pt-6 border-t border-[#EAF1F6]">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112C3E] font-space">
                    {selectedCategory === "View all" ? "All Articles" : selectedCategory}
                  </h2>
                  <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-xs font-bold rounded-full">
                    {filteredPosts.length} {filteredPosts.length === 1 ? "Article" : "Articles"}
                  </span>
                </div>
                <p className="text-sm text-[#677F9B]">
                  {CATEGORY_DESCRIPTIONS[selectedCategory] || "Explore insightful articles and tactical guides."}
                </p>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#EAF1F6] p-10 text-center space-y-3">
                  <p className="text-sm font-semibold text-[#677F9B]">No articles match your search or category filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("View all");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 rounded-full bg-[#F59E0B] text-white text-xs font-bold"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.slug}
                      className="bg-white rounded-3xl border border-[#EAF1F6] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-[#E2E8F0]">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-black/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                            {post.category}
                          </span>
                        </Link>

                        <div className="p-5 space-y-2">
                          <span className="text-[11px] font-semibold text-[#677F9B]">{post.publishDate}</span>
                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="text-base font-bold text-[#112C3E] font-space group-hover:text-[#F59E0B] transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#677F9B] line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-[#EAF1F6] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-[#475569]">{post.author.name}</span>
                          <span className="text-xs text-[#94A3B8]">• {post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
