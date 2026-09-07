import { makeCanvas, el, onKey, loop, overlay, scoreBar, store, randInt } from '../engine.js';

export default function frogger(container, config) {
  const W = 360, H = 400, rows = 8, rowH = H / rows;
  const speedMul = { easy: 1, normal: 1.2, hard: 1.6, extreme: 2.1 }[config.speed] || 1;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Crossings');
  bar.el.appendChild(el('span', { class: 'sep' }, '  lives: '));
  const livesEl = el('span', { class: 'best-val' }, '3');
  bar.el.appendChild(livesEl);
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.append(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  const lanes = [];
  for (let r = 1; r < rows - 1; r++) {
    const dir = r % 2 === 0 ? 1 : -1;
    const speed = (0.6 + Math.random() * 1.2) * speedMul * dir;
    const gap = randInt(110, 170);
    const cars = [];
    for (let x = 0; x < W; x += gap) cars.push({ x: x + randInt(0, 40), w: randInt(30, 46) });
    lanes.push({ speed, cars });
  }

  let frogX = W / 2 - 10, frogRow = rows - 1, score = 0, lives = 3, over = false;

  function resetFrog() { frogX = W / 2 - 10; frogRow = rows - 1; }

  const dirKeys = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  const offKey = onKey((key, e) => {
    if (over) return;
    const d = dirKeys[key];
    if (!d) return;
    e.preventDefault();
    frogX = Math.max(0, Math.min(W - 20, frogX + d[0] * 24));
    frogRow = Math.max(0, Math.min(rows - 1, frogRow + d[1]));
    if (frogRow === 0) {
      score++; bar.setScore(score);
      resetFrog();
    }
  });

  function draw() {
    ctx.fillStyle = '#181209'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#123a1a'; ctx.fillRect(0, 0, W, rowH);
    ctx.fillStyle = '#222'; ctx.fillRect(0, rowH, W, rowH * (rows - 2));
    lanes.forEach((lane, i) => {
      const y = (i + 1) * rowH;
      ctx.fillStyle = '#ffd23e';
      lane.cars.forEach((car) => ctx.fillRect(car.x, y + rowH * 0.2, car.w, rowH * 0.6));
    });
    ctx.fillStyle = '#7a9e4a';
    ctx.fillRect(frogX, frogRow * rowH + rowH * 0.15, 20, rowH * 0.7);
  }

  function update() {
    if (over) return;
    lanes.forEach((lane) => {
      lane.cars.forEach((car) => {
        car.x += lane.speed;
        if (lane.speed > 0 && car.x > W) car.x = -car.w;
        if (lane.speed < 0 && car.x < -car.w) car.x = W;
      });
    });
    if (frogRow > 0 && frogRow < rows - 1) {
      const lane = lanes[frogRow - 1];
      for (const car of lane.cars) {
        if (frogX + 20 > car.x && frogX < car.x + car.w) { hitCar(); break; }
      }
    }
    draw();
  }

  function hitCar() {
    lives--; livesEl.textContent = lives;
    resetFrog();
    if (lives <= 0) end();
  }

  function end() {
    over = true;
    const best = store.bestScore('frogger-' + config.speed, score);
    bar.setBest(best);
    overlay(canvasWrap, 'Game over', `Crossings: ${score} · Best: ${best}`);
  }

  bar.setBest(store.get('best:frogger-' + config.speed, 0));
  draw();
  const stopLoop = loop(() => { update(); return !over; });

  return { destroy() { offKey(); stopLoop(); } };
}
