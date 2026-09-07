import { el, overlay, randInt, scoreBar } from '../engine.js';

function makeProblem(op) {
  let a, b, actualOp = op;
  if (op === 'mixed') actualOp = ['add', 'sub', 'mul', 'div'][randInt(0, 3)];
  switch (actualOp) {
    case 'add': a = randInt(2, 80); b = randInt(2, 80); return { text: `${a} + ${b}`, answer: a + b };
    case 'sub': a = randInt(2, 90); b = randInt(1, a); return { text: `${a} - ${b}`, answer: a - b };
    case 'mul': a = randInt(2, 12); b = randInt(2, 12); return { text: `${a} × ${b}`, answer: a * b };
    case 'div': b = randInt(2, 12); a = b * randInt(2, 12); return { text: `${a} ÷ ${b}`, answer: a / b };
    default: a = randInt(2, 20); b = randInt(2, 20); return { text: `${a} + ${b}`, answer: a + b };
  }
}

export default function mathblitz(container, config) {
  const op = config.op || 'add';
  let timeLeft = 60, score = 0, streak = 0, over = false, problem = makeProblem(op);

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  const timeEl = el('span', { class: 'sep' }, `  time: ${timeLeft}`);
  bar.el.appendChild(timeEl);
  const problemEl = el('div', { style: 'font-size:2.2em;margin:.6em 0' });
  const input = el('input', { type: 'number', style: 'font-size:1.3em;width:120px;text-align:center' });
  const submitBtn = el('button', {}, 'Submit');
  const streakEl = el('div', { class: 'overlay-sub' });

  function render() { problemEl.textContent = `${problem.text} = ?`; input.value = ''; input.focus(); }

  function submit() {
    if (over) return;
    const val = parseInt(input.value, 10);
    if (Number.isNaN(val)) return;
    if (val === problem.answer) { score++; streak++; bar.setScore(score); streakEl.textContent = `Streak: ${streak}`; }
    else { streak = 0; streakEl.textContent = `Wrong! It was ${problem.answer}`; }
    problem = makeProblem(op);
    render();
  }

  submitBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  const timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = `  time: ${timeLeft}`;
    if (timeLeft <= 0) {
      over = true;
      clearInterval(timerId);
      input.disabled = true;
      overlay(wrap, "Time's up!", `Final score: ${score}`);
    }
  }, 1000);

  wrap.append(bar.el, problemEl, el('div', { style: 'display:flex;gap:.5em' }, [input, submitBtn]), streakEl);
  container.appendChild(wrap);
  render();

  return { destroy() { clearInterval(timerId); } };
}
