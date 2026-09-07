import { makeCanvas, el, loop, overlay, scoreBar, store, randInt } from '../engine.js';

export default function flappy(container, config) {
  const W = 320, H = 420;
  const gap = config.gap || 130;
  const speed = config.speed || 2.4;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  let birdY = H / 2, vy = 0, over = false, started = false, score = 0;
  const pipes = [{ x: W, gapY: randInt(60, H - 60 - gap) }];

  function flap() {
    if (over) return restart();
    started = true;
    vy = -6.2;
  }

  function restart() {
    birdY = H / 2; vy = 0; over = false; started = false; score = 0;
    pipes.length = 0; pipes.push({ x: W, gapY: randInt(60, H - 60 - gap) });
    bar.setScore(0);
    ov && ov.remove();
  }

  canvasWrap.addEventListener('mousedown', flap);
  canvasWrap.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
  function onKeyDown(e) { if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); } }
  window.addEventListener('keydown', onKeyDown);

  function draw() {
    ctx.fillStyle = '#181209'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3d8b8b';
    pipes.forEach((p) => {
      ctx.fillRect(p.x, 0, 40, p.gapY);
      ctx.fillRect(p.x, p.gapY + gap, 40, H - p.gapY - gap);
    });
    ctx.fillStyle = '#ffd23e';
    ctx.beginPath(); ctx.arc(60, birdY, 10, 0, Math.PI * 2); ctx.fill();
  }

  let ov = null;
  function update() {
    if (!started) { draw(); return; }
    if (over) return;
    vy += 0.35; birdY += vy;
    pipes.forEach((p) => { p.x -= speed; });
    if (pipes[pipes.length - 1].x < W - 180) pipes.push({ x: W, gapY: randInt(40, H - 40 - gap) });
    if (pipes[0].x < -40) { pipes.shift(); score++; bar.setScore(score); }
    for (const p of pipes) {
      if (60 + 10 > p.x && 60 - 10 < p.x + 40) {
        if (birdY - 10 < p.gapY || birdY + 10 > p.gapY + gap) return end();
      }
    }
    if (birdY > H || birdY < 0) return end();
    draw();
  }

  function end() {
    over = true;
    const best = store.bestScore('flappy-' + gap, score);
    bar.setBest(best);
    ov = overlay(canvasWrap, 'You crashed!', `Score: ${score} · Best: ${best} · click to retry`);
  }

  bar.setBest(store.get('best:flappy-' + gap, 0));
  draw();
  const stopLoop = loop(() => { update(); return true; });

  return { destroy() { window.removeEventListener('keydown', onKeyDown); stopLoop(); } };
}
