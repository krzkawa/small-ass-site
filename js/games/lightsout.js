import { el, makeGrid, overlay, randInt } from '../engine.js';

export default function lightsout(container, config) {
  const n = config.size || 5;
  const board = Array.from({ length: n }, () => Array(n).fill(false));
  let over = false, moves = 0;

  function toggle(r, c) {
    const hit = [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
    for (const [rr, cc] of hit) if (rr >= 0 && rr < n && cc >= 0 && cc < n) board[rr][cc] = !board[rr][cc];
  }

  // Start solved, then apply random valid moves so the puzzle stays solvable.
  for (let i = 0; i < n * n; i++) toggle(randInt(0, n - 1), randInt(0, n - 1));

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Turn off every light');
  wrap.appendChild(status);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, n, n, onClick);

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) cells[r][c].classList.toggle('on', board[r][c]);
  }

  function isSolved() { return board.every((row) => row.every((v) => !v)); }

  function onClick(r, c) {
    if (over) return;
    toggle(r, c);
    moves++;
    draw();
    status.textContent = `Moves: ${moves}`;
    if (isSolved()) { over = true; overlay(wrap, 'All lights out!', `Solved in ${moves} moves`); }
  }

  draw();
  if (isSolved()) { for (let i = 0; i < 3; i++) toggle(randInt(0, n - 1), randInt(0, n - 1)); draw(); }
  return { destroy() {} };
}
