import { el, overlay, choice } from '../engine.js';

const WORDS = {
  4: ['CAKE', 'STAR', 'MOON', 'FISH', 'GOLD', 'WIND', 'LEAF', 'RAIN', 'SNOW', 'BOLD'],
  5: ['CRANE', 'PLANT', 'BRAVE', 'STONE', 'GHOST', 'MUSIC', 'PLAZA', 'FROST', 'LIGHT', 'SHARP'],
  6: ['PLANET', 'GARDEN', 'BRIDGE', 'SPIRIT', 'CASTLE', 'WONDER', 'SILVER', 'PENCIL', 'MARBLE', 'JUNGLE'],
  7: ['JOURNEY', 'CRYSTAL', 'FREEDOM', 'MONSTER', 'RAINBOW', 'CAPTAIN', 'AIRPORT', 'PICTURE', 'THUNDER', 'DIAMOND'],
  8: ['MOUNTAIN', 'FESTIVAL', 'ELEPHANT', 'COMPUTER', 'SANDWICH', 'DAUGHTER', 'BUILDING', 'PRINCESS'],
};

export default function wordle(container, config) {
  const len = config.wordLength || 5;
  const list = WORDS[len] || WORDS[5];
  const secret = choice(list);
  const maxGuesses = 6;
  let row = 0, over = false, current = '';

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Guess the ${len}-letter word in ${maxGuesses} tries`);
  const board = el('div', { style: 'display:flex;flex-direction:column;gap:.3em;margin:.6em 0' });
  const rows = [];
  for (let r = 0; r < maxGuesses; r++) {
    const rowEl = el('div', { style: 'display:flex;gap:.3em' });
    const cells = [];
    for (let c = 0; c < len; c++) {
      const cell = el('div', { style: 'width:38px;height:38px;border:2px solid #333;display:flex;align-items:center;justify-content:center;font-size:1.2em;text-transform:uppercase' });
      rowEl.appendChild(cell); cells.push(cell);
    }
    board.appendChild(rowEl); rows.push(cells);
  }
  const input = el('input', { type: 'text', maxlength: String(len), style: 'text-transform:uppercase' });
  const submitBtn = el('button', {}, 'Guess');

  function submit() {
    if (over) return;
    const guess = input.value.trim().toUpperCase();
    if (guess.length !== len) return;
    const secretArr = secret.split(''), guessArr = guess.split('');
    const state = Array(len).fill('gray');
    for (let i = 0; i < len; i++) if (guessArr[i] === secretArr[i]) state[i] = 'green';
    // yellow pass, respecting how many of each letter remain after greens are removed

    const remaining = {};
    for (let i = 0; i < len; i++) if (state[i] !== 'green') remaining[secretArr[i]] = (remaining[secretArr[i]] || 0) + 1;
    for (let i = 0; i < len; i++) {
      if (state[i] === 'green') continue;
      const ch = guessArr[i];
      if (remaining[ch] > 0) { state[i] = 'yellow'; remaining[ch]--; }
    }
    const colors = { green: '#39ff88', yellow: '#ffd23e', gray: '#444' };
    rows[row].forEach((cell, i) => { cell.textContent = guessArr[i]; cell.style.background = colors[state[i]]; cell.style.borderColor = colors[state[i]]; cell.style.color = '#000'; });
    if (guess === secret) { over = true; overlay(wrap, 'You got it!', `${secret} in ${row + 1} guesses`); return; }
    row++;
    input.value = '';
    if (row >= maxGuesses) { over = true; overlay(wrap, 'Out of guesses', `The word was ${secret}`); }
  }

  submitBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  wrap.append(status, board, el('div', { style: 'display:flex;gap:.5em' }, [input, submitBtn]));
  container.appendChild(wrap);
  input.focus();

  return { destroy() {} };
}
