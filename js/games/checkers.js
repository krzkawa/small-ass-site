import { el, makeGrid, overlay, scoreBar } from '../engine.js';

export default function checkers(container, config) {
  const n = config.size || 8;
  const board = Array.from({ length: n }, () => Array(n).fill(null)); // {color:'b'|'w', king:bool}
  const rowsOfPieces = n === 6 ? 2 : 3;
  for (let r = 0; r < rowsOfPieces; r++) for (let c = 0; c < n; c++) if ((r + c) % 2 === 1) board[r][c] = { color: 'w', king: false };
  for (let r = n - rowsOfPieces; r < n; r++) for (let c = 0; c < n; c++) if ((r + c) % 2 === 1) board[r][c] = { color: 'b', king: false };

  let turn = 'b', over = false, selected = null, forcedFrom = null, aiTimer = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Your pieces');
  bar.el.appendChild(el('span', { class: 'sep' }, '  computer: '));
  const aiScoreEl = el('span', { class: 'best-val' }, String(rowsOfPieces * n / 2));
  bar.el.appendChild(aiScoreEl);
  const status = el('div', { class: 'overlay-sub' }, 'Your turn (black) — captures are forced when available');
  container.appendChild(wrap);
  wrap.append(bar.el, status);
  const { cells } = makeGrid(wrap, n, n, onClick);

  function dirsFor(piece) {
    if (piece.king) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return piece.color === 'b' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  }

  function movesFor(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const simple = [], captures = [];
    for (const [dr, dc] of dirsFor(piece)) {
      const r1 = r + dr, c1 = c + dc;
      if (r1 < 0 || r1 >= n || c1 < 0 || c1 >= n) continue;
      if (!board[r1][c1]) simple.push({ to: [r1, c1] });
      else if (board[r1][c1].color !== piece.color) {
        const r2 = r1 + dr, c2 = c1 + dc;
        if (r2 >= 0 && r2 < n && c2 >= 0 && c2 < n && !board[r2][c2]) captures.push({ to: [r2, c2], capture: [r1, c1] });
      }
    }
    return { simple, captures };
  }

  function allMoves(color) {
    const withCap = [], withoutCap = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      const { simple, captures } = movesFor(r, c);
      captures.forEach((m) => withCap.push({ from: [r, c], ...m }));
      simple.forEach((m) => withoutCap.push({ from: [r, c], ...m }));
    }
    return withCap.length ? withCap : withoutCap;
  }

  function countPieces() {
    let b = 0, w = 0;
    board.forEach((row) => row.forEach((p) => { if (p) p.color === 'b' ? b++ : w++; }));
    return { b, w };
  }

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const cell = cells[r][c];
      const dark = (r + c) % 2 === 1;
      cell.style.background = dark ? '#241d14' : '#181209';
      const p = board[r][c];
      cell.textContent = p ? (p.color === 'b' ? (p.king ? '⬛👑' : '⚫') : (p.king ? '⬜👑' : '⚪')) : '';
      cell.style.outline = selected && selected[0] === r && selected[1] === c ? '2px solid var(--accent)' : 'none';
    }
    const { b, w } = countPieces();
    bar.setScore(b); aiScoreEl.textContent = w;
  }

  function applyMove(move) {
    const [fr, fc] = move.from, [tr, tc] = move.to;
    const piece = board[fr][fc];
    board[fr][fc] = null;
    board[tr][tc] = piece;
    if (move.capture) board[move.capture[0]][move.capture[1]] = null;
    if ((piece.color === 'b' && tr === 0) || (piece.color === 'w' && tr === n - 1)) piece.king = true;
    return !!move.capture;
  }

  // Call with the color who moves NEXT — a stuck or wiped-out next player loses.
  function checkGameOver(nextColor) {
    const { b, w } = countPieces();
    const noPieces = nextColor === 'b' ? b === 0 : w === 0;
    const noMoves = !noPieces && allMoves(nextColor).length === 0;
    if (noPieces || noMoves) {
      over = true;
      overlay(wrap, nextColor === 'w' ? 'You win!' : 'Computer wins!', '');
      return true;
    }
    return false;
  }

  function onClick(r, c) {
    if (over || turn !== 'b') return;
    const legal = allMoves('b');
    const hasForced = legal.some((m) => m.capture);
    if (selected) {
      const move = legal.find((m) => m.from[0] === selected[0] && m.from[1] === selected[1] && m.to[0] === r && m.to[1] === c);
      if (move) {
        const captured = applyMove(move);
        draw();
        if (captured) {
          const cont = movesFor(r, c).captures;
          if (cont.length) { selected = [r, c]; forcedFrom = [r, c]; draw(); status.textContent = 'Capture again!'; return; }
        }
        selected = null; forcedFrom = null;
        if (checkGameOver('w')) return;
        turn = 'w';
        status.textContent = 'Computer thinking…';
        draw();
        aiTimer = setTimeout(aiTurn, 400);
        return;
      }
      if (board[r][c] && board[r][c].color === 'b' && !forcedFrom) { selected = [r, c]; draw(); return; }
      if (!forcedFrom) { selected = null; draw(); }
      return;
    }
    if (board[r][c] && board[r][c].color === 'b') {
      if (hasForced && !legal.some((m) => m.from[0] === r && m.from[1] === c)) return;
      selected = [r, c];
      draw();
    }
  }

  function aiTurn() {
    if (over) return;
    const legal = allMoves('w');
    if (!legal.length) return checkGameOver('w');
    const captures = legal.filter((m) => m.capture);
    let pool = captures.length ? captures : legal;
    let move = pool[Math.floor(Math.random() * pool.length)];
    let captured = applyMove(move);
    draw();
    while (captured) {
      const cont = movesFor(move.to[0], move.to[1]).captures;
      if (!cont.length) break;
      move = { from: move.to, ...cont[Math.floor(Math.random() * cont.length)] };
      captured = applyMove(move);
      draw();
    }
    if (checkGameOver('b')) return;
    turn = 'b';
    status.textContent = 'Your turn';
  }

  draw();
  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
