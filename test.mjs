// Run: node test.mjs   (Node 18+, no dependencies)
import assert from 'node:assert/strict';
import { LEXICON, dayIndex, rotationIndex, wordOfTheDay, starterTen, pushPayload, termById } from './lexicon.mjs';

const ok = [];
const check = (name, fn) => { fn(); ok.push(name); };

check('85 terms, unique kebab ids', () => {
  assert.equal(LEXICON.terms.length, 85);
  const ids = LEXICON.terms.map((t) => t.id);
  assert.equal(new Set(ids).size, 85);
  for (const id of ids) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/, id);
});

check('every term has a definition and a known group', () => {
  const groups = new Set(LEXICON.groups.map((g) => g.id));
  for (const t of LEXICON.terms) {
    assert.ok(t.definition.length > 10, t.id);
    assert.ok(groups.has(t.group), t.id);
  }
  assert.equal(LEXICON.groups.reduce((n, g) => n + g.count, 0), 85);
});

check('starter ten resolve and keep rank order', () => {
  const ten = starterTen();
  assert.equal(ten.length, 10);
  assert.deepEqual(ten.map((t) => t.id), ['session','agent','context-window','tool-call','gateway','channel','skill','approval','provider','read-back-verification']);
  for (const t of ten) assert.ok(t.why.length > 20, t.id);
});

check('day 0..9 serve the starter ten in order', () => {
  const days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 9, 30 + i));
    return wordOfTheDay(d);
  });
  assert.deepEqual(days.map((d) => d.id), starterTen().map((t) => t.id));
  assert.ok(days.every((d) => d.starter === true));
});

check('day 10..84 cover all 75 remaining terms exactly once', () => {
  const seen = [];
  for (let i = 10; i < 85; i++) seen.push(wordOfTheDay(new Date(Date.UTC(2026, 9, 30 + i))).id);
  const starterIds = new Set(starterTen().map((t) => t.id));
  assert.equal(new Set(seen).size, 75);
  assert.ok(seen.every((id) => !starterIds.has(id)));
});

check('rotation is periodic and never repeats on consecutive days', () => {
  const a = wordOfTheDay(new Date(Date.UTC(2026, 9, 30 + 120)));
  const b = wordOfTheDay(new Date(Date.UTC(2026, 9, 30 + 120 + 85)));
  assert.equal(a.id, b.id, 'same day 85 days later');
  for (let i = 0; i < 400; i++) {
    const x = wordOfTheDay(new Date(Date.UTC(2026, 9, 30 + i))).id;
    const y = wordOfTheDay(new Date(Date.UTC(2026, 9, 30 + i + 1))).id;
    assert.notEqual(x, y, `repeat on day ${i}`);
  }
});

check('dayIndex is UTC-stable across a local timezone', () => {
  assert.equal(dayIndex('2026-10-30'), 0);
  assert.equal(dayIndex('2026-11-19'), 20);
  assert.equal(dayIndex(new Date('2026-11-19T23:59:59Z')), 20);
  assert.equal(dayIndex(new Date('2026-11-20T00:00:00Z')), 21);
});

check('rotationIndex wraps unmodded days into the cycle, negatives included', () => {
  assert.equal(rotationIndex(0), 0);
  assert.equal(rotationIndex(6), 6);
  assert.equal(rotationIndex(85), 0);
  assert.equal(rotationIndex(120), 35);
  assert.equal(rotationIndex(-1), 84);
  assert.equal(rotationIndex(-86), 84);
  assert.equal(rotationIndex(dayIndex('2027-01-23')), rotationIndex(dayIndex('2026-10-30') + 85));
});

check('push payload is notification-ready', () => {
  const p = pushPayload('2026-11-05', { baseUrl: 'https://ai.3archai.com/' });
  assert.match(p.title, /^Word of the day — .+/);
  assert.ok(p.body.length > 10);
  assert.equal(p.url, 'https://ai.3archai.com/#skill');
  assert.equal(p.tag, 'wotd-6');
  assert.equal(p.data.id, 'skill');
});

check('unknown ids are refused, not silently undefined', () => {
  assert.throws(() => termById('not-a-word'));
  assert.throws(() => dayIndex('rubbish'));
});

console.log(`ok — ${ok.length} checks passed`);
for (const name of ok) console.log('  •', name);
