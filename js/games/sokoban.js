import { el, makeGrid, onKey, overlay } from '../engine.js';

const LEVELS = {
  1: ['#####', '#@$.#', '#####'],
  2: ['#####', '#.@.#', '#$_$#', '#___#', '#####'],
  3: ['#######', '#.@._.#', '#$_$_$#', '#_____#', '#######'],
  4: ['#########', '#.@._._.#', '#$_$_$_$#', '#_______#', '#########'],
  5: ['#######', '#___._#', '#_$@__#', '#_____#', '#######'],
  6: ['###########', '#.@._._._.#', '#$_$_$_$_$#', '#_________#', '###########'],
  7: ['#############', '#.@._._._._.#', '#$_$_$_$_$_$#', '#___________#', '#############'],
  8: ['###########', '#___.___._#', '#_$__@_$__#', '#_________#', '###########'],
  9: ['###############', '#.@._._._._._.#', '#$_$_$_$_$_$_$#', '#_____________#', '###############'],
  10: ['#################', '#.@._._._._._._.#', '#$_$_$_$_$_$_$_$#', '#_______________#', '#################'],
};

export default function sokoban(container, config) {
  const rows = LEVELS[config.level || 1];
  const R = rows.length, C = rows[0].length;
  const walls = [], targets = new Set();
  let boxes = new Set(), player = [0, 0];

  rows.forEach((row, r) => {
    for (let c = 0; c < C; c++) {
      const ch = row[c];
      walls.push([r, c, ch === '#']);
      if (ch === '.') targets.add(`${r},${c}`);
      if (ch === '$') boxes.add(`${r},${c}`);
      if (ch === '@') player = [r, c];
    }
  });
  const isWall = Array.from({ length: R }, () => Array(C).fill(false));
  walls.forEach(([r, c, w]) => { isWall[r][c] = w; });

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Push all boxes onto the targets · arrow keys');
  wrap.appendChild(status);
  container.appendChild(wrap);
  const { cells } = makeGrid(wrap, R, C, null);

  let over = false, moves = 0;

  function draw() {
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const key = `${r},${c}`;
      const cell = cells[r][c];
      cell.className = 'cell';
      let content = '';
      if (isWall[r][c]) { cell.style.background = '#000'; content = ''; }
      else {
        cell.style.background = '';
        const isTarget = targets.has(key);
        const hasBox = boxes.has(key);
        const isPlayer = player[0] === r && player[1] === c;
        if (isPlayer) content = isTarget ? '🧍' : '🙂';
        else if (hasBox) content = isTarget ? '✅' : '📦';
        else content = isTarget ? '❌' : '';
      }
      cell.textContent = content;
    }
  }

  function checkWin() {
    for (const t of targets) if (!boxes.has(t)) return false;
    return true;
  }

  const dirKeys = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1] };
  const offKey = onKey((key, e) => {
    if (over) return;
    const d = dirKeys[key];
    if (!d) return;
    e.preventDefault();
    const [pr, pc] = player;
    const nr = pr + d[0], nc = pc + d[1];
    if (isWall[nr]?.[nc] !== false) return;
    const nkey = `${nr},${nc}`;
    if (boxes.has(nkey)) {
      const br = nr + d[0], bc = nc + d[1];
      const bkey = `${br},${bc}`;
      if (isWall[br]?.[bc] !== false || boxes.has(bkey)) return;
      boxes.delete(nkey); boxes.add(bkey);
    }
    player = [nr, nc];
    moves++;
    draw();
    if (checkWin()) { over = true; status.textContent = `Solved in ${moves} moves`; overlay(wrap, 'Level complete!', `${moves} moves`); }
  });

  draw();
  return { destroy() { offKey(); } };
}
