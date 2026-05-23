# Week 0 Monorepo Scaffold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the WATCHMOGGED Turborepo + pnpm monorepo with `apps/web` (Next.js 15), `apps/mobile` (Expo), five package stubs, local Supabase init, GitHub Actions CI, Vercel hello-world deployment, and branch protection on `main`.

**Architecture:** Turborepo + pnpm workspaces. Packages consumed as TS source (no per-package build step). Single root flat ESLint config + Prettier + Vitest workspace. Tailwind v4 web / NativeWind mobile (independent configs by design). Feature-branch + PR + squash-merge workflow.

**Tech Stack:** Node 22 LTS, pnpm 9, TypeScript 5 strict, Next.js 15 (App Router), React 19, Expo current stable, Tailwind v4, NativeWind, shadcn/ui (New York), Vitest, ESLint 9 flat, Prettier 3, Supabase CLI, GitHub Actions, Vercel.

**Spec:** `docs/superpowers/specs/2026-05-22-week0-monorepo-scaffold-design.md`

---

## Plan amendments (spec drift accumulated during execution)

This plan was written 2026-05-22 against a tooling snapshot. The following deviations were approved during execution and are authoritative where they conflict with the plan body below.

### Amendment A1 — TypeScript 6.x accepted instead of TS 5.x (Task 6)

Header says "TypeScript 5 strict"; spirit was "latest stable." TS 6.0.3 was current at execution time and is what landed. Strict-mode flags in `tsconfig.base.json` carry through identically; no plan body changes needed.

### Amendment A2 — ESLint 9.x pinned explicitly with peer-aware plugin versions (Task 6)

Header says "ESLint 9 flat"; bare `pnpm add eslint` resolved to ESLint 10, which `eslint-plugin-import` doesn't yet accept as a peer. Pin all three together when installing: `eslint@^9 @eslint/js@^9 eslint-plugin-unicorn@^56`. Subsequent dispatch prompts in this plan must use explicit major pins on installs to avoid the same drift.

### Amendment A3 — Next.js 16.x accepted instead of Next 15 (Task 15)

Header says "Next.js 15"; `create-next-app@latest` shipped Next 16.2.6 at execution time. Spirit was "current Next.js with App Router." React 19, Tailwind v4, and ESLint 9 are all baseline in Next 16, so the stack is more coherent than backporting to 15.

Implications for downstream tasks:
- **Task 15 Step 1:** the `--no-turbopack` flag is now effectively a no-op — Next 16's `create-next-app` writes bare `next dev` / `next build` to `package.json` regardless, and Turbopack is the default. Either drop the flag from the scaffold command or leave it; it has no effect on output.
- **Task 18:** add `turbopack: { root: path.resolve(__dirname, '../..') }` to `next.config.ts` alongside `transpilePackages`. Without it, Turbopack's workspace-root inference can pick a stray lockfile higher in the filesystem tree (observed during execution) and trigger a boot-time warning.
- **Task 19:** self-defends at Step 1 ("if Tailwind is already ^4, skip to Step 6") and will no-op cleanly. No body changes needed — but expect this task to land as a verification-only commit, not a real upgrade.

### Amendment A4 — `mkdir -p apps` is a hidden prerequisite (Task 15)

The plan's `pnpm create next-app@latest apps/web` invocation assumes `apps/` already exists. Modern `create-next-app` fails with "application path is not writable" if the parent directory is missing. Run `mkdir -p apps` before the scaffold command (or in the same compound). Same applies to Task 22 for `apps/mobile`.

### Amendment A5 — `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` are scaffolder defaults — keep tracked (Task 15)

Next 16's `create-next-app` ships an `AGENTS.md` (with a `CLAUDE.md` that references it) warning AI agents that Next 16 has breaking changes vs. older training data. These files are useful in-repo guidance and should remain tracked. Do not delete them when staging Task 15's commit.

### Amendment A6 — `*.config.ts` must be in package tsconfig includes (Task 12 → Task 14)

Discovered during Task 14 verification: typescript-eslint's `projectService` rejects files outside any TypeScript program with a "not found by the project service" parse error. Every package `tsconfig.json` must include `*.config.ts` in its `include` array. Applied preemptively to all five packages in commit `6c7c386`. Future package scaffolds in this plan (or in later plans) must follow the pattern `"include": ["src/**/*", "*.config.ts"]`.

### Amendment A7 — shadcn ecosystem moved Radix → Base UI; "New York" style retired (Task 20)

Plan said "shadcn init: New York style, Neutral base color, CSS variables: yes" with separate `shadcn add button` afterward. The modern shadcn CLI (`shadcn@^4.8.0` as of execution time) has migrated significantly:

- **Primitives library:** `@base-ui/react` instead of Radix UI. Base UI is the MUI team's headless component library, designed by former Radix team members. shadcn's official direction post-2025. Every future shadcn component installed in apps/web will use Base UI primitives.
- **Style preset:** "base-nova" — "New York" no longer exists in the CLI. The new presets ship richer token sets including sidebar, charts (5 colors), and a full radius scale.
- **Animation library:** `tw-animate-css` replaces `tailwindcss-animate`.
- **Color space:** oklch values (perceptually uniform, future-proof) replace hex/HSL.
- **shadcn package:** now a runtime dep (`shadcn ^4.8.0`), not just dlx-invoked. The CLI bundles tooling that components reference.
- **Standard cn() helper:** lands at `apps/web/src/lib/utils.ts` via `clsx + tailwind-merge` — unchanged from older shadcn pattern.

**Init flag change:** modern CLI uses `--defaults --yes --no-monorepo` (preset-based) instead of the plan's positional `--style new-york --base-color neutral --css-variables`. `--defaults` includes Button as part of init — so the plan's separate `shadcn add button` step is redundant. Task 20 lands as one commit (init + Button together), not two.

The full token set landed in `apps/web/src/app/globals.css` is infrastructure for Phase 1 UI work — useful artifact, not bloat.

---

## How to read this plan

- Each task is a single concern, sized to complete and verify in ≤15-20 minutes.
- Steps within a task are 2-5 minutes each.
- Every task ends in a commit on the `chore/week-0-monorepo-scaffold` branch.
- Tasks marked **[USER ACTION]** require you to do something outside the editor (UI clicks, install software, scan a QR code on a phone, etc.). They are NOT bundled into other tasks.
- The final squash-merge collapses all intermediate commits.

---

## External prerequisites (do before Task 1)

### Prerequisite P1: Docker Desktop installed locally **[USER ACTION]**

Not blocking for Week 0 (we don't run `supabase start`), but required by Week 1 onward. The spec's DoD calls for verifying it's installed.

- [ ] **Step 1: Check whether Docker Desktop is installed**

Run: `docker --version`

If you see a version, skip the install step. If the command is not found, proceed.

- [ ] **Step 2: Install Docker Desktop (if missing)**

Download and install from https://www.docker.com/products/docker-desktop/. Launch the app at least once so the daemon is registered.

- [ ] **Step 3: Verify**

Run: `docker --version && docker info | head -5`
Expected: Version printed and `docker info` shows server reachable (or "Cannot connect" if you haven't started the daemon — that's fine for now).

---

### Prerequisite P2: Vercel account ready **[USER ACTION]**

- [ ] **Step 1: Confirm Vercel account**

Go to https://vercel.com/login. Sign in (use GitHub if asked — easiest path because we link the repo later).

- [ ] **Step 2: Confirm GitHub connection**

In Vercel: Settings → Login Connections → ensure GitHub is connected.

- [ ] **Step 3: Confirm scope permission**

In Vercel: confirm the personal account or team where the project will live.

No CLI install needed in Week 0 (the Vercel hookup is dashboard-driven).

---

### Prerequisite P3: GitHub admin access on the `watchmogged` repo **[USER ACTION]**

Needed at Task 25 (branch protection rules). Confirm now so it doesn't block at the end.

- [ ] **Step 1: Confirm admin on the repo**

Visit `https://github.com/<your-username>/watchmogged/settings`. If the URL loads (vs. 404), you're admin.

- [ ] **Step 2: Confirm the repo exists and `main` is the default branch**

Run from anywhere: `git ls-remote https://github.com/<your-username>/watchmogged.git HEAD`
Expected: a commit SHA prints (the existing `205b387` or a newer one). If the repo doesn't exist on GitHub yet, create it as private and `git push -u origin main` from the local repo before continuing.

---

## Task 1: Create the feature branch

**Files:** none

- [ ] **Step 1: Confirm clean working tree on main**

Run: `git status`
Expected: `working tree clean`. If not, stash or commit before continuing.

- [ ] **Step 2: Create and switch to the feature branch**

Run: `git checkout -b chore/week-0-monorepo-scaffold`
Expected: `Switched to a new branch 'chore/week-0-monorepo-scaffold'`

- [ ] **Step 3: Verify branch**

Run: `git branch --show-current`
Expected: `chore/week-0-monorepo-scaffold`

No commit yet — first commit is in Task 2.

---

## Task 2: Pin Node 22 via .nvmrc

**Files:** Create `.nvmrc`

- [ ] **Step 1: Create `.nvmrc`**

```
22
```

- [ ] **Step 2: Confirm your active Node is 22**

Run: `node --version`
Expected: `v22.x.x`.
If lower or higher, switch using your version manager (`nvm use`, `fnm use`, `volta`, etc.).

- [ ] **Step 3: Commit**

```bash
git add .nvmrc
git commit -m "chore: pin Node 22 via .nvmrc"
```

---

## Task 3: Ensure pnpm 9 is installed

**Files:** none

- [ ] **Step 1: Check pnpm version**

Run: `pnpm --version`
Expected: a `9.x.x` version.

- [ ] **Step 2: Install or upgrade pnpm if needed**

If absent or wrong major, run: `npm install -g pnpm@9`
Re-verify: `pnpm --version`

No commit (no files changed).

---

## Task 4: Initialize root `package.json`

**Files:** Create `package.json`

- [ ] **Step 1: Capture your installed pnpm version**

Run: `pnpm --version`
Note the output (e.g., `9.15.4`). You'll plug it into `packageManager` below.

- [ ] **Step 2: Create `package.json`**

Substitute `<PNPM_VERSION>` with the version from Step 1.

```jsonc
{
  "name": "watchmogged",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@<PNPM_VERSION>",
  "engines": {
    "node": ">=22 <23"
  },
  "scripts": {
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "build": "turbo run build",
    "dev": "turbo run dev",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: initialize root package.json with pnpm + Turbo passthroughs"
```

---

## Task 5: Configure pnpm workspaces

**Files:** Create `pnpm-workspace.yaml`

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 2: Commit**

```bash
git add pnpm-workspace.yaml
git commit -m "chore: declare pnpm workspaces for apps and packages"
```

---

## Task 6: Install root devDependencies

**Files:** Modifies `package.json`, creates `pnpm-lock.yaml`, `node_modules/`

- [ ] **Step 1: Install TypeScript + ESLint + Prettier + Turbo + Vitest stack**

Run from repo root:
```bash
pnpm add -Dw \
  typescript \
  @types/node \
  eslint \
  @eslint/js \
  @eslint/eslintrc \
  typescript-eslint \
  eslint-plugin-import \
  eslint-plugin-unicorn \
  prettier \
  prettier-plugin-tailwindcss \
  vitest \
  turbo
```

`-Dw` = devDependency, workspace root.

- [ ] **Step 2: Verify lockfile created**

Run: `ls pnpm-lock.yaml`
Expected: file exists.

- [ ] **Step 3: Verify TypeScript runs**

Run: `pnpm exec tsc --version`
Expected: a 5.x version prints.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install root devDependencies (TS, ESLint, Prettier, Vitest, Turbo)"
```

(Do NOT commit `node_modules/` — it's already in the existing `.gitignore`.)

---

## Task 7: Create `tsconfig.base.json`

**Files:** Create `tsconfig.base.json`

- [ ] **Step 1: Create `tsconfig.base.json`**

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.base.json
git commit -m "chore: add strict tsconfig.base.json"
```

---

## Task 8: Create editor/format config files

**Files:** Create `.editorconfig`, `.prettierrc`, `.prettierignore`

- [ ] **Step 1: Create `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Create `.prettierignore`**

```
node_modules
.next
.expo
.turbo
dist
build
pnpm-lock.yaml
supabase/.branches
supabase/.temp
```

- [ ] **Step 4: Commit**

```bash
git add .editorconfig .prettierrc .prettierignore
git commit -m "chore: add EditorConfig, Prettier config, Prettier ignore"
```

---

## Task 9: Extend `.gitignore` for monorepo

**Files:** Modify `.gitignore`

- [ ] **Step 1: Read the current `.gitignore`**

Run: `cat .gitignore`

It already covers `node_modules`, `.next`, `.expo`, `dist`, `build`, env files, `*.log`, `.DS_Store`, `.vscode`, `.idea`, `supabase/.branches`, `supabase/.temp`, `.claude-mem`.

- [ ] **Step 2: Append monorepo-specific entries**

Append these lines to `.gitignore`:

```
# Turborepo
.turbo/

# Vitest
coverage/

# Mobile builds (Expo dev artifacts beyond .expo)
*.tsbuildinfo
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: extend .gitignore for Turborepo, Vitest coverage, tsbuildinfo"
```

---

## Task 10: Create root flat ESLint config

**Files:** Create `eslint.config.mjs`

- [ ] **Step 1: Create `eslint.config.mjs`**

```js
// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      'supabase/.branches/**',
      'supabase/.temp/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      unicorn,
    },
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
    },
  },
);
```

Notes:
- Framework-specific layering (`next/core-web-vitals` for web, `expo` for mobile) is wired into each app's local `eslint.config.mjs` AFTER scaffolding (Tasks 17 and 22). Keeping root config framework-agnostic avoids tight coupling between root and app scaffolds.

- [ ] **Step 2: Verify ESLint loads the config (will error because no source files)**

Run: `pnpm exec eslint --print-config eslint.config.mjs > /dev/null`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore: add root flat ESLint config (TS + import + unicorn)"
```

---

## Task 11: Create `@watchmogged/utils` with `formatUsd` (TDD)

**Files:** Create `packages/utils/package.json`, `packages/utils/tsconfig.json`, `packages/utils/vitest.config.ts`, `packages/utils/src/index.ts`, `packages/utils/src/index.test.ts`

- [ ] **Step 1: Create `packages/utils/package.json`**

```jsonc
{
  "name": "@watchmogged/utils",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --passWithNoTests"
  }
}
```

- [ ] **Step 2: Create `packages/utils/tsconfig.json`**

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `packages/utils/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Write the failing test FIRST (TDD red phase)**

Create `packages/utils/src/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { formatUsd } from './index';

describe('formatUsd', () => {
  it('formats cents as USD with two decimals', () => {
    expect(formatUsd(12_500_000)).toBe('$125,000.00');
  });
  it('handles zero', () => {
    expect(formatUsd(0)).toBe('$0.00');
  });
});
```

- [ ] **Step 5: Create empty `packages/utils/src/index.ts` so the import resolves**

```ts
export {};
```

- [ ] **Step 6: Install workspace links**

From repo root: `pnpm install`
Expected: pnpm resolves the new workspace package.

- [ ] **Step 7: Run the test to confirm it fails (TDD red)**

Run: `pnpm --filter @watchmogged/utils test`
Expected: FAIL. Error mentions `formatUsd is not exported` or similar.

- [ ] **Step 8: Implement `formatUsd` (TDD green)**

Replace `packages/utils/src/index.ts` contents with:

```ts
export function formatUsd(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}
```

- [ ] **Step 9: Re-run the test to confirm it passes**

Run: `pnpm --filter @watchmogged/utils test`
Expected: PASS. Both assertions green.

- [ ] **Step 10: Commit**

```bash
git add packages/utils
git commit -m "feat(utils): add formatUsd with cents-as-integer convention + Vitest test"
```

---

## Task 12: Create the four remaining package stubs

**Files:** Create `packages/{types,db,api,config}/package.json`, `tsconfig.json`, `src/index.ts` for each

- [ ] **Step 1: Create `packages/types/`**

`packages/types/package.json`:
```jsonc
{
  "name": "@watchmogged/types",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --passWithNoTests"
  }
}
```

`packages/types/tsconfig.json`:
```jsonc
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"]
}
```

`packages/types/src/index.ts`:
```ts
export type Brand<K, T> = K & { readonly __brand: T };
```

- [ ] **Step 2: Create `packages/db/`**

`packages/db/package.json` — identical shape, name `@watchmogged/db`.
`packages/db/tsconfig.json` — identical to types'.
`packages/db/src/index.ts`:
```ts
// Database type will be regenerated by `supabase gen types typescript` in Week 1.
// Stub kept type-only so consumers can import { Database } today without runtime impact.
export type Database = Record<string, never>;
```

- [ ] **Step 3: Create `packages/api/`**

`packages/api/package.json` — identical shape, name `@watchmogged/api`.
`packages/api/tsconfig.json` — identical.
`packages/api/src/index.ts`:
```ts
export {};
```

- [ ] **Step 4: Create `packages/config/`**

`packages/config/package.json` — identical shape, name `@watchmogged/config`.
`packages/config/tsconfig.json` — identical.
`packages/config/src/index.ts`:
```ts
export const APP_NAME = 'watchmogged' as const;
```

- [ ] **Step 5: Re-resolve workspace links**

Run: `pnpm install`
Expected: all four packages registered as workspace members.

- [ ] **Step 6: Verify per-package typecheck**

Run: `pnpm --filter @watchmogged/types typecheck && pnpm --filter @watchmogged/db typecheck && pnpm --filter @watchmogged/api typecheck && pnpm --filter @watchmogged/config typecheck`
Expected: all four exit 0.

- [ ] **Step 7: Commit**

```bash
git add packages/types packages/db packages/api packages/config
git commit -m "feat(packages): add stubs for types, db, api, config"
```

---

## Task 13: Create Vitest workspace root config

**Files:** Create `vitest.workspace.ts`

- [ ] **Step 1: Create `vitest.workspace.ts`**

```ts
export default ['packages/*'];
```

This tells Vitest to discover each package's `vitest.config.ts` automatically.

- [ ] **Step 2: Verify Vitest workspace discovery**

Run: `pnpm exec vitest run`
Expected: PASS. Only `formatUsd` tests run; other packages are skipped (no test files yet, `--passWithNoTests` keeps them green).

- [ ] **Step 3: Commit**

```bash
git add vitest.workspace.ts
git commit -m "chore: configure Vitest workspace discovery"
```

---

## Task 14: Create `turbo.json` and verify root passthroughs

**Files:** Create `turbo.json`

- [ ] **Step 1: Create `turbo.json`**

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "lint":      { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "test":      { "dependsOn": ["^test"] },
    "build":     { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev":       { "cache": false, "persistent": true }
  }
}
```

- [ ] **Step 2: Verify root `pnpm typecheck` runs across packages**

Run: `pnpm typecheck`
Expected: Turbo prints a per-package matrix, all green.

- [ ] **Step 3: Verify root `pnpm test` runs across packages**

Run: `pnpm test`
Expected: Turbo runs `test` in each package; `formatUsd` test passes, others pass with `--passWithNoTests`.

- [ ] **Step 4: Verify root `pnpm lint`**

Run: `pnpm lint`
Expected: Turbo runs `eslint .` in each package; no errors (stubs are clean). If you see errors related to typescript-eslint's `recommendedTypeChecked` complaining about parserOptions, those need each package's tsconfig included — verify in next step before committing.

- [ ] **Step 5: If lint failed, debug parserOptions**

If `pnpm lint` errored with messages about TS project resolution, the root eslint config's `projectService: true` should auto-discover. If still failing, add `tsconfigRootDir` corrections. Engineer's call. Re-run `pnpm lint` until clean.

- [ ] **Step 6: Commit**

```bash
git add turbo.json
git commit -m "chore: configure Turbo task graph for lint/typecheck/test/build/dev"
```

---

## Task 15: Scaffold Next.js into `apps/web`

**Files:** Create `apps/web/*` (many files via scaffold)

- [ ] **Step 1: Run create-next-app**

From repo root:
```bash
pnpm create next-app@latest apps/web \
  --typescript \
  --app \
  --tailwind \
  --eslint \
  --src-dir \
  --import-alias '@/*' \
  --use-pnpm \
  --no-turbopack
```

The `--no-turbopack` flag is conservative — Turbopack may still be opt-in for builds in some Next.js 15 minor versions; revisit later if you want it on.

Expected: a fully scaffolded Next.js app under `apps/web/`. The scaffolder creates `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/src/app/`, etc.

- [ ] **Step 2: Verify it boots before changing anything**

Run: `pnpm --filter web dev`
Expected: dev server starts on `localhost:3000`. Open the URL in a browser, see the default Next.js page. Stop the server (Ctrl+C).

- [ ] **Step 3: Reconcile with monorepo lockfile**

The scaffolder may have created an inner `pnpm-lock.yaml` inside `apps/web/`. Workspace lockfiles live at the root only.

Run:
```bash
rm -f apps/web/pnpm-lock.yaml
pnpm install
```

Expected: root `pnpm-lock.yaml` is updated and includes Next.js deps.

- [ ] **Step 4: Commit**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "chore(web): scaffold Next.js 15 app via create-next-app"
```

---

## Task 16: Wire `apps/web` tsconfig to monorepo base

**Files:** Modify `apps/web/tsconfig.json`

- [ ] **Step 1: Read the scaffold's tsconfig**

Run: `cat apps/web/tsconfig.json`

It will look approximately like Next.js's default — `strict: true`, `paths: { "@/*": ["./src/*"] }`, etc. We extend our base and merge Next-specific bits.

- [ ] **Step 2: Replace `apps/web/tsconfig.json` with**

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES2022"],
    "jsx": "preserve",
    "allowJs": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "module": "esnext",
    "moduleResolution": "bundler"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Notes:
- Keeps the base's strict flags including `verbatimModuleSyntax: true`.
- Overrides `lib` to include DOM and `module`/`moduleResolution` for Next's bundler.

- [ ] **Step 3: Verify typecheck still passes**

Run: `pnpm --filter web typecheck`
Expected: exits 0. If `verbatimModuleSyntax` flags type-only imports in the scaffold's boilerplate, fix them by adding `import type` where needed.

- [ ] **Step 4: Commit**

```bash
git add apps/web/tsconfig.json
git commit -m "chore(web): extend tsconfig.base.json from the monorepo root"
```

---

## Task 17: Wire `apps/web` ESLint to monorepo + add Next preset

**Files:** Modify `apps/web/eslint.config.mjs` (create-next-app should have created this; if it created `.eslintrc.json` instead, replace it)

- [ ] **Step 1: Inspect what create-next-app produced**

Run: `ls apps/web/eslint.config.* apps/web/.eslintrc* 2>/dev/null`

- [ ] **Step 2: Remove any legacy `.eslintrc*` and write a flat config**

If there's a `.eslintrc.json`, delete it: `rm apps/web/.eslintrc.json`

Create or overwrite `apps/web/eslint.config.mjs`:

```js
import { FlatCompat } from '@eslint/eslintrc';
import rootConfig from '../../eslint.config.mjs';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...rootConfig,
  ...compat.config({
    extends: ['next/core-web-vitals'],
  }),
];
```

- [ ] **Step 3: Verify lint passes**

Run: `pnpm --filter web lint`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add apps/web/eslint.config.mjs
git rm -f apps/web/.eslintrc.json 2>/dev/null || true
git commit -m "chore(web): adopt root flat ESLint config + Next.js preset"
```

---

## Task 18: Add `transpilePackages` to `next.config.ts`

**Files:** Modify `apps/web/next.config.ts`

- [ ] **Step 1: Overwrite `apps/web/next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@watchmogged/api',
    '@watchmogged/config',
    '@watchmogged/db',
    '@watchmogged/types',
    '@watchmogged/utils',
  ],
};

export default nextConfig;
```

- [ ] **Step 2: Verify Next.js still boots**

Run: `pnpm --filter web dev`
Expected: dev server starts on `localhost:3000` without errors. Stop (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add apps/web/next.config.ts
git commit -m "chore(web): transpile @watchmogged/* workspace packages"
```

---

## Task 19: Upgrade `apps/web` to Tailwind v4 (if scaffold used v3)

**Files:** Modify `apps/web/package.json`, `apps/web/src/app/globals.css`, delete `apps/web/tailwind.config.{ts,js}` if present, modify `apps/web/postcss.config.{mjs,js}` if needed.

- [ ] **Step 1: Check what Tailwind version was installed**

Run: `cat apps/web/package.json | grep tailwindcss`

If the version is `^4.x` or `4.x`, skip to Step 6. If `^3.x` or `3.x`, continue.

- [ ] **Step 2: Uninstall Tailwind v3 dependencies**

From repo root:
```bash
pnpm --filter web remove tailwindcss postcss autoprefixer
```

- [ ] **Step 3: Install Tailwind v4**

```bash
pnpm --filter web add -D tailwindcss@^4 @tailwindcss/postcss@^4
```

- [ ] **Step 4: Delete the v3 config file (if present)**

```bash
rm -f apps/web/tailwind.config.ts apps/web/tailwind.config.js
```

- [ ] **Step 5: Update PostCSS config for v4**

Replace `apps/web/postcss.config.mjs` (or `.js`) contents with:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 6: Update `apps/web/src/app/globals.css` to v4 syntax**

Replace contents with:

```css
@import "tailwindcss";

@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(0 0% 3.9%);
  --color-muted: hsl(0 0% 96.1%);
  --color-muted-foreground: hsl(0 0% 45.1%);
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: hsl(0 0% 3.9%);
    --color-foreground: hsl(0 0% 98%);
    --color-muted: hsl(0 0% 14.9%);
    --color-muted-foreground: hsl(0 0% 63.9%);
  }
}

body {
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 7: Verify build**

Run: `pnpm --filter web build`
Expected: exits 0 with the standard Next.js build summary.

- [ ] **Step 8: Commit**

```bash
git add apps/web/package.json apps/web/postcss.config.mjs apps/web/src/app/globals.css pnpm-lock.yaml
git rm -f apps/web/tailwind.config.ts apps/web/tailwind.config.js 2>/dev/null || true
git commit -m "chore(web): upgrade to Tailwind v4 with @theme + @import 'tailwindcss'"
```

---

## Task 20: Initialize shadcn/ui and install Button

**Files:** Create `apps/web/components.json`, `apps/web/src/lib/utils.ts`, `apps/web/src/components/ui/button.tsx`

- [ ] **Step 1: Run shadcn init from `apps/web`**

```bash
cd apps/web
pnpm dlx shadcn@latest init
```

Answer prompts:
- Style: **New York**
- Base color: **Neutral**
- CSS variables: **Yes**

Return to repo root: `cd ../..`

This creates `apps/web/components.json` and `apps/web/src/lib/utils.ts` (the `cn` helper).

- [ ] **Step 2: Install the Button component**

```bash
cd apps/web
pnpm dlx shadcn@latest add button
cd ../..
```

Creates `apps/web/src/components/ui/button.tsx`.

- [ ] **Step 3: Verify build still passes**

Run: `pnpm --filter web build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components.json apps/web/src/lib apps/web/src/components apps/web/package.json pnpm-lock.yaml
git commit -m "chore(web): init shadcn/ui (New York, neutral) + install Button"
```

---

## Task 21: Write the web hello-world page

**Files:** Modify `apps/web/src/app/page.tsx`

- [ ] **Step 1: Replace `apps/web/src/app/page.tsx`**

```tsx
import { formatUsd } from '@watchmogged/utils';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">WATCHMOGGED</h1>
      <p>Sample value: {formatUsd(12_500_000)}</p>
    </main>
  );
}
```

- [ ] **Step 2: Verify dev server renders the page**

Run: `pnpm --filter web dev`
Open `http://localhost:3000`.
Expected: page shows `WATCHMOGGED` heading + `Sample value: $125,000.00`.
Stop the server (Ctrl+C).

- [ ] **Step 3: Verify build still succeeds**

Run: `pnpm --filter web build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat(web): hello-world page imports formatUsd from @watchmogged/utils"
```

---

## Task 22: Scaffold Expo into `apps/mobile`

**Files:** Create `apps/mobile/*` (many files via scaffold)

- [ ] **Step 1: Run create-expo-app**

From repo root:
```bash
npx create-expo-app@latest apps/mobile -t default
```

Expected: Expo scaffolds the default template (Expo Router + TypeScript). Output includes the SDK version actually installed — note it down.

- [ ] **Step 2: Note the installed Expo SDK version**

Run: `grep '"expo":' apps/mobile/package.json`
Record the version (e.g., `"expo": "~52.0.0"`). This is the SDK version Week 0 used.

- [ ] **Step 3: Verify Expo dev server starts**

Run: `pnpm --filter mobile start`
Expected: Metro starts and prints a QR code + dev tools URL. Stop (Ctrl+C).

If `pnpm --filter mobile start` fails because of monorepo resolution, that's expected — Task 24 fixes it.

- [ ] **Step 4: Reconcile lockfile**

```bash
rm -f apps/mobile/pnpm-lock.yaml apps/mobile/package-lock.json apps/mobile/yarn.lock
pnpm install
```

- [ ] **Step 5: Commit**

```bash
git add apps/mobile pnpm-lock.yaml
git commit -m "chore(mobile): scaffold Expo app via create-expo-app"
```

---

## Task 23: Wire `apps/mobile` tsconfig to monorepo base

**Files:** Modify `apps/mobile/tsconfig.json`

- [ ] **Step 1: Inspect Expo's scaffold tsconfig**

Run: `cat apps/mobile/tsconfig.json`

Typical Expo template extends `expo/tsconfig.base`. We need to keep that for RN types AND get our strict flags. We achieve this by setting `extends` to our base and re-importing Expo's via `compilerOptions.types`.

- [ ] **Step 2: Replace `apps/mobile/tsconfig.json`**

```jsonc
{
  "extends": ["expo/tsconfig.base", "../../tsconfig.base.json"],
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

TypeScript 5.0+ supports array `extends`. Configs merge in order; later files override earlier on conflict, so our strict flags from `tsconfig.base.json` win while Expo's RN type globals carry through.

- [ ] **Step 3: Verify typecheck**

Run: `pnpm --filter mobile typecheck`
Expected: exits 0. If `verbatimModuleSyntax` flags any imports in the Expo scaffold's `app/_layout.tsx` etc., add `import type` where appropriate.

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/tsconfig.json
git commit -m "chore(mobile): apply monorepo strict TS flags on top of expo/tsconfig.base"
```

---

## Task 24: Configure Metro for monorepo

**Files:** Modify or create `apps/mobile/metro.config.js`

- [ ] **Step 1: Inspect what Expo scaffolded**

Run: `cat apps/mobile/metro.config.js 2>/dev/null || echo "no metro.config.js"`

The default Expo template may not include one. If it does, back up its contents.

- [ ] **Step 2: Write the monorepo-aware metro.config.js**

Create or replace `apps/mobile/metro.config.js`:

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

- [ ] **Step 3: Verify Metro starts cleanly**

Run: `pnpm --filter mobile start`
Expected: Metro starts; no warnings about resolution. Stop (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/metro.config.js
git commit -m "chore(mobile): configure Metro for monorepo (watchFolders, nodeModulesPaths)"
```

---

## Task 25: Install and configure NativeWind

**Files:** Modify `apps/mobile/package.json`, create `apps/mobile/tailwind.config.js`, create `apps/mobile/global.css`, modify `apps/mobile/babel.config.js`, modify `apps/mobile/app/_layout.tsx`, create `apps/mobile/nativewind-env.d.ts`

- [ ] **Step 1: Install NativeWind + its Tailwind dependency**

```bash
pnpm --filter mobile add nativewind react-native-reanimated react-native-safe-area-context
pnpm --filter mobile add -D tailwindcss
```

NativeWind currently requires Tailwind v3 internally (verify via NativeWind's current docs — if v4 is supported by scaffold day, use it; the v3 install path is shown below as the conservative default). The Tailwind version mismatch with `apps/web` is intentional and documented in the spec.

- [ ] **Step 2: Create `apps/mobile/tailwind.config.js`**

```js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 3: Create `apps/mobile/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Modify `apps/mobile/babel.config.js`**

Replace contents with:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

- [ ] **Step 5: Create `apps/mobile/nativewind-env.d.ts`**

```ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 6: Import `global.css` in `apps/mobile/app/_layout.tsx`**

Read the current `_layout.tsx`. Add at the top of the imports:

```ts
import '../global.css';
```

- [ ] **Step 7: Verify Metro starts**

Run: `pnpm --filter mobile start`
Expected: Metro starts; no errors related to NativeWind. Stop (Ctrl+C).

- [ ] **Step 8: Commit**

```bash
git add apps/mobile pnpm-lock.yaml
git commit -m "chore(mobile): install and configure NativeWind"
```

---

## Task 26: Wire `apps/mobile` ESLint to monorepo + add Expo preset

**Files:** Create `apps/mobile/eslint.config.mjs`

- [ ] **Step 1: Install eslint-config-expo if not already**

```bash
pnpm --filter mobile add -D eslint-config-expo
```

- [ ] **Step 2: Create `apps/mobile/eslint.config.mjs`**

```js
import { FlatCompat } from '@eslint/eslintrc';
import rootConfig from '../../eslint.config.mjs';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...rootConfig,
  ...compat.config({
    extends: ['expo'],
  }),
];
```

- [ ] **Step 3: Add a `lint` script to `apps/mobile/package.json`**

If `apps/mobile/package.json` doesn't already have a `lint` script, add:

```jsonc
"scripts": {
  "lint": "eslint ."
  // ... preserve other scripts like start/android/ios
}
```

Also add `typecheck` and `test`:

```jsonc
"scripts": {
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run --passWithNoTests"
  // ... plus existing start/android/ios
}
```

- [ ] **Step 4: Verify lint**

Run: `pnpm --filter mobile lint`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/eslint.config.mjs apps/mobile/package.json pnpm-lock.yaml
git commit -m "chore(mobile): adopt root flat ESLint config + Expo preset + npm scripts"
```

---

## Task 27: Write the mobile hello-world screen

**Files:** Modify `apps/mobile/app/index.tsx`

- [ ] **Step 1: Replace `apps/mobile/app/index.tsx`**

```tsx
import { Text, View } from 'react-native';

import { formatUsd } from '@watchmogged/utils';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Text className="text-3xl font-bold">WATCHMOGGED</Text>
      <Text className="text-base">Sample value: {formatUsd(12_500_000)}</Text>
    </View>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter mobile typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/app/index.tsx
git commit -m "feat(mobile): hello-world screen imports formatUsd from @watchmogged/utils"
```

---

## Task 28: Verify mobile hello-world in Expo Go **[USER ACTION]**

**Files:** none

- [ ] **Step 1: Start Metro**

Run: `pnpm --filter mobile start`

- [ ] **Step 2: Scan the QR with Expo Go on a device, OR press `i` (iOS Simulator) or `a` (Android Emulator)**

You need either:
- Expo Go installed on a physical phone (App Store / Play Store), on the same Wi-Fi as your dev machine
- OR Xcode + iOS Simulator on a Mac
- OR Android Studio + an Android Emulator

- [ ] **Step 3: Confirm the screen renders**

Expected: phone/simulator shows `WATCHMOGGED` heading + `Sample value: $125,000.00`.

If NativeWind classes don't apply (text looks unstyled), check the import of `../global.css` in `_layout.tsx` and the `jsxImportSource: 'nativewind'` flag in `babel.config.js` from Task 25.

- [ ] **Step 4: Stop Metro (Ctrl+C). No commit (no files changed).**

---

## Task 29: Install Supabase CLI

**Files:** none

- [ ] **Step 1: Install via Homebrew**

```bash
brew install supabase/tap/supabase
```

- [ ] **Step 2: Verify**

Run: `supabase --version`
Expected: a version prints (e.g., `1.x.x` or `2.x.x` depending on stable at scaffold day).

No files changed; no commit.

---

## Task 30: Run `supabase init`

**Files:** Creates `supabase/config.toml`, `supabase/seed.sql`, `supabase/.gitignore`, `supabase/functions/`

- [ ] **Step 1: Run `supabase init` at repo root**

```bash
supabase init
```

If prompted about VS Code or IntelliJ Deno settings, answer **No** (we're not using those IDEs as the primary target).

Expected output: confirms initialization, creates the `supabase/` directory tree.

- [ ] **Step 2: Inspect what was created**

Run: `ls -la supabase/`
Expected: `config.toml`, `seed.sql`, `.gitignore`, possibly `migrations/` and `functions/` dirs (empty).

If `migrations/` and `functions/` don't exist as empty dirs, create them:
```bash
mkdir -p supabase/migrations supabase/functions
touch supabase/migrations/.gitkeep supabase/functions/.gitkeep
```

- [ ] **Step 3: Verify Supabase's auto-generated `.gitignore` is reasonable**

Run: `cat supabase/.gitignore`
Expected: ignores `.branches`, `.temp`, etc. — matches what the root `.gitignore` already covers but with finer scope.

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "chore(supabase): run supabase init for local CLI scaffolding"
```

---

## Task 31: Create GitHub Actions CI workflow

**Files:** Create `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: ci
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
```

- [ ] **Step 2: Verify YAML syntax is valid**

Run: `cat .github/workflows/ci.yml`
Visually confirm indentation. (No local YAML linter required; GitHub Actions will validate on push.)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow (typecheck + lint + test)"
```

---

## Task 32: Surgical CLAUDE.md edit to §Pull requests

**Files:** Modify `CLAUDE.md`

- [ ] **Step 1: Locate the §Pull requests section in `CLAUDE.md`**

Run: `grep -n "Pull requests" CLAUDE.md`
Expected: one match. Note the line number.

- [ ] **Step 2: Replace the section content**

Find this block:
```
Pull requests
For solo work: direct commits to dev branch, merge to main on milestones
For any code touching auth, payments, or RLS: PR + security-review even if solo
```

Replace with:
```
Pull requests
All work goes through short-lived feature branches → PR → squash-merge to main
CI (typecheck, lint, test) must pass to merge
Branch protection on main: require PR + CI green
No dev or staging branches
Code touching auth, payments, RLS, user uploads, or external integrations: security-review run on the PR before merge
```

Use the Edit tool to make this surgical (do NOT rewrite the whole file).

- [ ] **Step 3: Verify the edit**

Run: `grep -A 6 "Pull requests" CLAUDE.md`
Expected: the new content prints.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md §Pull requests to reflect feature-branch model"
```

---

## Task 33: Run the full root verification pass locally

**Files:** none

- [ ] **Step 1: Reinstall to confirm lockfile is canonical**

Run: `pnpm install --frozen-lockfile`
Expected: no diff, no errors.

- [ ] **Step 2: Run all root checks**

```bash
pnpm typecheck && pnpm lint && pnpm test
```
Expected: all three exit 0.

- [ ] **Step 3: Run web build**

```bash
pnpm --filter web build
```
Expected: exits 0.

No commit (no files changed).

If any step fails, stop and fix before continuing — the PR CI will not be more lenient.

---

## Task 34: Push the feature branch and open the PR

**Files:** none locally; creates a PR on GitHub

- [ ] **Step 1: Push the branch**

```bash
git push -u origin chore/week-0-monorepo-scaffold
```

- [ ] **Step 2: Open the PR via `gh` CLI** (or via the GitHub web UI if you don't have `gh`)

```bash
gh pr create --title "chore: Week 0 monorepo scaffold" --body "$(cat <<'EOF'
## Summary
- Turborepo + pnpm workspaces, Node 22, pnpm 9
- apps/web (Next.js 15 + Tailwind v4 + shadcn/ui) + apps/mobile (Expo + NativeWind)
- packages/{api,db,types,utils,config} stubs; utils has real formatUsd + Vitest test
- supabase/ initialized via supabase init (local CLI only)
- GitHub Actions CI: typecheck + lint + test
- Surgical CLAUDE.md update for feature-branch PR flow

Implements `docs/superpowers/specs/2026-05-22-week0-monorepo-scaffold-design.md`.

## Test plan
- [ ] CI green on this PR
- [ ] Vercel preview deploy renders the hello-world web page at /
- [ ] Mobile hello-world verified in Expo Go locally (cannot CI this)
- [ ] Branch protection on main configured after this PR is approved

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Confirm the PR URL prints, then visit it**

Open the URL in your browser to track CI and Vercel preview.

---

## Task 35: Verify GitHub Actions CI passes on the PR

**Files:** none

- [ ] **Step 1: Watch CI run**

In the PR UI, the `verify` job should appear and run within ~30s.

Alternatively, locally: `gh pr checks --watch`
Expected: `verify` finishes with ✓.

- [ ] **Step 2: If CI fails, fix locally and push**

The most common Week 0 CI failures:
- A devDependency hoisting difference between local and CI: ensure `pnpm install --frozen-lockfile` succeeds locally.
- A lint rule that's lenient locally but strict in CI: re-run `pnpm lint` exactly as CI does.
- A missing `tsconfigRootDir` resolution: ESLint flat config's `projectService` should handle this; if not, set `tsconfigRootDir: import.meta.dirname` explicitly in both root and app eslint configs.

Push fixes to the feature branch; CI re-runs automatically.

---

## Task 36: Connect Vercel project to the repo **[USER ACTION]**

**Files:** none (Vercel config lives in Vercel's UI)

- [ ] **Step 1: New Project on Vercel**

Go to https://vercel.com/new. Click **Import Git Repository**. Select `watchmogged`.

- [ ] **Step 2: Configure import**

- **Project Name:** `watchmogged` (or whatever Vercel suggests)
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** click **Edit** → set to `apps/web` → **Continue**
- **Build & Output Settings:** leave defaults (Vercel will run `pnpm install` at workspace root and `pnpm build` in `apps/web` once Root Directory is set)
- **Environment Variables:** none in Week 0
- Click **Deploy**

- [ ] **Step 3: Wait for the first production deploy** (deploys from `main`)

Vercel deploys whatever's currently at `main` HEAD. Since this PR isn't merged yet, the first production deploy renders an empty repo (404 on `/`). That's fine. The PR preview (next task) is what matters for Week 0 verification.

- [ ] **Step 4: Confirm Vercel sees the PR**

Refresh your PR on GitHub. A Vercel comment should appear with a **Preview** URL. If it doesn't within ~2 minutes, check Vercel's project Settings → Git → ensure "Preview Deployments" is **Enabled** and the connected branch is `*` (all branches).

---

## Task 37: Verify Vercel preview deploy renders the hello-world

**Files:** none

- [ ] **Step 1: Open the Preview URL from the PR**

The Vercel bot posts a comment on the PR with the preview URL.

- [ ] **Step 2: Confirm the page renders**

Expected: `WATCHMOGGED` heading + `Sample value: $125,000.00`.

- [ ] **Step 3: If the build failed on Vercel**

Open the Vercel deployment logs from the PR comment. Most common Week 0 failures:
- Wrong Root Directory (must be `apps/web`)
- Vercel didn't detect pnpm — set Install Command override to `pnpm install --frozen-lockfile` and Build Command to `pnpm turbo run build --filter=web` in Vercel Settings → Build & Development Settings.

Push any fixes to the branch and let Vercel auto-redeploy.

---

## Task 38: Configure branch protection on `main` **[USER ACTION]**

**Files:** none (rule lives in GitHub settings)

Prerequisite check: PR is open, CI has run at least once on this PR (so the `verify` check name exists to select).

- [ ] **Step 1: Open Branch Protection**

Visit `https://github.com/<your-username>/watchmogged/settings/branches`. Click **Add branch protection rule**.

- [ ] **Step 2: Fill the rule**

- **Branch name pattern:** `main`
- **Require a pull request before merging:** ✓
  - **Require approvals:** uncheck (solo work — your own approvals don't count anyway)
  - **Dismiss stale pull request approvals when new commits are pushed:** ✓
- **Require status checks to pass before merging:** ✓
  - **Require branches to be up to date before merging:** ✓
  - In the **Status checks** search box, type `verify` and select it
- **Require conversation resolution before merging:** ✓
- **Require linear history:** ✓ (squash-merge produces linear history naturally)
- **Do not allow bypassing the above settings:** ✓

- [ ] **Step 3: Save the rule**

Click **Create**.

---

## Task 39: Verify direct push to `main` is rejected

**Files:** none

- [ ] **Step 1: Switch to main locally**

```bash
git checkout main
git pull origin main
```

- [ ] **Step 2: Make a trivial change and attempt to push**

```bash
echo "" >> README.md
git add README.md
git commit -m "test: should fail to push directly to main"
git push origin main
```

Expected: push is REJECTED with a message like `protected branch hook declined`.

- [ ] **Step 3: Roll back the local main**

```bash
git reset --hard origin/main
git checkout chore/week-0-monorepo-scaffold
```

`reset --hard` here is bounded (only the failed test commit) — safe to run.

---

## Task 40: Final Definition-of-Done walkthrough

**Files:** none — verification only

Open the PR, then walk the DoD list from `docs/superpowers/specs/2026-05-22-week0-monorepo-scaffold-design.md` §11 and check each box:

- [ ] `pnpm install` succeeds at repo root; `pnpm-lock.yaml` committed
- [ ] `pnpm typecheck` exits 0 (CI run shows green)
- [ ] `pnpm lint` exits 0 (CI run shows green)
- [ ] `pnpm test` exits 0, `formatUsd` tests pass (CI run shows green)
- [ ] `pnpm --filter web dev` → `http://localhost:3000` renders WATCHMOGGED + `$125,000.00` (you saw this in Task 21)
- [ ] `pnpm --filter mobile start` → Expo Go renders WATCHMOGGED + `$125,000.00` (you saw this in Task 28)
- [ ] `supabase init` complete; `supabase/config.toml` committed (Task 30)
- [ ] GitHub Actions CI green on the PR (Task 35)
- [ ] Vercel preview deploy URL renders the hello-world page (Task 37)
- [ ] CLAUDE.md §Pull requests updated (Task 32)
- [ ] Branch protection rules on `main` configured; direct push rejected (Tasks 38, 39)

If any box is not checked, fix before merging.

---

## Task 41: Squash-merge the PR to `main`

**Files:** none locally; merges remotely

- [ ] **Step 1: Squash-merge via GitHub UI**

In the PR, click **Squash and merge**. Edit the squash commit message:

```
chore: Week 0 monorepo scaffold

Establishes the Turborepo + pnpm workspaces monorepo with Next.js 15
web app, Expo mobile app, five package stubs, local Supabase init,
GitHub Actions CI, Vercel hello-world deployment, and branch
protection on main.

Implements docs/superpowers/specs/2026-05-22-week0-monorepo-scaffold-design.md.
```

Click **Confirm squash and merge**.

- [ ] **Step 2: Delete the remote feature branch**

GitHub offers a **Delete branch** button after merge. Click it.

- [ ] **Step 3: Pull the new main locally and delete the local branch**

```bash
git checkout main
git pull origin main
git branch -d chore/week-0-monorepo-scaffold
```

- [ ] **Step 4: Verify the production Vercel deploy now renders the hello-world**

Visit your Vercel project's production URL. Expected: WATCHMOGGED + `$125,000.00` renders.

- [ ] **Step 5: Confirm**

Run: `git log --oneline -3`
Expected: top commit is the squashed Week 0 commit on `main`.

Week 0 complete.

---

## Out-of-scope reminders (do NOT do these in Week 0)

- Creating staging or production Supabase projects (Week 1)
- Writing any schema, RLS policy, or Edge Function (Week 1+)
- Setting up EAS Build / EAS Update (Week 6)
- Wiring Sentry / PostHog / Resend / Stripe / Anthropic SDKs (later weeks)
- Pointing a custom domain at Vercel (whenever you want; not on the critical path)
- Adding Husky, lint-staged, commitlint
- Enabling Turbo Remote Caching
- Building any UI beyond the smoke page
