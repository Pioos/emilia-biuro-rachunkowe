# Plan 005: Add one-command verification and gate deployment

> **Executor instructions**: This plan establishes the permanent verification
> contract after Plans 001–004 settle analytics, hosting and preview behavior.
> Run each gate, keep fixtures deterministic, and do not weaken checks merely
> to make CI green. Update the status row when complete.
>
> **Drift check (run first)**:
> `git diff --stat b40daa4..HEAD -- package.json package-lock.json playwright.config.js tools/verify-static.js tests .github README.md script.js preview-server.js netlify.toml sitemap.xml`
> Plans 001–004 will intentionally produce changes. Confirm their status is
> `DONE` and their done criteria still pass; otherwise stop.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: `plans/001-safe-ga4-bootstrap.md`, `plans/002-single-netlify-deployment.md`, `plans/003-secure-preview-server.md`, `plans/004-preview-production-parity.md`
- **Category**: tests
- **Planned at**: commit `b40daa4`, 2026-08-19

## Why this matters

The highest-churn files—`index.html`, `styles.css`, and `script.js`—contain the
lead form, consent, analytics and responsive UI, yet there is no automated
check before publication. The GA4 regression reached production because no
browser loaded every page and captured runtime errors. One documented command
must verify syntax, static contracts, unit tests and critical browser journeys,
and CI must run it before changes are considered deployable.

## Current state

- No `package.json`, lockfile, lint config or general verification command
  exists at planned commit.
- Plan 001 creates `tests/analytics-bootstrap.test.js`.
- Plan 003 creates `tests/preview-server-security.test.js` and exports an
  importable preview server.
- Plan 004 creates `tests/preview-routing.test.js` and documents deterministic
  local route/form simulation.
- `script.js:76-133` implements the critical contact-form validation, network
  state and form conversion event.
- `script.js:155-350` implements consent persistence, GA loading, modal focus,
  conversion listeners and footer year.
- `netlify.toml` is the production routing/header contract after Plan 002.
- Existing style is vanilla HTML/CSS/CommonJS, with no application framework.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci` | exit 0 from committed lockfile |
| Browser install | `npx playwright install chromium` | exit 0 |
| Full verification | `npm run verify` | exit 0; all stages pass |
| Browser smoke | `npm run test:e2e` | exit 0; all Chromium tests pass |
| Scope | `git diff --stat` | only files listed in Scope plus plan status |

## Suggested executor toolkit

- Use Playwright's official test runner for browser smoke tests.
- If an HTML validator is added, prefer a maintained CLI with a committed
  configuration and lockfile; do not add a framework or bundler.

## Scope

**In scope**:

- `package.json` (create)
- `package-lock.json` (create through npm)
- `playwright.config.js` (create)
- `tools/verify-static.js` (create)
- `tests/analytics-bootstrap.test.js` (retain; adjust harness only if needed)
- `tests/preview-server-security.test.js` (retain)
- `tests/preview-routing.test.js` (retain)
- `tests/site-smoke.spec.js` (create)
- `.github/workflows/verify.yml` (create)
- `README.md` (verification instructions)
- `.gitignore` (only Playwright output directories)
- `plans/README.md` (status only)

**Out of scope**:

- Changing visible copy, layout, SEO metadata or schema to appease tests.
- Refactoring shared HTML templates.
- Changing analytics identifiers/event names or consent policy.
- Sending a real Netlify form submission from automated tests.
- Reintroducing GitHub Pages deployment.
- Adding a frontend framework, bundler, formatter rewrite or broad lint cleanup.

## Git workflow

- Suggested branch: `codex/005-one-command-verification`
- Prefer two logical commits: tooling/tests, then CI/docs.
- Commit messages should be imperative, e.g. `Add one-command site verification`
  and `Gate changes on verification`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Define the Node verification contract

Create a private `package.json` with a supported Node engine and exact scripts:

- syntax check for `script.js` and `preview-server.js`;
- static site verification;
- all Node tests;
- Playwright smoke tests;
- `verify` chaining those stages in fail-fast order.

Add only the minimum browser-test dependency. Generate and commit a lockfile.
Do not introduce production dependencies.

**Verify**: `npm ci` → exit 0; `npm run` lists all documented scripts.

### Step 2: Implement deterministic static verification

Create `tools/verify-static.js` using Node built-ins unless a narrowly scoped
validator was deliberately selected. It must fail nonzero with file-specific
messages for:

- missing local `src`/`href` targets;
- duplicate IDs within a document;
- invalid JSON in every `application/ld+json` block;
- missing `lang`, title, description, canonical or viewport;
- sitemap URLs without a corresponding local HTML page/route;
- HTML pages missing the shared stylesheet or script where required;
- form contract drift: Netlify marker, form name, honeypot, required fields and
  hidden `form-name` must remain present on `index.html`;
- analytics contract drift already covered by Plan 001.

Avoid fragile checks on whitespace or full-file snapshots.

**Verify**: `npm run verify:static` → exit 0 and a concise checked-file count.

### Step 3: Add browser smoke tests for critical journeys

Configure Playwright to start the safe preview server on loopback with the
explicit form-success simulation flag. Use one Chromium project and disable
parallelism if shared localStorage state makes ordering ambiguous; preferably
create a fresh context per test.

`tests/site-smoke.spec.js` must cover:

1. every sitemap URL loads without page errors or console errors;
2. clean service navigation works;
3. mobile menu toggles `aria-expanded` and closes after navigation;
4. cookie banner: reject, reopen, customize, save, and persistence after reload;
5. cookie modal focus enters the dialog, Tab remains inside, Escape closes and
   focus returns to the opener;
6. contact form rejects missing required fields and focuses the first invalid
   control;
7. opt-in simulated submission shows success, disables fields and queues the
   existing form event without sending data externally;
8. representative phone and email clicks queue their existing event names;
9. privacy and RODO pages load with no `ReferenceError` and show current year;
10. reduced-motion context does not apply parallax transform during scrolling.

Block external GA/font/map requests in tests or replace them at the browser
network boundary so CI is deterministic. Do not change production code merely
to avoid network access.

**Verify**: `npm run test:e2e` → all named cases pass with no real external form
submission.

### Step 4: Make `npm run verify` the documented local gate

Update README with prerequisites, clean install, browser install, preview and
the exact `npm run verify` command. Explain what it covers and that tests never
deliver form contents. Include a short troubleshooting section for occupied
ports and missing Chromium only.

Add Playwright artifacts (`test-results/`, `playwright-report/`) to `.gitignore`.

**Verify**: from a clean install, `npm run verify` exits 0; `git status --short`
shows no generated test artifacts.

### Step 5: Gate repository changes in GitHub Actions

Create `.github/workflows/verify.yml` for pushes and pull requests to the active
default branch. Use least privileges (`contents: read`), install with `npm ci`,
install Chromium with required CI dependencies, then run `npm run verify`.
Configure concurrency to cancel obsolete runs.

Do not add a deployment job. If Plan 002 removed Pages, it must stay removed.

**Verify**: validate workflow YAML locally if a validator is available; after
operator-authorized push, the workflow must finish green. Local done criteria
do not require pushing.

## Test plan

- Existing three standard-library test files remain green.
- New `tests/site-smoke.spec.js` covers the ten journeys above.
- Static verifier is mutation-tested manually before completion: temporarily
  point one local link at a missing file and confirm nonzero exit, then revert;
  temporarily duplicate an ID and confirm failure, then revert. Never commit
  these mutations.
- Full clean gate: remove ignored install/test artifacts only if explicitly safe,
  run `npm ci`, install Chromium and run `npm run verify`.

## Done criteria

- [ ] `package.json` is private and has no production dependencies.
- [ ] Lockfile is committed and `npm ci` succeeds.
- [ ] `npm run verify:static` checks all seven HTML files and exits 0.
- [ ] All Node tests from Plans 001, 003 and 004 pass.
- [ ] Playwright covers all ten critical journeys without external delivery.
- [ ] `npm run verify` exits 0 from a clean install.
- [ ] README documents the exact gate and preview limitations.
- [ ] GitHub verification workflow has read-only contents permission and no
      deployment step.
- [ ] Generated reports/artifacts are ignored and absent from git status.
- [ ] No files outside Scope were modified.
- [ ] Plan 005 is marked `DONE`.

## STOP conditions

Stop and report if:

- any dependency plan is not `DONE` or its tests fail;
- Netlify is not the authoritative host after Plan 002;
- Playwright would submit a real form or require production credentials;
- a static check requires altering legitimate page content rather than fixing
  the verifier;
- the full gate is nondeterministic because it depends on Google, Netlify or
  another external service;
- completing the plan requires reintroducing Pages deployment or adding a
  frontend framework/build pipeline.

## Maintenance notes

Every change to form selectors, consent IDs, event names, clean routes or
shared script loading must update a focused test in the same commit. Avoid
full-page visual snapshots until there is evidence they provide value; they
are expensive and noisy for this site. A future shared-template refactor should
land only after this gate is green and should preserve generated HTML contracts.
