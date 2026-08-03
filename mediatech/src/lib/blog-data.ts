export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishDate: string;
  readTime: string;
  featuredImage: string;
  author: Author;
  featured?: boolean;
  tableOfContents?: { id: string; title: string }[];
  keyTakeaways?: string[];
  contentHtml?: string;
}

export const BLOG_CATEGORIES = [
  "View all",
  "Blogging & Copywriting",
  "Guest Posting Tips",
  "Content Marketing",
  "MediaHub Tutorials & News",
  "Influencer Marketing",
  "SEO Articles",
  "AI & Technologies",
  "Expert Interviews",
] as const;

export const TOP_ARTICLES = [
  {
    title: "Case Study: How Fello Grew DR 12 to 29, and 2x Boosted Organic Impressions",
    slug: "case-study-how-fello-grew-dr-12-to-29",
  },
  {
    title: "The Founders' Guide to B2B Copywriting: Turning Readers into Customers",
    slug: "mastering-b2b-copywriting-for-startups",
  },
  {
    title: "YouTube & Instagram Sponsorships for Startups: ROI Framework",
    slug: "influencer-sponsorship-guide-for-tech-startups",
  },
  {
    title: "MediaHub Platform Walkthrough: How Escrow Protection Works",
    slug: "mediahub-platform-guide-advertisers-publishers",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  // 1. SEO Articles (Featured)
  {
    slug: "ultimate-seo-migration-checklist-2026",
    title: "The Ultimate SEO Migration Checklist: 11 Steps to Protect Your Rankings",
    excerpt:
      "Planning a site redesign or domain migration? Discover our battle-tested 11-step checklist to transfer domain authority and preserve organic search traffic without losing rankings.",
    category: "SEO Articles",
    publishDate: "Jul 30, 2026",
    readTime: "12 min read",
    featured: true,
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Marcus Vance",
      role: "Head of Growth & Digital PR",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tableOfContents: [
      { id: "step-1", title: "1. Audit All Existing URLs & Backlink Profile" },
      { id: "step-2", title: "2. Map Old URLs to New URLs 1:1" },
      { id: "step-3", title: "3. Preserve Canonical Tags & Structured Data" },
      { id: "step-4", title: "4. Staging Site Technical Checks & Noindex Safety" },
      { id: "step-5", title: "5. Implement Permanent 301 Redirects" },
      { id: "step-6", title: "6. Update Google Search Console & XML Sitemap" },
    ],
    keyTakeaways: [
      "Always create a comprehensive URL mapping spreadsheet before touching a single line of DNS configuration.",
      "Ensure all 301 redirects are direct 1:1 redirects rather than chained redirects to avoid losing link equity.",
      "Keep the old domain active and monitored in Google Search Console for at least 180 days post-migration.",
      "Leverage MediaHub guest post campaigns to earn fresh high-DR contextual backlinks to accelerate indexation.",
    ],
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        A website migration is one of the highest-risk operations an SEO or digital marketing team can undertake. Whether you are changing domain names, switching CMS platforms, or restructuring your URL architecture, a single missed 301 redirect can wipe out years of accumulated domain rating (DR) and organic traffic.
      </p>
      <h2 id="step-1" class="text-2xl font-bold text-[#112C3E] mt-10 mb-4 font-space">1. Audit All Existing URLs & Backlink Profile</h2>
      <p class="text-[#475569] leading-relaxed mb-6">
        Before launching any migration, perform a full crawl of your site using Screaming Frog or Ahrefs. Extract every active indexable URL, along with its historical page views and backlink counts. Pay special attention to high-performing landing pages and pages with backlinks from authority publishers.
      </p>
      <h2 id="step-2" class="text-2xl font-bold text-[#112C3E] mt-10 mb-4 font-space">2. Map Old URLs to New URLs 1:1</h2>
      <p class="text-[#475569] leading-relaxed mb-6">
        Map every single old URL to its exact corresponding URL on the new structure. Avoid redirecting all legacy pages to the homepage, as Google treats mass homepage redirects as soft 404s and drops page-level link authority.
      </p>
    `,
  },

  // 2. Blogging & Copywriting
  {
    slug: "mastering-b2b-copywriting-for-startups",
    title: "The Founders' Guide to B2B Copywriting: Turning Readers into Customers",
    excerpt:
      "Learn how early-stage tech founders write persuasive, benefit-driven copy for blog posts, landing pages, and guest articles to drive real product signups.",
    category: "Blogging & Copywriting",
    publishDate: "Aug 01, 2026",
    readTime: "8 min read",
    featuredImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Sophia Martinez",
      role: "Lead Content Copywriter",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    keyTakeaways: [
      "Focus on customer pain points rather than listing product features.",
      "Include a single, prominent Call to Action (CTA) in every guest post and blog article.",
      "Use clear, jargon-free headlines that pass the '5-second clarity test'.",
    ],
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Copywriting is the highest-leverage skill a startup team can master. When publishing articles on MediaHub publisher sites or your own startup blog, your words determine whether a reader clicks away or becomes a paying customer.
      </p>
    `,
  },
  {
    slug: "how-to-write-high-converting-guest-post-content-2026",
    title: "How to Write Guest Posts That Pass Publisher Editorial Review & Rank Fast",
    excerpt:
      "A step-by-step copywriting template for drafting high-quality articles that site owners approve instantly while naturally integrating your brand backlinks.",
    category: "Blogging & Copywriting",
    publishDate: "Jul 22, 2026",
    readTime: "6 min read",
    featuredImage: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Sophia Martinez",
      role: "Lead Content Copywriter",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        High-tier media outlets receive dozens of submission drafts daily. To ensure your guest post gets accepted without revisions, structure your content with actionable data, clear subheadings, and contextual link placements.
      </p>
    `,
  },

  // 3. Guest Posting Tips
  {
    slug: "case-study-how-fello-grew-dr-12-to-29",
    title: "Case Study: How Fello Grew DR 12 to 29, and 2x Boosted Organic Impressions",
    excerpt:
      "See how real estate tech platform Fello used MediaHub's targeted publisher filter to acquire 45 high-DR niche contextual placements in under 60 days.",
    category: "Guest Posting Tips",
    publishDate: "Jul 25, 2026",
    readTime: "9 min read",
    featuredImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Elena Rostova",
      role: "SEO Strategist & Link Building Lead",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    keyTakeaways: [
      "Targeting niche-relevant publications with DR 40+ generated faster indexation and higher ranking boosts than generic web directories.",
      "Diversifying anchor text distribution between brand names, partial matches, and exact keywords kept the link profile natural.",
    ],
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Discover the step-by-step strategy Fello executed on MediaHub to double their organic traffic and rank #1 for high-intent real estate lead generation keywords.
      </p>
    `,
  },

  // 4. Content Marketing
  {
    slug: "innovative-marketing-strategies-2026",
    title: "9 Innovative Content Marketing Strategies That Help Brands Stand Out in Crowded Markets",
    excerpt:
      "Explore 9 modern marketing strategies combining content marketing, digital PR, and social proof to establish market authority.",
    category: "Content Marketing",
    publishDate: "Jul 18, 2026",
    readTime: "7 min read",
    featuredImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "David Sterling",
      role: "Senior Content Editor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Standing out in today's saturated digital landscape requires more than just standard ads. Learn how top brands build lasting organic authority.
      </p>
    `,
  },

  // 5. MediaHub Tutorials & News
  {
    slug: "mediahub-platform-guide-advertisers-publishers",
    title: "MediaHub Platform Walkthrough: How Escrow Protection & Metrics Work",
    excerpt:
      "A complete walkthrough of the MediaHub marketplace for publishers and advertisers. Learn how automated Moz DA/Ahrefs DR syncing and escrow payouts protect every transaction.",
    category: "MediaHub Tutorials & News",
    publishDate: "Jul 29, 2026",
    readTime: "5 min read",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Marcus Vance",
      role: "Head of Growth & Digital PR",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    keyTakeaways: [
      "MediaHub holds advertiser payments safely in escrow until the publisher delivers a live verified link.",
      "Publishers get paid instantly via UPI, PayPal, Wise, or Bank Transfer once post requirements are confirmed.",
    ],
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Welcome to MediaHub! This guide walks you through setting up your account, discovering high-authority publisher websites, filtering by organic traffic metrics, and placing escrow-secured guest post orders.
      </p>
    `,
  },
  {
    slug: "best-advertising-platforms-2026",
    title: "17 Best Advertising Platforms: Which Ones Do Startup Founders Actually Need?",
    excerpt:
      "A comprehensive analysis of top digital advertising platforms, ROI benchmarks, and how guest posting compares to paid ad acquisition costs.",
    category: "MediaHub Tutorials & News",
    publishDate: "Jul 10, 2026",
    readTime: "10 min read",
    featuredImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Marcus Vance",
      role: "Head of Growth & Digital PR",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Choosing the right advertising channels can make or break your marketing budget. Compare search, social, and guest publishing ROI side by side.
      </p>
    `,
  },

  // 6. Influencer Marketing
  {
    slug: "influencer-sponsorship-guide-for-tech-startups",
    title: "YouTube & Instagram Sponsorships for Startups: A Complete ROI Framework",
    excerpt:
      "How early-stage tech companies partner with YouTube creators and Instagram influencers to launch products and drive low-CAC user signups.",
    category: "Influencer Marketing",
    publishDate: "Jul 27, 2026",
    readTime: "8 min read",
    featuredImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Alex Rivera",
      role: "Influencer Relations Lead",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    keyTakeaways: [
      "Micro-influencers (10k-50k followers) offer up to 4x higher engagement rates than mega-celebrities.",
      "Bundle YouTube integrations with custom promo codes to track exact conversion attribution.",
    ],
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Influencer marketing has evolved into a performance-driven acquisition channel for modern startups. Discover how to negotiate packages, verify audience demographics, and manage influencer deliverables seamlessly on MediaHub.
      </p>
    `,
  },

  // 7. SEO Articles
  {
    slug: "technical-seo-audit-checklist-for-startups",
    title: "The 15-Minute Technical SEO Audit Checklist for New Startup Websites",
    excerpt:
      "Fix crawl errors, optimize page speed performance, configure canonical tags, and resolve indexation issues before launching your SEO campaign.",
    category: "SEO Articles",
    publishDate: "Jul 15, 2026",
    readTime: "7 min read",
    featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Marcus Vance",
      role: "Head of Growth & Digital PR",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Before spending budget on backlinks, ensure your site's technical foundation is rock solid. This checklist covers core web vitals, sitemap validation, and mobile responsiveness.
      </p>
    `,
  },

  // 8. AI & Technologies
  {
    slug: "ppc-reporting-tools-2026",
    title: "17 PPC & AI Reporting Tools for Agencies, Freelancers, and Enterprises",
    excerpt:
      "Discover top reporting platforms to streamline campaign tracking, automated client dashboards, and AI-driven conversion attribution.",
    category: "AI & Technologies",
    publishDate: "Jun 28, 2026",
    readTime: "8 min read",
    featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "Elena Rostova",
      role: "SEO Strategist & Link Building Lead",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        Automate your client reporting workflows with these 17 vetted reporting tools for PPC, SEO, and AI generative engine optimization.
      </p>
    `,
  },

  // 9. Expert Interviews
  {
    slug: "cyrus-shepard-ending-user-search-journey",
    title: "Cyrus Shepard: 'Create Pages That End The User's Search Journey' & Interview Highlights",
    excerpt:
      "Industry veteran Cyrus Shepard breaks down search intent optimization, helpful content algorithms, and how user engagement signals shape modern search rankings.",
    category: "Expert Interviews",
    publishDate: "Jun 20, 2026",
    readTime: "6 min read",
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    author: {
      name: "David Sterling",
      role: "Senior Content Editor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    contentHtml: `
      <p class="text-lg leading-relaxed text-[#475569] mb-6">
        In this exclusive interview, Cyrus Shepard breaks down searcher intent and how to build high-satisfaction landing pages that rank #1.
      </p>
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const filtered = BLOG_POSTS.filter((post) => post.slug !== currentSlug && (post.category === category || category === "View all"));
  if (filtered.length >= limit) return filtered.slice(0, limit);
  const remaining = BLOG_POSTS.filter((post) => post.slug !== currentSlug && !filtered.includes(post));
  return [...filtered, ...remaining].slice(0, limit);
}
