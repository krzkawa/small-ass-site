import { el, overlay, makeDeck, cardLabel, warRank, scoreBar } from '../engine.js';

function cardColor(card) { return card.red ? '#ff5566' : '#e8e8f0'; }
function cardBtn(card, onclick, extraStyle = '') {
  return el('button', { style: `font-size:1.1em;padding:.5em .6em;color:${cardColor(card)};${extraStyle}`, onclick }, cardLabel(card));
}

function acesUp(container) {
  const deck = makeDeck();
  const piles = [[deck.pop()], [deck.pop()], [deck.pop()], [deck.pop()]];
  const stock = deck;
  let selected = null, over = false;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, 'Discard a card if a higher card of the same suit shows elsewhere. Empty a pile, then move a card into it.');
  const pilesEl = el('div', { style: 'display:flex;gap:1em;margin:.8em 0' });
  const dealBtn = el('button', {}, `Deal round (${Math.ceil(stock.length / 4)} left)`);
  wrap.append(status, pilesEl, dealBtn);
  container.appendChild(wrap);

  function topsSameSuitHigher(pileIdx) {
    const card = piles[pileIdx][piles[pileIdx].length - 1];
    return piles.some((p, i) => i !== pileIdx && p.length && p[p.length - 1].suit === card.suit && warRank(p[p.length - 1].rank) > warRank(card.rank));
  }

  function draw() {
    pilesEl.innerHTML = '';
    piles.forEach((pile, i) => {
      const col = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:.3em;min-height:70px' });
      if (pile.length) {
        const top = pile[pile.length - 1];
        col.appendChild(cardBtn(top, () => onCardClick(i), selected === i ? 'outline:2px solid var(--accent)' : ''));
        col.appendChild(el('div', { class: 'overlay-sub' }, `${pile.length} card${pile.length > 1 ? 's' : ''}`));
      } else {
        col.appendChild(el('button', { style: 'width:60px;height:44px;opacity:.5', onclick: () => onEmptyClick(i) }, 'empty'));
      }
      pilesEl.appendChild(col);
    });
    dealBtn.textContent = `Deal round (${Math.ceil(stock.length / 4)} left)`;
    dealBtn.disabled = stock.length === 0;
  }

  function onCardClick(i) {
    if (over) return;
    if (selected === i) { selected = null; draw(); return; }
    if (topsSameSuitHigher(i)) {
      piles[i].pop();
      selected = null;
      draw();
      checkEnd();
      return;
    }
    if (piles.some((p) => p.length === 0)) { selected = i; draw(); return; }
    status.textContent = 'No higher same-suit card is showing — try another pile.';
  }

  function onEmptyClick(i) {
    if (over || selected === null || piles[selected].length === 0) return;
    piles[i].push(piles[selected].pop());
    selected = null;
    draw();
  }

  function checkEnd() {
    const totalCards = piles.reduce((a, p) => a + p.length, 0);
    const onlyAces = piles.every((p) => p.every((c) => c.rank === 'A'));
    if (stock.length === 0 && (onlyAces || !piles.some((_, i) => topsSameSuitHigher(i)))) {
      over = true;
      overlay(wrap, onlyAces && totalCards <= 4 ? 'You win! Only the Aces remain.' : 'No more moves', `${totalCards} cards remain`);
    }
  }

  dealBtn.addEventListener('click', () => {
    for (let i = 0; i < 4 && stock.length; i++) piles[i].push(stock.pop());
    draw();
    checkEnd();
  });

  draw();
  return { destroy() {} };
}

function golf(container) {
  const deck = makeDeck();
  const columns = Array.from({ length: 7 }, () => [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()]);
  const stock = deck;
  let foundation = stock.pop();
  let over = false;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Cards left');
  const status = el('div', { class: 'overlay-sub' }, 'Click a column\'s bottom card if it\'s one rank above or below the foundation');
  const foundationEl = el('div', { style: 'margin:.6em 0' });
  const colsEl = el('div', { style: 'display:flex;gap:.6em' });
  const drawBtn = el('button', {}, `Draw from stock (${stock.length})`);
  wrap.append(bar.el, status, foundationEl, colsEl, drawBtn);
  container.appendChild(wrap);

  function remaining() { return columns.reduce((a, c) => a + c.length, 0); }

  function draw() {
    foundationEl.innerHTML = '';
    foundationEl.appendChild(el('span', {}, 'Foundation: '));
    foundationEl.appendChild(cardBtn(foundation, () => {}, 'cursor:default'));
    colsEl.innerHTML = '';
    columns.forEach((col, i) => {
      const colEl = el('div', { style: 'display:flex;flex-direction:column;gap:2px' });
      col.forEach((card, ci) => {
        const isTop = ci === col.length - 1;
        colEl.appendChild(el('div', { style: `margin-top:${ci ? '-34px' : '0'}` }, isTop ? cardBtn(card, () => play(i)) : el('div', { style: `padding:.5em .6em;color:${cardColor(card)};background:#1e1811;border-radius:4px` }, cardLabel(card))));
      });
      if (!col.length) colEl.appendChild(el('div', { class: 'overlay-sub' }, 'empty'));
      colsEl.appendChild(colEl);
    });
    bar.setScore(remaining());
    drawBtn.textContent = `Draw from stock (${stock.length})`;
    drawBtn.disabled = stock.length === 0;
  }

  function play(i) {
    if (over) return;
    const col = columns[i];
    if (!col.length) return;
    const card = col[col.length - 1];
    if (Math.abs(warRank(card.rank) - warRank(foundation.rank)) === 1) {
      col.pop();
      foundation = card;
      draw();
      if (remaining() === 0) { over = true; overlay(wrap, 'You cleared the course!', ''); }
    } else {
      status.textContent = 'Not adjacent in rank — try drawing or another column.';
    }
  }

  drawBtn.addEventListener('click', () => {
    if (over || !stock.length) return;
    foundation = stock.pop();
    draw();
  });

  draw();
  return { destroy() {} };
}

function pyramid(container) {
  const deck = makeDeck();
  const rows = [];
  for (let r = 0; r < 7; r++) { const row = []; for (let p = 0; p <= r; p++) row.push(deck.pop()); rows.push(row); }
  const stock = deck;
  const waste = [];
  const removed = Array.from({ length: 7 }, (_, r) => Array(r + 1).fill(false));
  let selected = null, over = false;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Cards left');
  const status = el('div', { class: 'overlay-sub' }, 'Click two exposed cards that sum to 13 (King = 13 alone, A=1..Q=12)');
  const pyramidEl = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:2px' });
  const wasteRow = el('div', { style: 'display:flex;gap:.6em;margin-top:.6em;align-items:center' });
  const drawBtn = el('button', {}, `Draw (${stock.length})`);
  wrap.append(bar.el, status, pyramidEl, wasteRow);
  container.appendChild(wrap);

  function isExposed(r, p) {
    if (removed[r][p]) return false;
    if (r === 6) return true;
    return removed[r + 1][p] && removed[r + 1][p + 1];
  }
  function value(card) { return ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].indexOf(card.rank) + 1; }
  function remainingCount() { let n = 0; removed.forEach((row) => row.forEach((v) => { if (!v) n++; })); return n; }

  function draw() {
    pyramidEl.innerHTML = '';
    for (let r = 0; r < 7; r++) {
      const rowEl = el('div', { style: 'display:flex;gap:4px' });
      for (let p = 0; p <= r; p++) {
        if (removed[r][p]) { rowEl.appendChild(el('div', { style: 'width:44px' })); continue; }
        const exposed = isExposed(r, p);
        const card = rows[r][p];
        const btn = cardBtn(card, () => exposed && pick('pyramid', r, p), exposed ? (selected && selected.r === r && selected.p === p ? 'outline:2px solid var(--accent)' : '') : 'opacity:.35;pointer-events:none');
        btn.style.width = '44px';
        rowEl.appendChild(btn);
      }
      pyramidEl.appendChild(rowEl);
    }
    wasteRow.innerHTML = '';
    wasteRow.appendChild(drawBtn);
    if (waste.length) {
      const top = waste[waste.length - 1];
      wasteRow.appendChild(cardBtn(top, () => pick('waste'), selected && selected.waste ? 'outline:2px solid var(--accent)' : ''));
    }
    bar.setScore(remainingCount());
    drawBtn.textContent = `Draw (${stock.length})`;
  }

  function cardAt(sel) { return sel.waste ? waste[waste.length - 1] : rows[sel.r][sel.p]; }

  function pick(kind, r, p) {
    if (over) return;
    const sel = kind === 'waste' ? { waste: true } : { r, p };
    const card = cardAt(sel);
    if (value(card) === 13) { remove(sel); selected = null; draw(); checkWin(); return; }
    if (!selected) { selected = sel; draw(); return; }
    const other = cardAt(selected);
    if (value(card) + value(other) === 13) {
      remove(sel); remove(selected);
      selected = null; draw(); checkWin();
    } else {
      selected = (selected.waste === sel.waste && selected.r === sel.r && selected.p === sel.p) ? null : sel;
      draw();
    }
  }

  function remove(sel) {
    if (sel.waste) waste.pop();
    else removed[sel.r][sel.p] = true;
  }

  function checkWin() {
    if (remainingCount() === 0) { over = true; overlay(wrap, 'Pyramid cleared!', ''); }
  }

  drawBtn.addEventListener('click', () => {
    if (over) return;
    if (!stock.length) { stock.push(...waste.splice(0)); }
    if (stock.length) waste.push(stock.pop());
    draw();
  });

  draw();
  return { destroy() {} };
}

export default function solitaire(container, config) {
  const mode = config.mode || 'golf';
  if (mode === 'acesup') return acesUp(container);
  if (mode === 'pyramid') return pyramid(container);
  return golf(container);
}
