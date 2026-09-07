import { makeCanvas, el, loop, overlay, scoreBar } from '../engine.js';

const LEVELS = [
  { start: [50, 150], hole: [350, 150], walls: [], par: 2 },
  { start: [40, 260], hole: [360, 40], walls: [{ x: 180, y: 0, w: 20, h: 200 }], par: 3 },
  { start: [40, 40], hole: [360, 260], walls: [{ x: 140, y: 60, w: 20, h: 240 }, { x: 260, y: 0, w: 20, h: 240 }], par: 4 },
  { start: [200, 280], hole: [200, 20], walls: [{ x: 0, y: 140, w: 260, h: 20 }, { x: 300, y: 140, w: 100, h: 20 }], par: 4 },
  { start: [30, 30], hole: [370, 270], walls: [{ x: 100, y: 0, w: 20, h: 220 }, { x: 200, y: 80, w: 20, h: 300 }, { x: 300, y: 0, w: 20, h: 220 }], par: 5 },
];

export default function golfputt(container, config) {
  const W = 400, H = 300;
  const level = LEVELS[(config.level || 1) - 1] || LEVELS[0];
  const holeR = 10, ballR = 6;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Strokes');
  bar.el.appendChild(el('span', { class: 'sep' }, `  par: ${level.par}`));
  container.appendChild(wrap);
  const canvasWrap = el('div', { style: 'position:relative' });
  wrap.append(canvasWrap);
  const ctx = makeCanvas(canvasWrap, W, H);

  let ball = { x: level.start[0], y: level.start[1], vx: 0, vy: 0 };
  let strokes = 0, over = false, aiming = false, aimTo = null;

  function moving() { return Math.hypot(ball.vx, ball.vy) > 0.05; }

  canvasWrap.addEventListener('mousedown', (e) => { if (!moving() && !over) { aiming = true; updateAim(e); } });
  canvasWrap.addEventListener('mousemove', (e) => { if (aiming) updateAim(e); });
  window.addEventListener('mouseup', () => { if (aiming) { putt(); aiming = false; } });
  function updateAim(e) {
    const rect = canvasWrap.getBoundingClientRect();
    aimTo = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function putt() {
    if (!aimTo) return;
    const dx = aimTo.x - ball.x, dy = aimTo.y - ball.y;
    ball.vx = dx * 0.09; ball.vy = dy * 0.09;
    strokes++; bar.setScore(strokes);
    aimTo = null;
  }

  function draw() {
    ctx.fillStyle = '#0b3d1f'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#5a3a1a';
    level.walls.forEach((wl) => ctx.fillRect(wl.x, wl.y, wl.w, wl.h));
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(level.hole[0], level.hole[1], holeR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ballR, 0, Math.PI * 2); ctx.fill();
    if (aiming && aimTo) {
      ctx.strokeStyle = '#ffd23e'; ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(aimTo.x, aimTo.y); ctx.stroke();
    }
  }

  function collideWalls() {
    const rects = [{ x: -10, y: -10, w: 10, h: H + 20 }, { x: W, y: -10, w: 10, h: H + 20 }, { x: -10, y: -10, w: W + 20, h: 10 }, { x: -10, y: H, w: W + 20, h: 10 }, ...level.walls];
    for (const r of rects) {
      if (ball.x + ballR > r.x && ball.x - ballR < r.x + r.w && ball.y + ballR > r.y && ball.y - ballR < r.y + r.h) {
        const overlapX = Math.min(ball.x + ballR - r.x, r.x + r.w - (ball.x - ballR));
        const overlapY = Math.min(ball.y + ballR - r.y, r.y + r.h - (ball.y - ballR));
        if (overlapX < overlapY) { ball.vx *= -0.8; ball.x += ball.vx > 0 ? overlapX : -overlapX; }
        else { ball.vy *= -0.8; ball.y += ball.vy > 0 ? overlapY : -overlapY; }
      }
    }
  }

  function update() {
    if (over) { draw(); return; }
    ball.x += ball.vx; ball.y += ball.vy;
    ball.vx *= 0.985; ball.vy *= 0.985;
    if (Math.hypot(ball.vx, ball.vy) < 0.05) { ball.vx = 0; ball.vy = 0; }
    collideWalls();
    if (Math.hypot(ball.x - level.hole[0], ball.y - level.hole[1]) < holeR && !moving()) {
      over = true;
      overlay(canvasWrap, 'In the hole!', `${strokes} strokes (par ${level.par})`);
    }
    draw();
  }

  draw();
  const stopLoop = loop(() => { update(); return true; });

  return { destroy() { stopLoop(); } };
}
