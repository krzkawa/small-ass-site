import { el, overlay, store } from '../engine.js';

const ALL_COLORS = [
  { name: 'green', hex: '#39ff88' }, { name: 'red', hex: '#ff5566' },
  { name: 'yellow', hex: '#ffd23e' }, { name: 'blue', hex: '#3ea1ff' },
  { name: 'purple', hex: '#c78bff' }, { name: 'orange', hex: '#ff9a3e' },
];

export default function simon(container, config) {
  const numColors = config.colors || 4;
  const flashMs = config.speed || 500;
  const colors = ALL_COLORS.slice(0, numColors);
  let sequence = [], round = 0, over = false, playing = false, input = [], destroyed = false, nextTimer = null;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Watch the sequence, then repeat it');
  const pad = el('div', { style: `display:grid;grid-template-columns:repeat(${numColors > 4 ? 3 : 2},90px);gap:.5em;margin-top:.6em` });
  const pads = colors.map((c, i) => {
    const btn = el('div', { style: `width:90px;height:90px;border-radius:10px;background:${c.hex};opacity:.5;cursor:pointer`, onclick: () => onPad(i) });
    pad.appendChild(btn);
    return btn;
  });

  function flash(i, ms) {
    return new Promise((resolve) => {
      if (destroyed) return resolve();
      pads[i].style.opacity = 1;
      setTimeout(() => { if (!destroyed) pads[i].style.opacity = .5; resolve(); }, ms);
    });
  }

  async function playSequence() {
    playing = true;
    status.textContent = `Round ${round}`;
    await new Promise((r) => setTimeout(r, 500));
    for (const i of sequence) {
      if (destroyed) return;
      await flash(i, flashMs * 0.7); await new Promise((r) => setTimeout(r, flashMs * 0.3));
    }
    playing = false;
    input = [];
  }

  function nextRound() {
    if (destroyed) return;
    round++;
    sequence.push(Math.floor(Math.random() * numColors));
    playSequence();
  }

  function onPad(i) {
    if (over || playing) return;
    flash(i, 200);
    input.push(i);
    const idx = input.length - 1;
    if (sequence[idx] !== i) return lose();
    if (input.length === sequence.length) nextTimer = setTimeout(nextRound, 500);
  }

  function lose() {
    over = true;
    const best = store.bestScore('simon-' + numColors + flashMs, round - 1);
    overlay(wrap, 'Wrong!', `You reached round ${round} · best: ${best}`);
  }

  wrap.append(status, pad);
  container.appendChild(wrap);
  nextRound();

  return { destroy() { destroyed = true; over = true; clearTimeout(nextTimer); } };
}
