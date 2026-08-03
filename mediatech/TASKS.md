# Media Partner Hub — Task Tracker

> Keep this file open as your daily working checklist.
> Mark `[x]` when done, `[/]` when in progress.

---

## Day 1 — Project Setup & Infrastructure ✅ COMPLETE
- [x] Init Next.js 16 with Tailwind CSS v4, TypeScript
- [x] Setup Prisma schema + Prisma 7 config (prisma.config.ts)
- [x] Setup NextAuth.js v5 (Google + credentials)
- [x] Edge-safe auth split (auth.config.ts + lib/auth.ts)
- [x] Role-based proxy.ts (Next.js 16 middleware)
- [x] Shared layout: Sidebar, TopHeader components
- [x] Design system: globals.css with all tokens + component classes
- [x] Root layout with next/font (zero layout shift)
- [x] Login page UI + LoginForm component
- [x] Register page UI + RegisterForm component (2-step)
- [x] API routes: /api/auth/[...nextauth] + /api/auth/register
- [x] .env.example + CONTRIBUTING.md + README.md
- [x] next.config.ts (optimized: image, compression, tree-shaking)
- [x] lib/db.ts (Prisma 7 adapter-pg)
- [x] lib/utils.ts (cn, formatCurrency, formatNumber, formatDate)

---

## Day 2 — Auth & Onboarding ✅ COMPLETE
- [x] Forgot password page (email input, send reset link)
- [x] Reset password page (new password + strength meter + match check)
- [x] API: /api/auth/forgot-password (token generation + Resend email)
- [x] API: /api/auth/reset-password (token validation + bcrypt hash)
- [x] PasswordResetToken added to Prisma schema
- [x] Advertiser layout (sidebar + header + role guard)
- [x] Publisher layout (sidebar + header + role guard)
- [x] Influencer layout (sidebar + header + role guard)
- [x] Dashboard placeholder pages for all 3 roles
- [x] Post-register redirect by role (already in register-form.tsx)

---

## Day 3 — Publisher: My Platforms ✅ COMPLETE
- [x] "My Platforms" list page (renders banners, tabs, filters, website list card grids)
- [x] Add website platform form (URL, DA, traffic, niche, country, language metrics)
- [x] Package builder per platform (Article Posting placement + writing packages)
- [x] Platform status badges (Approved, Pending specification, Rejected)
- [x] Nice illustrated empty state for new publishers

---

## Day 4 — Influencer: My Channels ✅ COMPLETE
- [x] "My Channels" list page + empty state
- [x] Add/edit channel form (platform type, handle, followers, engagement, niche, country)
- [ ] Channel package builder (Story, Post, Reel, Video, Review + pricing)
- [x] Platform icons (Instagram, YouTube, TikTok, X, etc.)
- [x] Channel status badge system
- [x] Influencer sidebar layout (My Channels, Demand, Tasks, Referral)

---

## Day 7 — Advertiser: Purchase Placement Brief Form ✅ COMPLETE
- [x] Purchase page template routing platformId / channelId query params
- [x] Summary block displaying selected platform information and total cost
- [x] Target URL, Anchor Text, and Content Brief fields inputs
- [x] Insufficient wallet funds detection banner alerts
- [x] Submit database logic (decrement balance, increment reserved escrows, and save new Task record)
- [x] Sent placement tasks tracking list layout page

---

## Day 7 — Task/Order Placement Flow
- [x] "Buy now" → order briefing modal/page (target URL, anchor text, content notes, deadline)
- [ ] Project selector (or create new inline)
- [x] Task creation → escrow hold (balance → reserved)
- [x] Publisher/Influencer receives notification
- [x] Draft → Task Review state on submit

---

## Day 8 — Advertiser & Publisher: Tasks Management Workﬂow ✅ COMPLETE
- [x] Publisher tasks dashboard list sorting (status tab params)
- [x] Accept / Reject order triggers (escrow refunds to advertiser balance on rejection)
- [x] Live URL deliverable submission form
- [x] Advertiser tasks status lists (Reviewing, In Progress, Waiting for Approval, Completed)
- [x] Release escrow transactions (decrements advertiser reserved funds, credits publisher wallet balance and lifetime earnings)
- [x] Request improvements notes submissions (returns tasks to revisions status) detail view: brief, timeline, delivery proof, chat thread

---

## Day 9 — Wallet & Stripe Payments
- [x] Wallet page: Balance / Reserved / Bonus cards
- [x] Top-up via Stripe Checkout (preset amounts: $50, $100, $250, $500 + custom)
- [x] Stripe webhook: credit balance on successful payment
- [ ] Bonus logic (e.g. bank wire = +3% bonus)
- [x] Transaction history table (filterable by type + date)
- [x] On task completion: reserved → publisher/influencer earning

---

## Day 10 — Publisher/Influencer Earnings & Withdrawal ✅ COMPLETE
- [x] Seller wallet: Earnings / Reserved / Withdrawn
- [x] Withdrawal request form (amount, method: PayPal / bank)
- [x] Admin withdrawal approval queue
- [x] Earnings history with task reference links

---

## Day 11 — Notifications + In-Task Messaging
- [x] Notification bell with unread badge count
- [x] Notification dropdown with mark-as-read
- [x] "View all notifications" page
- [x] In-task chat thread (message input + message list)
- [x] Real-time via Supabase subscriptions or 5s polling fallback
- [x] Email notifications via Resend (task accepted, approval needed, withdrawal processed)

---

## Day 12 — Admin Panel ✅ COMPLETE
- [x] Admin dashboard: stats (total users, revenue, active tasks, pending approvals)
- [x] User management table (search, filter by role, suspend/activate)
- [x] Platform approval queue (approve/reject publisher sites)
- [x] Channel approval queue (approve/reject influencer channels)
- [x] Task oversight (all tasks, force-complete, force-refund)
- [x] Transaction log (all financial activity)

---

## Day 13 — Additional Pages + Polish
- [x] My Projects CRUD (advertiser)
- [x] Media Partner List (saved publishers/influencers)
- [x] Content Purchase page
- [x] Referral Program page (publisher + influencer)
- [x] Dismissable promo banners (localStorage state)
- [ ] Loading skeletons for all tables
- [x] Toast notifications (success, error, info)
- [ ] Mobile responsive + sidebar collapse toggle

---

## Day 14 — Testing & Deployment
- [ ] Full end-to-end test: Advertiser places order → Publisher accepts → delivers → Approved → Funds released
- [ ] Full influencer flow test
- [ ] Stripe webhook test (top-up, payout)
- [ ] Auth edge cases (wrong role redirect, expired session)
- [ ] Lighthouse performance audit (target >85)
- [ ] Seed demo data (5 publishers, 5 influencers, 3 advertisers, sample tasks)
- [ ] Production deploy on Vercel
- [ ] Custom domain setup
