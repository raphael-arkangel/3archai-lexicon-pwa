# 3archAI AI lexicon — integration package

85 core AI terms, a **ten-day opening series** ("the words to know before you start"), and a
**word of the day** rotation that needs no database and no state. Built to drop into the 3archAI PWA.

- Version: `2026.10.30` · 85 terms · 5 groups
- Provenance: mined from 75,197 messages (Raphael), 9,445 (Gabriel), 5,771 (Michael); cross-checked 2026-10-30.
- Authority: the source note is Raphael's vault, `02 Reference/AI lexicon — core terms.md`. **Do not edit
  definitions in the PWA.** Propose a change here and it comes back as a new package version.

## Files

| File | Purpose |
|---|---|
| `lexicon.json` | Canonical data. Use this from a Worker, cron, build step or any non-JS consumer. |
| `lexicon.data.mjs` | The same data as an ES module. **Generated** — never hand-edit. |
| `lexicon.mjs` | Pure functions: `wordOfTheDay`, `starterTen`, `pushPayload`, `dayIndex`, `rotationIndex`, `termById`. No DOM, no fetch, no state, so it runs unchanged in the browser, a service worker and a Cloudflare Worker. |
| `test.mjs` | Nine assertions, no dependencies. `node test.mjs`. |

Regenerate the module after editing the JSON:

```bash
node -e "import('./lexicon.json',{with:{type:'json'}}).then(({default:d})=>require('fs').writeFileSync('lexicon.data.mjs','// GENERATED from lexicon.json — do not edit by hand.\nexport const LEXICON = '+JSON.stringify(d,null,2)+';\n\nexport default LEXICON;\n'))"
```

## Data shape

```jsonc
{
  "name": "3archAI AI lexicon",
  "version": "2026.10.30",
  "count": 85,
  "rotation": { "epoch": "2026-10-30", "stride": 28, "lead_days": 10 },
  "starter": [ { "id": "session", "why": "the persistent thread; get it wrong and …" } ],  // 10, ranked
  "groups":  [ { "id": "model", "title": "The model", "count": 10 } ],                     // 5
  "terms":   [ { "id": "session", "term": "Session", "group": "context", "definition": "…" } ]  // 85
}
```

`id` is a stable kebab-case slug — it is the deep-link anchor and the push `data.id`. Treat it as an
identifier: if a term's wording improves, the `id` does not change.

## The rotation (implementable in three lines, anywhere)

```
day    = floor((utcMidnight(date) - utcMidnight(epoch)) / 86400000)
past   = day mod 85            // rotationIndex(day) in lexicon.mjs
if past < 10  -> starter[past]
else          -> rest[(past - 10) * 28 mod 75]      // rest = the 75 terms not in starter, in file order
```

**`dayIndex` returns unmodded days — including negatives before the epoch.** The wrap into the cycle is
`rotationIndex(day)`, exported separately so nobody has to guess. Take `dayIndex % 85` yourself and a
past date will look like a broken rotation.

Consequences, all asserted in `test.mjs`:

- Days 0–9 are the starter ten in rank order, so a new user meets the important words first.
- Days 10–84 cover the remaining 75 terms exactly once. 28 is coprime with 75, so nothing repeats
  before the cycle closes, and consecutive days are never neighbours in the list.
- The cycle is periodic in 85 days, so any date — including a date in the past or a future date used
  in a test — resolves identically on every client, with no stored cursor.

## Using it

```js
import { wordOfTheDay, starterTen, pushPayload } from './lexicon.mjs';

const w = wordOfTheDay('2026-11-05');
// { id, term, group, definition, day: 6, starter: true }

const onboarding = starterTen();   // 10 entries, each with `why` (the failure mode it prevents)
const notice = pushPayload(new Date(), { baseUrl: 'https://ai.3archai.com' });
// { title: 'Word of the day — Skill', body: '<definition>', url: 'https://ai.3archai.com/#skill', tag: 'wotd-N', data: {id, term, day} }
```

Rendering, minimally — anchor ids are the deep links, so the push `url` lands on the word:

```html
<section id="wotd">
  <h2>Word of the day</h2>
  <h3 id="w-term"></h3>
  <p id="w-def"></p>
</section>
<ol id="starter-ten"></ol>
<script type="module">
  import { wordOfTheDay, starterTen } from './lexicon.mjs';
  const w = wordOfTheDay(new Date());
  document.getElementById('w-term').textContent = w.term;
  document.getElementById('w-def').textContent = w.definition;
  document.querySelector('#wotd').id = w.id;
  for (const t of starterTen()) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${t.term}</strong> — ${t.definition} <em>${t.why}</em>`;
    document.getElementById('starter-ten').append(li);
  }
</script>
```

## Sending it as a notification

The payload above is exactly what a `push` handler forwards:

```js
// sw.js
self.addEventListener('push', (e) => {
  const p = e.data.json();
  e.waitUntil(self.registration.showNotification(p.title, {
    body: p.body, tag: p.tag, data: p.data, icon: '/icons/icon-192.png', badge: '/icons/badge-72.png',
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || '/'));
});
```

Notes that matter on the server side:

- **`tag` is stable per day** (`wotd-<day>`), so re-sending replaces the existing notice instead of
  stacking a second one.
- **Prune on `404` and `410`** — those subscriptions are dead; delete the row rather than retrying.
- **Encrypt per subscription** (`aes128gcm`) with VAPID; store `endpoint`, `p256dh`, `auth` and
  `created_at`. The private key stays a Worker secret.
- **iOS/iPadOS 16.4+ only works from a Home Screen web app.** A Safari tab cannot request permission,
  and the prompt must come from a tap inside the installed app. Gate the subscribe button on
  `navigator.standalone === true` and show the Share → Add to Home Screen instruction otherwise.
  Send `data.url` with the payload so the tap opens the right word.
- A notification is a nudge, not a delivery guarantee. Never put anything in it that the app does not
  also show on screen.

## Release rules

1. Changing any term, definition or the starter order means a new `version` in `lexicon.json`.
2. **Bump the service worker `CACHE_NAME` in the same commit** as any lexicon change, or installed
   clients keep serving the old module and the new word never appears.
3. Keep `lexicon.data.mjs` generated. If a diff shows hand edits there, the build was skipped.
4. `node test.mjs` must print `ok — 10 checks passed` before a release is called done. The test fails on
   a duplicated slug, a starter id that does not resolve, a rotation that repeats early, or a
   timezone-dependent `dayIndex`.

## What this package deliberately is not

- Not a glossary of how labs build models. Words with four uses or fewer across all three agents'
  histories were cut, and the reasons are recorded in the source note.
- Not an editable CMS. One authority (the vault note), one generated artefact, so two copies of a
  definition cannot drift apart.
