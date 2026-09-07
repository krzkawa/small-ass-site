import { el, makeGrid, overlay, randInt } from '../engine.js';

const EMOJI = ['🐸','🐱','🐶','🦊','🐼','🐵','🐷','🐰','🐨','🦁','🐯','🐔','🐧','🐢','🐙','🦄','🐳','🦋','🌵','🍀','🍕','⭐','🎈','🎲'];

export default function slidingpuzzle(container, config) {
  const n = config.size || 4;
  const theme = config.theme === 'emoji' ? EMOJI : null;
  const total = n * n;
  let tiles = Array.from({ length: total - 1 }, (_, i) => i + 1).concat([0]);
  let over = false, moves = 0;

  function idx(r, c) { return r * n + c; }
  function blankIndex() { return tiles.indexOf(0); }

  function shuffleBoard() {
    let blank = total - 1;
    for (let i = 0; i < n * n * 40; i++) {
      const br = Math.floor(blank / n), bc = blank % n;
      const opts = [];
      if (br > 0) opts.push(blank - n);
      if (br < n - 1) opts.push(blank + n);
      if (bc > 0) opts.push(blank - 1);
      if (bc < n - 1) opts.push(blank + 1);
      const swap = opts[randInt(0, opts.length - 1)];
      [tiles[blank], tiles[swap]] = [tiles[swap], tiles[blank]];
      blank = swap;
    }
  }
  shuffleBoard();

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Slide tiles into order');
  wrap.appendChild(status);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, n, n, onClick);

  function label(v) { return v === 0 ? '' : (theme ? theme[v - 1] : v); }

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const v = tiles[idx(r, c)];
      cells[r][c].textContent = label(v);
      cells[r][c].classList.toggle('on', v === 0);
    }
  }

  function isSolved() {
    for (let i = 0; i < total - 1; i++) if (tiles[i] !== i + 1) return false;
    return true;
  }

  function onClick(r, c) {
    if (over) return;
    const i = idx(r, c), b = blankIndex();
    const br = Math.floor(b / n), bc = b % n;
    if (Math.abs(br - r) + Math.abs(bc - c) !== 1) return;
    [tiles[i], tiles[b]] = [tiles[b], tiles[i]];
    moves++;
    draw();
    status.textContent = `Moves: ${moves}`;
    if (isSolved()) { over = true; overlay(wrap, 'Solved!', `${moves} moves`); }
  }

  draw();
  return { destroy() {} };
}
