# Implementation Plan
**Project:** Wristleague (working title)
**Author:** [You]
**Last updated:** 2026-05-21
**Companion doc:** PRD.md

---

## 1. Tech Stack

### Core
- **Monorepo:** Turborepo + pnpm workspaces
- **Web:** Next.js 15 (App Router) + TypeScript
- **Mobile:** Expo (React Native) + TypeScript
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)
- **Payments:** Stripe (web), App Store IAP (mobile, V1)
- **Styling:** Tailwind CSS (web), NativeWind (mobile)
- **Web UI primitives:** shadcn/ui
- **Data fetching:** TanStack Query (React Query) — same on both apps
- **Analytics:** PostHog
- **Error tracking:** Sentry
- **Email:** Resend
- **AI verification:** Claude Vision API (Anthropic) for silver tier
- **Pricing data:** WatchCharts API (paid) OR curated dataset (launch)

### Hosting & Infra
- **Web:** Vercel
- **Mobile:** Expo EAS Build + EAS Update for OTA
- **Domain:** `[yourdomain].com` — buy `.com` only, no `.io`/`.app`
- **DNS / CDN:** Cloudflare (free tier)

### Dev tooling
- **Version control:** GitHub
- **CI:** GitHub Actions (typecheck + lint on PR)
- **Local Supabase:** Supabase CLI for offline dev
- **Code quality:** ESLint, Prettier, TypeScript strict mode

---

## 2. Monorepo Structure

```
wristleague/
├── apps/
│   ├── web/                  # Next.js 15 app
│   └── mobile/               # Expo app
├── packages/
│   ├── api/                  # Supabase client, queries, mutations
│   ├── db/                   # Schema, migrations, generated types
│   ├── utils/                # Shared formatters, validators
│   ├── types/                # Shared TypeScript types
│   └── config/               # Shared config (env, constants)
├── supabase/
│   ├── migrations/
│   ├── functions/            # Edge functions
│   └── seed.sql
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Rule:** Business logic lives in `/packages`. UI lives in `/apps`. Do not share UI components between web and mobile — it's a productivity trap for solo builders.

---

## 3. Database Schema (v1)

### Tables

**profiles**
- `id` (uuid, references auth.users)
- `handle` (text, unique, indexed)
- `display_name` (text)
- `avatar_url` (text, nullable)
- `bio` (text, max 280)
- `country` (text)
- `city` (text)
- `is_anonymous` (bool, default false)
- `subscription_tier` (enum: free, collector, whale)
- `subscription_status` (enum: active, past_due, canceled)
- `stripe_customer_id` (text, nullable)
- `created_at` (timestamptz)

**watch_references**
- `id` (uuid)
- `brand` (text)
- `model` (text)
- `reference_number` (text)
- `year_introduced` (int)
- `case_size_mm` (numeric)
- `movement` (text)
- `category` (enum: dive, dress, sport, complication, etc.)
- `image_url` (text)
- `current_market_value_usd` (numeric)
- `last_priced_at` (timestamptz)
- Indexed on brand, reference_number, category

**watches** (user-owned)
- `id` (uuid)
- `owner_id` (uuid, references profiles)
- `reference_id` (uuid, references watch_references, nullable)
- `manual_brand` (text, nullable — for non-database watches)
- `manual_model` (text, nullable)
- `manual_reference` (text, nullable)
- `year_of_manufacture` (int, nullable)
- `acquisition_date` (date, nullable)
- `acquisition_price` (numeric, nullable)
- `notes` (text)
- `verification_tier` (enum: unverified, bronze, silver, gold)
- `is_hidden` (bool, default false) — counts toward total, not displayed
- `is_stolen` (bool, default false)
- `created_at` (timestamptz)

**watch_photos**
- `id` (uuid)
- `watch_id` (uuid, references watches)
- `storage_path` (text)
- `is_primary` (bool)
- `created_at` (timestamptz)

**verifications**
- `id` (uuid)
- `watch_id` (uuid, references watches)
- `tier_requested` (enum: bronze, silver, gold)
- `status` (enum: pending, approved, rejected)
- `challenge_code` (text, nullable, for bronze)
- `submitted_photo_url` (text)
- `ai_confidence_score` (numeric, nullable)
- `expert_reviewer_id` (uuid, nullable)
- `rejection_reason` (text, nullable)
- `submitted_at` (timestamptz)
- `resolved_at` (timestamptz, nullable)

**price_history**
- `id` (uuid)
- `reference_id` (uuid, references watch_references)
- `price_usd` (numeric)
- `recorded_at` (timestamptz)
- Indexed on (reference_id, recorded_at desc)

**leaderboard_snapshots** (denormalized, refreshed nightly)
- `profile_id` (uuid)
- `total_value_usd` (numeric)
- `watch_count` (int)
- `verified_value_usd` (numeric)
- `rank_global` (int)
- `rank_country` (int)
- `snapshot_at` (timestamptz)

### RLS Policies (critical, write on day one)
- Profiles: anyone can read non-anonymous profiles; only owner can update
- Watches: anyone can read non-hidden watches of non-anonymous profiles; only owner can write
- Watch photos: same as watches
- Verifications: only owner and reviewers can read; only owner can submit
- Price history: public read
- Leaderboard snapshots: public read

---

## 4. Week-by-Week Build Plan

### Week 0 — Foundations
- Initialize Turborepo monorepo
- Set up Next.js in `/apps/web` and Expo in `/apps/mobile`
- Create Supabase project (dev + prod)
- Run `supabase init` locally
- Buy domain, point at Vercel
- Set up GitHub repo, branches, basic CI
- **Done when:** Both apps run locally, hello-world on Vercel and Expo Go

### Week 1 — Schema + Auth
- Design and write Postgres migrations for all v1 tables
- Write RLS policies for every table
- Run `supabase gen types typescript` and commit generated types to `/packages/db`
- Wire Supabase Auth on web (email + Google + Apple OAuth)
- Wire Supabase Auth on mobile (with Expo SecureStore for token persistence)
- **Done when:** Sign up on web, log in on mobile, same user visible in both

### Week 2 — Shared API layer
- Build typed Supabase queries in `/packages/api`:
  - `getProfile(handle)`
  - `getMyProfile()`
  - `updateProfile(data)`
  - `getMyWatches()`
  - `addWatch(data)`
  - `deleteWatch(id)`
  - `getLeaderboard({ country?, brand?, era? })`
  - `getWatchReference(id)`
  - `searchWatchReferences(query)`
- Set up TanStack Query with shared QueryClient config
- **Done when:** Both apps can call the API layer without duplicating logic

### Week 3 — Web app: profile + collection
- Public profile page (`/[handle]`)
- "My collection" management UI
- Add watch flow (search reference DB or manual entry)
- Watch detail page (`/[handle]/[watch-id]`)
- Photo upload to Supabase Storage with signed URLs
- **Done when:** You can sign up, add 5 watches, view your public profile at a URL

### Week 4 — Web app: leaderboard + landing
- Leaderboard page with filters
- Watch reference database pages (SEO targets)
- Landing page with leaderboard preview
- Pricing page
- Static pages (About, FAQ, How Verification Works, ToS, Privacy)
- **Done when:** Friend can visit your URL, see the leaderboard, sign up, add watches, see their rank

### Week 5 — Mobile app: auth + browse
- Mobile auth flow (sign up, log in, social OAuth)
- Mobile profile and collection views
- Mobile leaderboard browsing
- Push notification setup (Expo Notifications)
- **Done when:** Mobile app does everything the web app does, minus camera

### Week 6 — Mobile app: camera + verification
- Camera-based watch upload flow (Expo Camera)
- Bronze verification: challenge-code-on-paper flow
- Image compression and upload to Supabase Storage
- Submit for verification via edge function
- **Done when:** You can take a photo, get a challenge code, submit, get bronze badge

### Week 7 — Payments
- Stripe products and prices set up (Collector + Whale, monthly + annual)
- Web checkout flow via Stripe Checkout
- Stripe webhook handler as Supabase Edge Function
- Subscription tier gating across UI (free vs. collector vs. whale)
- 14-day free trial logic
- Stripe Customer Portal for self-service management
- **Done when:** You can upgrade to Collector, see your watch limit increase

### Week 8 — Pricing data + AI verification
- Source pricing data (WatchCharts API or curated dataset)
- Scheduled Supabase Edge Function for weekly price refresh
- Leaderboard snapshot generator (nightly cron)
- AI silver verification edge function (Claude Vision API)
- Verification submission UI on both web and mobile
- **Done when:** Watches refresh in value weekly, silver verification works end-to-end

### Weeks 9–10 — Insurance PDF + polish
- Insurance-ready PDF export (use the pdf skill — react-pdf or similar)
- Watchlist (track watches you don't own)
- Email digest (weekly portfolio summary via Resend)
- Bug bash across both apps
- Accessibility audit
- **Done when:** Product feels finished, not janky

### Weeks 11–12 — Beta + launch
- Recruit 50–100 collectors from Reddit r/Watches, Watchuseek, Twitter
- Closed beta with feedback channel (Discord or Linear forms)
- Fix top 20 reported issues
- Set up PostHog dashboards
- Submit to App Store and Play Store (allow 2 weeks for first review)
- Write launch posts: Product Hunt, Twitter, Hodinkee outreach
- **Done when:** Public launch

---

## 5. Key Architectural Decisions

### Why Supabase over Firebase
- Postgres > NoSQL for this data (relational by nature)
- Row Level Security is genuinely powerful
- Generated TypeScript types from schema
- Edge functions, storage, auth, realtime in one platform
- Open source and self-hostable if you ever need to leave

### Why not share UI components
- React Native Web + Tamagui exists, works, but adds complexity
- Solo founders move 2x faster with native styling per platform
- Component reuse is a 20% win that costs 80% productivity
- Revisit if you ever hire a second developer

### Why TanStack Query on both
- Same caching mental model
- Same hooks API
- Plays well with Supabase realtime
- Handles optimistic updates cleanly

### Why web before mobile
- Faster dev iteration loop
- Easier to demo to potential users (send a URL, not a TestFlight link)
- SEO surface available from day one
- App Store review delays don't block validation

### Why three Supabase environments
- Local (via CLI) for dev — no network, no API costs
- Staging — mirrors prod, for QA before deploys
- Production — sacred, no manual schema changes

---

## 6. Best Practices (don't skip)

### Types & schema
- Run `supabase gen types typescript` after every migration
- Commit generated types
- TypeScript strict mode on, no `any` without comment justifying it

### Migrations
- All schema changes go through `supabase db diff` and migration files
- Never change schema in the prod Supabase dashboard
- Migrations are reviewed in PRs like any other code

### Security
- RLS on every table from day one
- Write SQL tests for RLS policies
- All Supabase Storage buckets private; serve via signed URLs
- No secrets in client code; use Edge Functions for anything sensitive

### Mobile-specific
- Set up EAS Update from day one — push JS fixes without App Store review
- Use Expo Dev Client for native module testing
- Never store sensitive data in AsyncStorage; use SecureStore

### Observability
- Sentry on both apps from week 1
- PostHog events on every meaningful action (signup, watch added, verification submitted, upgrade)
- Supabase logs piped to a reviewable location

### Performance
- Image compression on upload (target < 500kb per watch photo)
- Pagination on leaderboard (50 per page)
- Database indexes on every foreign key and every column you filter by
- Use Supabase Realtime sparingly — it's a footgun at scale

---

## 7. Cost Estimate (monthly, at launch)

| Service | Tier | Cost |
|---|---|---|
| Supabase | Pro | $25 |
| Vercel | Hobby → Pro on launch | $20 |
| Domain | .com | $1.25 |
| Cloudflare | Free | $0 |
| Resend | Pro | $20 |
| Sentry | Team | $26 |
| PostHog | Free → paid at scale | $0 |
| WatchCharts API | TBD | $50–500 |
| Claude API (verification) | Pay-as-you-go | $30 |
| Expo EAS | Production | $19 |
| Apple Developer | Annual / 12 | $8 |
| Google Play | One-time / 12 | $2 |
| **Total** | | **~$200–700/mo** |

Break-even: 50–70 paying subscribers at $14.99/mo.

---

## 8. What to Build Next, Right After This

1. **Now:** Finalize the PRD with any tweaks
2. **Today–tomorrow:** Open Claude Design, generate wireframes for the 8 core screens listed below, refine, export handoff bundle
3. **This week:** Week 0 setup — monorepo, Supabase, hello-world deploy
4. **Next week:** Week 1 — schema and auth

### Priority screens for Claude Design
1. Landing page (logged out)
2. Sign up / log in
3. Public profile page (`/[handle]`)
4. My collection (logged in dashboard)
5. Add a watch flow
6. Watch detail page
7. Leaderboard
8. Pricing page

Generate these in Claude Design, refine, then use the Claude Code handoff bundle to bootstrap your Next.js app.

---

## 9. Risks to Monitor During Build

- **Pricing data source uncertainty** — solve in week 1, don't defer to week 8
- **Scope creep** — every feature request in beta goes to a V1 list, not into MVP
- **Verification complexity** — bronze is the only one that must work for launch; silver and gold can be 80% solutions
- **Cold-start leaderboard** — start recruiting beta whales in week 4, not week 11
- **App Store review surprises** — submit early in week 11, have a backup launch plan if rejected

---

## 10. Definition of Done — MVP

The product is ready to launch when:
- A new user can sign up, add 5 watches, get bronze verified, see their rank — all in < 10 minutes
- The leaderboard has at least 100 real users with average value > $50k
- A paid user can export an insurance PDF that an actual insurance company would accept
- Both apps are crash-free in 95%+ of sessions over a week of beta testing
- Stripe payments work end-to-end including cancellation and refund flows
- App Store and Play Store apps are approved and live