import { el, overlay, makeDeck, cardLabel, warRank, scoreBar } from '../engine.js';

export default function war(container, config) {
  const reverse = !!config.reverse;
  const deck = makeDeck();
  let you = deck.slice(0, 26), ai = deck.slice(26), over = false;
  const pile = [];

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Your cards');
  bar.el.appendChild(el('span', { class: 'sep' }, '  computer: '));
  const aiCountEl = el('span', { class: 'best-val' }, '26');
  bar.el.appendChild(aiCountEl);
  const table = el('div', { style: 'font-size:1.8em;margin:.8em 0;min-height:1.4em' });
  const status = el('div', { class: 'overlay-sub' });
  const flipBtn = el('button', {}, 'Flip cards');

  function updateCounts() { bar.setScore(you.length); aiCountEl.textContent = ai.length; }

  function flip() {
    if (over) return;
    if (!you.length || !ai.length) return;
    const battle = [];
    const yourCard = you.shift(), aiCard = ai.shift();
    battle.push(yourCard, aiCard);
    table.textContent = `${cardLabel(yourCard)}  vs  ${cardLabel(aiCard)}`;
    resolve(yourCard, aiCard, battle);
  }

  function resolve(yourCard, aiCard, battle) {
    let yr = warRank(yourCard.rank), ar = warRank(aiCard.rank);
    if (reverse) { yr = -yr; ar = -ar; }
    if (yr > ar) { you.push(...battle); status.textContent = 'You win this round'; }
    else if (ar > yr) { ai.push(...battle); status.textContent = 'Computer wins this round'; }
    else {
      status.textContent = "War! Each side stakes 3 cards…";
      for (let i = 0; i < 3; i++) { if (you.length) battle.push(you.shift()); if (ai.length) battle.push(ai.shift()); }
      if (!you.length || !ai.length) { ai.push(...battle); }
      else {
        const y2 = you.shift(), a2 = ai.shift();
        battle.push(y2, a2);
        return resolve(y2, a2, battle);
      }
    }
    updateCounts();
    checkEnd();
  }

  function checkEnd() {
    if (!you.length || !ai.length) {
      over = true;
      overlay(wrap, you.length ? 'You win the whole deck!' : 'Computer wins the whole deck!', '');
    }
  }

  flipBtn.addEventListener('click', flip);
  wrap.append(bar.el, table, status, flipBtn);
  container.appendChild(wrap);
  updateCounts();

  return { destroy() {} };
}
