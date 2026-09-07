import { el, overlay, choice } from '../engine.js';

const WORDS = {
  animals: ['ELEPHANT', 'GIRAFFE', 'DOLPHIN', 'PENGUIN', 'KANGAROO', 'OCTOPUS', 'CHEETAH', 'HEDGEHOG'],
  countries: ['CANADA', 'BRAZIL', 'JAPAN', 'EGYPT', 'NORWAY', 'MEXICO', 'IRELAND', 'THAILAND'],
  movies: ['INCEPTION', 'AVATAR', 'GLADIATOR', 'JAWS', 'TITANIC', 'FROZEN', 'MATRIX', 'CASABLANCA'],
  code: ['FUNCTION', 'VARIABLE', 'COMPILER', 'ALGORITHM', 'RECURSION', 'DEBUGGER', 'JAVASCRIPT', 'ARRAY'],
  sports: ['BASKETBALL', 'VOLLEYBALL', 'MARATHON', 'GYMNASTICS', 'CRICKET', 'HOCKEY', 'SURFING', 'WRESTLING'],
  food: ['PANCAKE', 'SPAGHETTI', 'AVOCADO', 'SANDWICH', 'PRETZEL', 'BURRITO', 'LASAGNA', 'PINEAPPLE'],
  space: ['ASTEROID', 'SATELLITE', 'GALAXY', 'NEBULA', 'ASTRONAUT', 'TELESCOPE', 'METEOR', 'ECLIPSE'],
  mythology: ['MEDUSA', 'POSEIDON', 'PHOENIX', 'MINOTAUR', 'VALKYRIE', 'ODYSSEUS', 'CENTAUR', 'ORACLE'],
  occupations: ['ELECTRICIAN', 'ARCHITECT', 'SURGEON', 'PLUMBER', 'JOURNALIST', 'FIREFIGHTER', 'CARPENTER', 'PILOT'],
  weather: ['HURRICANE', 'BLIZZARD', 'THUNDER', 'DROUGHT', 'RAINBOW', 'TORNADO', 'MONSOON', 'FROST'],
  colors: ['TURQUOISE', 'MAROON', 'CRIMSON', 'LAVENDER', 'MAGENTA', 'INDIGO', 'AMBER', 'CHARCOAL'],
  vehicles: ['BICYCLE', 'HELICOPTER', 'SUBMARINE', 'MOTORCYCLE', 'TRACTOR', 'SCOOTER', 'FREIGHTER', 'GONDOLA'],
  superheroes: ['BATMAN', 'WOLVERINE', 'AQUAMAN', 'DAREDEVIL', 'HAWKEYE', 'CATWOMAN', 'HELLBOY', 'STORM'],
  instruments: ['TRUMPET', 'CLARINET', 'TROMBONE', 'ACCORDION', 'XYLOPHONE', 'BAGPIPES', 'MANDOLIN', 'CYMBAL'],
};
const STAGES = ['🙂', '😐', '😟', '😨', '😰', '😵', '💀'];

export default function hangman(container, config) {
  const list = WORDS[config.category] || WORDS.animals;
  const word = choice(list);
  const guessed = new Set();
  let wrong = 0, over = false;
  const maxWrong = 6;

  const wrap = el('div', {});
  const stageEl = el('div', { style: 'font-size:3em' }, STAGES[0]);
  const wordEl = el('div', { style: 'font-size:1.6em;letter-spacing:.3em;margin:.6em 0' });
  const status = el('div', { class: 'overlay-sub' }, `Category: ${config.category || 'animals'} · ${maxWrong} misses allowed`);
  const kb = el('div', { style: 'display:flex;flex-wrap:wrap;gap:.3em;max-width:420px;justify-content:center' });

  function drawWord() {
    wordEl.textContent = word.split('').map((ch) => (guessed.has(ch) ? ch : '_')).join(' ');
  }

  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((ch) => {
    const btn = el('button', { style: 'padding:.4em .6em', onclick: () => guess(ch, btn) }, ch);
    kb.appendChild(btn);
  });

  function guess(ch, btn) {
    if (over || guessed.has(ch)) return;
    guessed.add(ch);
    if (btn) btn.disabled = true;
    if (!word.includes(ch)) {
      wrong++;
      stageEl.textContent = STAGES[Math.min(wrong, maxWrong)];
      if (wrong >= maxWrong) return lose();
    }
    drawWord();
    if (word.split('').every((c) => guessed.has(c))) win();
  }

  function win() { over = true; overlay(wrap, 'You saved them!', `The word was ${word}`); }
  function lose() { over = true; overlay(wrap, 'Out of guesses', `The word was ${word}`); }

  wrap.append(status, stageEl, wordEl, kb);
  container.appendChild(wrap);
  drawWord();

  return { destroy() {} };
}
