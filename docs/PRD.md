# Product Requirements Document
**Working title:** Wristleague *(placeholder — finalize before launch)*
**Author:** [You]
**Last updated:** 2026-05-21
**Status:** Draft v1

---

## 1. Vision

A status game for watch collectors. Users upload their watches, get them verified, and compete on a public leaderboard ranked by collection value. The product turns the existing #wristcheck culture into a structured, gamified, monetizable platform.

**One-line pitch:** Strava for watch collectors — track, verify, and flex your collection.

---

## 2. Problem & Opportunity

Watch collectors already flex publicly (Instagram, Reddit r/Watches, Watchuseek, TikTok #wristcheck) but:
- There is no credible, verified leaderboard of who actually owns what
- Collection valuations live in spreadsheets, insurance docs, or memory — not in real-time
- Authentication is a constant pain point (super clones are everywhere)
- No social product treats watch collecting as a game with rank, badges, and progression

**Opportunity:** Build the canonical platform where serious collectors prove what they own, track its value, and earn status. Monetize via subscriptions, paid verification, affiliate marketplace revenue, and insurance partnerships.

---

## 3. Target Users

### Primary persona — "The Flexer"
- Male, 28–45
- Owns 3–15 watches worth $5k–$500k total
- Active on watch Instagram, Reddit, or forums
- Already posts wrist shots publicly
- Pays for things that signal status (Amex Platinum, club memberships)
- Will pay $10–15/mo without thinking if the product feels premium

### Secondary persona — "The Tracker"
- Serious collector who wants portfolio tracking more than flex
- Values insurance-ready exports, price history, ROI analytics
- May choose private mode but still wants the data
- Converts on utility, not status

### Anti-persona — "The Replica Owner"
- Not a target user
- Verification flow must filter them out to protect leaderboard credibility

---

## 4. Goals & Success Metrics

### Year-1 goals
- 10,000 registered users
- 1,500 paying subscribers ($150k+ ARR)
- 500 gold-verified watches across the platform
- Top-100 leaderboard average collection value > $100k

### Leading indicators
- Signup → first-watch-uploaded conversion > 60%
- Free → paid conversion > 8%
- Monthly active users / registered > 40%
- Verification submission rate (bronze) > 80% within 7 days of signup

### Health metrics
- Leaderboard credibility (qualitative — community sentiment in r/Watches and Watchuseek)
- Verification accuracy (false-positive rate on AI silver verification < 5%)
- Churn < 5% monthly on annual plans

---

## 5. Core Features — MVP

### 5.1 Authentication & Profiles
- Email + Google + Apple OAuth via Supabase Auth
- Unique handle reserved at signup (becomes public profile URL: `wristleague.com/[handle]`)
- Profile fields: display name, avatar, bio (280 char), city/country (city-level max for safety), join date
- Privacy toggle: public profile vs. anonymous (anonymous users still rank but show as "Collector #4,213")

### 5.2 Watch Collection Management
- Add a watch: select from reference database OR enter manually (brand, model, reference, year)
- Each watch has: photos, reference data, current estimated value, verification tier badge, optional notes
- Watch detail page with photo gallery, specs, price history chart, provenance notes
- Edit, hide (counts toward total but not displayed), or delete watches
- Collection total value displayed prominently on profile

### 5.3 Verification Tiers
- **Bronze** — User photographs watch alongside a system-generated challenge code on paper, dated. Free, instant.
- **Silver** — AI verification via Claude Vision / OpenAI Vision API checks photo against reference. Paid: $5/watch.
- **Gold** — Human expert authentication via partner (Bezel, WatchCSA, etc.). Paid: $99/watch.
- Each tier shows a visually distinct badge on the watch card.

### 5.4 Leaderboard
- Global top 100 by collection value, public to all visitors
- Filters: country, brand specialty (Rolex/Patek/AP/etc.), era (vintage <1980 vs. modern)
- Entry shows: rank, handle, avatar, total value, watch count, top 3 pieces preview
- Click any entry → public profile
- "Your rank" sticky header when logged in
- Anonymous collectors occupy rank but display as anonymous

### 5.5 Watch Reference Database
- Seeded with top 500 most-collected references at launch (Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, JLC, Vacheron Constantin, A. Lange & Söhne, plus key indies)
- Each reference page: specs, current market value, price history, owners on platform (opt-in), top owners
- Search and browse by brand/category
- SEO target — these pages should rank on Google for "[brand] [reference] price/value"

### 5.6 Pricing Data
- Weekly automated price refresh from data source (WatchCharts API preferred; fallback to manual curation + Chrono24 scraping)
- Price history retained per reference
- Collection total recalculates whenever underlying prices change

### 5.7 Subscription & Payments
- **Free tier:** Up to 3 watches, bronze verification, view top 100 leaderboard, basic profile
- **Collector — $14.99/mo or $99/yr:** Unlimited watches, full leaderboard, price history charts, watchlist, insurance PDF export, advanced badges, AI silver verification credits ($5 retail, $0 marginal cost included up to 5/mo)
- **Whale — $29.99/mo or $249/yr:** Everything in Collector, plus 1 free gold verification/quarter, concierge support, private $250k+ leaderboard access, priority support, early brand partnership access
- Stripe checkout on web; Apple IAP later for mobile
- Free trial: 14 days of Collector tier on signup

### 5.8 Public-Facing Surface (Web)
- Landing page with leaderboard preview, value prop, pricing
- Pricing page
- How verification works page (trust-builder, treat it seriously)
- About, FAQ, Terms, Privacy Policy, Contact
- Static blog at `/blog` for SEO (launch with 5 evergreen posts: "How to authenticate a Rolex," "Top 10 most collected watches 2026," etc.)

---

## 6. Core Features — V1 (first 6 months post-launch)

- Achievements & badges system (Holy Trinity Owner, First Patek, Five-Figure Club, All Four Crowns, etc.)
- Category leaderboards (dive watches, complications, indie, vintage, women's)
- Watchlist — track grail pieces you don't own, get price alerts
- Follow collectors + activity feed
- Comments on watches and collections
- Long-form "collection story" writeups
- Insurance-ready PDF export (saves users $300–500 in appraiser fees)
- Embed widgets (collection badge for personal sites/blogs)
- Theft registry — flag stolen watches across the network
- Weekly portfolio email digest
- Affiliate marketplace links ("See similar listings on Chrono24/Bezel")

---

## 7. Core Features — V2+ (later)

- Direct messaging between verified collectors
- Brand partnerships and sponsored indie spotlights
- Real-world meetup / IRL verification events
- Insurance partnership integration (Hodinkee, Chubb, Wesleyan)
- API for third-party developers
- iPad-optimized layouts
- Marketplace (likely partnership rather than build)

---

## 8. User Stories — MVP

### Onboarding
- As a new user, I can sign up with email or Google/Apple in under 30 seconds
- As a new user, I can reserve a unique handle and see my public profile URL immediately
- As a new user, I can add my first watch within 2 minutes of signup

### Collection
- As a user, I can add a watch by searching the reference database or entering details manually
- As a user, I can upload multiple photos per watch
- As a user, I can submit a bronze verification challenge photo
- As a user, I can see my total collection value update in real time as I add watches
- As a user, I can hide individual watches from public view while still counting them toward my total

### Leaderboard & Discovery
- As any visitor, I can view the top 100 leaderboard without an account
- As any visitor, I can click any collector to view their public profile
- As a logged-in user, I can see my current rank and how many places I'd need to climb to hit the top 100
- As a user, I can filter the leaderboard by country or brand specialty

### Verification
- As a user, I can submit a watch for AI silver verification and receive a result within 60 seconds
- As a user, I can submit a watch for gold human verification and track its status
- As a visitor, I can see at a glance which watches in a collection are gold-verified

### Subscription
- As a free user, I hit a clear paywall when adding my 4th watch with an obvious upgrade path
- As a paid user, I can manage my subscription via Stripe customer portal
- As a paid user, I can export my collection as an insurance-ready PDF

---

## 9. Non-Functional Requirements

### Performance
- Web pages load in < 2s on 4G connection
- Leaderboard query returns in < 500ms
- Image uploads compress and process in < 5s

### Security & Privacy
- Supabase Row Level Security on every table from day one
- All user uploads stored in private buckets with signed URLs
- City-level location only (never exact)
- 2FA optional, recommended for Whale tier
- Anonymous mode genuinely anonymizes (no public name, no city, no avatar)

### Trust & Anti-Abuse
- Rate limit watch uploads (max 5/hour for free, 20/hour for paid)
- Bronze verification challenge codes expire in 10 minutes
- Manual review queue for any watch flagged by 3+ users
- Theft registry crosschecks every new upload

### Scalability
- Architecture supports 100k users without re-platforming
- Pricing data refresh handles 5k references without exceeding API budget

### Compliance
- GDPR-compliant data export and deletion
- Stripe handles PCI
- Privacy policy and ToS reviewed by lawyer before launch

---

## 10. Out of Scope (MVP)

- Direct messaging
- Marketplace / transactions
- Trading or escrow
- Brand-sponsored content
- Mobile-app-store IAP (web Stripe only at launch)
- Multi-language support (English only at launch)
- Web3 / NFT / on-chain anything

---

## 11. Risks & Open Questions

### Top risks
1. **Pricing data source** — WatchCharts API may be too expensive or restrictive; scraping has legal risk. Mitigation: launch with curated top-500 dataset, refresh manually weekly, upgrade to API once revenue justifies.
2. **Verification credibility** — If users find ways to game bronze tier with replicas, leaderboard collapses. Mitigation: tiered system makes gold the only "real" flex, community flagging on bronze.
3. **Security / robbery risk** — Public collections create real-world danger. Mitigation: anonymous mode prominent, city-level location only, dollar amounts hidden in some views, opt-out always available.
4. **Cold start** — Leaderboard is boring without real whales. Mitigation: hand-recruit 50 known collectors before launch, offer free Whale tier for first 100 verified $100k+ collections.
5. **Apple/Google policy** — App stores may reject "rich list" framing as gambling-adjacent or in poor taste. Mitigation: position as collection tracker first, leaderboard second, in App Store metadata.

### Open questions
- Should anonymous users count toward the leaderboard at all, or be filtered out of public view?
- What's the right minimum collection value to appear on the public leaderboard? ($0, $1k, $10k?)
- Do we publish dollar amounts publicly, or rank tiers only? (Lean: rank + tier, blur exact value below the top 10)
- How do we handle a watch sold between users — does it transfer, or does each owner have an independent record?