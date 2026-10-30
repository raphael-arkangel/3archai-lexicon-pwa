import { LEXICON, wordOfTheDay, starterTen } from './lexicon.mjs';

const $ = (sel) => document.querySelector(sel);

function localDateKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* ---------- the word of the day ---------- */
function renderWord() {
  const w = wordOfTheDay(localDateKey());
  const group = LEXICON.groups.find((g) => g.id === w.group);
  $('#wotd').dataset.term = w.id;
  $('#wotd-h').textContent = w.term;
  $('#wotd-def').textContent = w.definition;
  $('#wotd-group').textContent = `${group ? group.title : w.group} · day ${w.day + 1} of the cycle`;
  $('#wotd-day').textContent = w.starter ? 'Word of the day · starting set' : 'Word of the day';
  document.title = `${w.term} — 3archAI AI lexicon`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${w.term}: ${w.definition} The 3archAI AI lexicon — 85 core AI terms.`;
}

/* ---------- the ten ---------- */
function renderStarter() {
  const list = $('#starter-list');
  list.innerHTML = '';
  for (const t of starterTen()) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${t.id}`;
    a.textContent = t.term;
    a.className = 't';
    const d = document.createElement('div');
    d.className = 'd';
    d.textContent = t.definition;
    const why = document.createElement('div');
    why.className = 'w';
    why.textContent = t.why;
    li.append(a, d, why);
    list.append(li);
  }
}

/* ---------- the whole lexicon ---------- */
function renderGroups() {
  const wrap = $('#groups');
  wrap.innerHTML = '';
  for (const g of LEXICON.groups) {
    const terms = LEXICON.terms.filter((t) => t.group === g.id);
    if (!terms.length) continue;
    const section = document.createElement('section');
    section.className = 'group';
    const h3 = document.createElement('h3');
    h3.textContent = g.title;
    const dl = document.createElement('dl');
    for (const t of terms) {
      const row = document.createElement('div');
      row.className = 'term';
      row.id = t.id;
      const dt = document.createElement('dt');
      const a = document.createElement('a');
      a.href = `#${t.id}`;
      a.textContent = t.term;
      a.style.color = 'inherit';
      a.style.textDecoration = 'none';
      dt.append(a);
      const dd = document.createElement('dd');
      dd.textContent = t.definition;
      row.append(dt, dd);
      dl.append(row);
    }
    section.append(h3, dl);
    wrap.append(section);
  }
  $('#ver').textContent = LEXICON.version;
}

function focusHash() {
  if (!location.hash) return;
  const el = document.getElementById(location.hash.slice(1));
  if (!el) return;
  el.scrollIntoView({ block: 'center' });
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 1600);
}

/* ---------- installability ---------- */
let deferredPrompt = null;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () =>
  window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $('#install-btn').hidden = false;
});

$('#install-btn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') $('#install-btn').hidden = true;
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => { $('#install-btn').hidden = true; });

function renderInstallNote() {
  const note = $('#notify-note');
  if (isStandalone()) {
    note.textContent = 'Installed. This app opens from your home screen and works offline.';
    return;
  }
  note.textContent = isIOS
    ? 'On iPhone and iPad, notifications need the app on your home screen: tap Share, then “Add to Home Screen”.'
    : 'Add it to your home screen to keep it to hand — the browser menu has “Install app”.';
}

/* ---------- notifications ---------- */
const VAPID_PUBLIC = document.querySelector('meta[name="push-key"]')?.content || '';

function urlB64ToU8(base64) {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function setupNotifications() {
  if (!('serviceWorker' in navigator) || !('Notification' in window) || !('PushManager' in window)) return;
  const section = $('#notify');
  section.hidden = false;
  renderInstallNote();

  const btn = $('#notify-btn');
  const state = $('#notify-state');
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();

  if (Notification.permission === 'denied') {
    state.textContent = 'Notifications are blocked for this site. You can allow them again in your browser settings.';
    return;
  }
  if (existing) {
    state.textContent = 'You get one word a day from this app.';
    btn.hidden = false;
    btn.textContent = 'Stop the daily word';
    btn.dataset.mode = 'off';
    return;
  }
  if (!VAPID_PUBLIC) {
    state.textContent = 'The daily send is not live on this address yet. The word above is always today’s.';
    return;
  }
  if (isIOS && !isStandalone()) {
    state.textContent = 'Add the app to your home screen first — iOS only allows notifications from an installed app.';
    return;
  }
  state.textContent = 'One word a day, at a time you choose. No other notifications.';
  btn.hidden = false;
  btn.dataset.mode = 'on';
}

$('#notify-btn').addEventListener('click', async () => {
  const btn = $('#notify-btn');
  const state = $('#notify-state');
  btn.disabled = true;
  try {
    const reg = await navigator.serviceWorker.ready;
    if (btn.dataset.mode === 'off') {
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      state.textContent = 'Stopped. The word above is still today’s.';
      btn.textContent = 'Send me the word of the day';
      btn.dataset.mode = 'on';
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      state.textContent = 'Not sending anything without permission.';
      return;
    }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToU8(VAPID_PUBLIC),
    });
    const res = await fetch('/api/push/subscribe', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...sub.toJSON(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    });
    if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
    state.textContent = 'Done — one word a day from here.';
    btn.textContent = 'Stop the daily word';
    btn.dataset.mode = 'off';
  } catch (err) {
    state.textContent = 'That did not go through. Nothing has been scheduled; try again later.';
    console.warn(err);
  } finally {
    btn.disabled = false;
  }
});

/* ---------- service worker ---------- */
async function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          const note = $('#notify-note');
          if (note) note.textContent = 'A new version is ready. Close and reopen the app to load it.';
        }
      });
    });
  } catch (err) {
    console.warn('sw registration failed', err);
  }
}

renderWord();
renderStarter();
renderGroups();
renderInstallNote();
focusHash();
window.addEventListener('hashchange', focusHash);
registerSW();
setupNotifications();
