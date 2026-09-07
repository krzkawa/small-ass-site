import { el, makeGrid, overlay } from '../engine.js';

function lineWin(board, n, winLen, mark) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    for (const [dr, dc] of dirs) {
      let ok = true;
      for (let k = 0; k < winLen; k++) {
        const rr = r + dr * k, cc = c + dc * k;
        if (rr < 0 || rr >= n || cc < 0 || cc >= n || board[rr][cc] !== mark) { ok = false; break; }
      }
      if (ok) return true;
    }
  }
  return false;
}

function emptyCells(board) {
  const out = [];
  board.forEach((row, r) => row.forEach((v, c) => { if (!v) out.push([r, c]); }));
  return out;
}

// Minimax only used for the classic 3x3 board (small enough state space).
// In misere play, completing a line LOSES, so terminal scores are inverted.
function minimax(board, n, winLen, depth, isMax, misere) {
  const flip = misere ? -1 : 1;
  if (lineWin(board, n, winLen, 'O')) return flip * (10 - depth);
  if (lineWin(board, n, winLen, 'X')) return flip * (depth - 10);
  const empties = emptyCells(board);
  if (!empties.length) return 0;
  let best = isMax ? -Infinity : Infinity;
  for (const [r, c] of empties) {
    board[r][c] = isMax ? 'O' : 'X';
    const score = minimax(board, n, winLen, depth + 1, !isMax, misere);
    board[r][c] = null;
    best = isMax ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

function bestMove(board, n, winLen, misere) {
  let best = -Infinity, move = null;
  for (const [r, c] of emptyCells(board)) {
    board[r][c] = 'O';
    const score = minimax(board, n, winLen, 0, false, misere);
    board[r][c] = null;
    if (score > best) { best = score; move = [r, c]; }
  }
  return move;
}

export default function tictactoe(container, config) {
  const n = config.size || 3;
  const winLen = config.winLen || 3;
  const mode = config.mode || '2p'; // 'ai-easy' | 'ai-hard' | '2p'
  const board = Array.from({ length: n }, () => Array(n).fill(null));
  let turn = 'X', over = false;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, mode === '2p' ? "Player X's turn" : 'Your turn (X)');
  wrap.appendChild(status);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, n, n, handleClick);

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const v = board[r][c];
      cells[r][c].textContent = v || '';
      cells[r][c].className = 'cell' + (v === 'X' ? ' x' : v === 'O' ? ' o' : '');
    }
  }

  const misere = !!config.misere;
  function checkEnd() {
    const xWon = lineWin(board, n, winLen, 'X'), oWon = lineWin(board, n, winLen, 'O');
    if (xWon) { end(misere ? (mode === '2p' ? 'X made a line — O wins!' : 'You made a line — computer wins!') : 'X wins!'); return true; }
    if (oWon) { end(misere ? (mode === '2p' ? 'O made a line — X wins!' : 'Computer made a line — you win!') : (mode === '2p' ? 'O wins!' : 'Computer wins!')); return true; }
    if (!emptyCells(board).length) { end("It's a draw!"); return true; }
    return false;
  }

  let ov = null;
  function end(msg) {
    over = true;
    ov = overlay(wrap, msg, 'Tap Restart to play again');
  }

  let aiTimer = null;
  function handleClick(r, c) {
    if (over || board[r][c]) return;
    board[r][c] = turn;
    draw();
    if (checkEnd()) return;
    turn = turn === 'X' ? 'O' : 'X';
    status.textContent = mode === '2p' ? `Player ${turn}'s turn` : (turn === 'X' ? 'Your turn (X)' : 'Computer thinking…');
    if (mode !== '2p' && turn === 'O') aiTimer = setTimeout(aiMove, 260);
  }

  function aiMove() {
    if (over) return;
    const empties = emptyCells(board);
    let move;
    if (mode === 'ai-hard' && n === 3) move = bestMove(board, n, winLen, misere);
    else move = empties[Math.floor(Math.random() * empties.length)];
    if (!move) return;
    board[move[0]][move[1]] = 'O';
    draw();
    if (checkEnd()) return;
    turn = 'X';
    status.textContent = 'Your turn (X)';
  }

  draw();
  return { destroy() { clearTimeout(aiTimer); } };
}
