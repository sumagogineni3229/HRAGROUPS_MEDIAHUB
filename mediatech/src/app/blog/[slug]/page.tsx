"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { FloatingSupportWidget } from "@/components/layout/floating-support-widget";
import { getBlogPostBySlug, getRelatedPosts, BlogPost } from "@/lib/blog-data";
import {
  ClockIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShareIcon,
  CheckIcon,
  BookmarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const post: BlogPost | undefined = getBlogPostBySlug(slug);

  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] text-[#112C3E]">
        <PublicHeader activePage="blog" />
        <div className="max-w-md mx-auto my-20 bg-white p-10 rounded-3xl border border-[#EAF1F6] text-center space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold font-space">Article Not Found</h2>
          <p className="text-sm text-[#677F9B]">The blog article you are looking for does not exist or has been moved.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E4FEA] text-white font-bold text-xs"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog Index
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#112C3E] font-sans antialiased selection:bg-[#3E4FEA] selection:text-white">
      {/* Header */}
      <PublicHeader activePage="blog" />

      {/* 1. BREADCRUMBS & ARTICLE HEADER */}
      <section className="bg-white border-b border-[#EAF1F6] pt-8 pb-12">
        <div className="w-full px-6 sm:px-8 lg:px-12 space-y-6">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#677F9B]">
            <Link href="/" className="hover:text-[#3E4FEA] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#3E4FEA] transition">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#112C3E] truncate max-w-xs">{post.category}</span>
          </nav>

          {/* Category Pill */}
          <div className="inline-block bg-[#3E4FEA]/10 text-[#3E4FEA] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#112C3E] tracking-tight font-space leading-tight max-w-5xl">
            {post.title}
          </h1>

          <p className="text-lg text-[#677F9B] leading-relaxed max-w-4xl">
            {post.excerpt}
          </p>

          {/* Author & Meta Bar */}
          <div className="pt-4 border-t border-[#EAF1F6] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border border-[#EAF1F6]"
              />
              <div>
                <p className="text-sm font-bold text-[#112C3E]">{post.author.name}</p>
                <p className="text-xs text-[#677F9B]">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#677F9B]">
              <span className="flex items-center gap-1.5 bg-[#F5F8FA] px-3 py-1.5 rounded-full border border-[#EAF1F6]">
                <CalendarIcon className="w-4 h-4 text-[#3E4FEA]" />
                {post.publishDate}
              </span>
              <span className="flex items-center gap-1.5 bg-[#F5F8FA] px-3 py-1.5 rounded-full border border-[#EAF1F6]">
                <ClockIcon className="w-4 h-4 text-[#3E4FEA]" />
                {post.readTime}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 bg-[#3E4FEA]/10 hover:bg-[#3E4FEA]/20 text-[#3E4FEA] px-3 py-1.5 rounded-full font-bold transition"
              >
                {copied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <ShareIcon className="w-4 h-4" />}
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT LAYOUT */}
      <section className="py-12 w-full px-6 sm:px-8 lg:px-12">
        {/* Hero Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl mb-12 border border-[#EAF1F6]">
          <img src={post.featuredImage} alt={post.title} className="w-full h-auto rounded-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents & Sticky Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {post.tableOfContents && post.tableOfContents.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#EAF1F6] shadow-sm sticky top-28 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#112C3E] font-space flex items-center gap-2">
                  <BookmarkIcon className="w-4 h-4 text-[#3E4FEA]" />
                  <span>Table of Contents</span>
                </h3>
                <ul className="space-y-2 text-xs font-medium text-[#677F9B]">
                  {post.tableOfContents.map((toc) => (
                    <li key={toc.id}>
                      <a
                        href={`#${toc.id}`}
                        className="block hover:text-[#3E4FEA] transition py-1 hover:translate-x-1 duration-200"
                      >
                        {toc.title}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Mini Escrow Widget */}
                <div className="pt-4 border-t border-[#EAF1F6] bg-[#F5F8FA] p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#3E4FEA] font-bold">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>MediaHub Escrow Protected</span>
                  </div>
                  <p className="text-[#677F9B]">
                    Monetize your website or buy high-DA guest posts with 100% money-back guarantee.
                  </p>
                  <Link
                    href="/register"
                    className="block text-center mt-2 px-4 py-2 bg-[#3E4FEA] text-white font-extrabold rounded-lg hover:bg-[#112C3E] transition"
                  >
                    Join Marketplace
                  </Link>
                </div>
              </div>
            )}
          </aside>

          {/* Article Body Content */}
          <article className="lg:col-span-9 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#EAF1F6] shadow-sm">
            {/* Key Takeaways Callout Box */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-[#3E4FEA]/5 to-[#8CF08A]/10 border-l-4 border-[#3E4FEA] rounded-r-2xl space-y-3">
                <div className="flex items-center gap-2 text-[#3E4FEA] font-bold font-space text-base">
                  <SparklesIcon className="w-5 h-5" />
                  <span>Key Takeaways & Executive Summary</span>
                </div>
                <ul className="space-y-2 text-sm text-[#112C3E]">
                  {post.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#3E4FEA] mt-2 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formatted HTML Content */}
            {post.contentHtml ? (
              <div
                className="prose prose-slate max-w-none text-[#475569] leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : (
              <p className="text-[#475569] leading-relaxed">
                Full article content is available. Explore more digital PR strategies on MediaHub.
              </p>
            )}

            {/* Author Bio Box */}
            <div className="pt-8 border-t border-[#EAF1F6] flex items-start gap-4 bg-[#F5F8FA] p-6 rounded-2xl">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-[#112C3E] font-space text-base">{post.author.name}</h4>
                <p className="text-xs text-[#3E4FEA] font-semibold">{post.author.role}</p>
                <p className="text-xs text-[#677F9B] leading-relaxed">
                  Specializes in organic search growth, publisher relation management, and technical SEO architecture. Writes regular strategy guides for the MediaHub publication.
                </p>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-[#112C3E] to-[#3E4FEA] text-white p-8 rounded-2xl shadow-xl space-y-4 text-center">
              <h3 className="text-2xl font-bold font-space">
                Scale Your Organic Keyword Rankings Today
              </h3>
              <p className="text-sm text-white/80 max-w-xl mx-auto">
                Filter over 150,000+ verified blogs and news publications by Moz DA, Ahrefs DR, organic traffic, and target niche.
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-3.5 bg-[#8CF08A] text-[#112C3E] font-extrabold rounded-full hover:bg-white transition shadow-lg text-sm"
              >
                Start Guest Posting Campaign
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 3. RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="py-16 w-full px-6 sm:px-8 lg:px-12 border-t border-[#EAF1F6]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#112C3E] font-space">Related Articles</h3>
            <Link href="/blog" className="text-xs font-bold text-[#3E4FEA] hover:underline flex items-center gap-1">
              <span>View All Articles</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div key={rel.slug} className="bg-white rounded-2xl border border-[#EAF1F6] p-5 shadow-sm hover:shadow-md transition">
                <Link href={`/blog/${rel.slug}`}>
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E4FEA] bg-[#3E4FEA]/10 px-2.5 py-0.5 rounded-full">
                    {rel.category}
                  </span>
                  <h4 className="font-bold text-[#112C3E] mt-2 mb-1 text-sm font-space line-clamp-2 hover:text-[#3E4FEA]">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#677F9B] line-clamp-2">{rel.excerpt}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <PublicFooter />
      <FloatingSupportWidget />
    </div>
  );
}
