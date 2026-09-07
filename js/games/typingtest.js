import { el, overlay, choice } from '../engine.js';

const PASSAGES = [
  'The quick brown fox jumps over the lazy dog while the sun sets slowly behind the hills.',
  'Practice makes perfect when it comes to typing quickly and accurately on any keyboard.',
  'Retro games remind us that simple ideas executed well can be more fun than complex ones.',
  'A journey of a thousand miles begins with a single step taken in the right direction.',
  'Programming is the art of telling another human being what you want the computer to do.',
  'The five boxing wizards jump quickly to analyze every possible move on the chessboard.',
];

export default function typingtest(container, config) {
  const duration = config.duration || 60;
  const passage = choice(PASSAGES);
  let timeLeft = duration, over = false, started = false, timerId = null, startTime = 0;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Type the passage below · time left: ${timeLeft}s`);
  const textEl = el('div', { style: 'font-size:1.1em;line-height:1.6;max-width:500px;margin:.6em 0;font-family:monospace' });
  const input = el('textarea', { rows: '3', style: 'width:100%;max-width:500px;font-family:monospace;font-size:1em' });
  const stats = el('div', { style: 'margin-top:.6em' });

  function renderPassage(typed) {
    textEl.innerHTML = '';
    for (let i = 0; i < passage.length; i++) {
      const span = document.createElement('span');
      span.textContent = passage[i];
      if (i < typed.length) span.style.color = typed[i] === passage[i] ? '#39ff88' : '#ff5566';
      else span.style.color = '#8888a0';
      textEl.appendChild(span);
    }
  }

  function finish() {
    if (over) return;
    over = true;
    clearInterval(timerId);
    input.disabled = true;
    const typed = input.value;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === passage[i]) correct++;
    const minutes = Math.max((performance.now() - startTime) / 60000, 1 / 60);
    const wpm = Math.round((correct / 5) / minutes);
    const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 0;
    overlay(wrap, 'Time!', `${wpm} WPM · ${accuracy}% accuracy`);
  }

  input.addEventListener('input', () => {
    if (over) return;
    if (!started) { started = true; startTime = performance.now(); timerId = setInterval(tick, 1000); }
    renderPassage(input.value);
    if (input.value.length >= passage.length) finish();
  });

  function tick() {
    timeLeft--;
    status.textContent = `Type the passage below · time left: ${timeLeft}s`;
    if (timeLeft <= 0) finish();
  }

  wrap.append(status, textEl, input, stats);
  container.appendChild(wrap);
  renderPassage('');
  input.focus();

  return { destroy() { clearInterval(timerId); } };
}
