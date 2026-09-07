import { makeCanvas, el, onKey, loop, overlay, scoreBar, store, randInt, rand } from '../engine.js';

export default function asteroids(container, config) {
  const W = 420, H = 420;
  const tierSpeed = { normal: 1, hard: 1.6, insane: 2.4 }[config.difficulty] || 1;
  const tierCount = { normal: 4, hard: 6, insane: 9 }[config.difficulty] || 4;
  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  const ship = { x: W / 2, y: H / 2, a: -Math.PI / 2, vx: 0, vy: 0 };
  let bullets = [], rocks = [], score = 0, lives = 3, over = false;
  const keys = {};
  const offKey = onKey((k, e) => { keys[k] = true; if (k === ' ') e.preventDefault(); });
  const offUp = (() => { const fn = (e) => { keys[e.key] = false; }; window.addEventListener('keyup', fn); return () => window.removeEventListener('keyup', fn); })();

  function spawnRock(x, y, size) {
    const speed = tierSpeed + rand(0.3, 1);
    const ang = rand(0, Math.PI * 2);
    rocks.push({ x: x ?? rand(0, W), y: y ?? rand(0, H), vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, size: size || 3, spin: rand(-0.05, 0.05), rot: 0 });
  }
  for (let i = 0; i < tierCount; i++) spawnRock();

  function wrapPos(o) { if (o.x < 0) o.x += W; if (o.x > W) o.x -= W; if (o.y < 0) o.y += H; if (o.y > H) o.y -= H; }

  let lastShot = 0;
  function update() {
    if (over) return;
    if (keys.ArrowLeft) ship.a -= 0.07;
    if (keys.ArrowRight) ship.a += 0.07;
    if (keys.ArrowUp) { ship.vx += Math.cos(ship.a) * 0.12; ship.vy += Math.sin(ship.a) * 0.12; }
    ship.vx *= 0.99; ship.vy *= 0.99;
    ship.x += ship.vx; ship.y += ship.vy;
    wrapPos(ship);
    const now = performance.now();
    if (keys[' '] && now - lastShot > 260) {
      bullets.push({ x: ship.x, y: ship.y, vx: Math.cos(ship.a) * 5 + ship.vx, vy: Math.sin(ship.a) * 5 + ship.vy, life: 60 });
      lastShot = now;
    }
    bullets.forEach((b) => { b.x += b.vx; b.y += b.vy; b.life--; wrapPos(b); });
    bullets = bullets.filter((b) => b.life > 0);
    rocks.forEach((r) => { r.x += r.vx; r.y += r.vy; r.rot += r.spin; wrapPos(r); });

    for (const b of bullets) {
      for (const r of rocks) {
        const dx = b.x - r.x, dy = b.y - r.y;
        if (Math.hypot(dx, dy) < r.size * 10) {
          b.life = 0; r.dead = true; score += (4 - r.size) * 20; bar.setScore(score);
          if (r.size > 1) { spawnRock(r.x, r.y, r.size - 1); spawnRock(r.x, r.y, r.size - 1); }
        }
      }
    }
    bullets = bullets.filter((b) => b.life > 0);
    rocks = rocks.filter((r) => !r.dead);
    if (!rocks.length) for (let i = 0; i < tierCount; i++) spawnRock();

    for (const r of rocks) {
      if (Math.hypot(ship.x - r.x, ship.y - r.y) < r.size * 10 + 6) {
        lives--; ship.x = W / 2; ship.y = H / 2; ship.vx = 0; ship.vy = 0;
        if (lives <= 0) return end();
        break;
      }
    }
    draw();
  }

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.a);
    ctx.strokeStyle = '#e8a33d'; ctx.beginPath();
    ctx.moveTo(10, 0); ctx.lineTo(-8, 7); ctx.lineTo(-8, -7); ctx.closePath(); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#3ea1ff';
    bullets.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = '#ff9a3e';
    rocks.forEach((r) => {
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) { const ang = (i / 8) * Math.PI * 2; const rad = r.size * 10 * (0.8 + (i % 2) * 0.2); ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad); }
      ctx.closePath(); ctx.stroke(); ctx.restore();
    });
    ctx.fillStyle = '#8888a0'; ctx.font = '14px monospace'; ctx.fillText(`Lives: ${lives}`, W - 80, 16);
  }

  function end() {
    over = true;
    const best = store.bestScore('asteroids-' + config.difficulty, score);
    bar.setBest(best);
    overlay(canvasWrap, 'Ship destroyed', `Score: ${score} · Best: ${best}`);
  }

  bar.setBest(store.get('best:asteroids-' + config.difficulty, 0));
  draw();
  const stopLoop = loop(() => { update(); return !over; });

  return { destroy() { offKey(); offUp(); stopLoop(); } };
}
