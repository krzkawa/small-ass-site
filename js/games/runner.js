import { makeCanvas, el, loop, overlay, scoreBar, store, rand } from '../engine.js';

export default function runner(container, config) {
  const W = 480, H = 220;
  const tierMul = { normal: 1, hard: 1.3, insane: 1.7 }[config.difficulty] || 1;
  let speed = (config.speed || 4) * tierMul;
  const groundY = H - 30;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Distance');
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  const player = { x: 50, y: groundY, vy: 0, jumping: false };
  let obstacles = [{ x: W, w: 16, h: 30 }];
  let distance = 0, over = false, started = false;

  function jump() {
    if (over) return restart();
    started = true;
    if (!player.jumping) { player.vy = -9.5; player.jumping = true; }
  }
  function restart() {
    player.y = groundY; player.vy = 0; player.jumping = false;
    obstacles = [{ x: W, w: 16, h: 30 }];
    distance = 0; over = false; started = false; speed = (config.speed || 4) * tierMul;
    bar.setScore(0);
    ov && ov.remove();
  }
  canvasWrap.addEventListener('mousedown', jump);
  canvasWrap.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });
  function onKeyDown(e) { if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); } }
  window.addEventListener('keydown', onKeyDown);

  function draw() {
    ctx.fillStyle = '#181209'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(0, groundY + 20); ctx.lineTo(W, groundY + 20); ctx.stroke();
    ctx.fillStyle = '#e8a33d'; ctx.fillRect(player.x, player.y - 20, 20, 20);
    ctx.fillStyle = '#ff5566';
    obstacles.forEach((o) => ctx.fillRect(o.x, groundY + 20 - o.h, o.w, o.h));
  }

  let ov = null;
  function update() {
    if (!started) { draw(); return; }
    if (over) return;
    distance++;
    bar.setScore(Math.floor(distance / 5));
    speed += 0.0015;
    player.vy += 0.5; player.y += player.vy;
    if (player.y > groundY) { player.y = groundY; player.vy = 0; player.jumping = false; }
    obstacles.forEach((o) => (o.x -= speed));
    if (obstacles[obstacles.length - 1].x < W - rand(160, 280)) obstacles.push({ x: W, w: rand(14, 22), h: rand(24, 46) });
    obstacles = obstacles.filter((o) => o.x > -30);
    for (const o of obstacles) {
      if (player.x + 18 > o.x && player.x < o.x + o.w && player.y > groundY + 20 - o.h) return end();
    }
    draw();
  }

  function end() {
    over = true;
    const score = Math.floor(distance / 5);
    const best = store.bestScore('runner-' + config.difficulty, score);
    bar.setBest(best);
    ov = overlay(canvasWrap, 'You tripped!', `Distance: ${score} · Best: ${best} · click to retry`);
  }

  bar.setBest(store.get('best:runner-' + config.difficulty, 0));
  draw();
  const stopLoop = loop(() => { update(); return true; });

  return { destroy() { window.removeEventListener('keydown', onKeyDown); stopLoop(); } };
}
