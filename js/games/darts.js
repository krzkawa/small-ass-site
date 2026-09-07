import { makeCanvas, el, overlay, scoreBar, rand } from '../engine.js';

const RINGS = [
  { r: 0.08, pts: 50, color: '#ff3ec8' },
  { r: 0.2, pts: 25, color: '#39ff88' },
  { r: 0.45, pts: 20, color: '#ff5566' },
  { r: 0.7, pts: 15, color: '#39ff88' },
  { r: 0.9, pts: 10, color: '#ff5566' },
  { r: 1.0, pts: 5, color: '#3ea1ff' },
];

function scoreAt(dist, R) {
  const frac = dist / R;
  for (const ring of RINGS) if (frac <= ring.r) return ring.pts;
  return 0;
}

export default function darts(container, config) {
  const mode = config.mode || 'practice';
  const size = 340, cx = size / 2, cy = size / 2, R = size / 2 - 10;
  const wrap = el('div', {});
  const bar = scoreBar(wrap, mode === 'practice' ? 'Total' : 'Score left');
  const status = el('div', { class: 'overlay-sub' }, mode === 'practice' ? '9 darts — click the board to throw, aim for the center' : `Reach exactly 0 from ${mode} · click to throw`);
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.append(bar.el, status, canvasWrap);
  const ctx = makeCanvas(canvasWrap, size, size);

  let remaining = mode === 'practice' ? 9 : parseInt(mode, 10);
  let turnScore = 0, dartsThisTurn = 0, over = false, lastHits = [], practiceTotal = 0;

  function draw() {
    ctx.fillStyle = '#181209'; ctx.fillRect(0, 0, size, size);
    for (let i = RINGS.length - 1; i >= 0; i--) {
      ctx.fillStyle = RINGS[i].color;
      ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.arc(cx, cy, RINGS[i].r * R, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    lastHits.forEach((h) => { ctx.beginPath(); ctx.arc(h.x, h.y, 3, 0, Math.PI * 2); ctx.fill(); });
  }

  function throwDart(x, y) {
    if (over) return;
    const jitter = 8;
    const tx = x + rand(-jitter, jitter), ty = y + rand(-jitter, jitter);
    const dist = Math.hypot(tx - cx, ty - cy);
    const pts = scoreAt(dist, R);
    lastHits.push({ x: tx, y: ty });
    if (lastHits.length > 30) lastHits.shift();
    draw();

    if (mode === 'practice') {
      remaining--;
      practiceTotal += pts;
      bar.setScore(practiceTotal);
      status.textContent = `Darts left: ${remaining} · last throw: ${pts}`;
      if (remaining <= 0) { over = true; overlay(wrap, 'Practice complete!', `Total: ${practiceTotal} points`); }
      return;
    }

    turnScore += pts; dartsThisTurn++;
    status.textContent = `This turn: ${turnScore} (dart ${dartsThisTurn}/3) · last throw: ${pts}`;
    if (dartsThisTurn === 3 || remaining - turnScore <= 0) {
      if (remaining - turnScore === 0) {
        remaining = 0; bar.setScore(remaining);
        over = true; overlay(wrap, 'Checkout! You win!', '');
        return;
      }
      if (remaining - turnScore < 0) {
        status.textContent = 'Bust! Turn score reset.';
      } else {
        remaining -= turnScore; bar.setScore(remaining);
      }
      turnScore = 0; dartsThisTurn = 0;
    }
  }

  canvasWrap.addEventListener('click', (e) => {
    const rect = canvasWrap.getBoundingClientRect();
    throwDart(e.clientX - rect.left, e.clientY - rect.top);
  });

  bar.setScore(remaining);
  draw();
  return { destroy() {} };
}
