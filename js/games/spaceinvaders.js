import { makeCanvas, el, onKey, loop, overlay, scoreBar, store, clamp } from '../engine.js';

export default function spaceinvaders(container, config) {
  const W = 400, H = 420;
  const rows = config.rows || 4, cols = 8;
  const baseSpeed = config.speed || 0.5;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  let enemies = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) enemies.push({ x: 30 + c * 42, y: 30 + r * 32, alive: true });
  let dir = 1, dropTimer = 0, enemySpeed = baseSpeed;
  let playerX = W / 2 - 15;
  let bullets = [], enemyBullets = [];
  let score = 0, over = false, lastShot = 0, lastEnemyShot = 0;
  const keys = {};

  const offKey = onKey((k, e) => { keys[k] = true; if (k === ' ') e.preventDefault(); });
  const offUp = (() => { const fn = (e) => { keys[e.key] = false; }; window.addEventListener('keyup', fn); return () => window.removeEventListener('keyup', fn); })();

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#8fae3d';
    enemies.forEach((e) => { if (e.alive) ctx.fillRect(e.x, e.y, 26, 18); });
    ctx.fillStyle = '#ffd23e';
    ctx.fillRect(playerX, H - 26, 30, 12);
    ctx.fillStyle = '#3ea1ff';
    bullets.forEach((b) => ctx.fillRect(b.x, b.y, 3, 10));
    ctx.fillStyle = '#ff5566';
    enemyBullets.forEach((b) => ctx.fillRect(b.x, b.y, 3, 10));
  }

  function update(dt) {
    if (over) return;
    if (keys.ArrowLeft) playerX -= 4.5; if (keys.ArrowRight) playerX += 4.5;
    playerX = clamp(playerX, 0, W - 30);
    const now = performance.now();
    if (keys[' '] && now - lastShot > 350) { bullets.push({ x: playerX + 14, y: H - 30 }); lastShot = now; }

    let edge = false;
    enemies.forEach((e) => { if (e.alive && (e.x <= 0 || e.x >= W - 26)) edge = true; });
    enemies.forEach((e) => { if (e.alive) e.x += dir * enemySpeed * (dt / 16); });
    if (edge) { dir *= -1; enemies.forEach((e) => { e.y += 14; }); }

    if (now - lastEnemyShot > 900) {
      const alive = enemies.filter((e) => e.alive);
      if (alive.length) { const s = alive[Math.floor(Math.random() * alive.length)]; enemyBullets.push({ x: s.x + 12, y: s.y + 18 }); lastEnemyShot = now; }
    }

    bullets.forEach((b) => (b.y -= 6));
    enemyBullets.forEach((b) => (b.y += 4));
    bullets = bullets.filter((b) => b.y > 0);
    enemyBullets = enemyBullets.filter((b) => b.y < H);

    for (const b of bullets) {
      for (const e of enemies) {
        if (e.alive && b.x > e.x && b.x < e.x + 26 && b.y > e.y && b.y < e.y + 18) {
          e.alive = false; b.y = -100; score += 10; bar.setScore(score);
        }
      }
    }
    for (const b of enemyBullets) {
      if (b.x > playerX && b.x < playerX + 30 && b.y > H - 26 && b.y < H - 14) return end(false);
    }
    if (enemies.some((e) => e.alive && e.y > H - 50)) return end(false);
    if (enemies.every((e) => !e.alive)) return end(true);
    draw();
  }

  function end(won) {
    over = true;
    const best = store.bestScore('invaders-' + rows, score);
    bar.setBest(best);
    overlay(canvasWrap, won ? 'You cleared the wave!' : 'Game over', `Score: ${score} · Best: ${best}`);
  }

  bar.setBest(store.get('best:invaders-' + rows, 0));
  draw();
  const stopLoop = loop((dt) => { update(dt); return !over; });

  return { destroy() { offKey(); offUp(); stopLoop(); } };
}
