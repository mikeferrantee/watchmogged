# WATCHMOGGED — Setup Guide

**Goal:** Take you from "designs are done" to "Claude Code is running and the first session is producing results" without missing anything.

**Time estimate:** 60-90 minutes if you're focused. Some steps run in the background.

**Last updated:** 2026-05-22

---

## Phase 1 — Claude Design handoff (15-20 min)

### Step 1.1 — Open your Claude Design project
Go to claude.ai, click the Claude Design icon in the sidebar, open your WATCHMOGGED project. You should see all 8 screens plus the full wireframe overview canvas.

### Step 1.2 — Verify your design system is complete
Before exporting, confirm the following exist in your Claude Design project:
- Color palette tokens (full scale, with named accents)
- Typography scale (display serif + grotesk pairing)
- Spacing scale
- Border radius scale
- Shadow scale
- Three verification badge styles (bronze, silver, gold)
- Subscription tier visual treatments (Free, Collector, Whale, Founding Member)
- Primary CTA button styles
- Empty state and loading state references

If any of those are missing, generate them now with a quick prompt. They're load-bearing for consistent code output.

### Step 1.3 — Export the handoff bundle for Claude Code
Look for the "Handoff" or "Export" option in Claude Design (it should be in the top-right or in a menu). Choose the option that packages everything for Claude Code. This typically gives you a single bundle containing:
- All screen designs as code-ready specs
- Design system tokens as a JSON or CSS file
- Component specifications
- Asset references

Save the bundle to a known location on your Mac. I'd recommend `~/Desktop/watchmogged-design-handoff/` for now — we'll move it into the project folder in Phase 2.

### Step 1.4 — Also export as PDF and PNG
Separately, export the full wireframe overview canvas as both PDF and PNG:
- **PDF** — for sharing, printing, lawyer/collaborator reviews
- **PNG** — for embedding in Notion, GitHub READMEs, or pasting into chat tools

Save these alongside the handoff bundle.

### Step 1.5 — Optional but recommended: print the PNG
If you have a printer, print the wireframe overview at A3 or letter size. Pin it on your wall. Solo founders ship better products when they can see the whole product physically.

---

## Phase 2 — Project initialization (15-20 min)

### Step 2.1 — Create the project directory
Open Terminal on your Mac.

```bash
cd ~/Projects     # or wherever you keep code
mkdir watchmogged
cd watchmogged
```

If `~/Projects` doesn't exist:
```bash
mkdir -p ~/Projects && cd ~/Projects
```

### Step 2.2 — Create the docs folder and drop in all the .md files
```bash
mkdir docs
mkdir design
```

Now copy all the markdown files I've generated for you into `docs/`:
- CLAUDE.md → put this at the **project root**, NOT in docs/ (it must be at root for Claude Code to find it)
- MVP_PLAN.md → docs/
- PRD.md → docs/
- MOSCOW.md → docs/
- USER_JOURNEY.md → docs/
- MONETIZATION.md → docs/
- PROMPTS.md → docs/
- IMPLEMENTATION_PLAN.md → docs/

Move your Claude Design handoff bundle from Phase 1 into `design/`.

Your folder should now look like:
```
watchmogged/
├── CLAUDE.md
├── docs/
│   ├── MVP_PLAN.md
│   ├── PRD.md
│   ├── MOSCOW.md
│   ├── USER_JOURNEY.md
│   ├── MONETIZATION.md
│   ├── PROMPTS.md
│   └── IMPLEMENTATION_PLAN.md
└── design/
    └── [handoff bundle files]
```

### Step 2.3 — Initialize git
```bash
git init
git branch -m main
```

### Step 2.4 — Create a .gitignore
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp.*

# Build outputs
.next/
.expo/
dist/
build/

# Environment
.env
.env.local
.env*.local

# Logs
*.log

# OS
.DS_Store

# IDE
.vscode/
.idea/

# Supabase
supabase/.branches
supabase/.temp

# Claude Code
.claude-mem/
EOF
```

### Step 2.5 — Create a basic README.md
```bash
cat > README.md << 'EOF'
# WATCHMOGGED

The leaderboard for real watch collectors.

See `CLAUDE.md` for project orientation. See `docs/MVP_PLAN.md` for the Phase 1 build spec.
EOF
```

### Step 2.6 — First commit
```bash
git add .
git commit -m "chore: initial project setup with docs and designs"
```

### Step 2.7 — Push to GitHub
Create a new repo on github.com called `watchmogged`. **Make it private.** Then:

```bash
git remote add origin git@github.com:[your-username]/watchmogged.git
git push -u origin main
```

(Use HTTPS if you don't have SSH set up: `https://github.com/[your-username]/watchmogged.git`)

---

## Phase 3 — Claude Code setup (20-30 min)

### Step 3.1 — Install Claude Code if you haven't already
If you already have Claude Code installed, skip to 3.2. Otherwise, install it via your preferred method (the install instructions are at docs.claude.com). Verify by running `claude --version` in Terminal.

### Step 3.2 — Open Claude Code in your project directory
```bash
cd ~/Projects/watchmogged
claude
```

Claude Code should boot up and read CLAUDE.md automatically because it's at the project root.

### Step 3.3 — Install the superpowers marketplace and plugin

In Claude Code, run:
```
/plugin marketplace add obra/superpowers-marketplace
```

Then:
```
/plugin install superpowers@superpowers-marketplace
```

Quit Claude Code and restart it (`exit` then `claude` again). On restart, you should see a session-start banner indicating superpowers is loaded. Verify by running `/help` — you should see commands like `/superpowers:brainstorm`, `/superpowers:write-plan`, etc.

### Step 3.4 — Install claude-mem
The cleanest install method (varies by version, check the README at github.com/hanfang/claude-memory-skill or the official claude-mem plugin):

Option A — via plugin marketplace (if available):
```
/plugin install claude-mem
```

Option B — via curl install script:
```bash
# Exit Claude Code first
exit
# Then in your regular terminal:
curl -fsSL https://raw.githubusercontent.com/hanfang/claude-memory-skill/main/install.sh | bash
```

After install, restart Claude Code. You should see a memory-context block appear at the top of new sessions once you have some memory built up (won't appear on the very first session — that's expected).

### Step 3.5 — Install security-review
```bash
# From regular terminal, in your project directory:
git clone https://github.com/anthropics/claude-code-security-review.git ~/.claude/skills/security-review
```

Then in Claude Code, verify by running `/security-review --help` or check `/help` for the command.

### Step 3.6 — Confirm frontend-design is active
This one's built into Claude Code. No install needed. It activates automatically when you're building UI. You can confirm it's available by looking at your skills list in Claude Code.

### Step 3.7 — Verify Anthropic API access for verification skills
Some skills (claude-mem compression, security review) use Claude API in the background. Confirm you have an Anthropic API key set up. If not, generate one at console.anthropic.com and add it to your environment:

```bash
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### Step 3.8 — Final verification
In Claude Code, run:
```
/help
```

You should see commands from at least:
- superpowers (`/superpowers:brainstorm`, `/superpowers:write-plan`, etc.)
- security-review (`/security-review`)
- claude-mem helpers (`/mem-search` or similar)

If anything is missing, troubleshoot before proceeding. Don't start coding with broken skills.

---

## Phase 4 — First Claude Code session (the brainstorm) (15-20 min)

This is where it all comes together. You're about to do the first real work.

### Step 4.1 — Start a fresh Claude Code session
```bash
cd ~/Projects/watchmogged
claude
```

### Step 4.2 — Verify orientation
Type:
```
Read CLAUDE.md and confirm you understand the project. Then read docs/MVP_PLAN.md and tell me what we're building in Phase 1.
```

Claude Code should give you a concise summary back. If the summary is wildly off (wrong project, wrong scope, wrong tech stack), the docs aren't being loaded — fix that before proceeding.

### Step 4.3 — Run the first superpowers brainstorm
```
/superpowers:brainstorm

I'm starting WATCHMOGGED Phase 1 setup. This is Week 0 of the implementation plan — pure infrastructure and project scaffolding, no product features yet.

The goal for Week 0:
- Initialize the Turborepo monorepo with pnpm workspaces
- Set up /apps/web (Next.js 15 App Router, TypeScript strict, Tailwind, shadcn/ui)
- Set up /apps/mobile (Expo SDK latest, TypeScript strict, NativeWind)
- Set up /packages/api, /packages/db, /packages/types, /packages/utils, /packages/config
- Create Supabase project (dev + prod)
- Initialize Supabase locally via CLI
- Configure GitHub Actions CI (typecheck, lint)
- Deploy a hello-world version of web to Vercel

Before writing any code, walk me through your understanding and any clarifying questions about the setup.
```

The brainstorming skill will ask clarifying questions. **Answer them carefully** — this is where you set foundational decisions for the whole project.

### Step 4.4 — Convert brainstorm to plan
Once brainstorming is complete:
```
/superpowers:write-plan
```

This produces a written plan. **Review it carefully** before approving.

### Step 4.5 — Execute the plan
```
/superpowers:execute-plan
```

Watch what Claude Code does. Intervene if it goes off-track. Confirm each major milestone (monorepo created, Next.js initialized, Expo initialized, packages scaffolded).

### Step 4.6 — Commit and push
At the end of the cycle:
```bash
git add .
git commit -m "feat: initial monorepo scaffolding"
git push
```

---

## Phase 5 — What to do next (immediate)

After Week 0 is complete, the cycles repeat for Week 1 onwards. The pattern is always:

1. `/superpowers:brainstorm` for the next milestone (referencing MVP_PLAN.md)
2. `/superpowers:write-plan` to produce a written plan
3. `/superpowers:execute-plan` to implement with TDD
4. `/superpowers:request-code-review` for fresh-agent review
5. `/security-review` if touching sensitive surfaces (auth, payments, RLS, uploads)
6. Commit + push
7. Move to next milestone

### Week 1 next session prompt template
```
We completed Week 0 (monorepo scaffolding). Now starting Week 1.

Goal: Database schema and Supabase Auth on both web and mobile.

Reference docs/MVP_PLAN.md Section 2 (Must Have features) and the database tables defined in docs/IMPLEMENTATION_PLAN.md Section 3.

/superpowers:brainstorm
```

---

## Background tasks to handle in parallel (do these this week, not blocking)

These don't need Claude Code but must happen before launch:

### Task A — Lock down the name
- USPTO trademark search for "WATCHMOGGED" — 30 min on tmsearch.uspto.gov
- Register `watchmogged.com` — 5 min on Cloudflare Registrar or Namecheap (~$15/yr)
- Reserve handles on TikTok, Instagram, X, Threads, Reddit, YouTube — 30 min
- Reserve the App Store name in App Store Connect (requires Apple Developer account)

### Task B — Set up developer accounts
- Apple Developer Program ($99/yr) — apple.com/developer
- Google Play Developer ($25 one-time) — play.google.com/console
- Stripe account — stripe.com (US business, NY)
- Anthropic API key (already done if you have Claude Pro)
- Resend account — resend.com
- Sentry account — sentry.io
- PostHog account — posthog.com
- Vercel account — vercel.com

### Task C — Solve pricing data
- Email WatchCharts about API access pricing: ask for tier and rate limits
- Identify fallback: which 500 references will you seed manually if API isn't viable?
- Decide by Week 2 so it doesn't block Week 8

### Task D — Find a lawyer for ToS/Privacy review
- US-based, NY-licensed, comfortable with SaaS/consumer apps
- Budget $1-3k for ToS and Privacy Policy review before launch
- Ask them about your sole-proprietor decision and document the risk acknowledgment

---

## When things go wrong

**Claude Code is generating code that contradicts the docs:**
- Stop. Ask: "Reread CLAUDE.md and tell me which constraint I just violated." Force it to self-correct against the docs.

**superpowers is asking questions you've already answered in the docs:**
- Tell it: "Reference docs/MVP_PLAN.md Section X. The answer is there." Force it to read before asking.

**claude-mem isn't surfacing past context:**
- Memory is sparse for first 1-2 sessions. It clicks around session 4-5. Be patient.
- If after a week it's not working, check the install via `claude-mem --status` or its equivalent.

**You're stuck mid-cycle and don't know how to proceed:**
- Don't push forward. Pause, document what you tried, and ask in Claude Code: "What's blocking us right now? Walk me through the options."
- Reducing complexity is almost always better than adding more.

**You feel scope creep:**
- Re-read MVP_PLAN.md Section 6 (What this MVP intentionally does NOT include).
- If a feature isn't in Section 2 (Must Have), defer it.

---

## Definition of "I'm fully set up and ready to build"

Check these one by one. You're set up when ALL are true:

- [ ] `watchmogged/` directory exists with CLAUDE.md at root and docs/ folder populated
- [ ] Designs are exported and in `/design`
- [ ] Git repo initialized and pushed to private GitHub repo
- [ ] Claude Code opens in the directory and reads CLAUDE.md automatically
- [ ] superpowers commands appear in `/help`
- [ ] claude-mem is installed (memory will be empty on first session — that's fine)
- [ ] security-review is installed and `/security-review --help` works
- [ ] Anthropic API key is in your environment
- [ ] You've registered watchmogged.com and locked down social handles
- [ ] Apple Developer and Google Play developer accounts are at least applied for
- [ ] You've sent the WatchCharts API inquiry email

When all 11 are true, you're ready to start the Week 0 brainstorm in Phase 4.

---

## Final note

This setup phase feels like a lot, but you only do it once. The actual building starts in Phase 4 and goes from there. Take the setup seriously — every shortcut here creates a problem in Week 4 or Week 8 that's harder to fix than it was to prevent.

Once setup is complete, hand the wheel to superpowers and trust the cycle.