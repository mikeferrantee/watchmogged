WATCHMOGGED — Feature Prioritization (MoSCoW)
Last updated: 2026-05-22 Owner: [You] Companion docs: PRD.md, IMPLEMENTATION_PLAN.md, PROMPTS.md

How to read this
Must Have — MVP launch is blocked without these. Build these first, no exceptions.
Should Have — V1, ships in the first 3 months after public launch based on user feedback.
Could Have — V2, ships 3-6 months after launch based on revenue and traction.
Won't Have — Explicitly out of scope. When a user or stakeholder requests these, point them here.
When in doubt, default to a lower tier. Solo-founder scope creep kills projects.

🟥 MUST HAVE — MVP launch is blocked without these
Legal & infrastructure
Domain watchmogged.com purchased and pointed at Vercel
Apple Developer account active ($99/yr)
Google Play Developer account active ($25 one-time)
Privacy Policy and Terms of Service drafted (lawyer review before launch)
Content moderation policy documented
Stripe account configured with US/NY tax handling
Authentication & profiles
Email + Google + Apple OAuth via Supabase Auth
Username/handle reservation at signup with real-time availability check
Public profile page at watchmogged.com/[handle]
Profile editing: avatar, display name, bio (280 char max), city/country (city-level max, never exact)
Privacy toggle: hide exact collection total, show rank only (still appears on leaderboard with total blurred)
Anonymous mode toggle: appears as "Anonymous Collector #[rank]" with no city, no avatar, no handle
Account deletion
GDPR-style data export
Watch collection — core
Add watch from curated reference database (search-as-you-type)
Add watch manually if reference not in database (flagged for curator review queue)
Multi-photo upload per watch (drag-drop on web, camera on mobile)
Photo content moderation: auto-reject if face or significant body parts detected via Claude Vision check on upload
Photo storage in private Supabase buckets, served via signed URLs
Watch detail page with photos, specs, current value, verification badge
Edit watch metadata
Delete watch
Mark watch as sold: captures sold_price and sold_date, preserved in historical record, removed from active collection value
Forward-only history (cannot retroactively add watches sold before joining the platform)
Verification — bronze only at MVP
Bronze verification flow: server generates 6-character challenge code expiring in 10 minutes
User photographs watch alongside handwritten code with current date visible
Server validates via Claude Vision (watch present, paper visible, code matches)
Bronze badge displayed publicly on every verified watch
Verification status is always public — visible to anyone viewing the watch
"How verification works" explainer page (trust-builder, treat seriously)
Pricing data
Curated reference database seeded with top 500 most-collected references at launch
Weekly automated price refresh via Supabase scheduled Edge Function
Pricing source: WatchCharts API if budget allows, otherwise manually maintained JSON file
Price history retained per reference
Collection total recalculates whenever underlying prices change
$5,000 minimum collection value to appear on public leaderboard
Leaderboard
Global top 100 by total collection value, publicly viewable without login
Mixed display: named users and anonymous users on the same ranking
Full dollar amounts publicly displayed by default
Users with the "hide total, show rank only" toggle display rank only
Anonymous users show as "Anonymous Collector #[rank]" with no avatar or city
"Your rank" sticky element when logged in
Default sort: total collection value, descending
Click any entry to view their public profile (unless anonymous — then no link)
Payments & subscription
Stripe Checkout integration on web
Free tier: 3 watches max, bronze verification only, full leaderboard view, public profile
Collector tier: $9.99/mo or $79/yr (~34% annual discount)
14-day free trial on Collector tier
Founding member offer: first 500 paying users get Collector at $4.99/mo for life (Stripe coupon-based, displayed countdown on pricing page)
Stripe Customer Portal for self-service subscription management
Stripe webhook handler as Edge Function (subscription.created/updated/deleted, payment failures, trial ending)
Subscription tier gating across the entire UI
Failed payment recovery flow with email reminders
Web app pages
Landing page with live leaderboard preview, founding member countdown, value prop, CTAs
Pricing page with comparison table, founding member offer prominently displayed
How verification works (trust page)
Public leaderboard
Public profile pages (watchmogged.com/[handle])
Watch detail pages (watchmogged.com/[handle]/[watch-id])
About, FAQ, Contact
Terms of Service, Privacy Policy
Mobile app (iOS + Android via Expo)
Auth flow with social OAuth (Apple, Google, email)
Camera-based photo capture for watch upload via Expo Camera
Photo upload with progress UI and retry handling for dropped connections
Bronze verification flow (mobile-only — camera-required, cannot be completed on web)
Profile and collection views matching web feature parity
Leaderboard browse with same data as web
Settings page (subscription managed via web link out, log out, delete account)
Push notification token registration (actual notification sends V1)
Deep linking for watchmogged.com/[handle] URLs to open in-app
Backend & ops
Row Level Security policies on every table from day one
SQL tests for RLS policies (catch security regressions before they ship)
Three Supabase environments: local (CLI), staging, production
All schema changes via version-controlled migrations
Sentry on web and mobile from day one
PostHog analytics with event tracking on key actions (signup, watch_added, verification_submitted, upgrade_clicked, upgrade_completed)
Resend for transactional email
Edge Functions for: challenge code generation, bronze verification validation, leaderboard snapshot computation, weekly price refresh, Stripe webhooks
Daily automated database backups
Image compression on upload (target 500kb max per photo)
Rate limiting on watch uploads (max 5/hour free, 20/hour paid)

🟧 SHOULD HAVE — V1, first 3 months after public launch
Verification expansion
Silver verification via Claude Vision AI ($5 per watch retail)
5 free silver verifications/month included with Collector tier
AI confidence score (0-100) displayed to user with rejection reasons
Manual review queue for AI rejections (you adjudicate)
Verification appeal flow
Leaderboard sophistication
Country filter
Brand specialty filter (Top Rolex Collectors, Top Patek Collectors, Top AP, Top Omega, etc.)
Era filter (vintage <1980, modern)
Category filter (dive, dress, complication, sport, indie)
Trending: biggest climbers and fallers this week
Sort by verification percentage (forces credibility, not just dollars)
Pagination beyond top 100 for paid users only
Collection management
Hide individual watches: counts toward total, not publicly displayed
Edit sold watches: correct mistakes in sold price or sold date
Watch acquisition price (private, optional, for personal ROI tracking)
Per-watch private notes
Pricing intelligence
Per-watch price history charts (1mo, 6mo, 1yr, all-time)
"Your collection moved $X this week" surfaced on dashboard
All-time-high indicator on each watch
Best/worst performer of the week
Insurance PDF export
One-click insurance-ready PDF generation
Includes all photos, references, current values, acquisition prices, verification tiers
Appraiser-style formatting
Gated to Collector tier and above
Significant value-prop for converting tracker-mindset users
Watch reference pages
Public detail page per reference (SEO target — /references/[id])
Specs, current market value, price history
"X collectors own this on WATCHMOGGED" social proof
Top 5 owners (opt-in to feature on the reference page)
Schema.org Product markup for Google
Email engagement
Weekly portfolio digest email (Mondays via Resend)
Verification status notifications
Big rank change notifications ("You broke into the top 100")
Founding member spots remaining countdown emails
Whale tier launch
$24.99/mo or $199/yr
Concierge support (you handle it personally to start)
Private $250k+ leaderboard access
Early brand partnership access
1 free gold verification per quarter (requires gold partnership lined up)
"Whale" badge on profile
Theft registry — basic
Mark your watch as stolen via dedicated flow
New uploads cross-checked against stolen list automatically
Manual review alert sent to you when potential match detected
Public theft registry page (searchable by reference + serial)
Achievements / badges
Holy Trinity Owner (Patek + AP + Vacheron)
First Patek, First AP, First Lange
Five-Figure Club, Six-Figure Club, Seven-Figure Club
All Four Crowns (Rolex pro models)
Verified Collector (>50% gold-verified)
Founding Member badge for first 500 users
Streak badges (consecutive months on the leaderboard)
Displayed on profile, share-worthy on social
Curator tooling
Admin UI for reviewing user-submitted references
Approve, reject, or merge with existing reference
Bulk reference import tooling for expanding the database
Admin override for verification disputes

🟨 COULD HAVE — V2, 3-6 months after launch
Gold verification
Human expert verification via partner (Bezel, WatchCSA, or similar)
$99 retail, 1 free per quarter for Whale tier
Status tracking in app (submitted, in transit, in review, complete)
Partner integration required
Social features
Follow other collectors
Activity feed (your follows added or upgraded a watch)
Comments on individual watches and profiles
"Collection Story" long-form writeups per watch (provenance, history, why I bought it)
Embed widgets for personal sites and blogs
Marketplace integration
Affiliate links to Chrono24, Bezel, WatchBox on every watch reference page
"See similar listings for sale" sections
Track price drops on watchlist items
Revenue share on referrals
Watchlist
Track references you don't own
Price alerts (email + push) when items move >5%
Watchlist visible on your public profile (optional)
KYC for Whale tier
Identity verification for users above $500k declared collection value
Reduces money laundering exposure
Stripe Identity integration
Required to access private Whale-only leaderboard
Referral program
"Give a month, get a month" mechanic
Tracking via Stripe coupons + database table
Referral leaderboard (top recruiters of the month)
Founding member referrals get extended benefits
Mobile-app-store IAP
Apple IAP for Collector and Whale tiers (Apple takes 30% year 1, 15% after)
Compliance with Apple's external payment rules
Maintain price parity between web and IAP
Brand partnerships
Sponsored Indie Spotlight sections
H. Moser, Czapek, Ming, Massena Lab integrations
Sponsored leaderboard categories ("Top Indie Collectors, sponsored by H. Moser")
Curated for editorial fit, not just paid placement
Additional verification depth
Box and papers documentation upload
Service history tracking
Provenance certificates
Original purchase receipt verification
Multi-language support
Spanish first (TikTok virality often hits LatAm)
Mandarin and Japanese for the Asian collector market
German for European market
Real-world events
IRL verification meetups in major cities (NYC, LA, London, Hong Kong)
Annual WATCHMOGGED awards (Collection of the Year, Climber of the Year)
Founding member exclusive events

⬛ WON'T HAVE — Explicitly out of scope
When users request these, point them to this list and the reasoning.
Marketplace, escrow, or transactions on platform — link out to partners only; transactional liability is not a fight worth picking
Trading platform between users — same reasoning as above
Watches users used to own pre-platform — no retroactive flex, forward-only history only
Crypto, NFT, Web3, or blockchain anything — wrong audience, wrong vibe, regulatory minefield
User-editable reference database — curator-only forever to protect data quality
Direct messaging between users — creates harassment surface that's not worth the moderation cost
Forums or community discussion threads — same as above
In-house watch authentication — partner only, never certify ourselves (legal liability)
In-house insurance underwriting — partner only, never issue policies
General-user real-name verification (KYC) — only required for Whale tier
Apple Watch app — not a real use case despite the irony
Browser extension — no clear value, distribution overhead
Public API for third parties — possible long-term but not a V2 priority
White-label or enterprise version — not the business model
NSFW or adult content — banned across the platform regardless of tier
Facial recognition for verification — privacy minefield, not differentiated value

Decisions baked into this prioritization
These are the key product decisions that shaped what landed where. Documenting them here so we don't re-litigate later.
Decision
Choice
Legal entity
Operating as sole proprietor at launch (personal liability acknowledged)
Exact dollar amounts on leaderboard
Public by default, with per-user opt-out (rank-only mode) — opt-out is Must Have
Minimum collection value for public leaderboard
$5,000
Anonymous users on leaderboard
Yes, mixed with named users on same ranking
Sold watches
Forward-only history (mark current watches as sold; no retroactive entries)
Reference database
Curator-only at launch
Verification tier visibility
Always public
Brand voice
Disruptive, innovative, new-era, Gen Z mogged energy
Reference brands
Cal AI, UMAX (face-of-brand approach, faceless TikTok content)
Founder visibility
Brand is the face, not founder-led
Collector pricing
$9.99/mo, $79/yr
Whale pricing (V1)
$24.99/mo, $199/yr
Founding member offer
First 500 paying users at $4.99/mo for life
Free tier limit
3 watches
Referral program at launch
No (V2)
Whale tier at launch
No (V1)
Operating jurisdiction
United States, New York
MVP launch definition
Public on the App Store
Hard deadline
None — quality over speed


What lands in MUST that wasn't in the original PRD
Hide exact total / show rank only privacy toggle (pulled forward from Should at user request)
Founding member offer ($4.99/mo for life, first 500)
Content moderation policy for face/body detection on uploaded photos
Forward-only history for sold watches (explicit business rule)
$5k minimum to appear on the public leaderboard
What was deferred from MUST to a later tier
AI silver verification → Should Have (bronze is enough to launch credibly)
Whale tier → Should Have (you confirmed launch without it is fine)
Watchlist → Should Have
Insurance PDF export → Should Have (high-value, but not blocking launch)
All social features (follow, feed, comments) → Could Have
Theft registry — basic → Should Have, full version → Could Have
Marketplace affiliate integration → Could Have
Gold verification → Could Have (requires partnership lined up first)

