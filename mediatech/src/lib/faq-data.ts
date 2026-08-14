export interface FaqItem {
  id: string;
  category: "Buyer's FAQs" | "Task & Statuses" | "Platform Metrics" | "Guarantees & Refunds" | "Account & Billing";
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES = [
  "All",
  "Buyer's FAQs",
  "Task & Statuses",
  "Platform Metrics",
  "Guarantees & Refunds",
  "Account & Billing",
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  // Buyer's FAQs
  {
    id: "getting-started",
    category: "Buyer's FAQs",
    question: "How do I get started?",
    answer:
      "Getting started on MediaHub is fast and simple! 1. Sign up for a free Advertiser account. 2. Explore our marketplace of 150,000+ verified publisher websites. 3. Filter sites by Ahrefs DR, Moz DA, organic traffic, and category. 4. Select whether you prefer 'Guest Post (Writing & Placement)' or 'Link Insertion'. 5. Add tasks to your cart and place your order using our secure escrow payment system.",
  },
  {
    id: "add-tasks-cart",
    category: "Buyer's FAQs",
    question: "How to add tasks/orders to the Cart?",
    answer:
      "When browsing the MediaHub marketplace, click on any publisher listing to view details. Choose your service type ('Writing & Placement' or 'Link Insertion'), enter your target landing page URL and anchor text, then click 'Add to Cart'. You can add multiple tasks from different publishers to your cart and check out in a single transaction.",
  },
  {
    id: "before-accept-task",
    category: "Buyer's FAQs",
    question: "What should I do before I accept the task?",
    answer:
      "Before approving a completed task, verify: 1. Your link is live and placed contextually on the agreed URL. 2. The link attribute (Dofollow/Nofollow) matches your order specifications. 3. The anchor text is spelled correctly and clickable. 4. The published article complies with your content guidelines. Once confirmed, click 'Approve Task' to release escrow funds to the publisher.",
  },
  {
    id: "custom-site-lists",
    category: "Buyer's FAQs",
    question: "What are My sites list(s) - Custom site lists?",
    answer:
      "Custom Site Lists allow advertisers to organize and bookmark favorite publishers into tailored lists (e.g., 'High DR Finance Sites', 'Tech Blogs', 'Fast TAT Publishers'). You can save these lists for future campaigns or share them with your marketing team members.",
  },

  // Task & Statuses
  {
    id: "task-status-meaning",
    category: "Task & Statuses",
    question: "What does each task status mean?",
    answer:
      "• Pending Approval: Order submitted and awaiting publisher acceptance (24-48 hrs).\n• In Progress: Publisher is drafting content or placing link.\n• Delivered / Under Review: Publisher has submitted the live link for your review.\n• Approved: Task completed and funds released.\n• Revision Requested: You have asked the publisher for corrections.\n• Cancelled / Refunded: Task cancelled and funds returned to your Available balance.",
  },
  {
    id: "what-is-tat",
    category: "Task & Statuses",
    question: "What is TAT?",
    answer:
      "TAT stands for Turnaround Time. It represents the average number of days a publisher takes from accepting an order to delivering the live URL. MediaHub displays each publisher's historical TAT on their marketplace card (e.g., Average TAT: 3 days).",
  },
  {
    id: "link-insertion-vs-writing",
    category: "Task & Statuses",
    question: "What is Link insertion vs Writing & placement?",
    answer:
      "• Link Insertion: Adding your link and anchor text into an existing, already-indexed article on the publisher's website.\n• Writing & Placement: The publisher (or MediaHub content team) writes a brand-new original article according to your topic guidelines and publishes it on their site with your link included.",
  },
  {
    id: "keyword-search",
    category: "Task & Statuses",
    question: "What is Search by keyword?",
    answer:
      "Search by Keyword allows you to find publishers whose websites currently rank on Google for specific keywords related to your niche. This ensures your link is placed on contextually authoritative pages with relevant search intent.",
  },

  // Platform Metrics
  {
    id: "traffic-differences",
    category: "Platform Metrics",
    question: "What is the difference between Ahrefs Organic Traffic, Similarweb Traffic, and Total Traffic?",
    answer:
      "• Ahrefs Organic Traffic: Estimated monthly search engine traffic derived specifically from Google organic rankings.\n• Similarweb Traffic: Total estimated desktop & mobile visits from all sources (Direct, Referral, Social, Organic).\n• Total Traffic / Google Analytics: Real-time verified traffic stats synced directly via Google Analytics API integration.",
  },
  {
    id: "initial-domain-rate",
    category: "Platform Metrics",
    question: "What is the Tasks with Initial Domain rate?",
    answer:
      "Tasks with Initial Domain rate indicates the percentage of orders completed on the exact domain listed in the publisher's profile without requesting domain swaps or alternative domain substitutions.",
  },
  {
    id: "avg-lifetime-links",
    category: "Platform Metrics",
    question: "What is Avg lifetime of links?",
    answer:
      "Avg Lifetime of Links measures link retention history across all previous orders completed by a publisher. A 99%+ rating confirms that links placed by the publisher stay live permanently without being removed.",
  },
  {
    id: "completion-rate-metrics",
    category: "Platform Metrics",
    question: "What do Average Completion rate, Tasks with Initial Domain, and Price rate in media partner profile mean?",
    answer:
      "These performance metrics measure publisher reliability: Average Completion Rate shows what percentage of accepted orders are finished successfully, Initial Domain Rate measures domain adherence, and Price Rate reflects price stability without unexpected price increases.",
  },
  {
    id: "ga-traffic-filter",
    category: "Platform Metrics",
    question: "What is the 'Total Traffic. Google Analytics' filter?",
    answer:
      "This filter allows you to narrow down marketplace listings to only show websites with verified Google Analytics integration, guaranteeing 100% accurate, first-party audience metrics.",
  },

  // Guarantees & Refunds
  {
    id: "refund-policy",
    category: "Guarantees & Refunds",
    question: "If I am not satisfied with a task performed by a media partner, can I get a refund?",
    answer:
      "Yes! MediaHub operates on an escrow protection model. Your funds are held securely until you review and approve the task. If a publisher fails to meet your requirements, delivers the wrong link, or exceeds the TAT limit, our Admin team will issue a 100% refund back to your Available Balance.",
  },
  {
    id: "guarantees-provided",
    category: "Guarantees & Refunds",
    question: "What guarantees do you provide?",
    answer:
      "1. Escrow Money-Back Guarantee: Funds released only after your approval.\n2. Link Retention Guarantee: Free replacement or full refund if a link is deleted within 12 months.\n3. Indexation Guarantee: Guaranteed indexation verification in Google Search.\n4. No-Follow / Do-Follow Accuracy: 100% compliance with your requested link rel attribute.",
  },

  // Account & Billing
  {
    id: "balance-categories",
    category: "Account & Billing",
    question: "What do different balance categories mean?",
    answer:
      "• Available Balance: Unrestricted funds ready to spend on new orders or withdraw.\n• Reserved Balance: Funds allocated to active, pending in-progress orders held safely in escrow.\n• Bonus Balance: Promotional credits earned via referral programs or deposit bonuses.",
  },
  {
    id: "manage-credits",
    category: "Account & Billing",
    question: "How to manage your credits?",
    answer:
      "You can manage credits in your Advertiser Billing Dashboard. Add funds instantly via PhonePe, UPI (Google Pay, Paytm, BHIM), Credit/Debit Cards, NetBanking, PayPal, or Bank Transfer. Track transaction history, download invoices, and monitor reserved escrow funds in real time.",
  },
  {
    id: "notification-settings",
    category: "Account & Billing",
    question: "How can I manage my notification settings?",
    answer:
      "Navigate to Profile > Notifications in your dashboard. You can customize email alerts and push notifications for order status changes, new messages, price drops, and low balance warnings.",
  },
  {
    id: "change-password",
    category: "Account & Billing",
    question: "Can I change my password?",
    answer:
      "Yes! Go to Account Settings > Security to change your password anytime. If you forgot your password, click 'Forgot Password' on the login screen to receive a secure reset link.",
  },
  {
    id: "deactivate-account",
    category: "Account & Billing",
    question: "How to Deactivate (Delete) an account and delete your data?",
    answer:
      "Go to Settings > Account Privacy and click 'Deactivate Account'. In accordance with GDPR and privacy policies, all personal data, payment details, and custom site lists will be permanently purged from our servers within 30 days.",
  },
];
