import { el, overlay, choice } from '../engine.js';

const MOVES = ['rock', 'paper', 'scissors'];
const ICON = { rock: '🪨', paper: '📄', scissors: '✂️' };
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

export default function rps(container, config) {
  const target = Math.ceil((config.bestOf || 3) / 2);
  let you = 0, ai = 0, over = false;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `First to ${target} wins`);
  const scoreEl = el('div', { style: 'font-size:1.3em;margin:.4em 0' }, `You ${you} — ${ai} Computer`);
  const result = el('div', { style: 'font-size:2em;min-height:1.4em' });
  const buttons = el('div', { style: 'display:flex;gap:.6em' });

  MOVES.forEach((m) => {
    buttons.appendChild(el('button', { style: 'font-size:1.4em;padding:.5em .8em', onclick: () => play(m) }, ICON[m]));
  });

  function play(mine) {
    if (over) return;
    const theirs = choice(MOVES);
    let outcome;
    if (mine === theirs) outcome = 'draw';
    else if (BEATS[mine] === theirs) { outcome = 'win'; you++; }
    else { outcome = 'lose'; ai++; }
    result.textContent = `${ICON[mine]} vs ${ICON[theirs]} — ${outcome === 'draw' ? "It's a draw" : outcome === 'win' ? 'You win the round!' : 'Computer wins the round!'}`;
    scoreEl.textContent = `You ${you} — ${ai} Computer`;
    if (you >= target || ai >= target) {
      over = true;
      overlay(wrap, you > ai ? 'You win the match!' : 'Computer wins the match!', `${you} — ${ai}`);
    }
  }

  wrap.append(status, scoreEl, result, buttons);
  container.appendChild(wrap);

  return { destroy() {} };
}
