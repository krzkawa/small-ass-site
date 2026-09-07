import { el, overlay, makeDeck, scoreBar, choice } from '../engine.js';

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function gofish(container, config) {
  const numAI = config.opponents || 1;
  const deck = makeDeck();
  const players = [{ name: 'You', hand: [], books: 0, human: true }];
  for (let i = 0; i < numAI; i++) players.push({ name: `AI ${i + 1}`, hand: [], books: 0, human: false });
  players.forEach((p) => { for (let i = 0; i < 7; i++) p.hand.push(deck.pop()); });
  const ocean = deck;
  let turn = 0, over = false, targetChoice = null, aiTimer = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Your books');
  const status = el('div', { class: 'overlay-sub' });
  const aiRow = el('div', { class: 'overlay-sub' });
  const handEl = el('div', { style: 'display:flex;gap:.4em;flex-wrap:wrap;margin:.6em 0;max-width:420px;justify-content:center' });
  const targetsEl = el('div', { style: 'display:flex;gap:.4em;margin-bottom:.4em' });
  wrap.append(bar.el, status, aiRow, targetsEl, handEl);
  container.appendChild(wrap);

  function countRanks(hand) {
    const counts = {};
    hand.forEach((c) => (counts[c.rank] = (counts[c.rank] || 0) + 1));
    return counts;
  }

  function checkBooks(p) {
    const counts = countRanks(p.hand);
    for (const rank of Object.keys(counts)) {
      if (counts[rank] === 4) { p.hand = p.hand.filter((c) => c.rank !== rank); p.books++; }
    }
  }

  function totalBooks() { return players.reduce((a, p) => a + p.books, 0); }

  function draw() {
    bar.setScore(players[0].books);
    aiRow.textContent = players.slice(1).map((p) => `${p.name}: ${p.hand.length} cards, ${p.books} books`).join('  ·  ');
    const counts = countRanks(players[0].hand);
    handEl.innerHTML = '';
    Object.keys(counts).sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b)).forEach((rank) => {
      handEl.appendChild(el('button', {
        disabled: turn !== 0 || over || targetChoice == null,
        onclick: () => askFor(rank),
      }, `${rank} ×${counts[rank]}`));
    });
    targetsEl.innerHTML = '';
    if (turn === 0 && !over) {
      if (players.length === 2) { targetChoice = 1; }
      else {
        players.slice(1).forEach((p, i) => {
          targetsEl.appendChild(el('button', { style: targetChoice === i + 1 ? 'outline:2px solid var(--accent)' : '', onclick: () => { targetChoice = i + 1; draw(); } }, `Ask ${p.name}`));
        });
      }
    }
  }

  function askFor(rank) {
    if (over || turn !== 0 || targetChoice == null) return;
    resolveAsk(0, targetChoice, rank);
  }

  function resolveAsk(askerIdx, targetIdx, rank) {
    const asker = players[askerIdx], target = players[targetIdx];
    const got = target.hand.filter((c) => c.rank === rank);
    let again;
    if (got.length) {
      target.hand = target.hand.filter((c) => c.rank !== rank);
      asker.hand.push(...got);
      status.textContent = `${asker.name} asked ${target.name} for ${rank}s and got ${got.length}!`;
      again = true;
    } else if (ocean.length) {
      const drawn = ocean.pop();
      asker.hand.push(drawn);
      status.textContent = `${asker.name} asked ${target.name} for ${rank}s — Go Fish!`;
      again = drawn.rank === rank;
    } else {
      status.textContent = `${asker.name} asked ${target.name} for ${rank}s — Go Fish! (ocean empty)`;
      again = false;
    }
    checkBooks(asker);
    if (totalBooks() >= 13) return endGame();
    targetChoice = null;
    if (!again) turn = (askerIdx + 1) % players.length;
    else turn = askerIdx;
    draw();
    if (turn !== 0 && !over) aiTimer = setTimeout(aiTurn, 700);
  }

  function aiTurn() {
    if (over || turn === 0) return;
    const asker = players[turn];
    if (!asker.hand.length) { turn = (turn + 1) % players.length; draw(); if (turn !== 0) aiTimer = setTimeout(aiTurn, 700); return; }
    const rank = choice(asker.hand).rank;
    const others = players.map((_, i) => i).filter((i) => i !== turn);
    const targetIdx = choice(others);
    resolveAsk(turn, targetIdx, rank);
  }

  function endGame() {
    over = true;
    const best = Math.max(...players.map((p) => p.books));
    const winners = players.filter((p) => p.books === best).map((p) => p.name);
    overlay(wrap, winners.includes('You') && winners.length === 1 ? 'You win!' : `${winners.join(', ')} win${winners.length > 1 ? '' : 's'}!`, players.map((p) => `${p.name}: ${p.books}`).join(' · '));
  }

  draw();
  return { destroy() { over = true; clearTimeout(aiTimer); } };
}
