# Plan 001: Make GA4 and Consent Mode initialize safely on every page

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer says they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat b40daa4..HEAD -- script.js index.html pelna-ksiegowosc.html kpir-ryczalt.html kadry-i-place.html vat-jpk.html polityka-prywatnosci.html rodo.html tests/analytics-bootstrap.test.js`
> If any in-scope file changed, compare the excerpts below with live code. On
> a mismatch, stop and report rather than applying the plan mechanically.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `b40daa4`, 2026-08-19

## Why this matters

`script.js` is loaded by all seven pages and GA4 is enabled. Five pages define
the global `gtag` queue in an inline head script, but the privacy-policy and
RODO pages do not. On those two pages the call at `script.js:218` raises a
`ReferenceError`, so all initialization below it—including modal keyboard
handling and the current footer year—never runs. The fix should remove this
page-template precondition rather than copying another fragile inline block.

## Current state

- `script.js` — shared interactions, consent and GA4 loader.
- `index.html` and four service pages — contain an inline Consent Mode/`gtag`
  bootstrap near line 8.
- `polityka-prywatnosci.html` and `rodo.html` — load the shared script but do
  not define `gtag`.

Current shared call (`script.js:212-219`):

```js
if (GA4_ID) {
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(tag);

  gtag('js', new Date());
  gtag('config', GA4_ID, { anonymize_ip: true });
}
```

Existing inline bootstrap exemplar (`index.html:8-22`):

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
</script>
```

Conventions: plain browser JavaScript, semicolons, single quotes in JS,
defensive optional DOM access through `$` and `on`, and no framework/build
runtime. Preserve Polish comments and visible text.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Syntax | `node --check script.js` | exit 0, no output |
| Regression test | `node --test tests/analytics-bootstrap.test.js` | exit 0; all tests pass |
| Inspect scope | `git diff --stat` | only in-scope files plus plan status changed |

## Scope

**In scope**:

- `script.js`
- `index.html`
- `pelna-ksiegowosc.html`
- `kpir-ryczalt.html`
- `kadry-i-place.html`
- `vat-jpk.html`
- `polityka-prywatnosci.html`
- `rodo.html`
- `tests/analytics-bootstrap.test.js` (create)
- `plans/README.md` (status only)

**Out of scope**:

- Changing the GA4 measurement identifier.
- Changing event names `klik_telefon`, `klik_email`, or `formularz_wyslany`.
- Changing the selected advanced/basic Consent Mode policy; Plan 001 preserves
  the current default-denied advanced-mode behavior.
- Editing cookie-banner wording or the privacy policy.
- Adding a tag manager, advertising product, dependency, or build system.

## Git workflow

- Suggested branch: `codex/001-safe-ga4-bootstrap`
- Use one logical commit, matching the repository's imperative style, e.g.
  `Initialize GA4 safely on every page`.
- Do not push or open a PR unless instructed by the operator.

## Steps

### Step 1: Move queue and default-consent ownership into the shared script

At the start of the consent section in `script.js`, before `readConsent()` and
before any call to `updateGCM`, initialize `window.dataLayer`, define one local
queue function matching Google's existing command shape
(`function gtag() { window.dataLayer.push(arguments); }`),
and enqueue exactly the current default consent fields plus
`ads_data_redaction` and `url_passthrough` settings. Do not expose correctness
to whether an HTML page happened to define a global function.

Keep default storage values `denied` and enqueue the defaults before appending
the remote GA script. Make all later calls in `script.js` use the same local
function.

**Verify**: `node --check script.js` → exit 0 with no syntax errors.

### Step 2: Remove duplicate inline bootstraps from the five HTML pages

Remove only the inline head scripts that create `dataLayer`, define `gtag`, and
set default consent from `index.html` and the four service pages. Do not remove
JSON-LD scripts or the final `<script src="...script.js">` includes. The two
legal pages should not need new inline code.

There must be one implementation of GA/Consent bootstrap after this step:
`script.js`.

**Verify**:
`Select-String -Path *.html -Pattern 'function gtag\('` → no matches.

### Step 3: Add a zero-dependency contract regression test

Create `tests/analytics-bootstrap.test.js` using `node:test`, `node:assert/strict`
and `fs`. Cover at least:

1. all seven HTML files load `script.js`;
2. none defines an inline `function gtag` bootstrap;
3. `script.js` initializes `window.dataLayer` before the remote GA URL appears;
4. default consent contains all four denied storage keys;
5. the shared script still registers all three conversion event names.

This is a static contract test, not a substitute for Plan 005's browser smoke
tests.

**Verify**: `node --test tests/analytics-bootstrap.test.js` → all five contract
checks pass.

### Step 4: Perform a manual runtime smoke check

Serve the current directory with the existing preview server. Open `/`,
`/polityka-prywatnosci.html`, and `/rodo.html`. On each page, capture browser
console errors, open cookie preferences, reject optional cookies, reopen the
preferences, and confirm the footer year is current.

**Verify**: browser console contains no `ReferenceError`; all three pages allow
the cookie modal to open and close; the footer shows the year returned by
`new Date().getFullYear()` at execution time.

## Test plan

- New test: `tests/analytics-bootstrap.test.js` as specified above.
- Manual regression: home, privacy policy and RODO with fresh storage and with
  a saved rejected-consent state.
- Verify that no analytics cookies appear when the optional categories remain
  denied. Do not judge whether cookieless requests are legally acceptable;
  that policy decision is outside this plan.

## Done criteria

- [ ] `node --check script.js` exits 0.
- [ ] `node --test tests/analytics-bootstrap.test.js` exits 0.
- [ ] `Select-String -Path *.html -Pattern 'function gtag\('` returns no matches.
- [ ] All seven HTML files still load the shared script.
- [ ] No `ReferenceError` occurs on the two legal pages.
- [ ] Default consent remains denied for analytics and advertising storage.
- [ ] No event name or GA4 identifier was changed.
- [ ] No files outside Scope were modified.
- [ ] Plan 001 is marked `DONE` in `plans/README.md`.

## STOP conditions

Stop and report if:

- any in-scope analytics/consent code has changed since `b40daa4`;
- the two legal pages no longer load `script.js`;
- making the queue local prevents the remote GA library from consuming
  `window.dataLayer`;
- a requested solution changes basic versus advanced Consent Mode policy;
- verification would require changing the GA4 identifier or analytics account.

## Maintenance notes

Future pages must only load `script.js`; they must not recreate analytics
bootstrap inline. Reviewers should scrutinize call ordering: default consent
must be queued before the remote library is appended, saved consent should be
restored before configuration, and event names must remain stable for GA4
reports.
