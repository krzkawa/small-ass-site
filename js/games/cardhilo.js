import { el, overlay, makeDeck, cardLabel, warRank, scoreBar, store } from '../engine.js';

export default function cardhilo(container, config) {
  const endless = config.mode !== 'streak';
  let deck = makeDeck();
  let current = deck.pop();
  let score = 0, over = false;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Streak');
  const status = el('div', { class: 'overlay-sub' }, endless ? 'Guess higher or lower — deck reshuffles forever' : 'Guess higher or lower — survive the whole deck to win');
  const cardEl = el('div', { style: 'font-size:3em;margin:.6em 0' }, cardLabel(current));
  const btnRow = el('div', { style: 'display:flex;gap:.6em' });
  const higherBtn = el('button', { onclick: () => guess('higher') }, '▲ Higher');
  const lowerBtn = el('button', { onclick: () => guess('lower') }, '▼ Lower');

  function guess(dir) {
    if (over) return;
    if (!deck.length) { if (endless) deck = makeDeck(); else return win(); }
    const next = deck.pop();
    const cur = warRank(current.rank), nxt = warRank(next.rank);
    let correct;
    if (nxt === cur) correct = 'push';
    else correct = (dir === 'higher') === (nxt > cur) ? 'right' : 'wrong';

    if (correct === 'push') {
      status.textContent = `${cardLabel(next)} — tie, no change. Guess again!`;
    } else if (correct === 'right') {
      score++; bar.setScore(score);
      status.textContent = `${cardLabel(next)} — correct!`;
    } else {
      status.textContent = `${cardLabel(next)} — wrong!`;
      current = next;
      cardEl.textContent = cardLabel(current);
      return lose();
    }
    current = next;
    cardEl.textContent = cardLabel(current);
    if (!endless && !deck.length) win();
  }

  function lose() {
    over = true;
    const best = store.bestScore('cardhilo-' + config.mode, score);
    overlay(wrap, 'Wrong guess!', `Streak: ${score} · Best: ${best}`);
  }
  function win() {
    over = true;
    const best = store.bestScore('cardhilo-' + config.mode, score);
    overlay(wrap, 'You survived the whole deck!', `Streak: ${score} · Best: ${best}`);
  }

  wrap.append(bar.el, status, cardEl, el('div', { style: 'display:flex;gap:.6em' }, [higherBtn, lowerBtn]));
  container.appendChild(wrap);
  bar.setBest(store.get('best:cardhilo-' + config.mode, 0));

  return { destroy() {} };
}
