import { el, overlay, scoreBar, randInt } from '../engine.js';

export default function dotsandboxes(container, config) {
  const n = config.size || 4;
  const horiz = Array.from({ length: n + 1 }, () => Array(n).fill(null)); // owner or null
  const vert = Array.from({ length: n }, () => Array(n + 1).fill(null));
  const boxes = Array.from({ length: n }, () => Array(n).fill(null));
  let turn = 'you', over = false, aiTimer = null;
  const score = { you: 0, ai: 0 };

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'You');
  bar.el.appendChild(el('span', { class: 'sep' }, '  ai: '));
  const aiScoreEl = el('span', { class: 'best-val' }, '0');
  bar.el.appendChild(aiScoreEl);
  const status = el('div', { class: 'overlay-sub' }, 'Click a line to claim it');
  container.append(wrap);
  wrap.append(bar.el, status);

  const dot = n > 5 ? 7 : 9, edge = n > 5 ? 26 : 34;
  const template = Array.from({ length: 2 * n + 1 }, (_, i) => (i % 2 === 0 ? `${dot}px` : `${edge}px`)).join(' ');
  const board = el('div', { style: `display:grid;grid-template-columns:${template};grid-template-rows:${template};gap:2px;background:#000;padding:6px;border-radius:6px;margin-top:.6em` });
  wrap.appendChild(board);

  function boxEdges(br, bc) {
    return [horiz[br][bc], horiz[br + 1][bc], vert[br][bc], vert[br][bc + 1]];
  }
  function boxFilled(br, bc) { return boxEdges(br, bc).every((v) => v); }

  function claim(kind, r, c, owner) {
    if (kind === 'h') { if (horiz[r][c]) return false; horiz[r][c] = owner; }
    else { if (vert[r][c]) return false; vert[r][c] = owner; }
    let gained = 0;
    for (let br = 0; br < n; br++) for (let bc = 0; bc < n; bc++) {
      if (!boxes[br][bc] && boxFilled(br, bc)) { boxes[br][bc] = owner; score[owner]++; gained++; }
    }
    return gained;
  }

  function render() {
    board.innerHTML = '';
    for (let row = 0; row <= 2 * n; row++) {
      for (let col = 0; col <= 2 * n; col++) {
        const rowIsDot = row % 2 === 0, colIsDot = col % 2 === 0;
        let node;
        if (rowIsDot && colIsDot) {
          node = el('div', { style: 'background:#555;border-radius:50%' });
        } else if (rowIsDot && !colIsDot) {
          const r = row / 2, c = (col - 1) / 2;
          const owner = horiz[r][c];
          node = el('div', {
            style: `background:${owner ? (owner === 'you' ? 'var(--accent)' : 'var(--accent2)') : '#241d14'};cursor:pointer;border-radius:3px`,
            onclick: () => handleClick('h', r, c),
          });
        } else if (!rowIsDot && colIsDot) {
          const r = (row - 1) / 2, c = col / 2;
          const owner = vert[r][c];
          node = el('div', {
            style: `background:${owner ? (owner === 'you' ? 'var(--accent)' : 'var(--accent2)') : '#241d14'};cursor:pointer;border-radius:3px`,
            onclick: () => handleClick('v', r, c),
          });
        } else {
          const br = (row - 1) / 2, bc = (col - 1) / 2;
          const owner = boxes[br][bc];
          node = el('div', { style: `background:${owner ? (owner === 'you' ? '#123' : '#312') : 'transparent'};display:flex;align-items:center;justify-content:center;font-size:.7em;color:${owner === 'you' ? 'var(--accent)' : 'var(--accent2)'}` }, owner ? (owner === 'you' ? 'Y' : 'AI') : '');
        }
        board.appendChild(node);
      }
    }
    bar.setScore(score.you);
    aiScoreEl.textContent = score.ai;
  }

  function checkEnd() {
    if (score.you + score.ai === n * n) {
      over = true;
      const msg = score.you > score.ai ? 'You win!' : score.you < score.ai ? 'Computer wins!' : "It's a tie!";
      overlay(wrap, msg, `You ${score.you} — ${score.ai} Computer`);
      return true;
    }
    return false;
  }

  function handleClick(kind, r, c) {
    if (over || turn !== 'you') return;
    const gained = claim(kind, r, c, 'you');
    if (gained === false) return;
    render();
    if (checkEnd()) return;
    if (!gained) { turn = 'ai'; status.textContent = 'Computer thinking…'; aiTimer = setTimeout(aiTurn, 350); }
    else status.textContent = 'You scored — go again!';
  }

  function listEdges() {
    const list = [];
    for (let r = 0; r <= n; r++) for (let c = 0; c < n; c++) if (!horiz[r][c]) list.push(['h', r, c]);
    for (let r = 0; r < n; r++) for (let c = 0; c <= n; c++) if (!vert[r][c]) list.push(['v', r, c]);
    return list;
  }

  function wouldGiveAway(kind, r, c) {
    const save = kind === 'h' ? horiz[r][c] : vert[r][c];
    if (kind === 'h') horiz[r][c] = 'test'; else vert[r][c] = 'test';
    let bad = false;
    for (let br = 0; br < n && !bad; br++) for (let bc = 0; bc < n; bc++) {
      const filled = boxEdges(br, bc).filter((v) => v).length;
      if (filled === 3 && !boxFilled(br, bc)) { bad = true; break; }
    }
    if (kind === 'h') horiz[r][c] = save; else vert[r][c] = save;
    return bad;
  }

  function aiTurn() {
    if (over) return;
    const edges = listEdges();
    const completing = edges.filter(([k, r, c]) => {
      const save = k === 'h' ? horiz[r][c] : vert[r][c];
      if (k === 'h') horiz[r][c] = 'test'; else vert[r][c] = 'test';
      let completes = false;
      for (let br = 0; br < n && !completes; br++) for (let bc = 0; bc < n; bc++) if (boxFilled(br, bc) && !boxes[br][bc]) completes = true;
      if (k === 'h') horiz[r][c] = save; else vert[r][c] = save;
      return completes;
    });
    let choice;
    if (completing.length) choice = completing[randInt(0, completing.length - 1)];
    else {
      const safe = edges.filter(([k, r, c]) => !wouldGiveAway(k, r, c));
      choice = safe.length ? safe[randInt(0, safe.length - 1)] : edges[randInt(0, edges.length - 1)];
    }
    const [kind, r, c] = choice;
    const gained = claim(kind, r, c, 'ai');
    render();
    if (checkEnd()) return;
    if (gained) { status.textContent = 'Computer scored — going again…'; aiTimer = setTimeout(aiTurn, 400); }
    else { turn = 'you'; status.textContent = 'Your turn'; }
  }

  render();
  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
