import { GAMES, CATEGORIES } from './registry.js';
import { store } from './engine.js';

const gamesEl = document.getElementById('games');
const chipsEl = document.getElementById('chips');
const searchEl = document.getElementById('search');
const playview = document.getElementById('playview');
const playBody = document.getElementById('play-body');
const playTitle = document.getElementById('play-title');
const backBtn = document.getElementById('back-btn');
const restartBtn = document.getElementById('restart-btn');

let activeCategory = 'All';
let current = null; // active game controller, has .destroy()
let lastGame = null;

// Category color instead of a per-game emoji — fewer colors than games,
// so the grid reads as sorted/organized rather than sprinkled with icons.
const CATEGORY_COLOR = {
  Arcade: '#e8a33d', Puzzle: '#3d8b8b', Board: '#b8503c',
  Word: '#a68b3c', Cards: '#8577a6', Reflex: '#5f7fa6',
};

function cardFor(g) {
  const card = document.createElement('div');
  card.className = 'card';
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = g.family.slice(0, 2).toUpperCase();
  badge.style.background = CATEGORY_COLOR[g.category] || '#8a8071';
  const meta = document.createElement('span');
  meta.className = 'meta';
  meta.innerHTML = `<span class="title">${g.title}</span><span class="fam">${g.category}</span>`;
  card.append(badge, meta);
  card.addEventListener('click', () => openGame(g));
  return card;
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  gamesEl.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (const g of GAMES) {
    if (activeCategory !== 'All' && g.category !== activeCategory) continue;
    if (q && !g.title.toLowerCase().includes(q) && !g.family.toLowerCase().includes(q)) continue;
    frag.appendChild(cardFor(g));
  }
  gamesEl.appendChild(frag);
}

function renderChips() {
  chipsEl.innerHTML = '';
  for (const cat of ['All', ...CATEGORIES]) {
    const chip = document.createElement('span');
    chip.className = 'chip' + (cat === activeCategory ? ' active' : '');
    chip.textContent = cat;
    chip.addEventListener('click', () => { activeCategory = cat; renderChips(); render(); });
    chipsEl.appendChild(chip);
  }
}

async function mount(g) {
  if (current && current.destroy) current.destroy();
  playBody.innerHTML = '';
  try {
    const mod = await import(`./games/${g.family}.js`);
    current = mod.default(playBody, g.config || {}, { id: g.id, store });
  } catch (err) {
    const hint = location.protocol === 'file:'
      ? 'This page must be served over http:// — see the banner at the top, or run `npx serve .` / `python3 -m http.server` from this folder.'
      : 'Check that the server is serving .js files with a JavaScript MIME type, and that the console (F12) shows more detail.';
    playBody.innerHTML = `<div class="overlay-sub">Failed to load this game.<br>${err.message}<br><br>${hint}</div>`;
    console.error(err);
  }
}

async function openGame(g) {
  lastGame = g;
  playTitle.textContent = g.title;
  playview.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  await mount(g);
}

function closeGame() {
  if (current && current.destroy) current.destroy();
  current = null;
  playview.classList.add('hidden');
  document.body.style.overflow = '';
}

backBtn.addEventListener('click', closeGame);
restartBtn.addEventListener('click', () => { if (lastGame) mount(lastGame); });
searchEl.addEventListener('input', render);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !playview.classList.contains('hidden')) closeGame();
});

renderChips();
render();

// ---- live transfer-size badge (Resource Timing API) ----
const kbUsedEl = document.getElementById('kb-used');
const kbMeterEl = document.getElementById('kb-meter');
const BUDGET = 512 * 1024;
const METER_WIDTH = 20;
function updateBudget() {
  let total = 0;
  for (const entry of performance.getEntriesByType('navigation')) total += entry.transferSize || 0;
  for (const entry of performance.getEntriesByType('resource')) total += entry.transferSize || 0;
  kbUsedEl.textContent = (total / 1024).toFixed(1);
  const filled = Math.max(1, Math.round((total / BUDGET) * METER_WIDTH));
  kbMeterEl.textContent = '[' + '#'.repeat(Math.min(filled, METER_WIDTH)) + '.'.repeat(Math.max(0, METER_WIDTH - filled)) + ']';
}
updateBudget();
if ('PerformanceObserver' in window) {
  new PerformanceObserver(updateBudget).observe({ type: 'resource', buffered: true });
}
setTimeout(updateBudget, 500);
