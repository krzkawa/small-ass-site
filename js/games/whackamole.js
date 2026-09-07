import { el, makeGrid, overlay, randInt, scoreBar, store } from '../engine.js';

const DIFFICULTY = {
  zen: { up: 1300, down: 1000, duration: 40 },
  easy: { up: 950, down: 700, duration: 30 },
  normal: { up: 720, down: 560, duration: 30 },
  hard: { up: 520, down: 420, duration: 25 },
  insane: { up: 350, down: 300, duration: 20 },
  nightmare: { up: 240, down: 200, duration: 18 },
};

export default function whackamole(container, config) {
  const level = DIFFICULTY[config.difficulty] || DIFFICULTY.normal;
  const size = config.gridSize || 3;
  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  const timeEl = el('span', { class: 'sep' }, `  time: ${level.duration}`);
  bar.el.appendChild(timeEl);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, size, size, onHit);

  let score = 0, timeLeft = level.duration, over = false;
  let activeCell = null, upTimer = null;

  function popRandom() {
    if (over) return;
    if (activeCell) { activeCell.classList.remove('on'); activeCell.textContent = ''; }
    const flat = cells.flat();
    activeCell = flat[randInt(0, flat.length - 1)];
    activeCell.classList.add('on');
    activeCell.textContent = '🐹';
    activeCell.dataset.hit = '0';
    upTimer = setTimeout(popRandom, level.up);
  }

  function onHit(r, c) {
    if (over) return;
    const cell = cells[r][c];
    if (cell === activeCell && cell.dataset.hit === '0') {
      cell.dataset.hit = '1';
      score++; bar.setScore(score);
      cell.textContent = '💥';
      setTimeout(() => { if (cell === activeCell) cell.textContent = ''; }, 120);
    }
  }

  const countdown = setInterval(() => {
    timeLeft--;
    timeEl.textContent = `  time: ${timeLeft}`;
    if (timeLeft <= 0) endGame();
  }, 1000);

  function endGame() {
    if (over) return;
    over = true;
    clearInterval(countdown);
    clearTimeout(upTimer);
    const best = store.bestScore('whackamole-' + config.difficulty + '-' + size, score);
    bar.setBest(best);
    overlay(wrap, "Time's up!", `Score: ${score} · Best: ${best}`);
  }

  bar.setBest(store.get('best:whackamole-' + config.difficulty + '-' + size, 0));
  popRandom();

  return { destroy() { clearInterval(countdown); clearTimeout(upTimer); } };
}
