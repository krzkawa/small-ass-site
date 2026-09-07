import { el, overlay, choice } from '../engine.js';

const PUZZLES = {
  5: [
    ['01010', '11111', '11111', '01110', '00100'], // heart-ish
    ['00100', '01110', '10101', '00100', '01010'], // star-ish
    ['10001', '01010', '00100', '01010', '10001'], // bowtie/X
  ],
  8: [
    ['00111100', '01111110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000'],
    ['00011000', '00111100', '01111110', '11111111', '01111110', '00111100', '00011000', '00011000'],
  ],
  10: [
    ['0001111000', '0011111100', '0111111110', '1111111111', '1111111111', '1111111111', '0111111110', '0011111100', '0001111000', '0000110000'],
  ],
  12: [
    ['000001100000', '000011110000', '000111111000', '001111111100', '011111111110', '111111111111',
      '111111111111', '011111111110', '001111111100', '000111111000', '000011110000', '000001100000'],
  ],
  14: [
    ['00001111110000', '00001111110000', '00001111110000', '00001111110000', '00001111110000',
      '11111111111111', '11111111111111', '11111111111111', '11111111111111',
      '00001111110000', '00001111110000', '00001111110000', '00001111110000', '00001111110000'],
  ],
};

function clues(line) {
  const groups = line.split('0').filter((s) => s.length);
  return groups.length ? groups.map((g) => g.length) : [0];
}

export default function nonogram(container, config) {
  const size = config.size || 5;
  const pool = PUZZLES[size] || PUZZLES[5];
  const solution = choice(pool);
  const n = solution.length;
  const filled = Array.from({ length: n }, () => Array(n).fill(false));
  let over = false;

  const rowClues = solution.map((row) => clues(row));
  const colClues = [];
  for (let c = 0; c < n; c++) colClues.push(clues(solution.map((row) => row[c]).join('')));
  const maxRowClueLen = Math.max(...rowClues.map((c) => c.length));
  const maxColClueLen = Math.max(...colClues.map((c) => c.length));

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Click to fill cells matching the row/column counts');
  container.appendChild(wrap);
  const cellPx = size > 8 ? 26 : 32;
  const layout = el('div', { style: `display:grid;grid-template-columns:${maxRowClueLen * 18}px repeat(${n},${cellPx}px);gap:2px;margin-top:.6em` });
  wrap.append(status, layout);

  // top-left spacer
  layout.appendChild(el('div', { style: `height:${maxColClueLen * 16}px` }));
  for (let c = 0; c < n; c++) {
    layout.appendChild(el('div', {
      style: `display:flex;flex-direction:column;align-items:center;justify-content:flex-end;font-size:.7em;height:${maxColClueLen * 16}px;color:#8888a0`,
    }, colClues[c].join(' ')));
  }
  const cellNodes = [];
  for (let r = 0; r < n; r++) {
    layout.appendChild(el('div', { style: 'display:flex;align-items:center;justify-content:flex-end;font-size:.7em;color:#8888a0;padding-right:.3em' }, rowClues[r].join(' ')));
    cellNodes.push([]);
    for (let c = 0; c < n; c++) {
      const cell = el('div', {
        style: `width:${cellPx}px;height:${cellPx}px;background:#241d14;cursor:pointer;border-radius:2px`,
        onclick: () => toggle(r, c),
      });
      layout.appendChild(cell);
      cellNodes[r].push(cell);
    }
  }

  function toggle(r, c) {
    if (over) return;
    filled[r][c] = !filled[r][c];
    cellNodes[r][c].style.background = filled[r][c] ? '#39ff88' : '#241d14';
    checkWin();
  }

  function checkWin() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (filled[r][c] !== (solution[r][c] === '1')) return;
    over = true;
    overlay(wrap, 'Picture complete!', '');
  }

  return { destroy() {} };
}
