import { el, onKey, onSwipe, randInt, scoreBar, overlay, store } from '../engine.js';

const COLORS = { 2:'#2c2318',4:'#3a2c1c',8:'#4a3520',16:'#6b4a24',32:'#8a5c28',64:'#b8722c',128:'#d68a2e',256:'#e8a33d',512:'#f0b850',1024:'#f5cc6a',2048:'#ffe28a' };

export default function twenty48(container, config) {
  const n = config.size || 4;
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let score = 0, over = false;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  container.appendChild(wrap);
  const boardEl = el('div', { class: 'grid', style: `--cols:${n};--cell:${n > 5 ? 44 : 56}px` });
  wrap.appendChild(boardEl);
  const tiles = [];
  for (let r = 0; r < n; r++) {
    tiles.push([]);
    for (let c = 0; c < n; c++) {
      const t = el('div', { class: 'cell' });
      boardEl.appendChild(t);
      tiles[r].push(t);
    }
  }

  function addRandom() {
    const empties = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!board[r][c]) empties.push([r, c]);
    if (!empties.length) return;
    const [r, c] = empties[randInt(0, empties.length - 1)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function draw() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const v = board[r][c];
      tiles[r][c].textContent = v || '';
      tiles[r][c].style.background = v ? (COLORS[v] || '#ffd23e') : '';
      tiles[r][c].style.color = v >= 64 ? '#000' : '#e8e8f0';
    }
    bar.setScore(score);
  }

  function slideLine(line) {
    const vals = line.filter((v) => v);
    const out = [];
    let gained = 0;
    for (let i = 0; i < vals.length; i++) {
      if (vals[i] === vals[i + 1]) { out.push(vals[i] * 2); gained += vals[i] * 2; i++; }
      else out.push(vals[i]);
    }
    while (out.length < line.length) out.push(0);
    return { out, gained };
  }

  function move(dir) {
    if (over) return;
    let moved = false, gained = 0;
    const range = [...Array(n).keys()];
    if (dir === 'left' || dir === 'right') {
      for (const r of range) {
        let line = board[r].slice();
        if (dir === 'right') line.reverse();
        const res = slideLine(line);
        if (dir === 'right') res.out.reverse();
        if (res.out.some((v, i) => v !== board[r][i])) moved = true;
        board[r] = res.out; gained += res.gained;
      }
    } else {
      for (const c of range) {
        let line = range.map((r) => board[r][c]);
        if (dir === 'down') line.reverse();
        const res = slideLine(line);
        if (dir === 'down') res.out.reverse();
        for (const r of range) { if (board[r][c] !== res.out[r]) moved = true; board[r][c] = res.out[r]; }
        gained += res.gained;
      }
    }
    if (moved) {
      score += gained;
      addRandom();
      draw();
      checkOver();
    }
  }

  function canMove() {
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!board[r][c]) return true;
      if (c < n - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < n - 1 && board[r][c] === board[r + 1][c]) return true;
    }
    return false;
  }

  function checkOver() {
    if (!canMove()) {
      over = true;
      const best = store.bestScore('twenty48-' + n, score);
      bar.setBest(best);
      overlay(wrap, 'Game over', `Score: ${score} · Best: ${best}`);
    }
  }

  const offKey = onKey((key) => {
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
    if (map[key]) move(map[key]);
  });
  const offSwipe = onSwipe(wrap, move);

  bar.setBest(store.get('best:twenty48-' + n, 0));
  addRandom(); addRandom(); draw();

  return { destroy() { offKey(); offSwipe(); } };
}
