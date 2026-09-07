import { el, overlay, shuffle, scoreBar } from '../engine.js';

const COLS = [
  { letter: 'B', min: 1, max: 15 }, { letter: 'I', min: 16, max: 30 }, { letter: 'N', min: 31, max: 45 },
  { letter: 'G', min: 46, max: 60 }, { letter: 'O', min: 61, max: 75 },
];

function makeCard() {
  const grid = [];
  COLS.forEach((col, ci) => {
    const nums = shuffle(Array.from({ length: col.max - col.min + 1 }, (_, i) => col.min + i)).slice(0, 5);
    nums.forEach((n, ri) => { grid[ri] = grid[ri] || []; grid[ri][ci] = n; });
  });
  grid[2][2] = 'FREE';
  return grid;
}

export default function bingo(container, config) {
  const mode = config.mode || 'classic';
  const card = makeCard();
  const marked = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => r === 2 && c === 2));
  const pool = shuffle(COLS.flatMap((col) => Array.from({ length: col.max - col.min + 1 }, (_, i) => col.min + i)));
  let calls = 0, over = false, autoTimer = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Calls');
  const status = el('div', { class: 'overlay-sub' }, mode === 'blackout' ? 'Fill the entire card, then click BINGO!' : 'Complete a row, column, or diagonal, then click BINGO!');
  const calledEl = el('div', { style: 'font-size:1.6em;margin:.4em 0;min-height:1.4em' }, '—');
  const gridEl = el('div', { style: 'display:grid;grid-template-columns:repeat(5,50px);gap:3px;background:#000;padding:5px;border-radius:6px' });
  const header = el('div', { style: 'display:grid;grid-template-columns:repeat(5,50px);gap:3px;margin-bottom:3px' });
  COLS.forEach((col) => header.appendChild(el('div', { style: 'text-align:center;color:var(--accent);font-weight:bold' }, col.letter)));
  const controls = el('div', { style: 'display:flex;gap:.6em;margin-top:.6em' });
  const callBtn = el('button', {}, 'Call next number');
  const bingoBtn = el('button', {}, 'BINGO!');

  const cellNodes = [];
  for (let r = 0; r < 5; r++) {
    cellNodes.push([]);
    for (let c = 0; c < 5; c++) {
      const cell = el('div', { style: 'width:50px;height:50px;display:flex;align-items:center;justify-content:center;background:#241d14;border-radius:4px;font-size:.9em' });
      gridEl.appendChild(cell);
      cellNodes[r].push(cell);
    }
  }

  function draw() {
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      cellNodes[r][c].textContent = card[r][c];
      cellNodes[r][c].style.background = marked[r][c] ? 'var(--accent)' : '#241d14';
      cellNodes[r][c].style.color = marked[r][c] ? '#000' : '#e8e8f0';
    }
    bar.setScore(calls);
  }

  function callNext() {
    if (over || !pool.length) return;
    const n = pool.pop();
    calls++;
    calledEl.textContent = `${COLS.find((c) => n >= c.min && n <= c.max).letter}-${n}`;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if (card[r][c] === n) marked[r][c] = true;
    draw();
    if (!pool.length) { status.textContent = 'Out of numbers! Click BINGO if you have a pattern.'; }
  }

  function hasWinningLine() {
    for (let r = 0; r < 5; r++) if (marked[r].every((v) => v)) return true;
    for (let c = 0; c < 5; c++) if (marked.every((row) => row[c])) return true;
    if ([0, 1, 2, 3, 4].every((i) => marked[i][i])) return true;
    if ([0, 1, 2, 3, 4].every((i) => marked[i][4 - i])) return true;
    return false;
  }
  function hasBlackout() { return marked.every((row) => row.every((v) => v)); }

  function claimBingo() {
    if (over) return;
    const won = mode === 'blackout' ? hasBlackout() : hasWinningLine();
    if (won) {
      over = true;
      clearInterval(autoTimer);
      overlay(wrap, 'BINGO! You win!', `Won in ${calls} calls`);
    } else {
      status.textContent = 'Not yet — keep calling numbers!';
    }
  }

  callBtn.addEventListener('click', callNext);
  bingoBtn.addEventListener('click', claimBingo);
  if (mode === 'speed') {
    callBtn.classList.add('hidden');
    autoTimer = setInterval(callNext, 1200);
  }

  controls.append(mode === 'speed' ? el('span', { class: 'overlay-sub' }, 'Numbers call automatically') : callBtn, bingoBtn);
  wrap.append(bar.el, status, calledEl, header, gridEl, controls);
  container.appendChild(wrap);
  draw();

  return { destroy() { clearInterval(autoTimer); } };
}
