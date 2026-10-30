// 3archAI AI lexicon — pure functions. No DOM, no fetch, no state: safe in a service worker,
// a Worker, a build step or a browser bundle.
import { LEXICON } from './lexicon.data.mjs';

const DAY = 86400000;

/** Whole days since the rotation epoch, in UTC. Accepts 'YYYY-MM-DD' or a Date. */
export function dayIndex(date = new Date(), epoch = LEXICON.rotation.epoch) {
  const at = date instanceof Date ? date : new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(at.getTime())) throw new Error(`dayIndex: unparseable date ${date}`);
  const base = new Date(`${epoch}T00:00:00Z`);
  return Math.floor((Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()) - base.getTime()) / DAY);
}

export function termById(id) {
  const t = LEXICON.terms.find((x) => x.id === id);
  if (!t) throw new Error(`termById: unknown id ${id}`);
  return t;
}

/** The ten to know before you start, in rank order, each with the failure mode it prevents. */
export function starterTen() {
  return LEXICON.starter.map(({ id, why }) => ({ ...termById(id), why }));
}

const STARTER_IDS = new Set(LEXICON.starter.map((s) => s.id));
const REST = LEXICON.terms.filter((t) => !STARTER_IDS.has(t.id));
const CYCLE = LEXICON.rotation.lead_days + REST.length;

/**
 * Wraps a day count into the rotation cycle, negatives included. `dayIndex` deliberately returns
 * unmodded days (a real date can be before the epoch); the cycle is this function's job, so a
 * consumer reimplementing the rule from the README should call this rather than take `dayIndex % n`
 * and conclude the rotation is not periodic.
 */
export function rotationIndex(day) {
  return ((day % CYCLE) + CYCLE) % CYCLE;
}

/**
 * The word for a given date. Days 0-9 serve the starter ten in rank order; from day 10 the
 * remaining terms are walked with a stride coprime to their count, so every term appears once
 * before any repeats and consecutive days are never neighbours in the list.
 */
export function wordOfTheDay(date = new Date()) {
  const day = dayIndex(date);
  const { lead_days: lead, stride } = LEXICON.rotation;
  const past = rotationIndex(day);
  const starter = past < lead;
  const pick = starter ? termById(LEXICON.starter[past].id) : REST[((past - lead) * stride) % REST.length];
  return { ...pick, day, starter };
}

/** Payload for a Web Push send. `tag` is stable per day so a re-send replaces rather than stacks. */
export function pushPayload(date = new Date(), { baseUrl = '/', titlePrefix = 'Word of the day' } = {}) {
  const w = wordOfTheDay(date);
  const key = w.day >= 0 ? String(w.day) : `m${-w.day}`;
  return {
    title: `${titlePrefix} — ${w.term}`,
    body: w.definition,
    url: `${baseUrl.replace(/\/$/, '')}/#${w.id}`,
    tag: `wotd-${key}`,
    data: { id: w.id, term: w.term, day: w.day },
  };
}

export { LEXICON };
export default { dayIndex, rotationIndex, wordOfTheDay, starterTen, pushPayload, termById, LEXICON };
