import { makeCanvas, el, onKey, onSwipe, randInt, scoreBar, overlay, tickLoop, store } from '../engine.js';

export default function snake(container, config) {
  const cells = config.board || 20;
  const wrap = !!config.wrap;
  const poison = !!config.poison;
  const speed = config.speed || 130;
  const px = Math.min(20, Math.floor(480 / cells));
  const size = px * cells;

  const wrapEl = el('div', {});
  const bar = scoreBar(wrapEl, 'Score');
  container.appendChild(wrapEl);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrapEl.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, size, size);

  let snakeBody = [[Math.floor(cells / 2), Math.floor(cells / 2)]];
  let dir = [1, 0], nextDir = [1, 0];
  let food = spawnFood();
  let bad = poison ? spawnFood() : null;
  let score = 0, over = false;

  function spawnFood() {
    let pos;
    do { pos = [randInt(0, cells - 1), randInt(0, cells - 1)]; }
    while (snakeBody.some((s) => s[0] === pos[0] && s[1] === pos[1]));
    return pos;
  }

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#e8a33d';
    snakeBody.forEach(([x, y], i) => { ctx.globalAlpha = i === 0 ? 1 : 0.85; ctx.fillRect(x * px, y * px, px - 1, px - 1); });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#3d8b8b'; ctx.fillRect(food[0] * px, food[1] * px, px - 1, px - 1);
    if (bad) { ctx.fillStyle = '#b8503c'; ctx.fillRect(bad[0] * px, bad[1] * px, px - 1, px - 1); }
  }

  function step() {
    if (over) return;
    dir = nextDir;
    let [hx, hy] = snakeBody[0];
    hx += dir[0]; hy += dir[1];
    if (wrap) { hx = (hx + cells) % cells; hy = (hy + cells) % cells; }
    else if (hx < 0 || hy < 0 || hx >= cells || hy >= cells) return end();
    if (snakeBody.some((s) => s[0] === hx && s[1] === hy)) return end();
    snakeBody.unshift([hx, hy]);
    if (hx === food[0] && hy === food[1]) {
      score++; bar.setScore(score); food = spawnFood();
      if (poison && Math.random() < 0.4) bad = spawnFood();
    } else if (bad && hx === bad[0] && hy === bad[1]) {
      snakeBody.splice(-2, 2);
      if (snakeBody.length < 1) return end();
      bad = null;
    } else {
      snakeBody.pop();
    }
    draw();
  }

  function end() {
    over = true;
    const best = store.bestScore('snake-' + cells + wrap + poison, score);
    bar.setBest(best);
    overlay(canvasWrap, 'Game over', `Score: ${score} · Best: ${best}`);
  }

  const keyMap = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
  const offKey = onKey((key) => {
    const d = keyMap[key];
    if (!d) return;
    if (d[0] === -dir[0] && d[1] === -dir[1]) return;
    nextDir = d;
  });
  const swipeMap = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const offSwipe = onSwipe(canvasWrap, (d) => {
    const v = swipeMap[d];
    if (v[0] === -dir[0] && v[1] === -dir[1]) return;
    nextDir = v;
  });

  bar.setBest(store.get('best:snake-' + cells + wrap + poison, 0));
  draw();
  const stopTick = tickLoop(step, speed);

  return { destroy() { offKey(); offSwipe(); stopTick(); } };
}
