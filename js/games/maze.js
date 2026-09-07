import { makeCanvas, el, onKey, overlay, randInt, shuffle } from '../engine.js';

export default function maze(container, config) {
  const n = config.size || 12;
  const cellPx = Math.min(30, Math.floor(420 / n));
  const size = cellPx * n;

  // cells[r][c] = { walls: {N,E,S,W}, visited }
  const cells = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ N: true, E: true, S: true, W: true, visited: false })));
  const DIRS = { N: [0, -1, 'S'], S: [0, 1, 'N'], E: [1, 0, 'W'], W: [-1, 0, 'E'] };

  function carve(r, c) {
    cells[r][c].visited = true;
    for (const dir of shuffle(Object.keys(DIRS))) {
      const [dx, dy, opp] = DIRS[dir];
      const nc = c + dx, nr = r + dy;
      if (nc < 0 || nc >= n || nr < 0 || nr >= n || cells[nr][nc].visited) continue;
      cells[r][c][dir] = false;
      cells[nr][nc][opp] = false;
      carve(nr, nc);
    }
  }
  carve(0, 0);

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Reach the star with the arrow keys');
  wrap.appendChild(status);
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, size, size);

  let px = 0, py = 0, over = false, moves = 0;
  const goal = [n - 1, n - 1];

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#e8a33d'; ctx.lineWidth = 2;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const x = c * cellPx, y = r * cellPx, cell = cells[r][c];
      ctx.beginPath();
      if (cell.N) { ctx.moveTo(x, y); ctx.lineTo(x + cellPx, y); }
      if (cell.W) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellPx); }
      if (cell.S) { ctx.moveTo(x, y + cellPx); ctx.lineTo(x + cellPx, y + cellPx); }
      if (cell.E) { ctx.moveTo(x + cellPx, y); ctx.lineTo(x + cellPx, y + cellPx); }
      ctx.stroke();
    }
    ctx.fillStyle = '#ffd23e';
    ctx.font = `${cellPx * 0.8}px monospace`;
    ctx.fillText('★', goal[1] * cellPx + cellPx * 0.15, goal[0] * cellPx + cellPx * 0.8);
    ctx.fillStyle = '#3d8b8b';
    ctx.beginPath(); ctx.arc(px * cellPx + cellPx / 2, py * cellPx + cellPx / 2, cellPx * 0.28, 0, Math.PI * 2); ctx.fill();
  }

  const dirKeys = { ArrowUp: 'N', ArrowDown: 'S', ArrowLeft: 'W', ArrowRight: 'E', w: 'N', s: 'S', a: 'W', d: 'E' };
  const offKey = onKey((key, e) => {
    if (over) return;
    const dir = dirKeys[key];
    if (!dir) return;
    e.preventDefault();
    const cell = cells[py][px];
    if (cell[dir]) return;
    const [dx, dy] = DIRS[dir];
    px += dx; py += dy; moves++;
    if (px === goal[1] && py === goal[0]) {
      over = true;
      status.textContent = `Solved in ${moves} moves`;
      overlay(canvasWrap, 'You found the exit!', `${moves} moves`);
    }
    draw();
  });

  draw();
  return { destroy() { offKey(); } };
}
