import { el, overlay } from '../engine.js';

export default function hanoi(container, config) {
  const disks = config.disks || 4;
  const pegs = [Array.from({ length: disks }, (_, i) => disks - i), [], []];
  let selected = null, moves = 0, over = false;
  const optimal = 2 ** disks - 1;

  const wrap = el('div', {});
  const status = el('div', { class: 'overlay-sub' }, `Move all disks to the last peg · optimal: ${optimal} moves`);
  const board = el('div', { style: 'display:flex;gap:1.5em;align-items:flex-end;justify-content:center;min-height:180px;margin:1em 0' });
  const pegEls = [0, 1, 2].map((i) => {
    const peg = el('div', {
      style: 'display:flex;flex-direction:column-reverse;align-items:center;gap:3px;width:140px;min-height:170px;border-top:4px solid #8888a0;padding-top:4px;cursor:pointer',
      onclick: () => onPeg(i),
    });
    return peg;
  });
  board.append(...pegEls);

  function colorFor(size) {
    const hue = (size * 47) % 360;
    return `hsl(${hue},70%,55%)`;
  }

  function draw() {
    pegEls.forEach((peg, i) => {
      peg.innerHTML = '';
      pegs[i].forEach((size) => {
        peg.appendChild(el('div', {
          style: `width:${30 + size * 16}px;height:20px;background:${colorFor(size)};border-radius:4px;`,
        }));
      });
    });
  }

  function onPeg(i) {
    if (over) return;
    if (selected === null) {
      if (pegs[i].length) selected = i;
    } else if (selected === i) {
      selected = null;
    } else {
      const disk = pegs[selected][pegs[selected].length - 1];
      const top = pegs[i][pegs[i].length - 1];
      if (top === undefined || disk < top) {
        pegs[i].push(pegs[selected].pop());
        moves++;
        status.textContent = `Moves: ${moves} · optimal: ${optimal}`;
        if (pegs[2].length === disks) {
          over = true;
          overlay(wrap, 'Solved!', `${moves} moves (optimal was ${optimal})`);
        }
      }
      selected = null;
    }
    draw();
  }

  wrap.append(status, board);
  container.appendChild(wrap);
  draw();

  return { destroy() {} };
}
