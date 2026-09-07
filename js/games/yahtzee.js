import { el, overlay, randInt, scoreBar } from '../engine.js';

const CATS = [
  { key: 'ones', label: 'Ones', calc: (d) => d.filter((v) => v === 1).length * 1 },
  { key: 'twos', label: 'Twos', calc: (d) => d.filter((v) => v === 2).length * 2 },
  { key: 'threes', label: 'Threes', calc: (d) => d.filter((v) => v === 3).length * 3 },
  { key: 'fours', label: 'Fours', calc: (d) => d.filter((v) => v === 4).length * 4 },
  { key: 'fives', label: 'Fives', calc: (d) => d.filter((v) => v === 5).length * 5 },
  { key: 'sixes', label: 'Sixes', calc: (d) => d.filter((v) => v === 6).length * 6 },
  { key: 'threeKind', label: '3-of-a-kind', calc: (d) => (counts(d).some((c) => c >= 3) ? sum(d) : 0) },
  { key: 'fourKind', label: '4-of-a-kind', calc: (d) => (counts(d).some((c) => c >= 4) ? sum(d) : 0) },
  { key: 'fullHouse', label: 'Full House', calc: (d) => (counts(d).includes(3) && counts(d).includes(2) ? 25 : 0) },
  { key: 'smallStraight', label: 'Small Straight', calc: (d) => (hasStraight(d, 4) ? 30 : 0) },
  { key: 'largeStraight', label: 'Large Straight', calc: (d) => (hasStraight(d, 5) ? 40 : 0) },
  { key: 'yahtzee', label: 'Yahtzee', calc: (d) => (counts(d).some((c) => c === 5) ? 50 : 0) },
  { key: 'chance', label: 'Chance', calc: (d) => sum(d) },
];

function sum(d) { return d.reduce((a, b) => a + b, 0); }
function counts(d) { const c = Array(7).fill(0); d.forEach((v) => c[v]++); return c.slice(1); }
function hasStraight(d, len) {
  const uniq = [...new Set(d)].sort((a, b) => a - b);
  let run = 1, best = 1;
  for (let i = 1; i < uniq.length; i++) { run = uniq[i] === uniq[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); }
  return best >= len;
}

export default function yahtzee(container) {
  let dice = [1, 1, 1, 1, 1], held = [false, false, false, false, false];
  let rollsLeft = 3, scored = {}, turn = 1, over = false;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Total');
  const status = el('div', { class: 'overlay-sub' }, `Turn ${turn}/13 · rolls left: ${rollsLeft}`);
  const diceRow = el('div', { style: 'display:flex;gap:.5em;margin:.6em 0' });
  const rollBtn = el('button', {}, 'Roll');
  const catList = el('div', { style: 'display:flex;flex-direction:column;gap:.25em;max-height:280px;overflow:auto;width:100%;max-width:320px' });

  const diceEls = dice.map((v, i) => el('div', {
    style: 'width:44px;height:44px;background:#241d14;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.3em;cursor:pointer',
    onclick: () => toggleHold(i),
  }, String(v)));
  diceEls.forEach((d) => diceRow.appendChild(d));

  function toggleHold(i) {
    if (rollsLeft === 3 || over) return;
    held[i] = !held[i];
    diceEls[i].style.outline = held[i] ? '2px solid var(--accent)' : 'none';
  }

  function rollDice() {
    if (rollsLeft <= 0 || over) return;
    dice = dice.map((v, i) => (held[i] ? v : randInt(1, 6)));
    diceEls.forEach((el2, i) => (el2.textContent = String(dice[i])));
    rollsLeft--;
    status.textContent = `Turn ${turn}/13 · rolls left: ${rollsLeft}`;
    drawCats();
  }

  function drawCats() {
    catList.innerHTML = '';
    CATS.forEach((cat) => {
      const done = cat.key in scored;
      const preview = done ? scored[cat.key] : cat.calc(dice);
      const row = el('div', {
        style: `display:flex;justify-content:space-between;padding:.3em .6em;border-radius:4px;background:${done ? '#1e1811' : '#241d14'};cursor:${done ? 'default' : 'pointer'}`,
        onclick: () => !done && scoreCategory(cat),
      });
      row.append(el('span', {}, cat.label), el('span', {}, String(preview)));
      catList.appendChild(row);
    });
  }

  function scoreCategory(cat) {
    if (over) return;
    scored[cat.key] = cat.calc(dice);
    const total = Object.values(scored).reduce((a, b) => a + b, 0);
    bar.setScore(total);
    if (Object.keys(scored).length === CATS.length) { over = true; overlay(wrap, 'Scorecard complete!', `Final score: ${total}`); return; }
    turn++;
    rollsLeft = 3;
    held = held.map(() => false);
    diceEls.forEach((el2) => (el2.style.outline = 'none'));
    status.textContent = `Turn ${turn}/13 · rolls left: ${rollsLeft}`;
    drawCats();
  }

  rollBtn.addEventListener('click', rollDice);
  wrap.append(bar.el, status, diceRow, rollBtn, catList);
  container.appendChild(wrap);
  drawCats();

  return { destroy() {} };
}
