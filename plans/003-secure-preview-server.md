# Plan 003: Confine the preview server to the project and loopback

> **Executor instructions**: Treat this as defensive maintenance. Do not print
> or copy contents of files outside the repository while testing. Follow the
> steps, run every verification, and stop rather than broadening scope. Update
> the status row in `plans/README.md` when done.
>
> **Drift check (run first)**:
> `git diff --stat b40daa4..HEAD -- preview-server.js tests/preview-server-security.test.js`
> Stop if the server implementation no longer matches Current state.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-safe-ga4-bootstrap.md`
- **Category**: security
- **Planned at**: commit `b40daa4`, 2026-08-19

## Why this matters

The developer preview server decodes an untrusted request path and passes the
joined result directly to `fs.readFile`. Parent-directory paths can resolve
outside the project, and the server listens without explicitly restricting
itself to loopback. A tool intended only for local preview can therefore expose
other readable files to the local network. Malformed encoded paths can also
throw outside error handling and terminate the process.

## Current state

`preview-server.js:20-33` currently contains:

```js
http.createServer((req, res) => {
  let filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (req.url === '/' || req.url === '') filePath = path.join(root, 'index.html');
  fs.readFile(filePath, (err, data) => {
    // ...
  });
}).listen(port, () => console.log(`Preview server on http://localhost:${port}`));
```

The project uses CommonJS (`require`) and callback-style Node APIs. Preserve
that style unless extracting a small exported handler makes testing materially
clearer. There is currently no package manifest; tests in this plan must use
only Node built-ins.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Syntax | `node --check preview-server.js` | exit 0 |
| Security tests | `node --test tests/preview-server-security.test.js` | exit 0; all tests pass |
| Scope | `git diff --stat` | only in-scope files plus plan status changed |

## Scope

**In scope**:

- `preview-server.js`
- `tests/preview-server-security.test.js` (create)
- `plans/README.md` (status only)

**Out of scope**:

- Reading or displaying any actual file outside the repository.
- Production Netlify routing or headers.
- Clean-route and form simulation behavior; those belong to Plan 004.
- Adding Express or any dependency.
- Exposing the preview server to LAN/WAN interfaces.

## Git workflow

- Suggested branch: `codex/003-secure-preview-server`
- Commit message: `Confine preview server to the project root`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Extract an importable server factory

Refactor `preview-server.js` so tests can create a server on an ephemeral port
without starting the default listener on import. Export the smallest useful
factory or request handler using CommonJS. Keep direct execution behavior under
`if (require.main === module)`.

Direct execution must bind explicitly to `127.0.0.1`, not an unspecified host.
The startup message must print the actual loopback URL.

**Verify**: `node --check preview-server.js` → exit 0.

### Step 2: Validate and contain every request path

Parse/decode the pathname inside guarded error handling. Resolve the candidate
against the project root, then use `path.relative` (not a string-prefix check)
to reject any result outside the root. Reject malformed URL encoding with HTTP
400 and path escape attempts with HTTP 403; do not pass either to `fs.readFile`.

Do not disclose the resolved filesystem path or exception details in the HTTP
response. Existing unknown in-root files should continue to return 404.

**Verify**: a normal request for `/styles.css` returns 200, malformed encoding
returns 400, and both plain and percent-encoded parent traversal cases return
403 without reading an external target.

### Step 3: Add standard-library security tests

Create `tests/preview-server-security.test.js` with `node:test`,
`node:assert/strict`, `http`/`fetch`, and the exported factory. Start on port 0
and close the server in test cleanup. Cover:

- normal in-root file;
- missing in-root file;
- malformed encoded pathname;
- plain parent traversal attempt;
- encoded parent traversal attempt;
- direct-execution host contract, factored into an exported constant if needed.

Tests must assert status/body metadata only. They must never read or print a
real external file.

**Verify**: `node --test tests/preview-server-security.test.js` → all cases pass
and the Node process exits cleanly.

## Test plan

- New test file described above; no external dependency.
- Verify cleanup closes the listener even after assertion failure.
- Run the existing analytics contract test from Plan 001 as a regression:
  `node --test tests/analytics-bootstrap.test.js` → pass.

## Done criteria

- [ ] `node --check preview-server.js` exits 0.
- [ ] Security tests exit 0 and close the server.
- [ ] Server binds explicitly to `127.0.0.1` on direct execution.
- [ ] Decoding failures return 400 without terminating the process.
- [ ] Out-of-root candidates return 403 before any file read.
- [ ] Responses do not expose absolute filesystem paths.
- [ ] No dependency or package manifest was added.
- [ ] No files outside Scope were modified.
- [ ] Plan 003 status is updated.

## STOP conditions

Stop and report if:

- `preview-server.js` has been replaced with an official Netlify development
  server before execution;
- tests would require reading a real external file or binding beyond loopback;
- clean-route support cannot be kept separate from this security boundary;
- the implementation changed materially since the planned commit.

## Maintenance notes

Every future route mapping must operate only after the containment check, or
map to a fixed in-root file. Reviewers should reject prefix-based containment
checks because sibling paths can share prefixes. Plan 004 builds routing on
top of this safe handler.
