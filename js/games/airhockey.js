import { makeCanvas, el, loop, overlay, clamp, scoreBar } from '../engine.js';

export default function airhockey(container, config) {
  const W = 480, H = 300;
  const aiSpeed = { easy: 2.8, normal: 4, hard: 5.5, insane: 7 }[config.difficulty] || 2.8;
  const goalH = 90;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'You');
  bar.el.appendChild(el('span', { class: 'sep' }, '  computer: '));
  const aiScoreEl = el('span', { class: 'best-val' }, '0');
  bar.el.appendChild(aiScoreEl);
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.append(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  const you = { x: 60, y: H / 2 }, ai = { x: W - 60, y: H / 2 };
  const R = 16;
  let puck = { x: W / 2, y: H / 2, vx: 0, vy: 0 };
  let yourScore = 0, aiScore = 0, over = false;

  function onMove(e) {
    const rect = canvasWrap.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    you.x = clamp(clientX - rect.left, R, W / 2 - R);
    you.y = clamp(clientY - rect.top, R, H - R);
  }
  canvasWrap.addEventListener('mousemove', onMove);
  canvasWrap.addEventListener('touchmove', (e) => { e.preventDefault(); onMove(e); }, { passive: false });

  function resetPuck(dir) { puck = { x: W / 2, y: H / 2, vx: 3 * dir, vy: (Math.random() * 2 - 1) * 2 }; }
  resetPuck(1);

  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.strokeStyle = '#39ff88';
    ctx.beginPath(); ctx.moveTo(0, H / 2 - goalH / 2); ctx.lineTo(0, H / 2 + goalH / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W, H / 2 - goalH / 2); ctx.lineTo(W, H / 2 + goalH / 2); ctx.stroke();
    ctx.fillStyle = '#3ea1ff'; ctx.beginPath(); ctx.arc(you.x, you.y, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff5566'; ctx.beginPath(); ctx.arc(ai.x, ai.y, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.arc(puck.x, puck.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8e8f0'; ctx.font = '18px monospace';
    ctx.fillText(yourScore, W / 2 - 40, 26); ctx.fillText(aiScore, W / 2 + 26, 26);
  }

  function hitPaddle(paddle) {
    const dx = puck.x - paddle.x, dy = puck.y - paddle.y;
    const dist = Math.hypot(dx, dy);
    if (dist < R + 8) {
      const nx = dx / (dist || 1), ny = dy / (dist || 1);
      const speed = Math.hypot(puck.vx, puck.vy) + 1.2;
      puck.vx = nx * Math.max(speed, 4);
      puck.vy = ny * Math.max(speed, 4);
      puck.x = paddle.x + nx * (R + 9); puck.y = paddle.y + ny * (R + 9);
    }
  }

  function update() {
    if (over) return;
    ai.y += clamp(puck.y - ai.y, -aiSpeed, aiSpeed);
    ai.y = clamp(ai.y, R, H - R);
    puck.x += puck.vx; puck.y += puck.vy;
    puck.vx *= 0.995; puck.vy *= 0.995;
    if (puck.y < 8 || puck.y > H - 8) puck.vy *= -1;
    if (puck.x < 8) {
      if (Math.abs(puck.y - H / 2) < goalH / 2) { aiScore++; aiScoreEl.textContent = aiScore; checkEnd(); resetPuck(1); }
      else puck.vx *= -1;
    }
    if (puck.x > W - 8) {
      if (Math.abs(puck.y - H / 2) < goalH / 2) { yourScore++; bar.setScore(yourScore); checkEnd(); resetPuck(-1); }
      else puck.vx *= -1;
    }
    hitPaddle(you); hitPaddle(ai);
    draw();
  }

  function checkEnd() {
    if (yourScore >= 7 || aiScore >= 7) {
      over = true;
      overlay(canvasWrap, yourScore > aiScore ? 'You win!' : 'Computer wins!', `${yourScore} — ${aiScore}`);
    }
  }

  draw();
  const stopLoop = loop(() => { update(); return !over; });

  return { destroy() { stopLoop(); canvasWrap.removeEventListener('mousemove', onMove); } };
}
