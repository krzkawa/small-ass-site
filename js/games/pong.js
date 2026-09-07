import { makeCanvas, el, onKey, loop, overlay, clamp } from '../engine.js';

export default function pong(container, config) {
  const W = 480, H = 300;
  const mode = config.mode || 'ai-easy'; // 'ai-easy' | 'ai-hard' | '2p'
  const speedMul = config.ballSpeed || 1;
  const aiSpeed = (mode === 'ai-hard' ? 5.2 : 3.4) * Math.min(speedMul, 1.3);
  const wrap = el('div', {});
  container.appendChild(wrap);
  const info = el('div', { class: 'overlay-sub' }, mode === '2p' ? 'Left: W/S · Right: ↑/↓' : 'W/S or ↑/↓ to move · first to 5 wins');
  wrap.appendChild(info);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.appendChild(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  const paddleH = 60, paddleW = 10;
  let leftY = H / 2 - paddleH / 2, rightY = H / 2 - paddleH / 2;
  let ballX = W / 2, ballY = H / 2, ballVX = 3.4 * speedMul, ballVY = 2 * speedMul;
  let leftScore = 0, rightScore = 0, over = false;
  const keys = {};

  const offKey1 = onKey((k, e) => { keys[k] = true; if (['ArrowUp', 'ArrowDown'].includes(k)) e.preventDefault(); });
  const offUp = (() => { const fn = (e) => { keys[e.key] = false; }; window.addEventListener('keyup', fn); return () => window.removeEventListener('keyup', fn); })();

  function resetBall(dir) {
    ballX = W / 2; ballY = H / 2;
    ballVX = 3.4 * speedMul * dir; ballVY = (Math.random() * 2 - 1) * 2.5 * speedMul;
  }

  function draw() {
    // Classic single-color phosphor look -- the original arcade Pong had no color at all.
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#4a3a20'; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#e8a33d';
    ctx.fillRect(10, leftY, paddleW, paddleH);
    ctx.fillRect(W - 10 - paddleW, rightY, paddleW, paddleH);
    ctx.beginPath(); ctx.arc(ballX, ballY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.font = '20px monospace';
    ctx.fillText(leftScore, W / 2 - 40, 30);
    ctx.fillText(rightScore, W / 2 + 24, 30);
  }

  function update() {
    if (over) return;
    if (keys.w) leftY -= 4.5; if (keys.s) leftY += 4.5;
    if (mode === '2p') { if (keys.ArrowUp) rightY -= 4.5; if (keys.ArrowDown) rightY += 4.5; }
    else {
      const target = ballY - paddleH / 2;
      rightY += clamp(target - rightY, -aiSpeed, aiSpeed);
    }
    leftY = clamp(leftY, 0, H - paddleH);
    rightY = clamp(rightY, 0, H - paddleH);

    ballX += ballVX; ballY += ballVY;
    if (ballY < 6 || ballY > H - 6) ballVY *= -1;
    if (ballX < 10 + paddleW && ballY > leftY && ballY < leftY + paddleH && ballVX < 0) {
      ballVX *= -1.05; ballVY += (ballY - (leftY + paddleH / 2)) * 0.08;
    }
    if (ballX > W - 10 - paddleW && ballY > rightY && ballY < rightY + paddleH && ballVX > 0) {
      ballVX *= -1.05; ballVY += (ballY - (rightY + paddleH / 2)) * 0.08;
    }
    if (ballX < 0) { rightScore++; checkWin(); resetBall(1); }
    if (ballX > W) { leftScore++; checkWin(); resetBall(-1); }
    draw();
  }

  function checkWin() {
    if (leftScore >= 5 || rightScore >= 5) {
      over = true;
      const winner = leftScore > rightScore ? (mode === '2p' ? 'Left player' : 'You') : (mode === '2p' ? 'Right player' : 'Computer');
      overlay(canvasWrap, `${winner} wins!`, `${leftScore} — ${rightScore}`);
    }
  }

  draw();
  const stopLoop = loop(() => { update(); return !over; });

  return { destroy() { offKey1(); offUp(); stopLoop(); } };
}
