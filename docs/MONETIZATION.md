WATCHMOGGED — Monetization Plan
Last updated: 2026-05-22 Companion docs: PRD.md, MOSCOW.md, USER_JOURNEY.md

Revenue mix at maturity
Stream
% of revenue
Margin
Timing
Subscriptions
60-70%
~70% (after Stripe)
Launch
Verification fees
15-20%
High on silver, thin on gold
Months 2-6
Affiliate revenue
10-15%
~100%
Month 2+
Insurance partnerships
Could become #1
Very high
Month 6+


Stream 1 — Subscriptions (primary)
The workhorse. Watch collectors are uniquely poorly-calibrated on $10/mo subscriptions — they spend $5k-$500k on wrist jewelry. Subscription is the easy yes.
Free — 3 watches, bronze verification, full leaderboard view
Collector — $9.99/mo or $79/yr (~34% annual discount)
Founding Member — $4.99/mo for life, first 500 users only (Stripe coupon)
Whale — $24.99/mo or $199/yr (V1, not MVP)
Why this works: Founding member offer creates launch urgency and TikTok content ("only 47 spots left"). Collector tier is the conversion engine. Whale tier creates aspirational ceiling and serves the actual whales who want exclusivity.

Stream 2 — Verification fees
Where you make real money, because verification is the only thing the leaderboard's credibility depends on.
Bronze — Free (challenge code mechanic)
Silver — $5/watch via Claude Vision AI. Collector tier gets 5/month included.
Gold — $99/watch via expert partner (Bezel, WatchCSA, etc.). Whale tier gets 1/quarter included.
Margins: Silver is near-pure margin (~$0.10 API cost). Gold is thin (~$30-50 partner cut), but the credibility halo is worth more than the margin.
Activation: Silver lands in V1 (within 60 days of launch). Gold lands in V2 (requires partnership signed first).

Stream 3 — Affiliate revenue
Invisible revenue. Runs in background, zero user friction.
Chrono24, Bezel, WatchBox referral links on every reference page
1-3% of transaction value — meaningful because watch sales are $5k-$500k+
"See similar listings" sections on every watch detail page
Watchlist price drop alerts that link to affiliate listings
Why this works: Collectors are constantly browsing Chrono24 anyway. Being the bridge between "I want this" and "here's where to buy" is free money.
Activation: Month 2-3, after launch dust settles.

Stream 4 — Insurance partnerships (sleeper hit)
Could become the largest revenue line long-term.
Hodinkee Insurance, Chubb, Wesleyan, Lloyd's pay $50-200/lead for HNW collectors
You have something they want desperately: a list of verified collections with exact values
Either referral model ($50-200/lead) or deeper partnership where they're your in-app insurance provider
Insurance PDF export is your conversion hook — users discover they need insurance, you have the partner ready
Why this works: HNW customer acquisition is brutal for insurers. You're aggregating them. The data is your moat.
Activation: Month 6+. Don't build for launch. But architect the data model now to enable it (collection value over time, verification tier, location coarse, etc.).

What to avoid
Ads — kills premium feel, alienates whales, low CPM in this niche anyway
Marketplace / transactions on platform — legal liability, escrow nightmare, regulatory exposure. Link out only.
Cosmetic IAP at launch (custom themes, badges, etc.) — cheapens the product. Maybe V3.
Brand sponsorships before 10k users — you have no leverage, deals will be lopsided
Apple IAP at launch — 30% Apple tax kills margins. Keep subscriptions web-only until mobile conversion data forces the issue.

Hormozi value-equation check


Dream Outcome
Likelihood
Time
Effort
Free
Get on the leaderboard
High
Instant
Low
Collector
Track + flex the full collection
High
Instant
Low
Whale
Verified status + exclusive community
High
Same-day
Low

The value-to-price ratio at $9.99/mo for Collector is absurd — you're charging $120/year for something tracking $50k-$500k of assets, providing real-time valuation, leaderboard status, and (V1) insurance-ready exports that save $300-500/year in appraisals. That's 10x value-to-price.
Founding member at $4.99/mo for life is the same math at 2x value ratio. People will lock in.

Order of revenue activation
Phase
Timing
Revenue streams active
MVP launch
Month 0
Free + Collector + Founding Member
V1
Month 2-3
+ Silver verification, + Affiliate links
V1 late
Month 4-6
+ Whale tier, + Gold verification
V2
Month 6+
+ Insurance partnerships
V2+
Month 9+
+ Brand sponsorships (carefully)


Break-even math
Fixed costs at launch: ~$200-700/mo (Supabase, Vercel, Resend, Sentry, WatchCharts, Claude API, Expo, dev accounts)
Break-even subscriber count:
At $9.99/mo Collector: ~50-100 paying users
At $4.99/mo Founding Member: ~100-200 paying users
Realistic year-1 target: 1,500 paying subscribers = ~$150k ARR. Add verification + affiliate revenue, conservatively $200-250k year-1 total.
Whale economics: Even 50 Whales at $24.99/mo is $15k ARR by itself. The math heavily favors getting the right whales over getting many free users.

The single most important monetization decision
Keep subscriptions web-only at launch. Apple's 30% tax on $9.99/mo means you net $7. After Stripe fees on web, you net $9.40. Over 1,500 users that's a $43k/year difference.
Use the mobile app as the experience (camera, verification, browsing), but force payment through web checkout. This is how Spotify operated for years and it's worth the minor UX friction.
Add IAP only when you have data showing mobile users won't complete web checkout — and only after you've maxed out the web channel.

