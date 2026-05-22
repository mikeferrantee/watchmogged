# WATCHMOGGED — Prompts Playbook
**For:** Claude Design + Claude Code
**Companion docs:** PRD.md, IMPLEMENTATION_PLAN.md
**Last updated:** 2026-05-21

---

## How to use this doc

1. Work top to bottom — prompts are sequenced to match the build plan
2. For Claude Code: always reference the PRD and Implementation Plan as context. Paste them into the project or use `@PRD.md` / `@IMPLEMENTATION_PLAN.md` references
3. Don't paste multiple prompts at once — let each one complete, review the output, then move on
4. After every prompt, ask Claude Code to summarize what it built before moving to the next step

---

## PART 1 — CLAUDE DESIGN PROMPTS

Use these in Claude Design to generate the 8 priority screens. Run them one at a time, refine, then export the handoff bundle when all 8 are done.

### Design system seed prompt (run first)

```
Create a design system for an iOS and web app called WATCHMOGGED — a status game and portfolio tracker for luxury watch collectors. The brand should feel premium but with TikTok-native energy. Think: the visual confidence of Hermès meets the punchy directness of a sports app like ESPN or Strava.

Brand attributes:
- Premium and serious about money, but not stuffy
- Confident, slightly cocky, leaderboard-driven
- Appeals equally to a 22-year-old TikTok user with one Tudor and a 50-year-old with $2M in Pateks
- Reads instantly as "this is about flexing watches"

Visual direction:
- Deep neutral base palette (off-black #0A0A0A, warm white #FAFAF7, deep green or oxblood accent — pick one signature accent)
- A single bold accent color used sparingly for ranks, badges, and CTAs
- Typography: a confident display serif for headers (think Editorial New, GT Sectra) paired with a clean grotesk for body (Inter or similar)
- Generous spacing — premium products breathe
- Subtle gold/metallic accent for verification badges (bronze, silver, gold tiers)
- Photography-forward — watch images are the hero of every screen
- Subtle micro-interactions and motion, never gratuitous

Generate the design system tokens: color palette (full scale), typography scale, spacing scale, border radius scale, shadow scale, and the three verification badge styles (bronze, silver, gold).
```

### Screen 1 — Landing page (web, logged out)

```
Design the logged-out landing page for WATCHMOGGED at watchmogged.com.

Structure top to bottom:
1. Sticky nav: WATCHMOGGED wordmark left, "Leaderboard / How it works / Pricing" center, "Log in / Sign up free" right
2. Hero section: massive headline "Prove what you own." with subhead "The leaderboard for real watch collectors. Upload, verify, rank." Primary CTA "Get my rank" and secondary "See the leaderboard". Right side or background: a stylized animation/visual of watch cards floating with rank numbers
3. Live leaderboard preview: top 10 collectors visible with blurred handles for anyone below top 3, showing handle, avatar, total collection value, top 3 watches preview. "Sign up to see your rank" CTA
4. "How it works" section: three cards — Upload, Verify, Rank. Use real verification badge visuals (bronze, silver, gold)
5. "Built for real collectors" section: 3 testimonial quotes (use placeholder names like @daytonadan, @journeking, @aprollie)
6. Pricing preview: 3 tier cards (Free, Collector $14.99/mo, Whale $29.99/mo) with key features
7. Final CTA: "Where do you rank?" with email capture and "Find out" button
8. Footer: links, social, legal

Tone: confident, punchy, premium. Headlines short and declarative. No fluff. Should make a guy with a $50k collection think "I need to be on this" within 5 seconds of landing.
```

### Screen 2 — Sign up / log in

```
Design the sign up and log in flow for WATCHMOGGED.

Sign up screen:
- Centered card on dark background
- Logo at top
- Headline: "Claim your rank"
- Subhead: "Free forever. Up to 3 watches."
- Three OAuth buttons: Apple, Google, Email
- Below: "Already mogging? Log in"
- Tiny legal text at bottom

Username reservation step (post-OAuth):
- "Pick your handle"
- Input field with `watchmogged.com/` prefix shown
- Real-time availability check with green checkmark or red X
- Continue button (disabled until available)

Log in screen:
- Same layout as sign up but reversed copy
- "Welcome back" / "Log in to your collection"

Mobile versions should be full-screen, not card-based.
```

### Screen 3 — Public profile page (web)

```
Design the public profile page at watchmogged.com/[handle]. This is the most-shared URL in the product, so it must be beautiful and link-preview-friendly.

Layout:
1. Hero header: large avatar, display name, @handle, city/country, "Following" or "Follow" button (V1), join date as small text
2. Stats row: Total Collection Value (huge number, optionally blurred behind paywall depending on settings), Watch Count, Global Rank with up/down arrow, Verification Score (% of collection gold-verified)
3. Top 3 watches showcase: large beautiful cards with watch photo, brand+model, reference number, current value, verification badge
4. Full collection grid below: smaller cards, filterable by brand, sortable by value/recency
5. Each watch card on hover/tap: photo, brand+model, ref, value, verification badge in corner
6. "Collection Story" section if user has written one (V1)
7. Anonymous users: avatar replaced with generic mogged silhouette, handle shows as "Anonymous Collector #4,213", city hidden, but rank and total value visible

Make this share-worthy. When someone screenshots this and posts to Instagram, it should look like a flex.
```

### Screen 4 — My collection (logged in dashboard)

```
Design the logged-in collection dashboard at watchmogged.com/dashboard.

Top section: 
- Current rank with big number, arrow showing weekly change, "+3 places this week"
- Total collection value with weekly delta
- Watch count and verification breakdown (e.g., "5 watches: 2 bronze, 2 silver, 1 gold")

Main section:
- "Add a watch" prominent CTA button
- Grid of all user watches with verification badges
- Each watch card actions on hover: Edit, Verify, Hide, Delete
- Filter and sort controls

Side panel (web only):
- Quick stats: best performer this month, worst performer, recent leaderboard movement
- Suggested actions: "Verify your Daytona to climb 12 ranks", "Add box and papers photos to upgrade to Silver"
- Upgrade prompt if on free tier and at watch limit

Empty state for new users: large centered "Add your first watch" with illustration, sample collection preview underneath ("Here's what your collection could look like")
```

### Screen 5 — Add a watch flow

```
Design the add-a-watch flow. Multi-step but should feel fast.

Step 1 — Search:
- Search bar with "Search 500+ reference numbers, brands, or models"
- Real-time search results as user types
- Each result: small image, brand, model, reference, year, current market value
- "Can't find it? Add manually" link

Step 2 — Confirm or manual entry:
- If selected from DB: confirm reference, show current value, year input, acquisition price (optional, private)
- If manual: brand, model, reference, year, estimated value (will require verification to count)

Step 3 — Photos:
- Drag-drop or tap to upload
- Suggested: dial macro, side profile, caseback, on-wrist
- Live preview thumbnails with reorder
- "Make this primary photo" toggle

Step 4 — Verification:
- Three big cards explaining Bronze (free), Silver ($5), Gold ($99)
- Recommended badge on Silver
- "Skip for now, verify later" link
- For Bronze: show challenge code on screen, instruction to photograph watch next to handwritten code

Step 5 — Success:
- Watch card preview
- "Your rank moved from #1,247 to #1,184"
- Share buttons (Twitter, Instagram story format)
- "Add another" or "Back to dashboard"

Make the flow feel like leveling up in a game, not filing paperwork.
```

### Screen 6 — Watch detail page

```
Design the watch detail page at watchmogged.com/[handle]/[watch-id].

Layout:
1. Photo gallery hero — large primary photo, swipeable, with thumbnails
2. Below photos: Brand and model as huge serif headline, reference number as monospace below
3. Stats panel: current value (big), all-time high, owner's acquisition price (only visible to owner), 30-day price change with chart
4. Verification badge prominently displayed with "Verified by [reviewer]" if Gold
5. Specs section: case size, movement, year, category, in a clean two-column layout
6. Price history chart: clean line chart, 1mo / 6mo / 1yr / all toggles
7. Owner section (if not the viewer): "Owned by @handle" with link to profile
8. Similar watches section: 4 cards of other watches on the platform of the same reference
9. Owner notes / Collection Story (V1) if written
10. Affiliate marketplace links (V1): "See similar listings on Chrono24 / Bezel"

The page should feel like a museum placard for the watch. Reverential, beautiful, but data-rich.
```

### Screen 7 — Leaderboard

```
Design the public leaderboard at watchmogged.com/leaderboard.

Top section:
- "The Leaderboard" headline
- Filter bar: All / By Country / By Brand / By Era / By Category
- View toggle: Global / Following (V1) / Country
- Search bar: find a specific collector

Main table:
- Sticky header row: Rank, Collector, Total Value, Watches, Verification %, Top Piece
- Rows: rank number (huge for top 10, then standard), avatar + handle, value (with weekly change arrow), watch count, verification percentage (with mini badge breakdown), thumbnail of their most valuable piece
- Top 3 styled differently — gold/silver/bronze accent treatment, larger row, more visible
- Below top 100, gated: "Sign up to see ranks 101–10,000+"

Right side (web only): 
- "Your rank" sticky card with rank, distance to top 100, "what would I need to add to climb" suggestion
- Trending: biggest climbers this week, biggest fallers
- Recent gold verifications

Mobile: same content but stacked, top 10 visually rich, below that table-like.

This is the addictive screen. People should want to refresh it.
```

### Screen 8 — Pricing page

```
Design the pricing page at watchmogged.com/pricing.

Layout:
1. Headline: "Pick your tier" / "Where do you rank?"
2. Three pricing cards side by side, equal height:
   - **Free** — $0, "Get on the leaderboard"
     - Up to 3 watches
     - Bronze verification
     - View top 100
     - Public profile
     - "Start free" button
   - **Collector** — $14.99/mo or $99/yr (highlighted as "Most popular")
     - Unlimited watches
     - Full leaderboard access
     - Price history charts
     - Watchlist
     - Insurance PDF export
     - 5 free AI silver verifications/month
     - "Start 14-day free trial" button
   - **Whale** — $29.99/mo or $249/yr (highlighted as "For serious collectors")
     - Everything in Collector
     - 1 free gold verification per quarter ($396 value)
     - Concierge support
     - Private $250k+ leaderboard
     - Early access to brand partnerships
     - "Apply for Whale" button
3. Toggle: Monthly / Annual (with "Save 45%" tag on annual)
4. Below cards: comparison table for full feature breakdown
5. FAQ section: "Can I change tiers? Is there a free trial? What does verification actually do? Can I get a refund?"
6. Trust footer: Stripe logo, money-back guarantee, "Trusted by 10,000+ collectors"

Annual prices should be visually emphasized as the better deal.
```

---

## PART 2 — CLAUDE CODE PROMPTS

Sequenced to match the week-by-week plan in the Implementation Plan. Run these in order. Always reference `@PRD.md` and `@IMPLEMENTATION_PLAN.md` in your Claude Code context.

### Prompt 0 — Project initialization

```
I'm building WATCHMOGGED, a watch collector status game and portfolio tracker. The full spec is in PRD.md and IMPLEMENTATION_PLAN.md. Read both before doing anything.

Set up the monorepo:
- Turborepo + pnpm workspaces
- /apps/web (Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui)
- /apps/mobile (Expo SDK latest, TypeScript, NativeWind)
- /packages/api (shared Supabase queries)
- /packages/db (schema, generated types)
- /packages/types (shared TS types)
- /packages/utils (formatters, validators)
- /packages/config (env constants)

Configure:
- TypeScript strict mode in all packages
- ESLint and Prettier with shared configs
- Tailwind CSS in web app
- NativeWind in mobile app
- Vercel deployment config for web
- EAS Build config for mobile

Initialize git with a sensible .gitignore for monorepos with Next.js, Expo, and Supabase.

Create a README.md with setup instructions for a new developer.

Stop after setup and tell me what you built so I can verify before moving to the next step.
```

### Prompt 1 — Supabase setup and schema

```
We're at Week 1 of the Implementation Plan. Read IMPLEMENTATION_PLAN.md section 3 carefully — that's the database schema.

Do the following:
1. Initialize Supabase locally with `supabase init`
2. Create migration files for all tables listed in IMPLEMENTATION_PLAN.md §3: profiles, watch_references, watches, watch_photos, verifications, price_history, leaderboard_snapshots
3. Add appropriate indexes (foreign keys, search columns, sort columns)
4. Write Row Level Security policies for every table per IMPLEMENTATION_PLAN.md §3 (anyone can read non-anonymous profiles, only owner can write own watches, etc.)
5. Generate TypeScript types with `supabase gen types typescript` and place them in /packages/db
6. Create a seed.sql with 10 sample watch_references (5 Rolex, 3 Patek, 2 AP) so we have test data
7. Document the migration workflow in /supabase/README.md

Stop after schema is created and types are generated. Show me the migration files and the generated types before we move on.
```

### Prompt 2 — Authentication on both apps

```
We're at the auth portion of Week 1. Set up Supabase Auth on both web and mobile.

Web (Next.js):
- Install @supabase/ssr
- Create Supabase client utilities for server components, client components, and middleware
- Build middleware that protects /dashboard routes
- Build auth callback route for OAuth redirects
- Create sign up, log in, and log out flows with email + Google + Apple OAuth
- After signup, trigger a flow to reserve a username/handle (per Screen 2 design)
- Store profile creation in a trigger or server action on signup

Mobile (Expo):
- Install @supabase/supabase-js and expo-secure-store
- Build a Supabase client with SecureStore-backed session persistence
- Build the same auth flows with native social OAuth
- Handle deep linking for OAuth callbacks
- Build a username reservation flow matching web

Both apps:
- Use the shared types from /packages/db
- Create a useUser() hook in /packages/api that works on both platforms (with platform-specific imports)

Stop and show me the auth flow working on web before building mobile. I should be able to sign up, get a handle, and see my profile placeholder.
```

### Prompt 3 — Shared API layer (Week 2)

```
We're at Week 2. Build the shared API layer in /packages/api.

Create typed functions for:
- getProfile(handle)
- getMyProfile()
- updateProfile(data)
- getMyWatches()
- getWatch(id)
- addWatch(data)
- updateWatch(id, data)
- deleteWatch(id)
- hideWatch(id, isHidden)
- searchWatchReferences(query)
- getWatchReference(id)
- getLeaderboard({ country?, brand?, era?, page?, pageSize? })
- getMyRank()
- uploadWatchPhoto(watchId, file)

Each function:
- Uses generated types from /packages/db
- Has explicit return types
- Handles errors and returns a consistent { data, error } shape
- Has JSDoc comments

Set up TanStack Query:
- Shared QueryClient config in /packages/api
- Per-function hooks (useProfile, useMyWatches, etc.)
- Sensible stale times and cache invalidation

Stop and show me the API surface before we wire UI to it.
```

### Prompt 4 — Web: profile + collection (Week 3)

```
We're at Week 3 — web UI for profile and collection management. I have a Claude Design handoff bundle ready to provide; I'll attach it.

Build these pages on web only:
1. /[handle] — public profile page per Screen 3 design
2. /dashboard — my collection dashboard per Screen 4 design
3. /add-watch — add watch flow per Screen 5 design
4. /[handle]/[watch-id] — watch detail page per Screen 6 design

Use the shared API layer from /packages/api. Use shadcn/ui components. Make it match the Claude Design handoff exactly — same spacing, colors, typography.

Implement:
- Photo upload to Supabase Storage with signed URL retrieval for display
- Image compression on upload (target 500kb max)
- Optimistic UI for add/edit/delete
- Loading skeletons matching the design
- Empty states matching the design

Skip verification flows for now (we'll build those after). Just allow user to mark verification tier manually for testing.

Stop when these 4 pages are working end-to-end. I want to add 5 watches and see them on my profile.
```

### Prompt 5 — Web: leaderboard + landing (Week 4)

```
We're at Week 4 — public-facing web surface.

Build:
1. / (landing page) per Screen 1 design
2. /leaderboard per Screen 7 design
3. /pricing per Screen 8 design
4. /how-it-works (explainer page for verification tiers)
5. /about, /faq, /terms, /privacy (static pages, write reasonable placeholder copy)
6. /references/[id] — watch reference page (SEO target)

For the leaderboard:
- Server-rendered for SEO
- Paginated (50 per page)
- Filterable by query params (?country=US&brand=rolex)
- Cache aggressively with ISR

For the landing page:
- Real leaderboard preview pulled live from the database
- SEO metadata, OG tags, Twitter cards
- Email capture form that adds to a Supabase waitlist table

For the reference pages:
- Static-generated for top 500 references
- Schema.org Product markup
- "X collectors own this reference on WATCHMOGGED" social proof
- Top 5 collectors of this reference

Stop when a friend can visit watchmogged.com, see the leaderboard, sign up, add watches, and see their rank update.
```

### Prompt 6 — Mobile: auth, browse, collection (Week 5)

```
We're at Week 5 — mobile app feature parity (minus camera).

Build mobile screens for:
- Auth (sign up, log in, handle reservation)
- Profile (my profile + viewing others)
- Collection dashboard
- Add a watch (manual entry only for now — camera comes Week 6)
- Watch detail
- Leaderboard with filters
- Settings (subscription, privacy, log out)

Use the same /packages/api layer — no duplicated logic. Use NativeWind for styling matching the Claude Design output. Use Expo Router for navigation.

Set up:
- Push notifications via Expo Notifications (token registration only, actual notifications come later)
- Sentry for error tracking
- EAS Update for OTA deployments
- Deep linking to handle watchmogged.com/[handle] and watchmogged.com/leaderboard URLs opening in-app when installed

Stop when mobile has feature parity with web minus camera and payments.
```

### Prompt 7 — Mobile: camera + bronze verification (Week 6)

```
We're at Week 6 — the mobile-only camera and bronze verification flow.

Build:
1. Camera-based watch add flow using expo-camera:
   - Multi-photo capture (suggest dial, side, caseback, wrist)
   - Live preview with retake option
   - Auto-compress before upload
   - Background upload with progress UI

2. Bronze verification flow:
   - Server generates a 6-character challenge code via Edge Function
   - Code expires in 10 minutes
   - User sees code on screen, instructed to write it on paper, photograph watch next to code with current date visible
   - Submit photo to verifications table with challenge_code
   - Edge function validates submission and marks bronze tier automatically if photo passes basic checks (has watch, has visible paper)

3. Background upload queue:
   - Handle dropped connections gracefully
   - Resume on app foreground
   - Show toast on completion

The challenge code generation, expiry, and validation must be server-side in Supabase Edge Functions — never trust the client.

Stop when I can take a photo on mobile, get a challenge code, submit, and see my watch upgrade to bronze tier.
```

### Prompt 8 — Payments (Week 7)

```
We're at Week 7 — Stripe payments on web. Mobile IAP is V1, skip for now.

Set up:
1. Stripe products and prices via Stripe CLI:
   - Collector monthly $14.99
   - Collector annual $99
   - Whale monthly $29.99
   - Whale annual $249
2. Stripe Checkout integration on /pricing
3. 14-day free trial on Collector tier signup
4. Stripe Customer Portal for subscription management
5. Webhook handler as Supabase Edge Function — handle: subscription.created, subscription.updated, subscription.deleted, invoice.payment_failed, customer.subscription.trial_will_end
6. Sync subscription_tier and subscription_status on profiles table from webhooks
7. UI gating:
   - Free tier hits paywall on 4th watch with upgrade prompt
   - Free tier sees leaderboard top 100 only, blurred below
   - Watchlist, insurance PDF, price history are paid features
8. Account page showing current plan, next billing date, manage subscription link

Test mode end-to-end including cancellation, failed payment recovery, and refunds.

Stop when I can sign up, hit the watch limit, upgrade to Collector, and see my limits lift.
```

### Prompt 9 — Pricing data + AI verification (Week 8)

```
We're at Week 8 — the data layer.

Part A — Pricing data:
- Build a Supabase Edge Function that refreshes watch_references prices weekly
- Use WatchCharts API if we have a key (check env), otherwise read from a manually curated JSON file at /packages/db/curated_prices.json
- Update price_history with every refresh
- Trigger leaderboard_snapshots recompute after each refresh

Part B — Leaderboard snapshots:
- Build a nightly Edge Function that computes leaderboard_snapshots
- Aggregates total_value_usd, watch_count, verified_value_usd per profile
- Computes rank_global and rank_country
- Stores snapshot with timestamp

Part C — AI silver verification:
- Build a Supabase Edge Function that accepts a watch photo and reference_id
- Calls Claude Vision API (Anthropic, model claude-opus-4-7) with a structured prompt:
  "Analyze this photo. Does it show a real [brand] [model] [reference]? Check for: correct dial markers, correct case profile, correct movement signature if visible, signs of replica (font issues, alignment, cyclops magnification, etc). Return JSON: { confidence: 0-100, is_authentic: bool, concerns: string[] }"
- Charge user $5 via Stripe before verification runs (or deduct from monthly free credits if Collector tier)
- Update verifications row with result
- Auto-upgrade watch to silver if confidence > 85, otherwise reject with reasons

Stop when prices refresh weekly, leaderboard recomputes nightly, and silver verification works end-to-end.
```

### Prompt 10 — Insurance PDF + polish (Weeks 9–10)

```
We're at Weeks 9-10 — V1 polish features.

Build:
1. Insurance-ready PDF export (use react-pdf or similar):
   - Cover page: collector name, date generated, total insured value
   - Per-watch page: photos, brand, model, reference, year, current value, acquisition date and price, verification tier, serial if user provided
   - Appraiser-style language and formatting
   - Downloadable from /dashboard/export
   - Gated to Collector tier and above

2. Watchlist feature:
   - User can add references to watchlist without owning them
   - Price alerts via email when watchlist items move >5%
   - /dashboard/watchlist page

3. Weekly portfolio email:
   - Resend email digest every Monday
   - Subject: "Your collection moved $X this week"
   - Body: total change, biggest mover, current rank, biggest leaderboard climbers globally
   - Unsubscribe link

4. Bug bash:
   - Run lighthouse on every page, fix accessibility issues
   - Test all flows on iPhone Safari, Android Chrome
   - Add loading states everywhere they're missing
   - Add error boundaries on every page

Stop when V1 polish is complete and product feels finished.
```

### Prompt 11 — Beta launch prep (Weeks 11–12)

```
We're at Weeks 11-12 — launch prep.

Build:
1. Beta access controls:
   - /signup behind invite code for closed beta
   - Admin panel at /admin to generate invite codes (auth-gated to my email)
   - Waitlist page at /waitlist with email capture

2. Analytics:
   - PostHog setup on both apps
   - Track events: signup, watch_added, watch_verified, leaderboard_viewed, upgrade_clicked, upgrade_completed
   - PostHog dashboards: funnel, retention, feature usage

3. Admin tooling:
   - View all users, their tiers, their watch counts
   - Manually verify watches (gold tier)
   - Flag stolen watches
   - Refund subscriptions

4. App Store submission prep:
   - App Store screenshots in required sizes
   - App Store metadata: name (WATCHMOGGED), subtitle, description, keywords
   - Privacy policy URL, support URL
   - Position in App Store as "luxury watch portfolio tracker" not "rich list game" to avoid policy issues
   - Same for Google Play

5. Launch assets:
   - 5 evergreen SEO blog posts in /blog (we'll write content separately)
   - Product Hunt launch assets
   - Twitter/X launch thread template
   - TikTok content ideas list (this is your acquisition channel)

Stop when we're ready for public beta. Final checklist of what's ready for launch.
```

---

## PART 3 — TIKTOK CONTENT STRATEGY (PARALLEL TRACK)

WATCHMOGGED lives or dies on TikTok. Start building these accounts in Week 0, not Week 12.

### Account setup (Week 0)
- @watchmogged on TikTok, Instagram, X
- Bio: "The leaderboard for real watch collectors. Where do you rank?" + link
- Consistent visual identity matching Claude Design output

### Content pillars (run all four in rotation)
1. **Leaderboard drama** — "The #1 collector on WATCHMOGGED just added a $2.3M Paul Newman. The #2 collector is having a bad day."
2. **Verification reveals** — Slow reveal of a watch being authenticated, big "GOLD VERIFIED" moment
3. **Tier-list content** — "Ranking the top 10 collections on the app this week"
4. **Educational hooks** — "How to spot a fake Daytona in 5 seconds" with WATCHMOGGED branding

### Hooks that work for this audience
- "POV: you just got mogged by a 19-year-old with a Tudor"
- "I have a $400k watch collection and ranked #3,847"
- "The richest WATCHMOGGED user has $4.2M in watches. Here's what's in his collection."
- "This $80 Casio mogged a $40k Sub. Here's why."

### Cadence
- 2-3 TikToks/day during launch month
- 1 carousel + 2 stories/day on Instagram
- 1 high-effort thread/week on X

The unfair advantage: your product IS the content. Every leaderboard change, every verification, every new whale signup is a story.

---

## Final reminders for working with Claude Code

- After every prompt completion, commit to git with a meaningful message
- If Claude Code suggests something that contradicts the PRD or Implementation Plan, push back and reference the docs
- Don't let Claude Code "fix" things that aren't broken — scope creep is real
- When stuck, ask Claude Code to explain its decisions, then decide if you agree
- Keep this prompts doc updated as you learn what works