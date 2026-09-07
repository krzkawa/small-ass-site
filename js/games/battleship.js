import { el, overlay, randInt, scoreBar } from '../engine.js';

function fleetFor(n) { return n >= 10 ? [5, 4, 3, 3, 2] : [4, 3, 3, 2]; }

function emptyBoard(n) { return Array.from({ length: n }, () => Array(n).fill(null)); }

function placeFleet(n) {
  const board = emptyBoard(n);
  const ships = fleetFor(n);
  ships.forEach((len, shipId) => {
    let placed = false;
    while (!placed) {
      const horiz = Math.random() < 0.5;
      const r = randInt(0, n - (horiz ? 1 : len));
      const c = randInt(0, n - (horiz ? len : 1));
      const cells = [];
      let ok = true;
      for (let i = 0; i < len; i++) {
        const rr = horiz ? r : r + i, cc = horiz ? c + i : c;
        if (board[rr][cc]) { ok = false; break; }
        cells.push([rr, cc]);
      }
      if (ok) { cells.forEach(([rr, cc]) => (board[rr][cc] = shipId)); placed = true; }
    }
  });
  return { board, totalCells: ships.reduce((a, b) => a + b, 0) };
}

export default function battleship(container, config) {
  const n = config.size || 8;
  const smart = config.aiMode === 'smart';
  const player = placeFleet(n);
  const ai = placeFleet(n);
  const shotsAtAI = Array.from({ length: n }, () => Array(n).fill(false));
  const shotsAtPlayer = Array.from({ length: n }, () => Array(n).fill(false));
  let over = false, playerHits = 0, aiHits = 0, aiTimer = null;
  let huntQueue = [];

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Your hits');
  bar.el.appendChild(el('span', { class: 'sep' }, '  computer hits: '));
  const aiHitsEl = el('span', { class: 'best-val' }, '0');
  bar.el.appendChild(aiHitsEl);
  const status = el('div', { class: 'overlay-sub' }, 'Fire at the enemy waters');
  const boards = el('div', { style: 'display:flex;gap:1.5em;flex-wrap:wrap;justify-content:center;margin-top:.6em' });
  wrap.append(bar.el, status, boards);
  container.appendChild(wrap);

  const cellPx = n > 8 ? 26 : 32;
  function makeBoardEl(label) {
    const col = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:.3em' });
    col.appendChild(el('div', { class: 'overlay-sub' }, label));
    const gridEl = el('div', { style: `display:grid;grid-template-columns:repeat(${n},${cellPx}px);gap:2px;background:#001a4d;padding:4px;border-radius:4px` });
    col.appendChild(gridEl);
    return { col, gridEl };
  }

  const enemyUI = makeBoardEl('Enemy waters — click to fire');
  const ownUI = makeBoardEl('Your fleet');
  boards.append(enemyUI.col, ownUI.col);

  const enemyCells = [], ownCells = [];
  for (let r = 0; r < n; r++) {
    enemyCells.push([]); ownCells.push([]);
    for (let c = 0; c < n; c++) {
      const ec = el('div', { style: `width:${cellPx}px;height:${cellPx}px;background:#0a2a5e;border-radius:3px;cursor:pointer;display:flex;align-items:center;justify-content:center`, onclick: () => fire(r, c) });
      enemyUI.gridEl.appendChild(ec); enemyCells[r].push(ec);
      const oc = el('div', { style: `width:${cellPx}px;height:${cellPx}px;background:#0a2a5e;border-radius:3px;display:flex;align-items:center;justify-content:center` });
      ownUI.gridEl.appendChild(oc); ownCells[r].push(oc);
    }
  }

  function drawOwn() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const hasShip = player.board[r][c] != null;
      const shot = shotsAtPlayer[r][c];
      ownCells[r][c].textContent = shot ? (hasShip ? '🔥' : '·') : (hasShip ? '🚢' : '');
      ownCells[r][c].style.background = shot ? (hasShip ? '#ff5566' : '#123') : '#0a2a5e';
    }
  }

  function fire(r, c) {
    if (over || shotsAtAI[r][c]) return;
    shotsAtAI[r][c] = true;
    const hit = ai.board[r][c] != null;
    enemyCells[r][c].textContent = hit ? '🔥' : '·';
    enemyCells[r][c].style.background = hit ? '#ff5566' : '#123';
    if (hit) { playerHits++; bar.setScore(playerHits); }
    if (playerHits >= ai.totalCells) { over = true; overlay(wrap, 'You sank the enemy fleet!', ''); return; }
    status.textContent = 'Computer firing…';
    aiTimer = setTimeout(aiTurn, 400);
  }

  function aiTurn() {
    if (over) return;
    let r, c;
    if (smart && huntQueue.length) {
      [r, c] = huntQueue.shift();
    } else {
      do { r = randInt(0, n - 1); c = randInt(0, n - 1); } while (shotsAtPlayer[r][c]);
    }
    shotsAtPlayer[r][c] = true;
    const hit = player.board[r][c] != null;
    if (hit) {
      aiHits++; aiHitsEl.textContent = aiHits;
      if (smart) {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < n && cc >= 0 && cc < n && !shotsAtPlayer[rr][cc]) huntQueue.push([rr, cc]);
        });
      }
    }
    drawOwn();
    if (aiHits >= player.totalCells) { over = true; overlay(wrap, 'The computer sank your fleet!', ''); return; }
    status.textContent = 'Fire at the enemy waters';
  }

  drawOwn();
  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
