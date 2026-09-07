import { el, makeGrid, overlay, randInt } from '../engine.js';

export default function minesweeper(container, config) {
  const rows = config.rows || 9, cols = config.cols || 9, mineCount = config.mines || 10;
  let mines = null; // set after first click
  const revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
  const flagged = Array.from({ length: rows }, () => Array(cols).fill(false));
  let firstClick = true, over = false, revealedCount = 0;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Mines: ${mineCount} · left-click reveal, right-click flag`);
  wrap.appendChild(status);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, rows, cols, onLeft, onRight);

  function placeMines(avoidR, avoidC) {
    mines = Array.from({ length: rows }, () => Array(cols).fill(false));
    let placed = 0;
    while (placed < mineCount) {
      const r = randInt(0, rows - 1), c = randInt(0, cols - 1);
      if (mines[r][c] || (Math.abs(r - avoidR) <= 1 && Math.abs(c - avoidC) <= 1)) continue;
      mines[r][c] = true; placed++;
    }
  }

  function neighbors(r, c) {
    const out = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push([rr, cc]);
    }
    return out;
  }

  function count(r, c) { return neighbors(r, c).filter(([rr, cc]) => mines[rr][cc]).length; }

  function reveal(r, c) {
    if (revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true; revealedCount++;
    const n = count(r, c);
    const cell = cells[r][c];
    cell.classList.add('on');
    if (n) cell.textContent = n;
    else { cell.textContent = ''; neighbors(r, c).forEach(([rr, cc]) => reveal(rr, cc)); }
  }

  function onLeft(r, c) {
    if (over) return;
    if (firstClick) { placeMines(r, c); firstClick = false; }
    if (flagged[r][c]) return;
    if (mines[r][c]) { revealed[r][c] = true; cells[r][c].classList.add('mine'); cells[r][c].textContent = '💣'; loseGame(); return; }
    reveal(r, c);
    if (revealedCount === rows * cols - mineCount) winGame();
  }

  function onRight(r, c) {
    if (over || revealed[r][c]) return;
    flagged[r][c] = !flagged[r][c];
    cells[r][c].classList.toggle('flag', flagged[r][c]);
    cells[r][c].textContent = flagged[r][c] ? '🚩' : '';
  }

  function loseGame() {
    over = true;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (mines[r][c]) { cells[r][c].classList.add('mine'); cells[r][c].textContent = '💣'; }
    overlay(wrap, 'Boom! You hit a mine', 'Tap Restart to try again');
  }

  function winGame() {
    over = true;
    overlay(wrap, 'You cleared the field!', 'Tap Restart to play again');
  }

  return { destroy() {} };
}
