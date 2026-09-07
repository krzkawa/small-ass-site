import { el, overlay, randInt } from '../engine.js';

const PALETTE = ['#ff5566', '#39ff88', '#3ea1ff', '#ffd23e', '#ff3ec8', '#ff9a3e', '#8affff', '#c78bff'];

export default function mastermind(container, config) {
  const numColors = config.colors || 6;
  const slots = config.slots || 4;
  const maxGuesses = config.maxGuesses || 10;
  const colors = PALETTE.slice(0, numColors);
  const secret = Array.from({ length: slots }, () => randInt(0, numColors - 1));
  let current = Array(slots).fill(null);
  let guessNum = 0, over = false;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Guess the ${slots}-color code in ${maxGuesses} tries`);
  const palette = el('div', { style: 'display:flex;gap:.4em;margin:.6em 0;flex-wrap:wrap;justify-content:center' });
  const slotsEl = el('div', { style: 'display:flex;gap:.4em;margin-bottom:.6em' });
  const submitBtn = el('button', { onclick: submit }, 'Submit guess');
  const history = el('div', { style: 'display:flex;flex-direction:column;gap:.3em;max-height:220px;overflow:auto' });

  colors.forEach((color, i) => {
    const swatch = el('div', {
      style: `width:34px;height:34px;border-radius:50%;background:${color};cursor:pointer;border:2px solid #0006`,
      onclick: () => pick(i),
    });
    palette.appendChild(swatch);
  });

  function pegEl(colorIdx) {
    return el('div', { style: `width:30px;height:30px;border-radius:50%;background:${colorIdx == null ? '#241d14' : colors[colorIdx]};border:1px solid #0006` });
  }

  function drawSlots() {
    slotsEl.innerHTML = '';
    current.forEach((v) => slotsEl.appendChild(pegEl(v)));
  }

  function pick(colorIdx) {
    if (over) return;
    const empty = current.indexOf(null);
    const target = empty === -1 ? slots - 1 : empty;
    current[target] = colorIdx;
    drawSlots();
  }

  function feedback(guess) {
    let black = 0;
    const sUsed = Array(slots).fill(false), gUsed = Array(slots).fill(false);
    for (let i = 0; i < slots; i++) if (guess[i] === secret[i]) { black++; sUsed[i] = gUsed[i] = true; }
    let white = 0;
    for (let i = 0; i < slots; i++) {
      if (gUsed[i]) continue;
      for (let j = 0; j < slots; j++) {
        if (sUsed[j] || guess[i] !== secret[j]) continue;
        white++; sUsed[j] = true; break;
      }
    }
    return { black, white };
  }

  function submit() {
    if (over || current.includes(null)) return;
    guessNum++;
    const { black, white } = feedback(current);
    const row = el('div', { style: 'display:flex;gap:.5em;align-items:center;background:#1e1811;padding:.3em .6em;border-radius:6px' });
    const pegs = el('div', { style: 'display:flex;gap:.2em' });
    current.forEach((v) => pegs.appendChild(pegEl(v)));
    row.append(pegs, el('span', { class: 'overlay-sub' }, `⚫${black} ⚪${white}`));
    history.prepend(row);
    if (black === slots) {
      over = true;
      overlay(wrap, 'Cracked it!', `Solved in ${guessNum} guesses`);
    } else if (guessNum >= maxGuesses) {
      over = true;
      overlay(wrap, 'Out of guesses', `The code was ${secret.map((i) => colors[i]).join(', ')}`);
    }
    current = Array(slots).fill(null);
    drawSlots();
  }

  wrap.append(status, palette, slotsEl, submitBtn, history);
  container.appendChild(wrap);
  drawSlots();

  return { destroy() {} };
}
