WATCHMOGGED — User Journey, MVP v1
Last updated: 2026-05-22 Scope: Must Have features only (per MOSCOW.md). Where Should-Have features would extend a journey, it's called out inline as a future addition, not part of v1. Companion docs: PRD.md, IMPLEMENTATION_PLAN.md, MOSCOW.md

How to read this
This doc walks through the actual lived experience of using WATCHMOGGED, end to end, for each major user type. For each step you'll see:
Trigger — what causes this step to happen
What they do — the user's actual action
What the product does — system response
What they feel — emotional state (this is the part most product docs skip and it matters)
Drop-off risk — where they might bail
Mitigation — how the product addresses that risk
The goal: by the end of this doc, you should be able to picture a real user moving through the app and predict where they get stuck, excited, or confused.

Part 1 — The personas, briefly
Marcus, "The TikTok Flexer" (primary persona)
24 years old, finance-adjacent job in NYC, takes home $130k. Owns a Tudor Black Bay 58 ($3.5k), a Cartier Tank Must ($3k), and just stretched for a pre-owned BLNR ($14k). Total: $20.5k. Discovered WATCHMOGGED via a TikTok showing the #1 collector's $4M collection. Signed up the same day. Wants to climb the rankings. Will pay $9.99/mo without thinking.
David, "The Established Collector" (secondary persona)
42 years old, dentist in Westchester, owns 8 watches worth $340k including a Daytona, a Royal Oak 15500, a JLC Reverso Tribute, and three vintage Omegas. Found WATCHMOGGED via a Hodinkee mention. Skeptical at first but curious about valuation and the leaderboard. Will pay for utility (insurance PDF, price tracking) more than flex.
Anonymous Andre, "The Quiet Whale" (tertiary persona)
56 years old, hedge fund partner, $1.8M collection including a Patek 5711 Tiffany, multiple Pateks, and an A. Lange Datograph. Genuinely worried about robbery. Wants to be on the leaderboard for the ego hit but absolutely will not show his face, name, or city. Uses anonymous mode from day one.
Tessa, "The Visitor" (non-converter, but matters)
19, college student, watched a WATCHMOGGED TikTok and clicked the link out of curiosity. Doesn't own a real luxury watch. Browses the leaderboard, daydreams. Might come back in 5 years when she has money. Free traffic that doesn't convert today but builds brand awareness.

Part 2 — The critical first-session journey
This is the journey that makes or breaks the product. Get the first 10 minutes right and Marcus is a paying customer forever. Get it wrong and he never comes back.
Step 1 — Discovery (TikTok)
Trigger: Marcus is on TikTok at 11pm. A video appears: "POV: you're #847 on WATCHMOGGED and the #1 guy just added a $2.3M Daytona." Quick cuts of leaderboard rankings, watch close-ups, "GOLD VERIFIED" badge animation, link in bio.
What he does: Watches it three times. Taps the profile. Sees @watchmogged. Bio reads "The leaderboard for real watch collectors. Where do you rank?" with a link. He taps the link.
What he feels: Curious. Slightly competitive. "Where would I rank?" is the exact thought.
Drop-off risk: Link could load slowly, look generic, look scammy.
Mitigation: Landing page is fast (< 2s on 4G), visually distinctive (matches TikTok aesthetic), shows real leaderboard data immediately above the fold.
Step 2 — Landing page (web, mobile browser)
Trigger: Tap-through from TikTok bio link.
What he sees:
Hero: "Prove what you own."
Subhead: "The leaderboard for real watch collectors. Upload, verify, rank."
Live top 5 leaderboard preview with real handles, total values, top watches
"Get my rank" CTA, "See the leaderboard" secondary
Founding member countdown: "423 of 500 founding spots left — $4.99/mo for life"
What he does: Scrolls. Looks at the top 5. Sees @daytonadan at $4.2M, @journeking at $3.8M. Thinks "no way I'm beating these guys but I want my spot." Taps "Get my rank."
What he feels: Aspirational but also achievable — he's not trying to beat #1, he's trying to get on the board.
Drop-off risk: Pricing fear, signup friction, "what's the catch" suspicion.
Mitigation: Founding member offer creates urgency, free tier is obvious (3 watches free forever), no credit card required for signup.
Step 3 — Signup
Trigger: Tapped "Get my rank."
What he sees: Centered card on dark background. "Claim your rank." Three buttons: Apple, Google, Email. Tiny legal text at bottom.
What he does: Taps Apple (he's on iPhone in mobile browser). Face ID. Returns to app.
What the product does: Supabase Auth creates the user. Triggers profile row creation. Redirects to handle reservation.
What he feels: Fast. Premium. Not annoyed.
Drop-off risk: OAuth fails on mobile browser, redirect loops, "what permissions are you asking for?"
Mitigation: OAuth permissions are minimal (email only). Sentry catches auth failures. Fallback to email signup is one tap away.
Step 4 — Handle reservation
Trigger: Just authenticated, no handle yet.
What he sees: "Pick your handle." Input field with watchmogged.com/ prefix shown. Tagline: "This is your public profile URL. Choose wisely."
What he does: Types "marcus". Sees a red X — taken. Tries "marcustime". Green check. Taps Continue.
What the product does: Real-time availability check via debounced query. Reserves handle on Continue.
What he feels: A little reminded of picking an Instagram username. Slight commitment moment — this is the URL he'll be sending to people.
Drop-off risk: All the good handles are taken, he gets frustrated, leaves.
Mitigation: Handle suggestions when typing a taken name. Reasonable rules (3-20 chars, alphanumeric + underscore). Can change handle later (with redirect from old URL).
Step 5 — First view of the app (empty dashboard)
Trigger: Just reserved handle.
What he sees: His dashboard, but empty.
"Welcome to WATCHMOGGED, @marcustime"
Big centered illustration of a watch with a "+"
"Add your first watch to get on the leaderboard"
Below: "Here's what your collection could look like" with sample collection preview
Sidebar (or scroll on mobile): "Your rank: Unranked"
What he does: Taps "Add your first watch."
What he feels: Mild commitment energy. The illustration helps. The sample collection makes it feel less empty.
Drop-off risk: The empty state feels lonely. He might leave thinking "I'll come back when I have time."
Mitigation: Single dominant CTA. The "your rank: unranked" is a small bug bite — he wants to fix that. Sample collection shows the destination.
Step 6 — Adding the first watch (search)
Trigger: Tapped "Add your first watch."
What he sees: A search bar with placeholder "Search 500+ references, brands, or models." Below: popular references as suggestions (Submariner, Daytona, Royal Oak 15500, Nautilus 5711).
What he does: Types "tudor". Sees Tudor results: Black Bay 58, Pelagos, Black Bay GMT, etc. Taps Black Bay 58 (39mm, ref 79030N).
What the product does: Live search via Supabase, debounced. Returns matches with reference image, current market value.
What he feels: Surprised the database is this comprehensive. "Oh nice, they have it."
Drop-off risk: His watch isn't in the database, he doesn't want to enter manually, he leaves.
Mitigation: 500 references covers ~85% of submissions. Manual entry option is clearly available. Curator queue exists for missing references.
Step 7 — Adding the first watch (photos)
Trigger: Selected the reference.
What he sees: "Add photos of your Black Bay 58. Suggested: dial macro, side profile, on-wrist." Drag-drop area on desktop, big camera button on mobile.
What he does (mobile): Taps camera. Permission prompt for camera access. Allows. Takes a dial shot. Reviews. Takes a side shot. Done.
What the product does:
Compresses each photo to ~500kb
Runs Claude Vision check on each: does this contain a face or significant body?
If face detected: rejects with message "We can't accept photos with faces or bodies visible. Crop or retake."
Uploads accepted photos to Supabase Storage with signed URL retrieval
What he feels: Slight friction if photo rejected. But the message is clear, not punitive. He retakes.
Drop-off risk: Photo upload fails (bad connection), face detection feels intrusive, he gives up.
Mitigation: Retry on failure, background upload queue, clear (not preachy) rejection message. The rejection happens on-device-perceived speed even though it's server-side.
Step 8 — Verification choice
Trigger: Photos uploaded successfully.
What he sees: Three cards.
Bronze — Free. "Photograph your watch with a challenge code to prove you have it." Recommended for new users.
Silver — Coming soon ($5). [Greyed out for v1]
Gold — Coming soon ($99). [Greyed out for v1]
"Skip for now" as a smaller text link
What he does: Taps Bronze.
What he feels: "Cool, this isn't going to cost me anything." Reads the bronze process. Slightly skeptical but willing.
Drop-off risk: The verification feels like extra work, he skips.
Mitigation: Bronze badge is visually prominent on watches that have it. Skipping means his watch shows as "unverified" — clear visual difference. We want skip to feel like a temporary state, not permanent.
Step 9 — Bronze verification (the unique mechanic)
Trigger: Tapped Bronze.
What he sees:
"Your challenge code: X7K9P2"
"This code expires in 10:00 minutes."
Instructions:
Write the code on a piece of paper, dated today
Place your Black Bay 58 next to the paper
Photograph both together so the code, date, and watch are all clearly visible
Upload the photo
Big upload button
Example image showing what a good submission looks like
What he does: Grabs a sticky note from his desk. Writes "X7K9P2" and the date. Puts his Tudor on top of it. Photographs with his phone. Uploads.
What the product does:
Validates upload via Edge Function
Claude Vision check: does image contain watch + paper + visible matching code + recent date?
If yes: marks watch as Bronze tier, dismisses verification
If no: returns specific reason ("We couldn't see the code clearly — retake the photo")
All within 30-60 seconds
What he feels: Mildly impressed. "Oh, that's clever." Feels like a real verification, not theater.
Drop-off risk: Verification fails repeatedly, he gets frustrated, leaves without verifying.
Mitigation: Specific error messages. Up to 3 retries before forcing a 1-hour cooldown (prevents abuse but not legit users). Skip option remains available.
Step 10 — First leaderboard placement (the dopamine moment)
Trigger: Bronze verification succeeded.
What he sees: Full-screen success state.
Animated badge: Bronze tier on his Tudor
Big number: "Your rank: #4,127"
Smaller text: "You're on the leaderboard with $3,500 in watches"
"Add another watch to climb" CTA
Share buttons: "Share my rank" — generates an Instagram-story-ready image
What he does: Stares at the screen for a beat. Taps "Share my rank." Sees a beautifully formatted card showing his handle, his rank, and a watch silhouette. Posts to his Instagram story.
What he feels: Validated. He's on the board. The number doesn't matter — being on the board matters. He's a collector now, officially.
Drop-off risk: None at this point — this is peak emotion.
Mitigation: N/A — make sure this moment is beautiful. This is the moment that converts a casual user into a returning user.
Step 11 — Adding a second and third watch
Trigger: He's still in the dopamine zone after first placement.
What he does: Goes back to dashboard. Adds his Cartier Tank. Then his BLNR. Photographs both, runs bronze verification on both (or skips, defers to later).
What the product does: With each addition, his rank updates with an animated count-down: "Climbing from #4,127 to #3,891."
What he feels: This is the slot-machine moment. He wants to add more. He realizes he's about to hit a paywall.
Drop-off risk: Hitting the paywall feels like a hard stop, he resents it.
Mitigation: The paywall is the conversion moment — designed in step 12 below.
Step 12 — Hitting the paywall (the conversion moment)
Trigger: He taps "Add a 4th watch."
What he sees: A modal, not a redirect.
Headline: "You've hit your free limit."
Subhead: "Free users can track 3 watches. Upgrade to unlock unlimited."
Two cards side by side:
Collector — $9.99/mo, 14-day free trial. "Unlimited watches. Full leaderboard. Price history. Insurance export."
Founding Member — $4.99/mo for life. "423 of 500 founding spots left." Highlighted, recommended.
"Maybe later" link, smaller, at the bottom
What he does: Looks at the founding member offer. Notices the spot count is dropping. Taps Founding Member.
What he feels: Mild loss aversion. The "for life" framing is powerful. $4.99 is below his decision-threshold. He's not "paying $5/month" he's "locking in a deal."
Drop-off risk: He picks "maybe later," forgets to come back, gets a different distraction.
Mitigation:
Founding member countdown creates urgency
Free trial removes payment fear (no card upfront if he uses trial)
Email sequence after dismissal (24h, 72h, 7d, 14d) reminds him about founding member spots
His existing 3 watches keep updating in value, generating reasons to return
Step 13 — Stripe checkout
Trigger: Tapped Founding Member.
What he sees: Stripe Checkout page. Pre-filled email. Apple Pay option available.
What he does: Apple Pay → Face ID → done.
What the product does:
Stripe webhook fires
Profile updated to subscription_tier: collector, founding_member: true
Returns to dashboard with confetti animation
"You're founding member #78"
What he feels: Mildly excited at "founding member #78" — feels like he's part of something early.
Drop-off risk: Payment fails, Apple Pay glitch, returns to dashboard but tier didn't update.
Mitigation: Stripe webhook retry logic. Manual reconciliation script for orphaned payments. Clear "billing issue" path with support email.
Step 14 — Post-conversion: filling the collection
Trigger: Now has unlimited watches.
What he does: Spends the next 20 minutes adding his remaining watches he's been mentally tracking — adds 2 more he forgot about (an Oris and a Hamilton). Photographs and bronze-verifies each.
What he feels: Completionist energy. Wants to "finish" his collection. Wants to see his real rank.
Drop-off risk: Limited at this point — he's invested time and money.
Mitigation: Each watch add still shows the rank-climb animation. Keep the dopamine flowing.
End of first session
By the end of first session (~30-45 min for a typical Marcus), he has:
Account with handle reserved
5 watches added
5 bronze verifications (or some unverified)
Founding member subscription
Posted to Instagram story
Real rank on the leaderboard
Probably bookmarked the site
He'll come back tomorrow to check his rank.

Part 3 — The trial period journey (days 1-14)
For free users who didn't convert on day one — most users in this segment. The 14-day window is when conversion either happens or doesn't.
Day 1 — Came back
Trigger: Push notification or email: "@daytonadan just added a $2.3M Daytona — see how the leaderboard moved." (V1 feature, not MVP)
For MVP without push: Marcus just opens the bookmark on his own.
What he does: Logs in (already authenticated). Sees his rank. Has it moved? Did someone new beat him? Scrolls leaderboard top 10. Browses @daytonadan's profile.
What he feels: Engaged. Slightly competitive. The whales' collections are aspirational.
Drop-off risk: Nothing new to do, he closes the app and doesn't come back.
Mitigation: Leaderboard movement is the content. Even without him doing anything, prices fluctuate weekly, his rank moves, other users add watches.
Day 3 — Rank moved
Trigger: Weekly price refresh ran. His BLNR dropped 2% in market value. He dropped 4 ranks.
What he does: Sees a small "-4" indicator next to his rank when he logs in. Investigates. Sees the BLNR detail page showing the price drop.
What he feels: Mild stomach drop. The leaderboard is real — values fluctuate, ranks move. This is good for engagement.
Drop-off risk: None — this is the kind of engagement that brings users back.
Day 7 — Sharing his profile
Trigger: Group chat with watch friends. Someone shares a wrist shot. He drops his WATCHMOGGED profile link.
What he does: Sends watchmogged.com/marcustime to the group chat.
What his friends see: His profile page, beautifully formatted, with his 3 watches, his rank, his founding member badge.
What he feels: Mild flex satisfaction. Mild "you guys need to get on this."
Drop-off risk: Friends laugh at it, dismiss it, he gets embarrassed.
Mitigation: The product visual quality has to be good enough that sharing it feels like sharing a Hodinkee article, not a janky app.
Day 10 — Hitting the paywall (for those who didn't convert on day 1)
Trigger: He wants to add the watch his uncle gave him for his birthday — a Hamilton Khaki. 4th watch attempt. Same modal as Step 12 above.
What he does: This time he's been on the platform 10 days. He's emotionally invested. Founding member spots are now down to "287 of 500."
What he feels: Stronger urge to convert than day 1. The product has earned trust.
Mitigation: Same as Step 12, but the urgency is higher.
Day 14 — Free trial expiring (for users who picked free trial path)
Trigger: Email at 12 days: "Your free trial ends in 2 days. Founding member spots: 234 of 500."
What he does: Either adds payment method, lets it expire, or upgrades to founding member rate.
What he feels: Decision pressure. Loss aversion if he's been using it.
Drop-off risk: Forgets the email, trial expires, gets downgraded to free tier (still has his account, still has his watches, but capped to 3 visible).
Mitigation: Hidden watches don't get deleted — they're just not displayed. This is critical. If he upgrades a month later, his collection is intact. No "you have to re-add" punishment.

Part 4 — The conversion journey (paid signup deep-dive)
This is what happens for users who pay. Not all journeys go this way. About 8-12% target conversion.
Acquisition channel mix
TikTok bio link → ~60% of paid signups (high intent, fast conversion)
Direct search ("watchmogged") → ~15% (curious, lower conversion)
SEO from reference pages → ~10% (utility-driven, converts on insurance/tracking)
Word of mouth / shared profile links → ~10% (social proof, fast conversion)
Press (Hodinkee, etc.) → ~5% (David persona, slower conversion, higher LTV)
The friction points (and how MVP handles them)
Friction
MVP handling
"Will this charge me without warning?"
14-day trial with cancel-anytime, prominently stated
"Is this safe to share my watches publicly?"
Privacy toggle is Must Have (hide total, anonymous mode)
"Will my watches actually be on a real leaderboard?"
Visible top 100 immediately, can be browsed without signup
"Is the $4.99 founding member offer real?"
Stripe coupon with hard limit at 500, countdown visible everywhere
"What if I cancel?"
Account stays, watches stay, just capped to 3 displayed
"What if my watch isn't worth what you say?"
Per-watch market value visible, sourced from real data, updated weekly


Part 5 — The paid power user journey
For users 30+ days into a paid subscription. This is retention territory.
Habits to encourage
Weekly check-in: Their rank changes, leaderboard moves, new users sign up. Check at least 1x/week.
Adding new watches: Whenever they buy a new piece IRL, they add it to WATCHMOGGED. The platform becomes the "where I keep my collection" muscle memory.
Marking watches as sold: When they sell, they mark it. This preserves their history and surfaces interesting "they used to own a Daytona" data on their profile.
Sharing their profile: WhatsApp groups, Reddit comments, Twitter replies. The URL becomes their watch identity.
What the MVP doesn't yet give them (and that's OK)
The paid user journey is intentionally simple in MVP. They get:
Unlimited watches
Full leaderboard
Profile and dashboard
They don't yet get (Should/Could Have, V1+):
Silver/gold verification
Insurance PDF
Watchlist
Achievements
Price history charts (per-watch)
Email digests
Social features
The risk: paid users might churn after the initial flex wears off, because there's not enough utility. The mitigation: Should-Have features (insurance PDF, price history) need to ship within 60 days of launch. That's why MoSCoW puts them in V1.

Part 6 — Edge case flows
These are the weird paths that real users will hit. MVP needs to handle them or users get burned.
Edge case A — Photo rejected for face detection
Trigger: User uploads a wrist shot with their face partially visible (selfie-style mirror photo).
System: Claude Vision flags face presence. Rejects upload.
User sees: Clear message: "We can't accept photos that show faces or bodies. This is for your privacy. Try cropping the photo to show just the watch, or retake."
Path forward: User retakes or crops. Upload retries until acceptable.
Failure path: User gets frustrated after 3 rejections, leaves. Mitigation: clear up-front guidance on the upload screen ("dial, case, caseback — no faces or bodies"), so users self-select before upload.
Edge case B — Watch not in reference database
Trigger: User wants to add a Massena Lab x Movado collab that isn't in our top 500.
System: "Couldn't find it? Add manually."
User does: Enters brand, model, reference number, year, estimated value.
System:
Creates the watch in the user's collection with manual_entry: true
Watch shows as "unverified" with no current market value (just user-declared)
Submits the reference to curator queue
User gets notified when reference is added to canonical database
At that point, watch is linked to the canonical reference and pricing kicks in
Risk: User declares $50k for a Tudor Black Bay to game the leaderboard.
Mitigation: Manual entries don't count toward leaderboard until verified by a curator OR linked to a canonical reference. (This is critical — write into the schema.)
Edge case C — User wants to be anonymous mid-stream
Trigger: User signed up with their name, then after seeing the leaderboard, gets nervous.
What they do: Go to Settings → Privacy → Toggle "Anonymous mode."
System: Their profile immediately switches:
Handle hidden, replaced with "Anonymous Collector #[rank]"
Avatar hidden, replaced with silhouette
City hidden
Public profile URL still works but shows anonymized version
They still keep their rank on the leaderboard
Path forward: Can toggle back to public any time.
Edge case D — Marking a watch as sold
Trigger: User sells their Datejust in real life.
What they do: On the watch detail page in their collection, tap "Mark as sold." Modal asks:
Date sold (defaults to today)
Price sold for (optional, private)
Confirm
System:
Updates watch with sold_at and sold_price
Removes from active collection total
Watch still appears in their personal history (private to them by default, can be shown publicly)
Leaderboard total updates
User feels: Mild loss of rank, but the historical record is satisfying. They watched a piece appreciate. They got a return.
Edge case E — Failed payment / subscription lapse
Trigger: Marcus's credit card expires. Stripe attempts payment. Fails.
System:
Stripe sends webhook
Email sent: "Payment failed — update your payment method"
Grace period: 7 days, account still functions as paid
After 7 days: downgraded to free tier
Watches over the 3-watch limit are hidden, not deleted
Email sent: "Your account has been downgraded — update payment to restore access"
User can: Update payment any time, instantly restored.
Edge case F — Account deletion
Trigger: User wants out (privacy concern, life change, whatever).
What they do: Settings → Delete Account → Two-step confirmation requiring typing handle.
System:
Profile soft-deleted (anonymized, watches deleted, leaderboard entry removed)
Stripe subscription canceled
Photos deleted from Supabase Storage within 30 days (GDPR-compliant retention)
Email confirmation sent
30-day grace period to undo via support email
After 30 days: hard delete
Edge case G — Suspected fake collection
Trigger: A user signs up, adds 47 watches in a day, all photographed against the same wall, total declared value $4.2M.
System (manual): Anomaly detection flags this for review. You (or admin) review. If fake: account suspended pending verification, watches removed from leaderboard.
MVP version: Manual. Just review the top 100 weekly for plausibility. As you scale, this needs automation, but for MVP it's "you check the top 100 manually before the weekly leaderboard snapshot."
Edge case H — Anonymous Andre is on the top 10
Trigger: Andre signs up anonymously with $1.8M in real watches, all gold-verified eventually. He's at #7 on the global leaderboard.
What appears on the leaderboard:
Rank 7: "Anonymous Collector #7" — Total: $1,820,000 — 23 watches — Top piece: [generic watch silhouette]
Click row: opens a profile-style page but everything is anonymized
What does NOT appear:
His handle, name, avatar, city, individual watch photos (or photos are visible but with watermark/blur)
The design tension: The leaderboard is more interesting if you can browse what's at the top, but anonymous users protect themselves by hiding details. MVP resolves this by: anonymous users still show their watches (since they're verified pieces) but with no link back to identity. People can see the collection, just not who owns it. This is a deliberate trade — Andre gets less flex satisfaction than a public user, but he gets to participate at all.

Part 7 — Cross-channel touchpoints
Where users encounter WATCHMOGGED outside the app itself.
TikTok / Instagram
@watchmogged account posting 2-3x daily
User-generated content: people sharing their rank screenshots
"Founding member #X" status as TikTok hook material
Email (via Resend)
Welcome email (instant after signup)
Trial-ending reminder (12 days into trial)
Failed payment notification
Verification status emails
Big rank change emails (V1+, not MVP)
Weekly digest (V1+, not MVP)
Web SEO
Reference pages ranked on Google ("Rolex Daytona 116500LN value")
"Top 100 watch collectors" listicle ranking
Blog (V1+, not MVP)
Public profile URLs
Share-friendly: watchmogged.com/marcustime
OG tags + Twitter cards optimized for link previews
Embedded in Instagram bios, Twitter bios, Reddit signatures

Critical moments to nail
If you can only get five things right in MVP, get these:
The first leaderboard placement (Step 10) — beautiful, share-worthy, dopamine peak
The bronze verification mechanic (Step 9) — feels novel, feels real, builds trust
The paywall modal (Step 12) — founding member urgency, no hard stop
The shared profile URL — when Marcus DMs his link to friends, the page has to look premium
The "you broke into the top 100" or similar rank-change feedback — even if no email, the in-app moment when they refresh and see they climbed
Get those five right and you have a product. Get them wrong and even a great feature list won't save you.

What this user journey explicitly assumes about MVP
Bronze verification only — silver/gold are coming-soon teases
No achievements, no badges (except Founding Member which is a special case for Must Have)
No email digests beyond transactional and trial-related
No social features (follow, comments, activity feed)
No watchlist
No insurance PDF
No Whale tier
No price history charts on individual watches
No theft registry
These are all Should/Could Have. They come within 60-90 days of launch. They are NOT what makes the difference between launching and not launching.

What I want feedback on before this becomes canon
The 5 critical moments at the bottom — agree or would you reorder?
The paywall position at 4th watch — too aggressive, too generous, or right?
The bronze verification mechanic — feel confident in the challenge-code-on-paper approach, or worried about user friction?
The manual entry handling for missing references — should manual entries count toward leaderboard at all, or only after curator approval?
Andre's anonymous experience — does showing his watches but not his identity feel right, or should anonymous users hide watches too?

