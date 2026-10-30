# 3archAI — the AI lexicon (PWA)

An installable reference app: **one AI term a day**, the **ten words to know before you start**, and the
full 85 to browse. Vanilla ES modules — no build step, no framework, no dependencies.

Target host: `ai.3archai.com`. Deployer: Gabriel. Author: Raphael.

`PACKAGE.md` is the integration contract for the lexicon data itself; this file is about the app.

## Run it

```bash
python3 -m http.server 8802        # any static server with .mjs → text/javascript works
```

The service worker needs a secure context: `http://localhost` and `127.0.0.1` count, plain `http://` on a
LAN address does not.

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell: word of the day, the starter ten, all 85, notification block. |
| `styles.css` | Dark 3archAI palette (`#060A15` ground, `#E8BD44` amber), mobile-first, safe-area aware. |
| `app.js` | Renders from the lexicon module, handles install prompt, deep links, push subscription UI. |
| `sw.js` | Shell cache, navigation fallback, `push` and `notificationclick` handlers. |
| `manifest.webmanifest` | Standalone display, icons (any + maskable), two shortcuts. |
| `lexicon.json` | Canonical data: 85 terms, 5 groups, starter ten with failure lines, rotation parameters. |
| `lexicon.data.mjs` | The same data as an ES module, generated from the JSON. |
| `lexicon.mjs` | `wordOfTheDay`, `starterTen`, `pushPayload`, `dayIndex`, `rotationIndex`, `termById`. |
| `test.mjs` | 10 assertions over the data and the rotation. `node test.mjs`. |
| `icons/` | 192, 512, maskable 512, apple-touch 180, notification badge 72, OG card. |

## The word of the day

No database, no stored cursor. `dayIndex(date)` is whole days from the epoch `2026-10-30`; days 0–9 serve
the starter ten in rank order; from day 10 the remaining 75 are walked with a stride of 28 (coprime with
75), so every term appears once before any repeats and consecutive days are never neighbours.
`rotationIndex(day)` wraps an unmodded day into the cycle — do not take `day % 85` yourself.

The page uses the visitor's **local** calendar date so "today" matches their day; the arithmetic is
UTC-based on that date string, so every client resolves the same date to the same term.

## Notifications — the contract the sender must meet

The client is written; the sending side is not deployed, so `VAPID_PUBLIC` is empty and the UI says so
plainly rather than offering a dead button. To switch it on:

1. Generate a VAPID key pair. Public key into `index.html` as `<meta name="push-key" content="…">`,
   private key as a Worker secret.
2. Implement these endpoints on the same origin:

   | Endpoint | Body | Response |
   |---|---|---|
   | `POST /api/push/subscribe` | `{ endpoint, keys: { p256dh, auth }, tz }` | `201`, row stored |
   | `POST /api/push/unsubscribe` | `{ endpoint }` | `204`, row deleted |

   Key the row on `endpoint` (unique) and store `tz` so a local-morning send is possible.
3. Daily job: for each row, `pushPayload(todayLocalDate, { baseUrl: '/' })` → send with `aes128gcm`
   encryption → on `404` or `410`, delete the row and never retry.
4. Payload shape (already produced by `pushPayload`): `{ title, body, url, tag }`, where `tag` is
   `wotd-<day>` so a re-send replaces rather than stacks. `sw.js` renders it and opens `url` on tap.

## Install behaviour

- Chromium: `beforeinstallprompt` is captured and surfaced as a button; `appinstalled` hides it.
- iOS/iPadOS: notifications exist only for a Home Screen web app. The UI checks `navigator.standalone`
  and shows Share → Add to Home Screen instead of a permission button that cannot work in a tab.
- Installed already (`display-mode: standalone`): the install note becomes confirmation, not instruction.

## Release rules

- Bump `CACHE_NAME` in `sw.js` in the **same commit** as any shell change. An installed client serves the
  shell from cache, so a change without a bump never arrives.
- `lexicon.json` is canonical. If a term changes, regenerate `lexicon.data.mjs` from it, bump
  `LEXICON.version`, and bump `CACHE_NAME` too.
- `node test.mjs` must print `ok — 10 checks passed` before a release is called done.
- Content changes come back as a PR to `agent-share/shared/interfaces/lexicon/`, not as an edit here.

## Provenance

85 terms mined from 75,197 messages on Raphael's box, 9,445 on Gabriel's, 5,771 on Michael's (2026-10-30),
then cut to what the work actually uses. Definitions are the working meaning, not the textbook one.

## Deploy (Gabriel)

Static: no build command, output at the repo root. A Cloudflare Pages project with an empty build command
and `/` as output deploys it as-is. Custom domain `ai.3archai.com`, and the push Worker on the same origin
so `/api/push/*` needs no CORS.
