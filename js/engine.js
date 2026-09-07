// Shared helpers used by every game module. Kept tiny and dependency-free
// since it ships to every player as part of the lazy-loaded game bundle.

export function rand(min, max) { return Math.random() * (max - min) + min; }
export function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
export function choice(arr) { return arr[randInt(0, arr.length - 1)]; }
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// requestAnimationFrame loop with delta time (ms). cb(dt) -> return false to stop.
export function loop(cb) {
  let raf, last = performance.now(), stopped = false;
  function frame(t) {
    if (stopped) return;
    const dt = t - last;
    last = t;
    if (cb(dt) === false) return;
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => { stopped = true; cancelAnimationFrame(raf); };
}

// fixed-tick loop, calls cb() every `ms` while active
export function tickLoop(cb, ms) {
  const id = setInterval(cb, ms);
  return () => clearInterval(id);
}

export function onKey(handler) {
  const fn = (e) => handler(e.key, e);
  window.addEventListener('keydown', fn);
  return () => window.removeEventListener('keydown', fn);
}

// Basic swipe detection for touch devices; calls dir('up'|'down'|'left'|'right')
export function onSwipe(el, dir) {
  let sx = 0, sy = 0;
  function start(e) { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; }
  function end(e) {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) dir(dx > 0 ? 'right' : 'left');
    else dir(dy > 0 ? 'down' : 'up');
  }
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('touchend', end, { passive: true });
  return () => {
    el.removeEventListener('touchstart', start);
    el.removeEventListener('touchend', end);
  };
}

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export function makeCanvas(container, w, h) {
  const canvas = el('canvas', { width: w, height: h, class: 'game-canvas' });
  container.appendChild(canvas);
  return canvas.getContext('2d');
}

// Renders a clickable grid of cells; cellRender(cellEl, r, c) sets content/class.
export function makeGrid(container, rows, cols, onClick, onRightClick) {
  const cellPx = cols > 20 ? 16 : cols > 12 ? 22 : cols > 9 ? 28 : 36;
  const grid = el('div', { class: 'grid', style: `--cols:${cols};--cell:${cellPx}px` });
  const cells = [];
  for (let r = 0; r < rows; r++) {
    cells.push([]);
    for (let c = 0; c < cols; c++) {
      const cell = el('div', { class: 'cell' });
      if (onClick) cell.addEventListener('click', () => onClick(r, c, cell));
      if (onRightClick) cell.addEventListener('contextmenu', (e) => { e.preventDefault(); onRightClick(r, c, cell); });
      grid.appendChild(cell);
      cells[r].push(cell);
    }
  }
  container.appendChild(grid);
  return { grid, cells };
}

const PREFIX = 'arcade512:';
export const store = {
  get(key, def) {
    try { const v = localStorage.getItem(PREFIX + key); return v == null ? def : JSON.parse(v); }
    catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch {}
  },
  bestScore(id, score, higherIsBetter = true) {
    const best = store.get('best:' + id, higherIsBetter ? -Infinity : Infinity);
    const improved = higherIsBetter ? score > best : score < best;
    if (improved) store.set('best:' + id, score);
    return improved ? score : best;
  },
};

export function scoreBar(container, label = 'Score') {
  const wrap = el('div', { class: 'scorebar' });
  const scoreEl = el('span', { class: 'score-val' }, '0');
  const bestEl = el('span', { class: 'best-val' }, '0');
  wrap.append(el('span', {}, `${label}: `), scoreEl, el('span', { class: 'sep' }, '  best: '), bestEl);
  container.appendChild(wrap);
  return {
    el: wrap,
    setScore(v) { scoreEl.textContent = v; },
    setBest(v) { bestEl.textContent = v; },
  };
}

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export function makeDeck() {
  const deck = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ rank, suit, red: suit === '♥' || suit === '♦' });
  return shuffle(deck);
}
export function cardLabel(card) { return `${card.rank}${card.suit}`; }
export function cardValue(rank) {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank, 10);
}
export function warRank(rank) { return RANKS.indexOf(rank); }

export function overlay(container, text, sub = '') {
  const o = el('div', { class: 'overlay' }, [
    el('div', { class: 'overlay-title' }, text),
    sub ? el('div', { class: 'overlay-sub' }, sub) : null,
  ]);
  container.appendChild(o);
  return o;
}
