import { el, overlay, randInt } from '../engine.js';

export default function nim(container, config) {
  const misere = !!config.misere;
  const piles = (config.piles || [3, 5, 7]).slice();
  let over = false, turn = 'you', aiTimer = null;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, misere
    ? 'Misère Nim: take the LAST object and you LOSE'
    : 'Take the last object to WIN');
  const pilesEl = el('div', { style: 'display:flex;flex-direction:column;gap:.5em;margin:1em 0' });
  const controls = el('div', { style: 'display:flex;gap:.5em;align-items:center' });
  const amountInput = el('input', { type: 'number', min: '1', value: '1', style: 'width:70px' });
  const takeBtn = el('button', {}, 'Take');
  let selectedPile = 0;

  function drawPiles() {
    pilesEl.innerHTML = '';
    piles.forEach((count, i) => {
      const row = el('div', {
        style: `display:flex;gap:.3em;align-items:center;padding:.3em;border-radius:6px;cursor:pointer;background:${i === selectedPile ? '#2e2e4d' : 'transparent'}`,
        onclick: () => { selectedPile = i; drawPiles(); },
      });
      row.appendChild(el('span', { class: 'overlay-sub' }, `Pile ${i + 1}: `));
      for (let k = 0; k < count; k++) row.appendChild(el('span', {}, '🔵'));
      pilesEl.appendChild(row);
    });
  }

  function totalRemaining() { return piles.reduce((a, b) => a + b, 0); }

  function endIfDone() {
    if (totalRemaining() === 0) {
      over = true;
      const humanTookLast = turn === 'ai';
      const humanWins = misere ? !humanTookLast : humanTookLast;
      overlay(wrap, humanWins ? 'You win!' : 'Computer wins!', '');
      return true;
    }
    return false;
  }

  function take(pileIdx, amount) {
    if (over || amount < 1 || amount > piles[pileIdx]) return false;
    piles[pileIdx] -= amount;
    drawPiles();
    return true;
  }

  function aiMove() {
    if (over) return;
    let xorAll = piles.reduce((a, b) => a ^ b, 0);
    let pileIdx = -1, amount = 1;
    if (misere) {
      const nonTrivial = piles.filter((p) => p > 1).length;
      if (nonTrivial === 0) {
        // Only 0/1 piles left: leave an odd number of 1-piles for the opponent.
        const ones = piles.reduce((a, p) => a + (p === 1 ? 1 : 0), 0);
        pileIdx = piles.findIndex((p) => p > 0);
        amount = piles[pileIdx];
        if (ones % 2 === 0 && piles[pileIdx] === 1) amount = 1;
      }
    }
    if (pileIdx === -1) {
      if (xorAll === 0) {
        pileIdx = piles.findIndex((p) => p > 0);
        amount = 1;
      } else {
        for (let i = 0; i < piles.length; i++) {
          const target = piles[i] ^ xorAll;
          if (target < piles[i]) { pileIdx = i; amount = piles[i] - target; break; }
        }
      }
    }
    if (pileIdx === -1) { pileIdx = piles.findIndex((p) => p > 0); amount = 1; }
    take(pileIdx, amount);
    status.textContent = `Computer took ${amount} from pile ${pileIdx + 1}`;
    if (!endIfDone()) turn = 'you';
  }

  takeBtn.addEventListener('click', () => {
    if (over || turn !== 'you') return;
    const amount = parseInt(amountInput.value, 10) || 0;
    if (!take(selectedPile, amount)) return;
    if (endIfDone()) return;
    turn = 'ai';
    status.textContent = 'Computer thinking…';
    aiTimer = setTimeout(aiMove, 400);
  });

  controls.append(el('span', {}, 'Take: '), amountInput, takeBtn);
  wrap.append(status, pilesEl, controls);
  container.appendChild(wrap);
  drawPiles();

  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
