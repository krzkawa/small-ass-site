import { el, overlay, shuffle } from '../engine.js';

const CLUES = { beginner: 50, easy: 40, medium: 33, hard: 27, expert: 22 };

function solvedGrid() {
  const base = 3, side = 9;
  const pattern = (r, c) => (base * (r % base) + Math.floor(r / base) + c) % side;
  const rBase = [0, 1, 2];
  const rows = [];
  shuffle(rBase).forEach((g) => shuffle(rBase).forEach((r) => rows.push(g * base + r)));
  const cols = [];
  shuffle(rBase).forEach((g) => shuffle(rBase).forEach((c) => cols.push(g * base + c)));
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const grid = [];
  for (let r = 0; r < side; r++) {
    grid.push([]);
    for (let c = 0; c < side; c++) grid[r].push(nums[pattern(rows[r], cols[c])]);
  }
  return grid;
}

export default function sudoku(container, config) {
  const clues = CLUES[config.difficulty] || CLUES.medium;
  const solution = solvedGrid();
  const given = Array.from({ length: 9 }, () => Array(9).fill(false));
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i)).slice(0, clues);
  positions.forEach((p) => { const r = Math.floor(p / 9), c = p % 9; given[r][c] = true; board[r][c] = solution[r][c]; });

  let selected = null, over = false;
  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Fill every row, column, and 3×3 box with 1-9 · ${config.difficulty || 'medium'}`);
  container.appendChild(wrap);
  const boardEl = el('div', { style: 'display:grid;grid-template-columns:repeat(9,32px);gap:0;background:#000;border:2px solid #e8a33d' });
  const cellNodes = [];
  for (let r = 0; r < 9; r++) {
    cellNodes.push([]);
    for (let c = 0; c < 9; c++) {
      const borderRight = (c + 1) % 3 === 0 && c !== 8 ? '2px solid #e8a33d' : '1px solid #222';
      const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? '2px solid #e8a33d' : '1px solid #222';
      const cell = el('div', {
        style: `width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#181209;border-right:${borderRight};border-bottom:${borderBottom};font-size:1em`,
        onclick: () => selectCell(r, c),
      });
      boardEl.appendChild(cell);
      cellNodes[r].push(cell);
    }
  }
  const pad = el('div', { style: 'display:flex;gap:.3em;margin-top:.6em;flex-wrap:wrap;justify-content:center' });
  for (let n = 1; n <= 9; n++) pad.appendChild(el('button', { onclick: () => setValue(n) }, String(n)));
  pad.appendChild(el('button', { onclick: () => setValue(0) }, '⌫'));
  const checkBtn = el('button', { style: 'margin-top:.6em', onclick: checkWin }, 'Check solution');

  function selectCell(r, c) {
    if (over || given[r][c]) { selected = given[r][c] ? null : [r, c]; draw(); return; }
    selected = [r, c];
    draw();
  }
  function setValue(n) {
    if (over || !selected) return;
    const [r, c] = selected;
    board[r][c] = n;
    draw();
  }
  function draw() {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const cell = cellNodes[r][c];
      cell.textContent = board[r][c] || '';
      cell.style.color = given[r][c] ? '#8a8071' : '#e8a33d';
      cell.style.outline = selected && selected[0] === r && selected[1] === c ? '2px solid var(--accent2)' : 'none';
    }
  }
  function checkWin() {
    if (over) return;
    for (let i = 0; i < 9; i++) {
      const row = new Set(board[i]), col = new Set(board.map((row2) => row2[i]));
      if (row.size !== 9 || !board[i].every((v) => v) || col.size !== 9) { status.textContent = 'Not solved yet — keep going!'; return; }
    }
    for (let br = 0; br < 9; br += 3) for (let bc = 0; bc < 9; bc += 3) {
      const box = new Set();
      for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) box.add(board[r][c]);
      if (box.size !== 9) { status.textContent = 'Not solved yet — keep going!'; return; }
    }
    over = true;
    overlay(wrap, 'Sudoku solved!', '');
  }

  wrap.append(status, boardEl, pad, checkBtn);
  draw();

  return { destroy() {} };
}
