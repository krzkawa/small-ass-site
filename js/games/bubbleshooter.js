import { el, overlay, randInt, scoreBar } from '../engine.js';

const COLORS = ['#ff5566', '#39ff88', '#3ea1ff', '#ffd23e', '#c78bff'];
const COL_HEIGHT = 12;
const COLS = 7;

export default function bubbleshooter(container, config) {
  const initRows = config.rows || 6;
  const columns = Array.from({ length: COLS }, () => Array.from({ length: initRows }, () => randInt(0, COLORS.length - 1)));
  let score = 0, over = false, next = randInt(0, COLORS.length - 1);

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Popped');
  const status = el('div', { class: 'overlay-sub' }, 'Click a column to drop the next bubble · match 3+ same colors');
  const nextEl = el('div', { style: 'display:flex;align-items:center;gap:.5em;margin:.4em 0' });
  const nextSwatch = el('div', { style: 'width:26px;height:26px;border-radius:50%' });
  nextEl.append(el('span', { class: 'overlay-sub' }, 'Next: '), nextSwatch);
  container.appendChild(wrap);
  const boardEl = el('div', { style: `display:flex;gap:4px;align-items:flex-end;background:#000;padding:6px;border-radius:6px;height:${COL_HEIGHT * 28 + 12}px` });
  wrap.append(bar.el, status, nextEl, boardEl);

  const colEls = [];
  for (let c = 0; c < COLS; c++) {
    const colEl = el('div', { style: 'display:flex;flex-direction:column-reverse;gap:3px;cursor:pointer;width:26px', onclick: () => drop(c) });
    boardEl.appendChild(colEl);
    colEls.push(colEl);
  }

  function draw() {
    for (let c = 0; c < COLS; c++) {
      colEls[c].innerHTML = '';
      columns[c].forEach((color) => colEls[c].appendChild(el('div', { style: `width:26px;height:26px;border-radius:50%;background:${COLORS[color]}` })));
    }
    nextSwatch.style.background = COLORS[next];
  }

  function floodMatch(c, r) {
    const target = columns[c][r];
    const seen = new Set();
    const stack = [[c, r]];
    const group = [];
    while (stack.length) {
      const [cc, rr] = stack.pop();
      const key = cc + ',' + rr;
      if (seen.has(key)) continue;
      seen.add(key);
      if (cc < 0 || cc >= COLS || rr < 0 || rr >= columns[cc].length || columns[cc][rr] !== target) continue;
      group.push([cc, rr]);
      stack.push([cc + 1, rr], [cc - 1, rr], [cc, rr + 1], [cc, rr - 1]);
    }
    return group;
  }

  function resolveAt(c, r) {
    let cleared = 0;
    let group = floodMatch(c, r);
    if (group.length >= 3) {
      const byCol = {};
      group.forEach(([cc, rr]) => { (byCol[cc] = byCol[cc] || []).push(rr); });
      Object.entries(byCol).forEach(([cc, rows]) => {
        const rowSet = new Set(rows);
        columns[cc] = columns[cc].filter((_, i) => !rowSet.has(i));
      });
      cleared = group.length;
    }
    return cleared;
  }

  function resolveInitial() {
    let changed = true;
    while (changed) {
      changed = false;
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < columns[c].length; r++) {
          const group = floodMatch(c, r);
          if (group.length >= 3) { resolveAt(c, r); changed = true; break; }
        }
        if (changed) break;
      }
    }
  }
  resolveInitial();

  function drop(c) {
    if (over) return;
    if (columns[c].length >= COL_HEIGHT) { status.textContent = 'That column is full — try another!'; return; }
    columns[c].push(next);
    const r = columns[c].length - 1;
    const cleared = resolveAt(c, r);
    if (cleared) { score += cleared; bar.setScore(score); status.textContent = `Popped ${cleared} bubbles!`; }
    else status.textContent = 'Click a column to drop the next bubble · match 3+ same colors';
    next = randInt(0, COLORS.length - 1);
    draw();
    if (columns.every((col) => col.length === 0)) { over = true; overlay(wrap, 'Cleared the board!', `Score: ${score}`); return; }
    if (columns.some((col) => col.length >= COL_HEIGHT)) { over = true; overlay(wrap, 'Bubbles reached the top!', `Score: ${score}`); }
  }

  draw();
  return { destroy() {} };
}
