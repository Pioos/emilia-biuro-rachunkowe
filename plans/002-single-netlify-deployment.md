# Plan 002: Make Netlify the single production deployment contract

> **Executor instructions**: Follow this plan exactly and verify external state
> before deleting any workflow. If a STOP condition occurs, report it rather
> than choosing a hosting platform on the user's behalf. Update this plan's row
> in `plans/README.md` when complete.
>
> **Drift check (run first)**:
> `git diff --stat b40daa4..HEAD -- .github/workflows/pages.yml netlify.toml README.md index.html`
> If these files changed, compare them with Current state and stop on a
> material mismatch.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/001-safe-ga4-bootstrap.md`
- **Category**: migration
- **Planned at**: commit `b40daa4`, 2026-08-19

## Why this matters

The site currently describes two deployments with different capabilities.
Netlify supplies clean-URL redirects, security/cache headers, and the lead
form backend. GitHub Pages publishes the raw directory but cannot implement
those Netlify contracts. A green Pages deployment can therefore expose a site
that looks similar while losing the primary conversion path and returning
different routes and headers.

## Current state

- `netlify.toml:1-93` — publishes `.` and defines canonical redirects, headers
  and caching.
- `index.html:934-938` — contact form uses `data-netlify="true"`, a hidden
  `form-name`, and a Netlify honeypot.
- `script.js:114` — submits URL-encoded form data to `/`.
- `.github/workflows/pages.yml:3-37` — every push to `master` independently
  uploads the raw repository to GitHub Pages.
- There is no `CNAME` file and no README declaring which host is authoritative.
- The canonical public origin in HTML, sitemap and robots is
  `https://biuro-motylska.pl/`; current project history and configuration point
  to Netlify as the intended production platform, but external ownership must
  be confirmed before removal.

Repo convention: deployment configuration is root-level TOML plus a small
GitHub Actions workflow. Recent commits use imperative messages such as
`Point sameAs at the Google Business Profile entity`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect Pages | `gh api repos/Pioos/emilia-biuro-rachunkowe/pages` | status or a documented 404 if Pages is disabled |
| Inspect DNS | `Resolve-DnsName biuro-motylska.pl` | records identifying the active provider |
| Inspect Netlify link | `npx netlify-cli status` | linked site/account status, with no deployment |
| Inspect scope | `git diff --stat` | only in-scope files plus plan status changed |

Do not run a production deployment, change DNS, or delete an external site as
part of this plan.

## Scope

**In scope**:

- `.github/workflows/pages.yml` (remove only after confirmation)
- `README.md` (create a focused deployment section if absent)
- `plans/README.md` (status only)

**Out of scope**:

- DNS mutations.
- Netlify site deletion, relinking, or production deploy.
- Changes to canonical URLs, sitemap URLs, form fields or analytics.
- Replacing Netlify Forms with another backend.
- GitHub issue or repository settings mutations except read-only inspection.

## Git workflow

- Suggested branch: `codex/002-single-netlify-deployment`
- Commit message: `Make Netlify the canonical deployment`
- Do not push, deploy, change DNS or open a PR unless explicitly instructed.

## Steps

### Step 1: Confirm the external deployment owner

Using read-only GitHub, DNS, and Netlify inspection, record:

1. whether GitHub Pages is enabled and its public URL;
2. whether that URL has meaningful traffic, backlinks, or an intentional
   fallback purpose available to the operator;
3. whether `biuro-motylska.pl` is currently served by the linked Netlify site;
4. whether Netlify Forms receives submissions for form name `contact`.

Do not include private submission contents in notes or output.

**Verify**: provide a short factual record identifying the authoritative host
and whether Pages can be retired. Expected decision for the current repo is
Netlify production and no required Pages copy; if evidence differs, STOP.

### Step 2: Retire the incompatible Pages deployment

If Step 1 confirms Pages is not required, delete
`.github/workflows/pages.yml`. Do not disable Pages through an API and do not
delete any external environment; repository-setting cleanup is an operator
action after merge.

If Pages is intentionally required, do not edit the workflow: stop and report
that the plan must be redesigned to provide routing, headers and a compatible
form backend on both platforms.

**Verify**: `Test-Path '.github/workflows/pages.yml'` → `False` in the approved
Netlify-only path.

### Step 3: Document the deployment contract

Create `README.md` if absent, or add a `Deployment` section if it exists. State:

- production host: Netlify;
- publish directory: repository root;
- canonical origin: `https://biuro-motylska.pl/`;
- pushes/merges are deployed through the linked Netlify configuration;
- clean URLs, headers and Netlify Forms depend on `netlify.toml`/Netlify;
- GitHub Pages is not a supported runtime;
- exact read-only checks for redirects, 404, form presence and headers;
- rollback must happen through Netlify deployment history, not DNS improvisation.

Do not put account identifiers, tokens, private form data or secrets in README.

**Verify**: `Select-String -Path README.md -Pattern 'Netlify','GitHub Pages','biuro-motylska.pl','Netlify Forms'` → all four concepts matched.

### Step 4: Run a non-mutating contract check

Check the deployed home page, every sitemap URL, a representative `.html`
redirect, a clean service URL and a missing URL. Inspect headers for HSTS and
`nosniff`. Do not submit the live contact form unless the owner explicitly
authorizes a marked test lead.

**Verify**: production home and sitemap URLs return 200; `.html` returns a
single 301 to the clean URL; missing URL returns 404; required headers exist.

## Test plan

- No new application test is needed in this small migration plan.
- Plan 005 will automate the hosting contract.
- Manual/read-only checks cover DNS, Pages state, Netlify ownership, redirects,
  404 and headers.
- Do not treat a successful GitHub Pages build as verification.

## Done criteria

- [ ] Read-only external evidence confirms Netlify is authoritative.
- [ ] `.github/workflows/pages.yml` is absent, or the plan is BLOCKED because
      Pages is intentionally required.
- [ ] README names Netlify and explicitly says Pages is unsupported.
- [ ] No DNS, external-site or production-deployment mutation occurred.
- [ ] Production redirects, 404 and security headers were checked.
- [ ] No files outside Scope were modified.
- [ ] Plan 002 status is updated in `plans/README.md`.

## STOP conditions

Stop and report if:

- GitHub Pages is intentionally used, receives material traffic, or serves as
  a documented fallback;
- DNS or Netlify inspection does not prove which host serves the canonical
  domain;
- the contact form has already migrated away from Netlify Forms;
- completing the work requires changing DNS, deleting an external site,
  deploying production or accessing private form submissions;
- the workflow or deployment files drifted materially since `b40daa4`.

## Maintenance notes

If a second host is added later, it must pass the same routing, form and header
contract before being called production. If GitHub Actions remain elsewhere,
pinning third-party actions to immutable SHAs should be handled in a separate
supply-chain plan.
