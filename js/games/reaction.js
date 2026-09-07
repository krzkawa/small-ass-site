import { el, overlay, choice, shuffle, store } from '../engine.js';

function simpleMode(container, api) {
  const box = el('div', { style: 'width:260px;height:180px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2em;cursor:pointer;background:#241d14;user-select:none' }, 'Wait for green…');
  container.appendChild(box);
  let state = 'idle', startTime = 0, timeoutId = null;

  function schedule() {
    state = 'waiting';
    box.style.background = '#ff5566';
    box.textContent = 'Wait for green…';
    timeoutId = setTimeout(() => {
      state = 'ready';
      box.style.background = '#39ff88';
      box.textContent = 'Click!';
      startTime = performance.now();
    }, 1000 + Math.random() * 2500);
  }

  box.addEventListener('click', () => {
    if (state === 'idle') { schedule(); return; }
    if (state === 'waiting') { clearTimeout(timeoutId); box.style.background = '#241d14'; box.textContent = 'Too soon! Click to retry'; state = 'idle'; return; }
    if (state === 'ready') {
      const ms = Math.round(performance.now() - startTime);
      const best = store.bestScore('reaction-simple', ms, false);
      box.style.background = '#241d14';
      box.textContent = `${ms} ms — best ${best} ms · click to retry`;
      state = 'idle';
    }
  });

  return { destroy() { clearTimeout(timeoutId); } };
}

function colorMode(container) {
  const COLORS = ['red', 'green', 'blue', 'yellow'];
  const HEX = { red: '#ff5566', green: '#39ff88', blue: '#3ea1ff', yellow: '#ffd23e' };
  let score = 0, over = false, timeoutId;
  const word = el('div', { style: 'font-size:2.4em;font-weight:bold;margin-bottom:.6em' });
  const buttons = el('div', { style: 'display:flex;gap:.5em' });
  const status = el('div', { class: 'overlay-sub' }, `Score: 0 — click the INK COLOR, not the word`);
  const wrap = el('div', {});
  COLORS.forEach((c) => buttons.appendChild(el('button', { style: `background:${HEX[c]};color:#000;width:60px`, onclick: () => pick(c) }, '')));
  let inkColor;
  function round() {
    const label = choice(COLORS);
    inkColor = choice(COLORS);
    word.textContent = label.toUpperCase();
    word.style.color = HEX[inkColor];
  }
  function pick(c) {
    if (over) return;
    if (c === inkColor) { score++; status.textContent = `Score: ${score}`; round(); }
    else { over = true; overlay(wrap, 'Wrong color!', `Final score: ${score}`); }
  }
  wrap.append(status, word, buttons);
  container.appendChild(wrap);
  round();
  return { destroy() { clearTimeout(timeoutId); } };
}

function sequenceMode(container) {
  let sequence = [], round = 1, over = false, timerId = null;
  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Memorize the numbers, then click them in order');
  const display = el('div', { style: 'font-size:1.8em;min-height:1.4em;letter-spacing:.3em' });
  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(3,60px);gap:.4em;margin-top:.6em' });
  let input = [];

  function nextRound() {
    round++; sequence.push(Math.floor(Math.random() * 9));
    showSequence();
  }
  function showSequence() {
    input = [];
    display.textContent = sequence.map((n) => n + 1).join(' ');
    grid.querySelectorAll('button').forEach((b) => (b.disabled = true));
    timerId = setTimeout(() => {
      display.textContent = '?'.repeat(sequence.length);
      grid.querySelectorAll('button').forEach((b) => (b.disabled = false));
    }, 900 + sequence.length * 400);
  }
  for (let i = 0; i < 9; i++) {
    grid.appendChild(el('button', { onclick: () => pick(i) }, String(i + 1)));
  }
  function pick(i) {
    if (over) return;
    input.push(i);
    const idx = input.length - 1;
    if (sequence[idx] !== i) { over = true; overlay(wrap, 'Wrong order!', `You reached round ${round}`); return; }
    if (input.length === sequence.length) timerId = setTimeout(nextRound, 500);
  }
  sequence.push(Math.floor(Math.random() * 9));
  wrap.append(status, display, grid);
  container.appendChild(wrap);
  showSequence();
  return { destroy() { over = true; clearTimeout(timerId); } };
}

export default function reaction(container, config, api) {
  const mode = config.mode || 'simple';
  if (mode === 'color') return colorMode(container);
  if (mode === 'sequence') return sequenceMode(container);
  return simpleMode(container, api);
}
