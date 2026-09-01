# Plan 004: Make local preview reproduce clean routes and explicit form simulation

> **Executor instructions**: Execute only after Plans 002 and 003. Keep the
> preview non-delivering by default: it must never imply that a local form
> submission reached the office. Run every test and update the index status.
>
> **Drift check (run first)**:
> `git diff --stat b40daa4..HEAD -- preview-server.js netlify.toml sitemap.xml tests/preview-routing.test.js README.md`
> Because Plans 002 and 003 intentionally change some paths, compare their
> completed state with this plan's assumptions. Stop if Netlify is not the
> confirmed production host or the preview server is no longer custom code.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/002-single-netlify-deployment.md`, `plans/003-secure-preview-server.md`
- **Category**: dx
- **Planned at**: commit `b40daa4`, 2026-08-19

## Why this matters

Production advertises extensionless URLs and redirects `.html` variants, but
the local server only special-cases `/`. It also lacks MIME types for assets
used by the site and treats form POSTs as file reads. Maintainers therefore
cannot exercise the same navigation contract locally or intentionally test
the form's success/error UI.

## Current state

- `netlify.toml:6-46` — redirects six `.html` paths and `/index.html` to clean
  canonical paths.
- `sitemap.xml` — lists `/`, four clean service paths and two clean legal paths.
- `preview-server.js:8-18` — MIME table omits `.webp` and `.ico`.
- `preview-server.js:20-30` — maps path directly to a file; only `/` becomes
  `index.html`.
- `script.js:114` — form sends URL-encoded POST to `/` and treats any 2xx as
  delivered.
- After Plan 003, the server is importable, loopback-only and rejects unsafe
  paths before file access. Preserve that security boundary.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Syntax | `node --check preview-server.js` | exit 0 |
| Routing tests | `node --test tests/preview-server-security.test.js tests/preview-routing.test.js` | exit 0; all pass |
| Scope | `git diff --stat` | only in-scope files plus README/index status changed |

## Scope

**In scope**:

- `preview-server.js`
- `tests/preview-routing.test.js` (create)
- `README.md` (preview instructions only)
- `plans/README.md` (status only)

**Out of scope**:

- Editing production redirects or sitemap merely to satisfy local tests.
- Sending, storing, logging, emailing or forwarding form contents.
- Changing `script.js` form UI or Netlify Forms markup.
- Adding dependencies or a general-purpose web framework.
- Weakening the traversal protections from Plan 003.

## Git workflow

- Suggested branch: `codex/004-preview-production-parity`
- Commit message: `Align local preview with Netlify routes`
- Do not push or deploy unless instructed.

## Steps

### Step 1: Map extensionless routes without duplicating a route list

For safe GET/HEAD requests:

- `/` serves `index.html`;
- an extensionless single-segment path may serve the same-name `.html` file
  only if that file exists inside the project;
- `/index.html` redirects 301 to `/`;
- an existing top-level `.html` page redirects 301 to its extensionless path;
- unknown paths return 404;
- query strings do not affect file selection.

Derive mappings from existing in-root files rather than maintaining a second
manual route array. Apply containment before reading any derived path.

**Verify**: all seven URLs from `sitemap.xml` return 200 locally; representative
`.html` forms return exactly one 301 with the expected `Location`; a missing
path returns 404.

### Step 2: Complete response semantics and MIME types

Add at least `image/webp` for `.webp` and `image/x-icon` (or the platform's
standard icon MIME) for `.ico`. Implement HEAD without a body. Return 405 plus
an `Allow` header for unsupported methods, except for the explicit form POST
behavior in Step 3.

**Verify**: local requests for `outside.webp` and `favicon.ico` have the correct
Content-Type; HEAD `/` has the same success metadata as GET and an empty body.

### Step 3: Add explicit, non-delivering form simulation

Default POST `/` behavior must return a clear non-success status explaining
that local preview does not deliver Netlify Forms. Add an explicit environment
flag intended only for UI smoke tests; when set, accept URL-encoded POST `/`
and return an empty 2xx simulation response with a response header that marks
it as simulated. Never log or persist field values.

README must document both modes and visibly warn that simulated success does
not deliver a message.

**Verify**: without the flag, POST `/` returns the documented non-success; with
the flag, it returns the documented 2xx and simulation header; neither response
contains submitted values and no file is created.

### Step 4: Add routing and simulation tests

Create `tests/preview-routing.test.js` using Node built-ins and the Plan 003
server factory. Parse `sitemap.xml` in the test so every declared local path is
checked. Cover redirects, 404, GET/HEAD, WebP/ICO MIME, unsupported methods,
default form rejection and opt-in simulated success.

**Verify**:
`node --test tests/preview-server-security.test.js tests/preview-routing.test.js`
→ all tests pass; no process remains listening.

## Test plan

- Keep security tests from Plan 003 unchanged and green.
- New routing test dynamically covers every sitemap path.
- New method/form tests assert status, `Location`, `Allow`, simulation header,
  empty/non-sensitive response and absence of created files.
- Manual browser check: service-card links open clean URLs; default form shows
  its error state; opt-in simulation can exercise success UI with clearly
  documented non-delivery.

## Done criteria

- [ ] All sitemap paths return 200 locally.
- [ ] `.html` and `/index.html` redirect once to canonical local paths.
- [ ] Unknown paths return 404; unsafe paths still return 403.
- [ ] WebP and ICO MIME types are correct.
- [ ] Default local form POST cannot be mistaken for delivery.
- [ ] Opt-in simulated success stores/logs no submitted content.
- [ ] Both preview test files pass with `node --test`.
- [ ] README contains the non-delivery warning and exact commands.
- [ ] No files outside Scope were modified.
- [ ] Plan 004 status is updated.

## STOP conditions

Stop and report if:

- Plan 002 did not establish Netlify as production;
- Plan 003 is incomplete or its containment tests fail;
- the custom server has been replaced by `netlify dev` or another supported
  preview tool—in that case this plan should be superseded, not reimplemented;
- accurate local behavior requires storing or transmitting form submissions;
- a production route differs from the repository's sitemap/config contract.

## Maintenance notes

When adding a top-level HTML page, add it to sitemap if indexable; preview will
derive its clean route automatically. Keep simulated form success opt-in and
visibly non-delivering. Any future nested route scheme requires new containment
and routing tests before implementation.
