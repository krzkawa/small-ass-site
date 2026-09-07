import { el, makeGrid, overlay, shuffle, scoreBar } from '../engine.js';

const EMOJI = ['🍎','🍌','🍇','🍒','🍉','🍋','🍓','🍑','🥝','🍍','🥕','🌽','🍄','🌶️','🥑','🍔','🍕','🍟','🍩','🍪','🎲','🎮','⚽','🏀','🚀','⭐','🌙','☀️','🐸','🐱','🐶','🦊'];
const SHAPES = ['🔺','🔷','⬛','⬤','🔶','🔻','🟢','🟣','🟡','🟠','⭐','💠','🔳','🔲','◼️','◾','🟥','🟦','🟩','🟨','🟧','🟪','⚫','⚪','🔘','💎','🔸','🔹','🔴','🔵','🟫','⬜'];
const NUMS = Array.from({ length: 32 }, (_, i) => String(i + 1));
const THEMES = { numbers: NUMS, shapes: SHAPES, emoji: EMOJI };

export default function memorymatch(container, config) {
  const rows = config.rows || 4, cols = config.cols || 4;
  const theme = THEMES[config.theme] || EMOJI;
  const timeLimit = config.timeLimit || 0;
  const total = rows * cols;
  const symbols = shuffle(theme.slice(0, total / 2).concat(theme.slice(0, total / 2)));

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Moves');
  const timeEl = el('span', { class: 'sep' }, timeLimit ? `  time: ${timeLimit}` : '');
  bar.el.appendChild(timeEl);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, rows, cols, onClick);

  let moves = 0, matched = 0, open = [], busy = false, over = false;
  let timeLeft = timeLimit, timerId = null;

  function label(r, c) { return r * cols + c; }

  function draw() {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = label(r, c);
      const cell = cells[r][c];
      const isOpen = open.includes(i) || cell.dataset.matched === '1';
      cell.textContent = isOpen ? symbols[i] : '❔';
      cell.classList.toggle('on', isOpen);
    }
  }

  function onClick(r, c) {
    if (over || busy) return;
    const i = label(r, c);
    if (open.includes(i) || cells[r][c].dataset.matched === '1') return;
    open.push(i);
    draw();
    if (open.length === 2) {
      moves++; bar.setScore(moves);
      busy = true;
      const [a, b] = open;
      if (symbols[a] === symbols[b]) {
        const ra = Math.floor(a / cols), ca = a % cols, rb = Math.floor(b / cols), cb = b % cols;
        cells[ra][ca].dataset.matched = '1';
        cells[rb][cb].dataset.matched = '1';
        matched += 2; open = []; busy = false;
        if (matched === total) win();
      } else {
        setTimeout(() => { open = []; busy = false; draw(); }, 650);
      }
    }
  }

  function win() {
    over = true;
    if (timerId) clearInterval(timerId);
    overlay(wrap, 'Matched them all!', `${moves} moves` + (timeLimit ? ` · ${timeLeft}s left` : ''));
  }

  function timeUp() {
    over = true;
    overlay(wrap, "Time's up!", `You matched ${matched / 2} of ${total / 2} pairs`);
  }

  if (timeLimit) {
    timerId = setInterval(() => {
      timeLeft--;
      timeEl.textContent = `  time: ${timeLeft}`;
      if (timeLeft <= 0) { clearInterval(timerId); if (!over) timeUp(); }
    }, 1000);
  }

  draw();
  return { destroy() { if (timerId) clearInterval(timerId); } };
}
