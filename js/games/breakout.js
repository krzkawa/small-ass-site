import { makeCanvas, el, onKey, loop, overlay, clamp, scoreBar, store } from '../engine.js';

export default function breakout(container, config) {
  const W = 480, H = 360;
  const level = config.level || 1;
  const speedMul = config.speed || 1;
  const rows = 3 + level, cols = 8;
  const brickW = W / cols, brickH = 16;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  const bricks = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (level === 3 && (r + c) % 3 === 0) continue; // sparser pattern for level 3
    bricks.push({ x: c * brickW, y: r * brickH + 30, alive: true, hue: (r * 40) % 360 });
  }

  const paddleW = 70, paddleH = 10;
  let paddleX = W / 2 - paddleW / 2;
  let ballX = W / 2, ballY = H - 40, ballVX = 2.6 * speedMul, ballVY = -3.2 * speedMul;
  let score = 0, lives = 3, over = false;
  const keys = {};
  const offKey = onKey((k) => { keys[k] = true; });
  const offUp = (() => { const fn = (e) => { keys[e.key] = false; }; window.addEventListener('keyup', fn); return () => window.removeEventListener('keyup', fn); })();
  function onMove(e) {
    const rect = canvasWrap.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    paddleX = clamp(clientX - rect.left - paddleW / 2, 0, W - paddleW);
  }
  canvasWrap.addEventListener('mousemove', onMove);
  canvasWrap.addEventListener('touchmove', onMove, { passive: true });

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    bricks.forEach((b) => { if (b.alive) { ctx.fillStyle = `hsl(${b.hue},70%,55%)`; ctx.fillRect(b.x + 1, b.y, brickW - 2, brickH - 3); } });
    ctx.fillStyle = '#e8a33d'; ctx.fillRect(paddleX, H - 20, paddleW, paddleH);
    ctx.fillStyle = '#3d8b8b'; ctx.beginPath(); ctx.arc(ballX, ballY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8888a0'; ctx.font = '14px monospace'; ctx.fillText(`Lives: ${lives}`, W - 80, 16);
  }

  function resetBall() { ballX = W / 2; ballY = H - 40; ballVX = 2.6 * speedMul * (Math.random() < 0.5 ? 1 : -1); ballVY = -3.2 * speedMul; }

  function update() {
    if (over) return;
    if (keys.ArrowLeft) paddleX -= 5.5; if (keys.ArrowRight) paddleX += 5.5;
    paddleX = clamp(paddleX, 0, W - paddleW);
    ballX += ballVX; ballY += ballVY;
    if (ballX < 6 || ballX > W - 6) ballVX *= -1;
    if (ballY < 6) ballVY *= -1;
    if (ballY > H - 26 && ballY < H - 14 && ballX > paddleX && ballX < paddleX + paddleW) {
      ballVY = -Math.abs(ballVY);
      ballVX += (ballX - (paddleX + paddleW / 2)) * 0.06;
    }
    for (const b of bricks) {
      if (!b.alive) continue;
      if (ballX > b.x && ballX < b.x + brickW && ballY - 6 < b.y + brickH && ballY + 6 > b.y) {
        b.alive = false; score += 10; bar.setScore(score); ballVY *= -1; break;
      }
    }
    if (ballY > H) {
      lives--;
      if (lives <= 0) { over = true; return endGame(); }
      resetBall();
    }
    if (bricks.every((b) => !b.alive)) { over = true; return endGame(true); }
    draw();
  }

  function endGame(won) {
    const best = store.bestScore('breakout-' + level, score);
    bar.setBest(best);
    overlay(canvasWrap, won ? 'Level cleared!' : 'Game over', `Score: ${score} · Best: ${best}`);
  }

  bar.setBest(store.get('best:breakout-' + level, 0));
  draw();
  const stopLoop = loop(() => { update(); return !over; });

  return { destroy() { offKey(); offUp(); stopLoop(); canvasWrap.removeEventListener('mousemove', onMove); canvasWrap.removeEventListener('touchmove', onMove); } };
}
