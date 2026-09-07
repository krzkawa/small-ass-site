import { el, overlay, randInt } from '../engine.js';

export default function numberguess(container, config) {
  const max = config.max || 100;
  const secret = randInt(1, max);
  const maxGuesses = Math.ceil(Math.log2(max)) + 2;
  let guesses = 0, over = false;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Guess a number between 1 and ${max} (${maxGuesses} tries)`);
  const input = el('input', { type: 'number', min: '1', max: String(max) });
  const btn = el('button', {}, 'Guess');
  const feedback = el('div', { style: 'font-size:1.2em;margin-top:.6em' });
  const history = el('div', { class: 'overlay-sub' });

  function submit() {
    if (over) return;
    const val = parseInt(input.value, 10);
    if (Number.isNaN(val)) return;
    guesses++;
    if (val === secret) {
      over = true;
      overlay(wrap, 'You got it!', `${secret} in ${guesses} guesses`);
    } else if (guesses >= maxGuesses) {
      over = true;
      overlay(wrap, 'Out of tries', `The number was ${secret}`);
    } else {
      feedback.textContent = val < secret ? '📈 Higher!' : '📉 Lower!';
      history.textContent += `${val} → ${val < secret ? 'higher' : 'lower'}  `;
    }
    input.value = '';
    input.focus();
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  wrap.append(status, el('div', { style: 'display:flex;gap:.5em;margin-top:.6em' }, [input, btn]), feedback, history);
  container.appendChild(wrap);
  input.focus();

  return { destroy() {} };
}
