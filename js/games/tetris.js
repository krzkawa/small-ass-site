import { makeCanvas, el, onKey, tickLoop, overlay, scoreBar, store } from '../engine.js';

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
};
const COLORS = { I: '#3ea1ff', O: '#ffd23e', T: '#c78bff', S: '#39ff88', Z: '#ff5566', J: '#ff9a3e', L: '#ff3ec8' };
const KEYS = Object.keys(SHAPES);

function rotate(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[c][rows - 1 - r] = matrix[r][c];
  return out;
}

export default function tetris(container, config) {
  const cols = 10, rows = 18, cell = 20;
  const speed = config.speed || 500;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, cols * cell, rows * cell);

  let score = 0, over = false, piece = null, dropSpeed = speed;

  function spawn() {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    piece = { shape: SHAPES[key], key, x: Math.floor(cols / 2) - 1, y: 0 };
    if (collides(piece.shape, piece.x, piece.y)) over = true;
  }

  function collides(shape, px, py) {
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const x = px + c, y = py + r;
      if (x < 0 || x >= cols || y >= rows) return true;
      if (y >= 0 && grid[y][x]) return true;
    }
    return false;
  }

  function lock() {
    piece.shape.forEach((row, r) => row.forEach((v, c) => { if (v && piece.y + r >= 0) grid[piece.y + r][piece.x + c] = piece.key; }));
    let cleared = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r].every((v) => v)) {
        grid.splice(r, 1); grid.unshift(Array(cols).fill(null)); cleared++; r++;
      }
    }
    if (cleared) { score += [0, 100, 300, 500, 800][cleared] || cleared * 200; bar.setScore(score); }
    spawn();
  }

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cols * cell, rows * cell);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (grid[r][c]) { ctx.fillStyle = COLORS[grid[r][c]]; ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2); }
    }
    if (piece) {
      ctx.fillStyle = COLORS[piece.key];
      piece.shape.forEach((row, r) => row.forEach((v, c) => { if (v) ctx.fillRect((piece.x + c) * cell + 1, (piece.y + r) * cell + 1, cell - 2, cell - 2); }));
    }
  }

  function move(dx, dy) {
    if (over || !piece) return false;
    if (!collides(piece.shape, piece.x + dx, piece.y + dy)) { piece.x += dx; piece.y += dy; return true; }
    if (dy > 0) lock();
    return false;
  }

  function doRotate() {
    if (over || !piece) return;
    const rotated = rotate(piece.shape);
    if (!collides(rotated, piece.x, piece.y)) piece.shape = rotated;
  }

  const offKey = onKey((k, e) => {
    if (over) return;
    if (k === 'ArrowLeft') move(-1, 0);
    else if (k === 'ArrowRight') move(1, 0);
    else if (k === 'ArrowDown') move(0, 1);
    else if (k === 'ArrowUp') doRotate();
    else return;
    e.preventDefault();
    draw();
  });

  function tick() {
    if (over) { endGame(); return; }
    move(0, 1);
    draw();
  }

  function endGame() {
    stopTick();
    const best = store.bestScore('tetris-' + speed, score);
    bar.setBest(best);
    overlay(canvasWrap, 'Game over', `Score: ${score} · Best: ${best}`);
  }

  bar.setBest(store.get('best:tetris-' + speed, 0));
  spawn();
  draw();
  const stopTick = tickLoop(tick, dropSpeed);

  return { destroy() { offKey(); stopTick(); } };
}
