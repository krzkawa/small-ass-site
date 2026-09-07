import { el, overlay, scoreBar } from '../engine.js';

function checkWinAt(board, rows, cols, r, c) {
  const mark = board[r][c];
  if (!mark) return false;
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (const s of [1, -1]) {
      let rr = r + dr * s, cc = c + dc * s;
      while (rr >= 0 && rr < rows && cc >= 0 && cc < cols && board[rr][cc] === mark) { count++; rr += dr * s; cc += dc * s; }
    }
    if (count >= 4) return true;
  }
  return false;
}

function dropRow(board, rows, col) {
  for (let r = rows - 1; r >= 0; r--) if (!board[r][col]) return r;
  return -1;
}

function evalBoard(board, rows, cols, mark) {
  const opp = mark === 'R' ? 'Y' : 'R';
  let score = 0;
  const lines = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      const cellsIn = [];
      let ok = true;
      for (let k = 0; k < 4; k++) {
        const rr = r + dr * k, cc = c + dc * k;
        if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) { ok = false; break; }
        cellsIn.push(board[rr][cc]);
      }
      if (ok) lines.push(cellsIn);
    }
  }
  for (const line of lines) {
    const m = line.filter((v) => v === mark).length;
    const o = line.filter((v) => v === opp).length;
    if (m && !o) score += [0, 1, 8, 40][m];
    if (o && !m) score -= [0, 1, 8, 40][o];
  }
  return score;
}

function aiMove(board, rows, cols, mark, depth) {
  const opp = mark === 'R' ? 'Y' : 'R';
  function search(b, d, isMax, alpha, beta) {
    const validCols = [];
    for (let c = 0; c < cols; c++) if (!b[0][c]) validCols.push(c);
    if (!validCols.length) return { score: 0 };
    if (d === 0) return { score: evalBoard(b, rows, cols, mark) };
    let best = null;
    for (const c of validCols) {
      const r = dropRow(b, rows, c);
      b[r][c] = isMax ? mark : opp;
      const win = checkWinAt(b, rows, cols, r, c);
      const result = win ? { score: isMax ? 100000 - d : -100000 + d } : search(b, d - 1, !isMax, alpha, beta);
      b[r][c] = null;
      if (best === null || (isMax ? result.score > best.score : result.score < best.score)) best = { score: result.score, col: c };
      if (isMax) alpha = Math.max(alpha, best.score); else beta = Math.min(beta, best.score);
      if (beta <= alpha) break;
    }
    return best;
  }
  return search(board.map((row) => row.slice()), depth, true, -Infinity, Infinity).col;
}

export default function connectfour(container, config) {
  const rows = config.rows || 6, cols = config.cols || 7;
  const mode = config.mode || 'ai'; // 'ai' | '2p'
  const board = Array.from({ length: rows }, () => Array(cols).fill(null));
  let turn = 'R', over = false, aiTimer = null;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, mode === '2p' ? "Red's turn" : 'Your turn (Red)');
  wrap.appendChild(status);
  container.appendChild(wrap);
  const boardEl = el('div', { style: `display:grid;grid-template-columns:repeat(${cols},1fr);gap:3px;background:#001a4d;padding:6px;border-radius:6px` });
  wrap.appendChild(boardEl);

  const cellSize = cols > 8 ? 26 : 40;
  const cellNodes = [];
  for (let r = 0; r < rows; r++) {
    cellNodes.push([]);
    for (let c = 0; c < cols; c++) {
      const cell = el('div', { style: `width:${cellSize}px;height:${cellSize}px;border-radius:50%;background:#181209;cursor:pointer`, onclick: () => play(c) });
      boardEl.appendChild(cell);
      cellNodes[r].push(cell);
    }
  }

  function draw() {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = board[r][c];
      cellNodes[r][c].style.background = v === 'R' ? '#ff5566' : v === 'Y' ? '#ffd23e' : '#181209';
    }
  }

  function play(c) {
    if (over || (mode !== '2p' && turn !== 'R')) return;
    drop(c);
  }

  function drop(c) {
    const r = dropRow(board, rows, c);
    if (r === -1) return;
    board[r][c] = turn;
    draw();
    if (checkWinAt(board, rows, cols, r, c)) return end(mode === '2p' ? `${turn === 'R' ? 'Red' : 'Yellow'} wins!` : (turn === 'R' ? 'You win!' : 'Computer wins!'));
    if (board[0].every((v) => v)) return end("It's a draw!");
    turn = turn === 'R' ? 'Y' : 'R';
    status.textContent = mode === '2p' ? `${turn === 'R' ? "Red's" : "Yellow's"} turn` : (turn === 'R' ? 'Your turn (Red)' : 'Computer thinking…');
    if (mode !== '2p' && turn === 'Y') aiTimer = setTimeout(() => {
      if (over) return;
      const col = aiMove(board, rows, cols, 'Y', cols > 8 ? 3 : 5);
      if (col != null) drop(col);
    }, 300);
  }

  function end(msg) { over = true; overlay(wrap, msg, ''); }

  draw();
  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
