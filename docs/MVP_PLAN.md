WATCHMOGGED — MVP Plan, Phase 1
Last updated: 2026-05-22 Status: Pre-build. Designs complete in Claude Design. Ready for Claude Code execution. Companion docs: PRD.md, MOSCOW.md, USER_JOURNEY.md, MONETIZATION.md, PROMPTS.md

1. Product Overview
One-liner: The leaderboard for real watch collectors — upload, verify, and rank your collection by total value.
WATCHMOGGED turns watch collecting into a status game. Users add their watches to the platform, get them verified through a tiered authentication flow, and compete on a public global leaderboard ranked by total collection value. The product taps into existing #wristcheck culture but adds structure, verification, and monetizable utility.
Why now: Watch collecting culture is fragmenting onto TikTok, with younger collectors flexing on a platform that doesn't yet have a structured way to rank them. The elite-elite are bored of Instagram. Both sides of the market want a real leaderboard, and nobody has built it credibly.
Target market — dual:
Elite-elite ($250k+ collections) — validate the leaderboard's credibility, drive aspirational content
Aspirational mass-market (TikTok-discovered, $5k-$50k collections) — drive subscription revenue and viral growth
Brand voice: Disruptive, innovative, new-era. Gen Z fluent. Reference brands: Cal AI, UMAX. Brand is the face, not founder-led. TikTok content is faceless: watch close-ups, leaderboard reveals, rank-climb animations, text-overlay POV style.

2. Finalized MVP Features (Must-Haves for Phase 1)
This is the complete spec for Phase 1. Anything not in this section is V1+ and explicitly out of scope for launch.
2.1 Authentication & profiles
Email, Google, and Apple OAuth via Supabase Auth
Username/handle reservation at signup with real-time availability check
Public profile page at watchmogged.com/[handle]
Profile editing: avatar, display name, bio (280 char max), city/country only (never exact location)
Privacy toggle: hide exact collection total, show rank only (still appears on leaderboard)
Anonymous mode toggle: appears as "Anonymous Collector #[rank]" with no avatar, no handle, no city
Account deletion with 30-day grace period
GDPR-style data export
2.2 Watch collection — core
Add watch from curated reference database (search-as-you-type, 500 references at launch)
Add watch manually if reference not in database — flagged for curator review queue, does NOT count toward leaderboard until linked to canonical reference
Multi-photo upload per watch (drag-drop on web, native camera on mobile)
Photo content moderation: auto-reject if face or significant body parts detected via Claude Vision check on upload
Photo storage in private Supabase buckets, served via signed URLs
Watch detail page with photos, specs, current market value, verification badge
Edit watch metadata
Delete watch
Mark watch as sold: captures sold price and sold date, preserved as historical record, removed from active collection total
Forward-only history (cannot retroactively add watches sold before joining the platform)
2.3 Verification — bronze only at MVP
Bronze verification flow: server generates 6-character challenge code expiring in 10 minutes
User photographs watch alongside handwritten code with current date visible
Server validates via Claude Vision (watch present, paper visible, code matches, date matches)
Bronze badge displayed publicly on every verified watch
Verification status is always public
"How verification works" explainer page (trust-builder)
2.4 Pricing data
Curated reference database seeded with top 500 most-collected references at launch
Weekly automated price refresh via Supabase scheduled Edge Function
Source: WatchCharts API if budget allows, otherwise manually maintained JSON file
Price history retained per reference (for V1 charting features, captured at MVP)
Collection total recalculates whenever underlying prices change
$5,000 minimum collection value to appear on public leaderboard
2.5 Leaderboard
Global top 100 by total collection value, publicly viewable without login
Mixed display: named users and anonymous users on the same ranking
Full dollar amounts publicly displayed by default
Users with "hide total, show rank only" toggle display rank without dollar amount
Anonymous users show as "Anonymous Collector #[rank]" with watches visible but no link to identity
"Your rank" sticky element when logged in
Default sort: total collection value, descending
Click any non-anonymous entry → view their public profile
2.6 Payments & subscription
Stripe Checkout integration on web (no mobile IAP at MVP)
Free tier: 3 watches max, bronze verification, full leaderboard view, public profile
Collector tier: $9.99/mo or $79/yr (~34% annual discount), 14-day free trial
Founding Member offer: First 500 paying users get Collector at $4.99/mo for life via Stripe coupon, with countdown visible on pricing page
Stripe Customer Portal for self-service subscription management
Stripe webhook handler as Edge Function (subscription created/updated/deleted, payment failures, trial-ending)
Subscription tier gating across entire UI
Failed payment recovery with 7-day grace period and email reminders
2.7 Web app pages
Landing page with live leaderboard preview, founding member countdown, value prop, CTAs
Pricing page with comparison table, founding member offer prominently displayed
How verification works (trust page)
Public leaderboard
Public profile pages
Watch detail pages
About, FAQ, Contact
Terms of Service, Privacy Policy (lawyer-reviewed before launch)
2.8 Mobile app (iOS + Android via Expo)
Auth flow with social OAuth (Apple, Google, email)
Camera-based photo capture via Expo Camera
Photo upload with progress UI and retry handling
Bronze verification flow (mobile-only — camera-required)
Profile and collection views with feature parity to web
Leaderboard browse
Settings (subscription managed via web link out, log out, delete account)
Push notification token registration (notifications themselves are V1, not MVP)
Deep linking for watchmogged.com/[handle] URLs
2.9 Backend & ops
Row Level Security policies on every table from day one
SQL tests for RLS policies
Three Supabase environments: local (CLI), staging, production
All schema changes via version-controlled migrations
Sentry on web and mobile from day one
PostHog analytics with event tracking on key actions
Resend for transactional email (welcome, trial reminders, payment issues)
Edge Functions for: challenge code generation, bronze verification validation, leaderboard snapshot computation, weekly price refresh, Stripe webhooks
Daily automated database backups
Image compression on upload (target 500kb max)
Rate limiting: 5 watch uploads/hour free, 20/hour paid
2.10 Content moderation policy (MVP)
Auto-rejection of any photo containing identifiable face or significant body parts (Claude Vision check)
No NSFW content allowed across the platform
Manual review queue for reports
Suspended accounts cannot upload but retain data for 30 days
Theft suspicion handled manually for MVP (full registry is V1)

3. Detailed User Journey (MVP)
The Phase 1 user journey, end-to-end, with only Must-Have features in play.
3.1 Discovery → Landing
User finds WATCHMOGGED via TikTok (primary), direct search, or a shared profile link. They land on watchmogged.com and see a hero with a live top-5 leaderboard preview. The founding member countdown ("423 of 500 founding spots left — $4.99/mo for life") creates urgency. CTA: "Get my rank." Decision point: sign up or leave.
3.2 Signup
OAuth via Apple, Google, or email — Supabase handles auth. After auth, user reserves a handle with real-time availability check. Handle becomes their permanent public URL (watchmogged.com/[handle]). Designed to take < 60 seconds end-to-end.
3.3 Empty dashboard
First view of the app: empty state with single dominant CTA ("Add your first watch"). Sample collection shown below as aspirational preview. "Your rank: Unranked" creates a small bug bite — they want to fix that.
3.4 Adding the first watch
Search-as-you-type against the 500-reference database. User finds their watch (e.g., Tudor Black Bay 58). Selects it. Confirms reference and year. Proceeds to photos.
If their watch isn't in the database, manual entry is available — but manual entries don't count toward the leaderboard until a curator approves and links to a canonical reference. The user is told this.
3.5 Photo upload
User takes multiple photos (dial, side, on-wrist). System auto-compresses, then runs Claude Vision face/body detection. If a face or body is detected, the photo is rejected with a clear message ("We can't accept photos that show faces or bodies. Try cropping or retaking."). If clean, photos are stored in Supabase Storage with signed URLs.
3.6 Bronze verification (the unique mechanic)
User is presented with three verification tier cards: Bronze (free, available), Silver (coming soon, greyed out), Gold (coming soon, greyed out). User selects Bronze.
System generates a 6-character challenge code (e.g., "X7K9P2") with a 10-minute expiry. User is instructed to write the code on paper with today's date, place their watch next to it, and photograph both together.
User submits the photo. Edge function validates via Claude Vision: watch present, paper visible, code matches, date matches. If pass: watch upgraded to Bronze tier. If fail: specific error message ("We couldn't see the code clearly — retake"). Up to 3 retries before 1-hour cooldown.
3.7 First leaderboard placement (the dopamine moment)
On verification success, user sees a full-screen celebration: animated bronze badge, their rank ("#4,127"), their total value ("$3,500 in watches"), and a "Share my rank" button that generates an Instagram-story-ready card.
This is the critical moment. The visual quality and emotional payoff here determine whether they come back tomorrow.
3.8 Adding more watches
User adds 2 more watches. Each addition shows an animated rank-climb. They feel the slot-machine pull. As they go to add a 4th watch, they hit the paywall.
3.9 The paywall
Modal (not a redirect) appears:
"You've hit your free limit."
Collector card: $9.99/mo, 14-day free trial
Founding Member card: $4.99/mo for life, "423 of 500 spots left" (highlighted, recommended)
"Maybe later" link as smaller text
User taps Founding Member → Stripe Checkout → Apple Pay → done. Returns to dashboard with confetti and "You're founding member #78."
3.10 Post-conversion
User adds remaining watches. Each one shows the rank climb. They share their profile URL to friends, group chats, social. The profile URL is the most-shared artifact of the product.
3.11 Daily/weekly engagement
User returns to check rank. Prices refresh weekly, so their rank moves even without action. They watch the leaderboard. They see new whales sign up. They occasionally add a new watch when they buy IRL. They mark watches as sold when they sell IRL.
3.12 Sharing — the loop closes
User's watchmogged.com/[handle] URL gets shared on Instagram bio, Twitter, Reddit, WhatsApp. New users discover the product via these shared profile links and the loop continues.

4. Edge Case Notes
Real users hit edge cases. MVP needs explicit handling for these or users get burned.
4.1 Photo rejected for face/body detection
Clear, non-preachy rejection message. User retakes or crops. Up-front guidance on upload screen prevents most cases ("dial, case, caseback — no faces or bodies"). Critical because of NY privacy expectations and brand safety.
4.2 Watch not in reference database
Manual entry available, but those watches do NOT count toward leaderboard until a curator approves and links them to a canonical reference. This is the single most important anti-gaming rule. Without it, anyone can declare a $4M Patek and rocket to #1.
4.3 User wants to be anonymous mid-stream
Settings → Privacy → Anonymous mode toggle. Profile immediately switches to anonymized display. Handle, avatar, city all hidden. Watches still visible but with no link back to identity. They retain their rank. Can toggle back any time.
4.4 Marking a watch as sold
Watch detail page → "Mark as sold." Modal captures sold date (defaults to today) and sold price (optional). Watch is removed from active collection total but preserved as historical record on the user's profile. No retroactive sold-watch entries allowed.
4.5 Failed payment / subscription lapse
Stripe webhook fires. Email sent. 7-day grace period during which account still functions as paid. After grace: downgraded to free tier. Watches over the 3-watch limit are hidden (not deleted). Email sent to restore. Update payment any time, instant restore.
4.6 Account deletion
Settings → Delete Account → two-step confirmation requiring typing handle. Profile soft-deleted, watches deleted, leaderboard entry removed. Stripe subscription canceled. Photos deleted from storage within 30 days (GDPR). 30-day grace period to undo. After 30 days: hard delete.
4.7 Suspected fake collection
For MVP: manual review. Admin reviews top 100 weekly for plausibility. Anomaly flags (47 watches added in a day, all photographed against the same wall, declared $4.2M) trigger manual review. Account suspended pending verification if fake. Automation comes in V1.
4.8 Anonymous user on top 10
Their entry shows "Anonymous Collector #7" with full value and watch count. Watches are visible (they're verified pieces) but with no link back to identity. The design trade: less flex satisfaction than public users, but the option to participate at all.
4.9 Handle change requests
Users can change handle once every 30 days. Old handle redirects to new for 90 days. After 90 days, old handle is released back to the pool. Documented in Terms.
4.10 Watch shared between users (e.g., one user adds, then the other adds same watch)
Possible at MVP — same reference, two users own different copies, both legitimate. No deduplication enforced. If photos are identical (image hash match), system flags for manual review.
4.11 Bronze verification edge cases
Challenge code expires before user submits → generate new code, no penalty
User uploads watch + code + paper but code is illegible → AI flags, asks for retake
User attempts to verify same watch multiple times → only latest submission counts
User tries to game by photographing replica with code → AI checks for obvious replica tells, but this is not foolproof; gold verification is the answer to replicas, not bronze
4.12 Price data discrepancies
Users may disagree with declared market value of their watch
For MVP: no override allowed; price comes from the data source
User-submitted acquisition price (V1 feature) is private and doesn't affect leaderboard value
4.13 Watch references not in the curated 500
Submitted to curator queue. User notified when reference is added to canonical database and their watch is linked. Until then: shown on profile as manual entry, NOT on leaderboard.
4.14 Photo upload fails mid-stream (connection drop)
Background upload queue. Resumes on app foreground. User can dismiss the upload screen — it continues in background. Toast notification on completion.
4.15 Cross-platform session conflicts
User signs in on web while also signed in on mobile. Both sessions valid. Supabase handles. Token refresh on each platform independent.

5. Tech Stack + Monetization Plan
5.1 Tech Stack
Monorepo & language
Turborepo + pnpm workspaces
TypeScript everywhere, strict mode
Web
Next.js 15 (App Router)
Tailwind CSS
shadcn/ui component primitives
TanStack Query for data fetching
Deployed on Vercel
Mobile
Expo SDK (latest)
React Native
NativeWind for styling
Expo Router for navigation
Expo Camera for photo capture
Expo SecureStore for session persistence
Expo Notifications (token registration only at MVP)
EAS Build + EAS Update for deployments and OTA fixes
Backend
Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)
Row Level Security on every table
Generated TypeScript types from schema
Supabase CLI for migrations and local dev
Payments
Stripe Checkout (web only at MVP)
Stripe Customer Portal
Stripe Coupons for founding member offer
Apple IAP and Google Play Billing deferred to V2
AI services
Claude Vision API (Anthropic) for photo moderation and bronze verification
Claude Vision for silver verification (V1, not MVP)
Email & ops
Resend for transactional email
Sentry for error tracking
PostHog for product analytics
Development tooling
GitHub for version control
GitHub Actions for CI (typecheck, lint, test)
Claude Code with skills: superpowers, claude-mem, frontend-design, security-review
Pricing data
Primary: WatchCharts API (if budget allows)
Fallback: Manually curated JSON of top 500 references, refreshed weekly
Shared packages structure
/apps/web              Next.js app
/apps/mobile           Expo app
/packages/api          Shared Supabase queries, TanStack Query hooks
/packages/db           Schema, generated types
/packages/types        Shared TypeScript types
/packages/utils        Shared formatters, validators
/packages/config       Shared environment constants
Estimated monthly cost at launch: $200-700/mo depending on WatchCharts API tier and Claude Vision usage volume.

5.2 Monetization Plan
Revenue mix at maturity:
Stream
% of revenue
Margin
Activation timing
Subscriptions
60-70%
~70% post-Stripe
Launch
Verification fees
15-20%
High on silver, thin on gold
Month 2-6
Affiliate revenue
10-15%
~100%
Month 2+
Insurance partnerships
Sleeper hit
Very high
Month 6+

Subscriptions (Phase 1):
Free: 3 watches, bronze verification, full leaderboard view
Collector: $9.99/mo or $79/yr
Founding Member: $4.99/mo for life, first 500 users only (Stripe coupon)
Whale: $24.99/mo or $199/yr (V1, not MVP)
Verification fees (V1):
Bronze: free
Silver: $5/watch (5/mo free with Collector tier)
Gold: $99/watch (1/quarter free with Whale tier)
Affiliate revenue (V1+):
Chrono24, Bezel, WatchBox referral links on every reference page
1-3% of transaction value
Invisible to user, zero friction
Insurance partnerships (V2+):
Hodinkee Insurance, Chubb, Wesleyan, Lloyd's
$50-200/lead for HNW collectors
Insurance PDF export (V1) is the conversion hook
Key economic decisions:
Subscriptions web-only at launch to avoid Apple's 30% tax. Saves ~$2.40/user/month.
Founding member offer creates launch urgency, TikTok content, and locks in 500 power users.
Hormozi value equation works at $9.99/mo because tracking $50k-$500k of assets is worth far more than $120/year. The price-to-value ratio is intentionally absurd in the user's favor.
Break-even math:
Fixed costs: $200-700/mo
Break-even: 50-200 paying subscribers depending on Founding Member mix
Year-1 target: 1,500 paying subscribers = ~$150k subscription ARR
With verification + affiliate: $200-250k total Year-1 revenue
Order of revenue activation:
Launch (Month 0): Free + Collector + Founding Member
V1 early (Month 2-3): + Silver verification, + Affiliate links
V1 late (Month 4-6): + Whale tier, + Gold verification
V2 (Month 6+): + Insurance partnerships
V2+ (Month 9+): + Brand sponsorships (carefully)
What we deliberately avoid:
Ads (kills premium feel)
In-platform marketplace or transactions (legal liability)
Cosmetic IAP at launch (cheapens the product)
Brand sponsorships before 10k users (no leverage)
Apple IAP at launch (30% tax kills margins)

6. What this MVP intentionally does NOT include
This document defines Phase 1. The following are explicitly NOT in scope for the initial launch and are tracked in MOSCOW.md as Should-Have or Could-Have:
Silver and gold verification
Whale tier
Watchlist
Insurance-ready PDF export
Achievements and badges (except Founding Member)
Price history charts on individual watches
Email digests beyond transactional
Social features (follow, comments, activity feed)
Theft registry
Marketplace affiliate integration
Category and country leaderboard filters
Per-watch acquisition price tracking
Apple/Google IAP
These come in V1 (months 2-3 post-launch) and V2 (months 3-6) based on user feedback and revenue traction. Do not pull them forward into Phase 1.

7. Definition of "Done" for Phase 1
The MVP is ready to launch when:
A new user can sign up, add 3 watches, get bronze verified, and see their rank — all in under 10 minutes
The leaderboard has at least 100 seeded users with realistic collections (hand-recruited beta whales)
Stripe payments work end-to-end including failure recovery and cancellation
Both apps are crash-free in 95%+ of sessions over a week of beta testing
App Store and Play Store apps are approved and live
Privacy Policy and ToS are lawyer-reviewed and live
Content moderation policy is documented and enforced via Claude Vision
Founding member countdown is functional and Stripe coupons are configured
Verification flow has been tested by 10+ real beta users with real watches
Security review (via security-review skill) has been run on the full codebase with no critical findings outstanding
When all 10 are true: ship.

