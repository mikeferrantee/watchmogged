CLAUDE.md
This file is loaded by Claude Code on every session start. It's the agent's first read. Keep it tight — every line costs context. Last updated: 2026-05-22

Project identity
Name: WATCHMOGGED One-liner: The leaderboard for real watch collectors — upload, verify, and rank your collection by total value. Stage: Pre-build. Designs complete. About to start Week 0 setup. Owner: Solo founder Operating from: New York, US

What we are building
A mobile + web app where watch collectors upload their watches, get them verified via a tiered authentication system, and compete on a public leaderboard ranked by total collection value. Brand voice is disruptive, new-era, Gen Z fluent. Reference brands: Cal AI, UMAX.
We monetize through subscriptions (Free / Collector / Whale), verification fees, affiliate commerce, and (later) insurance partnerships.

How to use the project docs
Always read these in this order at session start:
MVP_PLAN.md — the canonical Phase 1 build spec. This is your source of truth for what we're building.
MOSCOW.md — feature prioritization. Tells you what's Must Have vs deferred.
CLAUDE.md (this file) — conventions and workflow rules.
Read on demand for specific work:
PRD.md — the longer-form vision document. Read for context on personas, market, V2+ direction. Defer to MVP_PLAN.md when they conflict for Phase 1 work.
USER_JOURNEY.md — end-to-end user flows including edge cases. Read before any UI work or before making product decisions about flows.
MONETIZATION.md — revenue strategy, pricing tiers, what to charge for. Read before touching Stripe, paywalls, or pricing pages.
PROMPTS.md — historical prompts library. Reference only.
IMPLEMENTATION_PLAN.md — original week-by-week build plan. Use as scaffold but MVP_PLAN.md supersedes for scope.
When in doubt about scope: MVP_PLAN.md Section 2 (Must Have features) is the only list that matters for Phase 1.

Tech stack
Monorepo: Turborepo + pnpm workspaces
Web: Next.js 15 (App Router), TypeScript strict mode, Tailwind CSS, shadcn/ui, TanStack Query
Mobile: Expo SDK latest, React Native, TypeScript strict mode, NativeWind, Expo Router, Expo Camera, Expo SecureStore
Backend: Supabase (Postgres, Auth, Storage, Edge Functions, Realtime)
Payments: Stripe Checkout + Customer Portal (web only at MVP, no Apple/Google IAP)
AI: Claude Vision API for photo moderation and bronze verification
Email: Resend
Analytics: PostHog
Errors: Sentry
Hosting: Vercel (web), Expo EAS (mobile)
Version control: GitHub

Repository structure
watchmogged/
├── apps/
│   ├── web/                Next.js app
│   └── mobile/             Expo app
├── packages/
│   ├── api/                Shared Supabase queries, TanStack Query hooks
│   ├── db/                 Schema, generated types
│   ├── types/              Shared TypeScript types
│   ├── utils/              Shared formatters, validators
│   └── config/             Shared environment constants
├── supabase/
│   ├── migrations/         All schema changes, version-controlled
│   ├── functions/          Edge Functions
│   └── seed.sql
├── docs/                   All .md project docs live here
└── design/                 Claude Design handoff exports
Hard rules:
All business logic lives in /packages. UI is in /apps.
Do NOT share UI components between web and mobile. Different platforms, different UI code.
Each app consumes the same /packages/api data layer.

Skills available
You have these Claude Code skills installed. Use them as described.
superpowers (obra/superpowers)
The workflow framework. Use this for every non-trivial task.
/superpowers:brainstorm — start every new feature here. Don't write code until brainstorming is complete.
/superpowers:write-plan — convert brainstorm into a written plan before implementation.
/superpowers:execute-plan — execute the plan with TDD discipline.
/superpowers:request-code-review — after implementation, request review from a fresh agent.
Rule: If you find yourself about to write code without going through brainstorm → plan → execute, stop. Run brainstorm first.
claude-mem
Persistent memory across sessions. Loads context automatically at session start.
Captures session summaries to local SQLite store.
Retrieves relevant past context when you start a new session.
Use <private> tags to exclude sensitive content from memory storage.
You do not need to manually invoke this — it runs in the background.
frontend-design (built-in)
Activates automatically when building UI. Encodes design constraints for this environment. You do not need to manually invoke; trust it when it triggers.
security-review (anthropic/claude-code-security-review)
AI-powered security analysis.
/security-review — run on any PR or code change touching auth, payments, RLS policies, user uploads, or external integrations.
Required: run before merging anything that touches Stripe, Supabase Auth, RLS policies, or user-uploaded photo handling.

Workflow expectations
Every feature follows this cycle
/superpowers:brainstorm — clarify requirements, surface unknowns
/superpowers:write-plan — produce a written plan, confirm with me
Create a git worktree or branch for the work
/superpowers:execute-plan — TDD implementation
/superpowers:request-code-review — fresh-agent review
/security-review — if touching sensitive surfaces
Commit, merge, move on
Commits
Conventional commit format: feat:, fix:, chore:, docs:, refactor:
One logical change per commit
Commit after each completed superpowers cycle, not mid-cycle
Pull requests
For solo work: direct commits to dev branch, merge to main on milestones
For any code touching auth, payments, or RLS: PR + security-review even if solo

Critical conventions
TypeScript
Strict mode on. No any without a comment justifying it.
Generated types from Supabase live in /packages/db. Regenerate after every schema change with supabase gen types typescript.
Commit generated types to git.
Database
All schema changes via version-controlled migrations in /supabase/migrations.
NEVER make schema changes directly in the Supabase production dashboard.
Write SQL tests for RLS policies. Catch security regressions before they ship.
Row Level Security
RLS on every table from day one.
Default deny. Add specific allow policies.
Profiles: anyone can read non-anonymous profiles; only owner writes own profile
Watches: anyone can read non-hidden watches of non-anonymous profiles; only owner writes own watches
Verifications: only owner and admins can read; only owner submits
Photos: signed URLs only; private buckets
Photo uploads
All user-uploaded photos must run Claude Vision face/body detection BEFORE storage.
If a face or body is detected: reject with clear message, do not store.
All accepted photos compressed to ~500kb before storage.
Stored in private Supabase buckets, served via signed URLs only.
Environment separation
Three Supabase projects: local (CLI), staging, production.
Never test against production.
Use environment-specific Stripe keys.
Secrets
Never commit secrets.
Use .env.local for dev (gitignored).
Use Vercel environment variables for staging/prod.
API keys never in client code — use Edge Functions for anything sensitive.

Product decisions baked in (do not re-litigate)
These are decided. Do not propose alternatives for Phase 1.
Decision
Choice
Legal entity
Sole proprietor at launch (user accepted personal liability)
Public dollar amounts
Public by default, with per-user opt-out (rank-only mode)
Minimum to appear on leaderboard
$5,000 collection value
Anonymous users on leaderboard
Yes, mixed with named users
Sold watches
Forward-only history (can mark current as sold; no retroactive entries)
Reference database
Curator-only
Verification tier visibility
Always public
Brand voice
Disruptive, new-era, Gen Z. References: Cal AI, UMAX
Brand vs founder
Brand is the face, not founder-led
Collector pricing
$9.99/mo, $79/yr
Founding member offer
First 500 users at $4.99/mo for life
Free tier limit
3 watches
Whale tier at launch
NO (V1)
Silver/Gold verification at launch
NO (V1)
Mobile IAP at launch
NO (web Stripe only)
Referral program at launch
NO (V2)


Don't-do list (scope creep guardrails)
Refuse these unless explicitly approved:
Adding any feature NOT in MVP_PLAN.md Section 2 to Phase 1
Building Whale tier, silver/gold verification, watchlist, insurance PDF, or social features for launch
Direct messaging between users
Marketplace / transactions on platform
Crypto / NFT / blockchain anything
Allowing user-editable reference database
Forums or community discussion threads
Apple Watch app
Browser extension
Public API
Real-name verification for general users (only Whale tier KYC in V2)
If a user request would expand scope, push back and reference this list.

Definition of done (for any code change)
A change is done when:
TypeScript compiles with no errors
Tests pass (unit + RLS where applicable)
Linter and formatter clean
If touching sensitive surfaces (auth, payments, RLS, user uploads): security-review run with no critical findings
Manual test on both web and mobile if cross-platform
Committed with conventional commit message
A feature is done when:
All above
Code review from fresh superpowers agent (no concerns outstanding)
Deployed to staging
Validated against the user journey in USER_JOURNEY.md
Analytics events firing correctly in PostHog
No new Sentry errors after 24 hours of staging exposure

How to handle ambiguity
If a requirement is unclear or you have to make a product decision:
First, check MVP_PLAN.md and MOSCOW.md
Second, check USER_JOURNEY.md for related flows
Third, check the "Product decisions baked in" table above
If still unclear: STOP. Ask the user before assuming.
Do not make product decisions silently. Surface them.

Where designs live
Claude Design handoff bundle is in /design. It includes:
Design system tokens (colors, typography, spacing)
8 core screens for web and mobile
Full wireframe overview canvas
Component specifications
Reference designs by screen number (1-8). They're listed in PROMPTS.md Part 1.
When building UI, always check the design exports first. Do not invent layouts that contradict the designs.

Communication style with the user
Be direct. The user has shipped Next.js apps before and uses Supabase and Expo.
Don't over-explain basics. Do over-explain edge cases and security implications.
When uncertain, ask. Don't bluff.
When you find a problem in the docs or the plan, surface it. The plan is not sacred — the goal is shipping a good product.
One question at a time when blocked. Don't drown the user in clarifying questions.

End of file
If you've read this, you're oriented. Read MVP_PLAN.md next.

