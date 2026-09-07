import { el, makeGrid, overlay, scoreBar } from '../engine.js';

const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export default function othello(container, config) {
  const n = config.size || 8;
  const board = Array.from({ length: n }, () => Array(n).fill(null));
  const mid = n / 2;
  board[mid - 1][mid - 1] = 'W'; board[mid][mid] = 'W';
  board[mid - 1][mid] = 'B'; board[mid][mid - 1] = 'B';
  let turn = 'B', over = false, aiTimer = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'You (Black)');
  bar.el.appendChild(el('span', { class: 'sep' }, '  computer: '));
  const aiScoreEl = el('span', { class: 'best-val' }, '2');
  bar.el.appendChild(aiScoreEl);
  container.appendChild(wrap);
  wrap.append(bar.el);
  const { cells } = makeGrid(wrap, n, n, (r, c) => onClick(r, c));

  function flipsFor(b, r, c, mark) {
    if (b[r][c]) return [];
    const opp = mark === 'B' ? 'W' : 'B';
    let all = [];
    for (const [dr, dc] of DIRS) {
      let rr = r + dr, cc = c + dc, line = [];
      while (rr >= 0 && rr < n && cc >= 0 && cc < n && b[rr][cc] === opp) { line.push([rr, cc]); rr += dr; cc += dc; }
      if (line.length && rr >= 0 && rr < n && cc >= 0 && cc < n && b[rr][cc] === mark) all = all.concat(line);
    }
    return all;
  }

  function legalMoves(b, mark) {
    const moves = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (flipsFor(b, r, c, mark).length) moves.push([r, c]);
    return moves;
  }

  function counts() {
    let bC = 0, wC = 0;
    board.forEach((row) => row.forEach((v) => { if (v === 'B') bC++; if (v === 'W') wC++; }));
    return { B: bC, W: wC };
  }

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const v = board[r][c];
      cells[r][c].textContent = v ? (v === 'B' ? '⚫' : '⚪') : '';
    }
    const { B, W } = counts();
    bar.setScore(B); aiScoreEl.textContent = W;
  }

  function place(r, c, mark) {
    const flips = flipsFor(board, r, c, mark);
    if (!flips.length) return false;
    board[r][c] = mark;
    flips.forEach(([rr, cc]) => { board[rr][cc] = mark; });
    return true;
  }

  const status = el('div', { class: 'overlay-sub' }, 'Your turn — flip opponent discs by bracketing them');
  wrap.insertBefore(status, wrap.firstChild.nextSibling);

  function nextTurn(justMoved) {
    const other = justMoved === 'B' ? 'W' : 'B';
    if (legalMoves(board, other).length) turn = other;
    else if (legalMoves(board, justMoved).length) turn = justMoved;
    else return endGame();
    status.textContent = turn === 'B' ? 'Your turn' : 'Computer thinking…';
    if (turn === 'W') aiTimer = setTimeout(aiTurn, 350);
  }

  function endGame() {
    over = true;
    const { B, W } = counts();
    overlay(wrap, B > W ? 'You win!' : B < W ? 'Computer wins!' : "It's a tie!", `${B} — ${W}`);
  }

  function onClick(r, c) {
    if (over || turn !== 'B') return;
    if (!place(r, c, 'B')) return;
    draw();
    nextTurn('B');
  }

  function aiTurn() {
    if (over) return;
    const moves = legalMoves(board, 'W');
    if (!moves.length) return nextTurn('W');
    let best = null, bestScore = -Infinity;
    for (const [r, c] of moves) {
      let s = flipsFor(board, r, c, 'W').length;
      if ((r === 0 || r === n - 1) && (c === 0 || c === n - 1)) s += 10;
      if (s > bestScore) { bestScore = s; best = [r, c]; }
    }
    place(best[0], best[1], 'W');
    draw();
    nextTurn('W');
  }

  draw();
  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
