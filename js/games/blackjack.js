import { el, overlay, makeDeck, cardLabel, cardValue, scoreBar, shuffle } from '../engine.js';

function handValue(hand) {
  let total = hand.reduce((sum, c) => sum + cardValue(c.rank), 0);
  let aces = hand.filter((c) => c.rank === 'A').length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function shoe(decks) {
  let cards = [];
  for (let i = 0; i < decks; i++) cards = cards.concat(makeDeck());
  return shuffle(cards);
}

export default function blackjack(container, config) {
  const decks = config.decks || 1;
  let deck = shoe(decks);
  let player = [], dealer = [], wins = 0, losses = 0, pushes = 0, over = false;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Wins');
  bar.el.appendChild(el('span', { class: 'sep' }, '  losses: '));
  const lossEl = el('span', { class: 'best-val' }, '0');
  bar.el.appendChild(lossEl);
  const dealerRow = el('div', { style: 'margin:.6em 0;font-size:1.4em' });
  const playerRow = el('div', { style: 'margin:.6em 0;font-size:1.4em' });
  const status = el('div', { class: 'overlay-sub' });
  const hitBtn = el('button', { onclick: hit }, 'Hit');
  const standBtn = el('button', { onclick: stand }, 'Stand');
  const nextBtn = el('button', { onclick: deal, class: 'hidden' }, 'Deal again');

  function draw(hideHoleCard) {
    dealerRow.textContent = 'Dealer: ' + dealer.map((c, i) => (i === 1 && hideHoleCard ? '🂠' : cardLabel(c))).join(' ') + (hideHoleCard ? '' : ` (${handValue(dealer)})`);
    playerRow.textContent = `You: ${player.map(cardLabel).join(' ')} (${handValue(player)})`;
  }

  function deal() {
    if (deck.length < 15) deck = shoe(decks);
    player = [deck.pop(), deck.pop()];
    dealer = [deck.pop(), deck.pop()];
    over = false;
    status.textContent = '';
    hitBtn.disabled = false; standBtn.disabled = false;
    nextBtn.classList.add('hidden');
    draw(true);
    if (handValue(player) === 21) stand();
  }

  function endRound(msg, outcome) {
    over = true;
    hitBtn.disabled = true; standBtn.disabled = true;
    nextBtn.classList.remove('hidden');
    if (outcome === 'win') wins++; else if (outcome === 'lose') losses++; else pushes++;
    bar.setScore(wins); lossEl.textContent = losses;
    draw(false);
    status.textContent = msg;
  }

  function hit() {
    if (over) return;
    player.push(deck.pop());
    draw(true);
    if (handValue(player) > 21) endRound('Bust! You lose.', 'lose');
  }

  function stand() {
    if (over) return;
    while (handValue(dealer) < 17) dealer.push(deck.pop());
    const p = handValue(player), d = handValue(dealer);
    if (d > 21 || p > d) endRound(`You win! ${p} vs ${d}`, 'win');
    else if (p < d) endRound(`Dealer wins. ${p} vs ${d}`, 'lose');
    else endRound(`Push. ${p} vs ${d}`, 'push');
  }

  wrap.append(bar.el, dealerRow, playerRow, status, el('div', { style: 'display:flex;gap:.5em;margin-top:.6em' }, [hitBtn, standBtn, nextBtn]));
  container.appendChild(wrap);
  deal();

  return { destroy() {} };
}
