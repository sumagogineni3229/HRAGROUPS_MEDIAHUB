// Structured Content Types & Defaults for 100% Design-Preserving Page Editing
import { FAQ_ITEMS, FaqItem } from "./faq-data";

// ─────────────────────────────────────────────
// 1. HOME PAGE
// ─────────────────────────────────────────────
export interface HomePageContent {
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroSubtitle: string;
  btnExplore: string;
  btnPublisher: string;
  btnInfluencer: string;
  btnDemo: string;

  metric1Value: string;
  metric1Label: string;
  metric2Value: string;
  metric2Label: string;
  metric3Value: string;
  metric3Label: string;
  metric4Value: string;
  metric4Label: string;

  demoBannerTitle: string;
  demoBannerSubtitle: string;
  demoBannerBtn: string;

  servicesBadge: string;
  servicesTitle: string;
  servicesSubtitle: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  service4Title: string;
  service4Desc: string;
  service5Title: string;
  service5Desc: string;

  pubCardBadge: string;
  pubCardTitle: string;
  pubCardDesc: string;
  pubCardBullet1: string;
  pubCardBullet2: string;
  pubCardBullet3: string;
  pubCardBullet4: string;
  pubCardBtn: string;

  infCardBadge: string;
  infCardTitle: string;
  infCardDesc: string;
  infCardBullet1: string;
  infCardBullet2: string;
  infCardBullet3: string;
  infCardBullet4: string;
  infCardBtn: string;

  howItWorksBadge: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  trust1Title: string;
  trust1Desc: string;
  trust2Title: string;
  trust2Desc: string;
  trust3Title: string;
  trust3Desc: string;

  ctaTitle: string;
  ctaSubtitle: string;
  ctaBtn1: string;
  ctaBtn2: string;
}

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  heroBadge: "The C-Suite trusted marketplace · MediaHub",
  heroTitle1: "The Premier Marketplace for",
  heroTitleHighlight: "Guest Posting, Link Building",
  heroTitle2: "& Influencer Marketing",
  heroSubtitle: "Connect with 150,000+ publishers, websites, bloggers, news portals, influencers and creators worldwide — all in one escrow-protected marketplace.",
  btnExplore: "Find Publishers",
  btnPublisher: "Monetize My Website",
  btnInfluencer: "Join as Influencer",
  btnDemo: "Book Demo Call",

  metric1Value: "152,384+",
  metric1Label: "Websites",
  metric2Value: "48,210+",
  metric2Label: "Influencers",
  metric3Value: "412,963+",
  metric3Label: "Orders Completed",
  metric4Value: "87,521+",
  metric4Label: "Active Users",

  demoBannerTitle: "Looking for customized enterprise PR distribution?",
  demoBannerSubtitle: "Schedule a 15-minute consultation with our media strategists.",
  demoBannerBtn: "Book Demo Call",

  servicesBadge: "Core Services",
  servicesTitle: "Everything you need to scale your authority",
  servicesSubtitle: "Five battle-tested products powering thousands of campaigns every month.",
  service1Title: "Link Insertion",
  service1Desc: "Place your link on an existing high-authority article — fast and cost-effective.",
  service2Title: "Guest Posting",
  service2Desc: "Publish on top-tier websites with editorial control and verified metrics.",
  service3Title: "Content + Guest Post",
  service3Desc: "We write expert content tailored to your niche and publish it for you.",
  service4Title: "Custom PR Packages",
  service4Desc: "Curated digital PR campaigns across news portals, magazines and trade media.",
  service5Title: "Influencer Marketing",
  service5Desc: "Sponsored posts, reels, stories & UGC from creators across every major platform.",

  pubCardBadge: "For Publishers",
  pubCardTitle: "Monetize your website on autopilot",
  pubCardDesc: "List your site once, set your prices and receive paid guest post + link insertion orders from vetted advertisers — every week.",
  pubCardBullet1: "Zero listing fees · 3% platform commission",
  pubCardBullet2: "Auto-payouts after buyer approval",
  pubCardBullet3: "Add unlimited websites & contributors",
  pubCardBullet4: "Real-time chat with advertisers",
  pubCardBtn: "Start earning",

  infCardBadge: "For Influencers",
  infCardTitle: "Turn your audience into income",
  infCardDesc: "Connect Instagram, YouTube, TikTok, LinkedIn, X and Facebook accounts to receive brand deals from global advertisers.",
  infCardBullet1: "Set your own rates for posts, reels & stories",
  infCardBullet2: "Escrow-protected payments — no chasing brands",
  infCardBullet3: "Audience demographics dashboard",
  infCardBullet4: "Get discovered by 50k+ active advertisers",
  infCardBtn: "Join as creator",

  howItWorksBadge: "How it works",
  howItWorksTitle: "From discovery to live placement in 4 steps",
  step1Title: "1. Discover",
  step1Desc: "Filter 150k+ websites & influencers by DA, DR, traffic, niche, country and price.",
  step2Title: "2. Fund Wallet",
  step2Desc: "Top up instantly via PhonePe, UPI, GPay, Paytm, Cards, or PayPal. Funds held safely in escrow.",
  step3Title: "3. Collaborate",
  step3Desc: "Chat directly with publishers. Submit content, briefs, links and creative assets.",
  step4Title: "4. Approve & Release",
  step4Desc: "Verify the placement. Funds release automatically. Auto-approve after 7 days.",

  trust1Title: "Escrow Protected",
  trust1Desc: "Every order is escrow-protected. Funds release only after you approve the placement.",
  trust2Title: "Verified Metrics",
  trust2Desc: "Live DA, DR, organic traffic, spam score and engagement data — never trust a stale screenshot again.",
  trust3Title: "Built for Scale",
  trust3Desc: "API, bulk orders, agency multi-seats, white-label reporting — for teams placing 100+ orders/month.",

  ctaTitle: "Ready to scale your authority?",
  ctaSubtitle: "Join 87,000+ marketers, agencies and creators already growing on MediaHub.",
  ctaBtn1: "Create free account",
  ctaBtn2: "Browse marketplace",
};

// ─────────────────────────────────────────────
// 2. SOLUTIONS / MARKETPLACE PAGE
// ─────────────────────────────────────────────
export interface SolutionTabContent {
  badge: string;
  heroHeadline: string;
  heroSubheadline: string;
  btn1Text: string;
  btn2Text: string;
  guarantee1: string;
  guarantee2: string;
  guarantee3: string;

  overviewTitle: string;
  overviewBadge: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;

  featuresHeading: string;
  featuresSubtitle: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;

  workflowBadge: string;
  workflowTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  comparisonBadge: string;
  comparisonTitle: string;
  comparisonSubtitle: string;
  comparisonCol1: string;
  comparisonCol2: string;
  comparisonRow1Left: string;
  comparisonRow1Right: string;
  comparisonRow2Left: string;
  comparisonRow2Right: string;
  comparisonRow3Left: string;
  comparisonRow3Right: string;
  comparisonRow4Left: string;
  comparisonRow4Right: string;

  ctaHeadline: string;
  ctaSubtitle: string;
  ctaBtn1: string;
  ctaBtn2: string;
}

export interface SolutionsPageContent {
  marketing: SolutionTabContent;
  advertisers: SolutionTabContent;
  brands: SolutionTabContent;
  agencies: SolutionTabContent;
}

export const DEFAULT_SOLUTIONS_PAGE_CONTENT: SolutionsPageContent = {
  marketing: {
    badge: "All-in-One Growth Platform",
    heroHeadline: "Scale Digital PR & Content Marketing with Guaranteed Results",
    heroSubheadline: "Connect with 25,000+ verified blogs, tech publications, and podcast hosts. Launch high-impact content campaigns with escrow protection and real-time ROI analytics.",
    btn1Text: "Get Started Now",
    btn2Text: "Book Demo Strategy",
    guarantee1: "No monthly subscriptions",
    guarantee2: "100% Escrow Protection",
    guarantee3: "Verified Metrics",

    overviewTitle: "Marketplace Overview",
    overviewBadge: "Live Platform Stats",
    stat1Value: "25,000+", stat1Label: "Verified Outlets",
    stat2Value: "99.4%", stat2Label: "Placement Success",
    stat3Value: "3.8x", stat3Label: "Average Organic Lift",
    stat4Value: "100%", stat4Label: "Escrow Secured",

    featuresHeading: "Why Leaders Choose MediaHub for Marketing & Growth",
    featuresSubtitle: "Streamline outreach, verify domain metrics, and maximize marketing ROI with our clean platform suite.",
    feat1Title: "Curated Publisher Marketplace", feat1Desc: "Filter media outlets by Domain Authority, Ahrefs DR, Organic Traffic, Geo Location, and niche topics in seconds.",
    feat2Title: "Escrow Payment Protection", feat2Desc: "Funds are securely locked in escrow and only released after your article or podcast ad is published and verified live.",
    feat3Title: "AI-Powered Media Matching", feat3Desc: "Smart algorithm pairs your niche SaaS or e-commerce store with high-converting publications for optimal audience fit.",
    feat4Title: "Multi-Channel Distribution", feat4Desc: "Manage guest posts, sponsored news features, podcast mentions, and influencer shoutouts under one unified dashboard.",

    workflowBadge: "Step-by-Step",
    workflowTitle: "How Content Marketing Works on MediaHub",
    step1Title: "Select Media Outlets", step1Desc: "Choose from pre-vetted blogs, media platforms, and podcast shows based on DA, traffic, and price.",
    step2Title: "Submit Content & Brief", step2Desc: "Provide your drafted article or request expert content creation from verified native copywriters.",
    step3Title: "Escrow & Publication", step3Desc: "Publishers review, post your content with contextual links, and submit live URLs for instant verification.",

    comparisonBadge: "The MediaHub Advantage",
    comparisonTitle: "Traditional Outreach vs. MediaHub Platform",
    comparisonSubtitle: "Say goodbye to endless email cold pitching, unverified metric claims, non-responsive webmasters, and payment fraud.",
    comparisonCol1: "Manual Guest Posting",
    comparisonCol2: "MediaHub Marketplace",
    comparisonRow1Left: "Uncertain Delivery Time", comparisonRow1Right: "48-Hour Escrow SLA",
    comparisonRow2Left: "Unverified Metrics", comparisonRow2Right: "Real-time Moz DA & DR",
    comparisonRow3Left: "Upfront Payment Risk", comparisonRow3Right: "100% Escrow Protection",
    comparisonRow4Left: "Manual Invoicing", comparisonRow4Right: "Automated Tax & GST Invoices",

    ctaHeadline: "Supercharge your digital PR & SEO pipeline today",
    ctaSubtitle: "Join thousands of growth marketers, SEO agencies, and enterprise brands building authority with MediaHub.",
    ctaBtn1: "Sign Up for Free",
    ctaBtn2: "Contact Sales Team",
  },
  advertisers: {
    badge: "Performance Link Acquisition",
    heroHeadline: "Buy Authentic Backlinks & High-Authority Content Placements",
    heroSubheadline: "Stop wasting budget on low-tier guest posts. Access top-tier media outlets with transparent metrics, instant pricing, and zero negotiation hassle.",
    btn1Text: "Find Backlinks",
    btn2Text: "Request Custom Catalog",
    guarantee1: "No monthly subscriptions",
    guarantee2: "100% Escrow Protection",
    guarantee3: "Verified Metrics",

    overviewTitle: "Advertiser Ecosystem",
    overviewBadge: "Verified Inventory",
    stat1Value: "150K+", stat1Label: "Global Sites",
    stat2Value: "0%", stat2Label: "Spam Footprint",
    stat3Value: "48h", stat3Label: "Avg. Turnaround",
    stat4Value: "100%", stat4Label: "Permanent Retention",

    featuresHeading: "Why Leaders Choose MediaHub for Advertisers",
    featuresSubtitle: "High-DR backlink acquisition engineered for high-intent SEO teams.",
    feat1Title: "Verified Ahrefs DR & Moz DA", feat1Desc: "Every publisher profile syncs real-time SEO metrics directly from leading SEO databases.",
    feat2Title: "Native Contextual Links", feat2Desc: "Contextually embedded do-follow backlinks inserted naturally within editorial high-relevance articles.",
    feat3Title: "Transparent Fixed Pricing", feat3Desc: "Clear upfront prices with zero hidden outreach markup fees or unpredictable agency retainers.",
    feat4Title: "Guaranteed Indexation", feat4Desc: "Automatic indexation monitoring guarantees your guest placement gets indexed by Google search engines.",

    workflowBadge: "Step-by-Step",
    workflowTitle: "Advertiser Order Pipeline",
    step1Title: "Explore Catalog", step1Desc: "Filter publications by Niche, Spam Score, Organic Traffic, and Ahrefs DR metrics.",
    step2Title: "Place Escrow Order", step2Desc: "Fund your account safely; your deposit remains protected until publication is confirmed.",
    step3Title: "Track Backlinks & Traffic", step3Desc: "Monitor link status, indexed pages, and referral analytics right inside your advertiser dashboard.",

    comparisonBadge: "The MediaHub Advantage",
    comparisonTitle: "Traditional Outreach vs. MediaHub Platform",
    comparisonSubtitle: "Say goodbye to endless email cold pitching, unverified metric claims, non-responsive webmasters, and payment fraud.",
    comparisonCol1: "Manual Guest Posting",
    comparisonCol2: "MediaHub Marketplace",
    comparisonRow1Left: "Uncertain Delivery Time", comparisonRow1Right: "48-Hour Escrow SLA",
    comparisonRow2Left: "Unverified Metrics", comparisonRow2Right: "Real-time Moz DA & DR",
    comparisonRow3Left: "Upfront Payment Risk", comparisonRow3Right: "100% Escrow Protection",
    comparisonRow4Left: "Manual Invoicing", comparisonRow4Right: "Automated Tax & GST Invoices",

    ctaHeadline: "Start acquiring high-DR backlinks with zero risk",
    ctaSubtitle: "Access 150,000+ vetted sites with verified traffic and do-follow links today.",
    ctaBtn1: "Browse Inventory",
    ctaBtn2: "Talk to Strategist",
  },
  brands: {
    badge: "Monetization & Growth for Publishers",
    heroHeadline: "Turn Your Digital Presence Into New Opportunities",
    heroSubheadline: "MediaHub helps publishers connect with advertisers looking to promote their brands through trusted websites and digital platforms. List your websites, showcase your audience, and discover relevant advertising opportunities—all from one platform.",
    btn1Text: "Add Your Website",
    btn2Text: "Explore Opportunities",
    guarantee1: "Zero Listing Fees",
    guarantee2: "100% Escrow Protection",
    guarantee3: "Instant Payouts & Full Control",

    overviewTitle: "Publisher Performance Hub",
    overviewBadge: "Verified Publishers",
    stat1Value: "150K+", stat1Label: "Active Websites Listed",
    stat2Value: "$4.8M+", stat2Label: "Paid to Publishers",
    stat3Value: "100%", stat3Label: "Escrow Guaranteed",
    stat4Value: "<24h", stat4Label: "Average Order Acceptance",

    featuresHeading: "What You Can Do on MediaHub",
    featuresSubtitle: "Whether you manage a blog, news website, niche publication, or online platform, MediaHub helps you showcase your digital properties to potential advertisers.",
    feat1Title: "List Your Websites", feat1Desc: "Add and manage your websites with details such as industry, niche, audience metrics, organic traffic, and custom editorial pricing.",
    feat2Title: "Choose Your Industry & Niche", feat2Desc: "Select from a wide range of industries and categories so advertisers can easily discover your website based on their campaign requirements.",
    feat3Title: "Get Discovered by Advertisers", feat3Desc: "Make your websites visible to thousands of vetted advertisers actively searching for high-authority platforms to publish sponsored content.",
    feat4Title: "Connect With Brands & Grow", feat4Desc: "Discover high-paying advertising opportunities, collaborate with top brands, and manage all your inbound orders from a single dashboard.",

    workflowBadge: "Simple 3-Step Process",
    workflowTitle: "How Publishers Grow Revenue",
    step1Title: "Create Profile & List Websites", step1Desc: "Sign up as a publisher and submit your blog, news site, or portal with your desired turnaround time and pricing.",
    step2Title: "Receive & Review Orders", step2Desc: "Get notified when advertisers order guest posts or link placements. Review content and approve directly in your dashboard.",
    step3Title: "Publish & Get Paid Instantly", step3Desc: "Submit the live placement URL. Once verified, escrow funds are released immediately to your wallet.",

    comparisonBadge: "The MediaHub Advantage",
    comparisonTitle: "Direct Outreach vs. MediaHub Platform",
    comparisonSubtitle: "Say goodbye to endless email cold pitching, payment defaults, unresponsive clients, and chargeback risks.",
    comparisonCol1: "Traditional Direct Selling",
    comparisonCol2: "MediaHub for Publishers",
    comparisonRow1Left: "Payment Default Risk", comparisonRow1Right: "100% Escrow Funded Orders",
    comparisonRow2Left: "Inconsistent Deal Flow", comparisonRow2Right: "Continuous Inbound Demand",
    comparisonRow3Left: "Manual Invoicing & Chasing", comparisonRow3Right: "Automated Instant Wallet Payouts",
    comparisonRow4Left: "Time-Consuming Negotiations", comparisonRow4Right: "You Set Fixed Transparent Rates",

    ctaHeadline: "Your Website. Your Audience. Your Opportunity.",
    ctaSubtitle: "List your website. Get discovered. Connect with brands. Grow your revenue with MediaHub today.",
    ctaBtn1: "Add Your Website",
    ctaBtn2: "Explore Opportunities",
  },
  agencies: {
    badge: "Creator Economy & Influencer Hub",
    heroHeadline: "Turn Your Influence Into Opportunities",
    heroSubheadline: "MediaHub helps influencers connect with brands looking for authentic creators to promote their products, services, and campaigns. Showcase your social presence, connect your channels, and discover collaboration opportunities that match your audience and niche.",
    btn1Text: "Connect Your Channels",
    btn2Text: "Explore Opportunities",
    guarantee1: "Zero Platform Fees",
    guarantee2: "100% Escrow Protection",
    guarantee3: "Verified Brand Collaborations",

    overviewTitle: "Creator Growth Hub",
    overviewBadge: "Active Influencers",
    stat1Value: "35K+", stat1Label: "Verified Creators",
    stat2Value: "$2.4M+", stat2Label: "Creator Payouts",
    stat3Value: "100%", stat3Label: "Payment Escrow Protection",
    stat4Value: "6+", stat4Label: "Supported Platforms",

    featuresHeading: "What You Can Do on MediaHub",
    featuresSubtitle: "Whether you create content on Instagram, YouTube, LinkedIn, TikTok, Facebook, or other platforms, MediaHub gives you a place to showcase your influence and connect with potential brand partners.",
    feat1Title: "Connect Your Social Accounts", feat1Desc: "Connect your social media channels directly to your MediaHub profile and showcase your real-time verified creator reach.",
    feat2Title: "Build Your Creator Profile", feat2Desc: "Create a professional influencer media kit with your niche, audience demographics, platforms, content categories, and pricing.",
    feat3Title: "Discover Relevant Campaigns", feat3Desc: "Find brands and high-paying advertising opportunities that match your specific content niche, audience, and preferred format.",
    feat4Title: "Collaborate & Manage Easily", feat4Desc: "Collaborate directly with top advertisers, present your social insights, and manage all your campaigns from a single dashboard.",

    workflowBadge: "Simple 3-Step Process",
    workflowTitle: "How Influencers Monetize Reach",
    step1Title: "Connect Channels & Profile", step1Desc: "Sign up as a creator and link your YouTube, Instagram, TikTok, LinkedIn, or Facebook channels with your rates.",
    step2Title: "Receive Brand Sponsorships", step2Desc: "Advertisers discover your profile and send campaign collaboration requests with clear creative briefs and requirements.",
    step3Title: "Create Content & Get Paid", step3Desc: "Deliver your sponsored post, video, or story. Once approved, escrow funds are instantly transferred to your account.",

    comparisonBadge: "The MediaHub Advantage",
    comparisonTitle: "Direct Brand Pitching vs. MediaHub Platform",
    comparisonSubtitle: "Say goodbye to unread DMs, ghosted emails, non-paying sponsors, and delayed payments.",
    comparisonCol1: "Manual DM Pitching",
    comparisonCol2: "MediaHub for Creators",
    comparisonRow1Left: "Unsecured Payments", comparisonRow1Right: "100% Upfront Escrow Protection",
    comparisonRow2Left: "Cold Outreach & Low Reply Rates", comparisonRow2Right: "Inbound Deals from Active Brands",
    comparisonRow3Left: "Unclear Campaign Briefs", comparisonRow3Right: "Structured Standardized Orders",
    comparisonRow4Left: "Manual Metric Screenshots", comparisonRow4Right: "Verified Live Social Insights",

    ctaHeadline: "Your Audience. Your Voice. Your Opportunities.",
    ctaSubtitle: "MediaHub helps creators turn their social presence into meaningful brand collaborations. Connect your channels, showcase your influence, and discover brand opportunities today.",
    ctaBtn1: "Connect Your Channels",
    ctaBtn2: "Explore Opportunities",
  },
};

// ─────────────────────────────────────────────
// 3. FAQ PAGE (COMPLETE CONTENT WITH ALL FAQS)
// ─────────────────────────────────────────────
export interface FaqPageContent {
  heroTitle: string;
  searchPlaceholder: string;
  cat1Title: string;
  cat2Title: string;
  cat3Title: string;
  cat4Title: string;
  cat5Title: string;
  faqs: FaqItem[];
  contactBannerLine1: string;
  contactBannerLine2: string;
  contactEmail: string;
}

export const DEFAULT_FAQ_PAGE_CONTENT: FaqPageContent = {
  heroTitle: "FAQ",
  searchPlaceholder: "Search for answers",
  cat1Title: "Buyer`s Frequently Asked Questions",
  cat2Title: "Task Statuses & Workflow",
  cat3Title: "Platform Metrics & Verification",
  cat4Title: "Guarantees & Escrow Refund Policy",
  cat5Title: "Account, Billing & Data Management",
  faqs: FAQ_ITEMS,
  contactBannerLine1: "If you have more questions,",
  contactBannerLine2: "please ask here or reach us at",
  contactEmail: "support@mediahub.com",
};

// ─────────────────────────────────────────────
// 4. CONTACT PAGE
// ─────────────────────────────────────────────
export interface ContactPageContent {
  heroTitle: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  questionsTitle: string;
  questionsSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  companyAddress: string;
  socialsTitle: string;
  advertiserFormTitle: string;
  agencyBannerTitle: string;
  agencyBannerSubtitle: string;
  agencyBullets: string[];
  brandBullets: string[];
  faqJumpTitle: string;
  faqJumpText: string;
  faqJumpBtn: string;
}

export const DEFAULT_CONTACT_PAGE_CONTENT: ContactPageContent = {
  heroTitle: "Contact us",
  aboutTitle: "A few words about MediaHub",
  aboutParagraph1: "MediaHub is an Escrow-Protected Content Marketing & Digital PR Marketplace with expertise in SEO, Publisher Monetization, and Content Distribution, founded in 2026. We started as a blog posting and link building platform with a goal to continually develop our capabilities to offer a wide range of features to meet clients' needs to improve SERP rankings, build high-quality backlinks, and broaden brand recognition.",
  aboutParagraph2: "Advertisers can easily place content on over 150K top-class sites from various GEOs (USA, UK, France, Australia, Spain, Germany, India, etc.). Also, it's possible to pick sites from 50+ categories with instant Ahrefs DR & GA metric verification.",
  questionsTitle: "Do you have any further questions about our blog posting service or suggestions?",
  questionsSubtitle: "Drop us a line, and our support team will be happy to help.",
  contactEmail: "contact@thecconnects.com",
  contactPhone: "+91 9490056002",
  companyName: "MediaHub Inc.",
  companyAddress: "Miyapur, Hyderabad, 500049, India",
  socialsTitle: "Talk to us on socials",
  advertiserFormTitle: "For advertisers",
  agencyBannerTitle: "Are you representing an Agency or a Brand?",
  agencyBannerSubtitle: "Learn more about services and features MediaHub can offer for Agencies and Brands for better blog posting",
  agencyBullets: [
    "20+ filters",
    "priority & friendly support from the MediaHub team",
    "multiple sites' metrics",
    "personalized platform walkthrough with the MediaHub manager",
    "CSV task reports",
    "custom lists creation",
    "real-time answers to your questions to help you grow (during demo call)",
  ],
  brandBullets: [
    "20+ filters",
    "priority & friendly support from the MediaHub team",
    "multiple sites' metrics",
    "personalized platform walkthrough with the MediaHub manager",
    "clear and precise task tracking",
    "sites from 50+ niches",
    "real-time answers to your questions to help you grow (during demo call)",
  ],
  faqJumpTitle: "Prefer finding answers on your own?",
  faqJumpText: "Jump to FAQ For advertisers",
  faqJumpBtn: "Learn More",
};

// ─────────────────────────────────────────────
// 5. PR SUITE & PODCASTS (MEDIA KIT)
// ─────────────────────────────────────────────
export interface MediaKitPageContent {
  heroHeadline: string;
  guestVisualTitle: string;
  guestVisualSubtitle: string;
  timelineTitle: string;
  timeline1Title: string;
  timeline1Desc: string;
  timeline2Title: string;
  timeline2Desc: string;
  timeline3Title: string;
  timeline3Desc: string;
  timeline4Title: string;
  timeline4Desc: string;
  whyExistsTitle: string;
  whyExistsSubtitle: string;
  whyExistsBullets: string[];
  noticeBannerText: string;
  whoIsItForTitle: string;
  whoIsItForSubtitle: string;
  whoIsItForRoles: string[];
  whyJoinTitle: string;
  whyJoinSubtitle: string;
  whyMediaHubTitle: string;
  whyMediaHubBullets: string[];
}

export const DEFAULT_MEDIAKIT_PAGE_CONTENT: MediaKitPageContent = {
  heroHeadline: "Talks with people who are shaping the future of search & media",
  guestVisualTitle: "Where Digital Leaders Share Unfiltered Strategy",
  guestVisualSubtitle: "Industry Experts Featured on MediaHub Talks",
  timelineTitle: "What is MediaHub Talks",
  timeline1Title: "Honest conversations about search in the AI era",
  timeline1Desc: "MediaHub Talks is where we have honest, strategic conversations about how search, content monetization, and brand authority are changing in the AI era.",
  timeline2Title: "No recycled basics",
  timeline2Desc: "We don’t recycle basic tips. We don’t do “SEO for beginners.”",
  timeline3Title: "Voices shaping the future of discovery",
  timeline3Desc: "We talk to the people who are actually shaping SEO, AI-driven discovery, digital PR, and brand authority — and we go deep.",
  timeline4Title: "Not tactics — perspective",
  timeline4Desc: "This isn’t a tactical checklist podcast. It’s a forward-looking conversation for people who already live and breathe search, content, and publisher growth.",
  whyExistsTitle: "Why This Podcast Exists?",
  whyExistsSubtitle: "Search isn’t just about rankings anymore. AI answers, zero-click behavior, entity signals, brand authority — the game is shifting fast.",
  whyExistsBullets: [
    "Why rankings are no longer the only metric that matters",
    "What citations and authority mean in AI search",
    "How brand visibility works when users don't click",
    "How SEO, PR, and content are merging",
  ],
  noticeBannerText: "And we’re building a curated lineup of people who genuinely move the industry forward.",
  whoIsItForTitle: "Who Is It For?",
  whoIsItForSubtitle: "This podcast is a perfect match for (yet, anyone in the industry is welcome to watch us):",
  whoIsItForRoles: [
    "Senior SEO specialists",
    "Heads of Growth",
    "Digital PR leaders",
    "Agency founders",
    "SaaS marketing teams",
    "In-house search professionals",
  ],
  whyJoinTitle: "Why Join MediaHub Talks?",
  whyJoinSubtitle: "If you’re already shaping the industry, this isn’t an interview — it’s a real conversation. Here’s what you get:",
  whyMediaHubTitle: "Why MediaHub?",
  whyMediaHubBullets: [
    "At MediaHub, we work at the intersection of content distribution, digital PR, and authority-building.",
    "We talk to SEO professionals and agencies every day.",
    "MediaHub Talks is an extension of those real conversations.",
    "We see what’s breaking, what’s working, and what’s misunderstood.",
  ],
};

// ─────────────────────────────────────────────
// 6. PODCAST SPONSORSHIPS / STRATEGY LIBRARY
// ─────────────────────────────────────────────
export interface PodcastSponsorshipPageContent {
  badge: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  pillar1Title: string;
  pillar1Subtitle: string;
  pillar2Title: string;
  pillar2Subtitle: string;
  pillar3Title: string;
  pillar3Subtitle: string;
  btnExploreMediaKit: string;
  guidesCountLabel: string;
  featuredBadge: string;
  featuredReadTime: string;
  featuredTitle: string;
  featuredSummary: string;
  featuredSpeaker: string;
  featuredRole: string;
  featuredBtnText: string;
}

export const DEFAULT_PODCAST_SPONSORSHIP_PAGE_CONTENT: PodcastSponsorshipPageContent = {
  badge: "MediaHub Technical Strategy & Knowledge Base",
  heroHeadline: "MediaHub",
  heroHeadlineHighlight: "Podcast Sponsorships & Strategy Library",
  heroSubtitle: "Read official technical design guides and operational architecture summaries directly from our startup specification (plan.md). Includes Escrow security rules, daily link crawlers, admin moderation, and creator payout systems.",
  pillar1Title: "100% Escrow Guard",
  pillar1Subtitle: "Funds locked until verification",
  pillar2Title: "Daily Retention Crawls",
  pillar2Subtitle: "Automated HTTP & link checks",
  pillar3Title: "Multi-Currency Payouts",
  pillar3Subtitle: "UPI, PayPal, Wise & Wire",
  btnExploreMediaKit: "Explore Media Kit",
  guidesCountLabel: "6 Technical Strategy Guides Available",
  featuredBadge: "★ Featured Technical Guide",
  featuredReadTime: "5 min read",
  featuredTitle: "Escrow Payment Architecture: 100% Financial Safety for Advertisers & Publishers",
  featuredSummary: "An inside breakdown of MediaHub's digital escrow system. Learn how funds remain locked until live post URL verification and auto-releases after 72 hours of advertiser approval.",
  featuredSpeaker: "MediaHub Engineering & Ops Team",
  featuredRole: "Core Marketplace Architecture",
  featuredBtnText: "Read Featured Guide",
};

// ─────────────────────────────────────────────
// 7. PRIVACY POLICY
// ─────────────────────────────────────────────
export interface PrivacyPageContent {
  title: string;
  lastUpdated: string;
  section1Title: string;
  section1Text: string;
  section2Title: string;
  section2Text: string;
  section3Title: string;
  section3Text: string;
}

export const DEFAULT_PRIVACY_PAGE_CONTENT: PrivacyPageContent = {
  title: "Privacy Policy",
  lastUpdated: "Last updated: July 2026 • MediaHub Inc.",
  section1Title: "1. Data Collection & Privacy",
  section1Text: "MediaHub respects your privacy. We collect minimal personal information required to facilitate escrow transactions, user authentication, and order fulfillment.",
  section2Title: "2. Data Security",
  section2Text: "All sensitive billing data is encrypted using SSL/TLS encryption. We do not sell or trade user information to third-party advertisers.",
  section3Title: "3. Account Deletion & GDPR",
  section3Text: "Users have the right to request account deactivation and complete deletion of stored data at any time via Account Settings.",
};

// ─────────────────────────────────────────────
// 8. TERMS AND CONDITIONS
// ─────────────────────────────────────────────
export interface TermsPageContent {
  title: string;
  lastUpdated: string;
  section1Title: string;
  section1Text: string;
  section2Title: string;
  section2Text: string;
  section3Title: string;
  section3Text: string;
}

export const DEFAULT_TERMS_PAGE_CONTENT: TermsPageContent = {
  title: "Terms and Conditions",
  lastUpdated: "Last updated: July 2026 • MediaHub Inc.",
  section1Title: "1. Platform Services",
  section1Text: "MediaHub operates a digital escrow-protected marketplace connecting Advertisers with website Publishers and Influencers for guest posting, content creation, and digital PR placements.",
  section2Title: "2. Escrow & Payment Protection",
  section2Text: "All payments placed by Advertisers are held securely in escrow until order completion is verified. Funds are released to Publishers only after live post verification. If a Publisher fails to deliver, 100% of the funds are refunded to the Advertiser's available balance.",
  section3Title: "3. Publisher Guarantee & Link Retention",
  section3Text: "Publishers agree to retain published articles and contextual links permanently. Links removed within 12 months are subject to mandatory replacement or full order refund.",
};

// ─────────────────────────────────────────────
// 9. BLOG HUB
// ─────────────────────────────────────────────
export interface BlogPageContent {
  heroHeadline: string;
  serpPromoTitle: string;
  serpPromoSubtitle: string;
  serpPromoBtn: string;
}

export const DEFAULT_BLOG_PAGE_CONTENT: BlogPageContent = {
  heroHeadline: "MediaHub Blog: Your SEO & Marketing Trends and Insights",
  serpPromoTitle: "Grow your SERP Rankings",
  serpPromoSubtitle: "Place content on DA40+ guest posting sites",
  serpPromoBtn: "Sign Up for Free",
};
