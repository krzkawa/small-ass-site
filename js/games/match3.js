import { el, overlay, randInt, scoreBar } from '../engine.js';

const COLORS = ['#ff5566', '#39ff88', '#3ea1ff', '#ffd23e', '#c78bff', '#ff9a3e'];

export default function match3(container, config) {
  const n = config.size || 8;
  const moveLimit = config.moveLimit || 20;
  const timeLimit = config.timeLimit || 0;
  const board = Array.from({ length: n }, () => Array(n).fill(0));

  function randColorAvoiding(r, c) {
    let color;
    do {
      color = randInt(0, COLORS.length - 1);
    } while (
      (c >= 2 && board[r][c - 1] === color && board[r][c - 2] === color) ||
      (r >= 2 && board[r - 1][c] === color && board[r - 2][c] === color)
    );
    return color;
  }
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) board[r][c] = randColorAvoiding(r, c);

  let movesLeft = moveLimit, timeLeft = timeLimit, score = 0, over = false, selected = null, timerId = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  const infoEl = el('span', { class: 'sep' }, timeLimit ? `  time: ${timeLeft}` : `  moves: ${movesLeft}`);
  bar.el.appendChild(infoEl);
  container.appendChild(wrap);
  const cellPx = n > 8 ? 30 : 38;
  const gridEl = el('div', { style: `display:grid;grid-template-columns:repeat(${n},${cellPx}px);gap:3px;background:#000;padding:5px;border-radius:6px` });
  wrap.appendChild(gridEl);

  const cellNodes = [];
  for (let r = 0; r < n; r++) {
    cellNodes.push([]);
    for (let c = 0; c < n; c++) {
      const cell = el('div', { style: `width:${cellPx}px;height:${cellPx}px;border-radius:6px;cursor:pointer`, onclick: () => onClick(r, c) });
      gridEl.appendChild(cell);
      cellNodes[r].push(cell);
    }
  }

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      cellNodes[r][c].style.background = COLORS[board[r][c]];
      cellNodes[r][c].style.outline = selected && selected[0] === r && selected[1] === c ? '3px solid #fff' : 'none';
    }
  }

  function findMatches() {
    const marked = Array.from({ length: n }, () => Array(n).fill(false));
    for (let r = 0; r < n; r++) {
      let run = 1;
      for (let c = 1; c <= n; c++) {
        if (c < n && board[r][c] === board[r][c - 1]) run++;
        else { if (run >= 3) for (let k = c - run; k < c; k++) marked[r][k] = true; run = 1; }
      }
    }
    for (let c = 0; c < n; c++) {
      let run = 1;
      for (let r = 1; r <= n; r++) {
        if (r < n && board[r][c] === board[r - 1][c]) run++;
        else { if (run >= 3) for (let k = r - run; k < r; k++) marked[k][c] = true; run = 1; }
      }
    }
    return marked;
  }

  function resolveCascades() {
    let totalCleared = 0;
    for (;;) {
      const marked = findMatches();
      let count = 0;
      marked.forEach((row) => row.forEach((v) => { if (v) count++; }));
      if (!count) break;
      totalCleared += count;
      for (let c = 0; c < n; c++) {
        const kept = [];
        for (let r = 0; r < n; r++) if (!marked[r][c]) kept.push(board[r][c]);
        const newCount = n - kept.length;
        const fresh = Array.from({ length: newCount }, () => randInt(0, COLORS.length - 1));
        const col = fresh.concat(kept);
        for (let r = 0; r < n; r++) board[r][c] = col[r];
      }
    }
    return totalCleared;
  }

  function adjacent(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1; }

  function onClick(r, c) {
    if (over) return;
    if (!selected) { selected = [r, c]; draw(); return; }
    if (selected[0] === r && selected[1] === c) { selected = null; draw(); return; }
    if (!adjacent(selected, [r, c])) { selected = [r, c]; draw(); return; }
    const [sr, sc] = selected;
    [board[sr][sc], board[r][c]] = [board[r][c], board[sr][sc]];
    const cleared = resolveCascades();
    if (!cleared) {
      [board[sr][sc], board[r][c]] = [board[r][c], board[sr][sc]];
    } else {
      score += cleared * 10;
      bar.setScore(score);
    }
    selected = null;
    draw();
    if (!timeLimit) {
      movesLeft--;
      infoEl.textContent = `  moves: ${movesLeft}`;
      if (movesLeft <= 0) endGame();
    }
  }

  function endGame() {
    over = true;
    clearInterval(timerId);
    overlay(wrap, 'Out of ' + (timeLimit ? 'time' : 'moves') + '!', `Final score: ${score}`);
  }

  if (timeLimit) {
    timerId = setInterval(() => {
      timeLeft--;
      infoEl.textContent = `  time: ${timeLeft}`;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  draw();
  return { destroy() { clearInterval(timerId); } };
}
