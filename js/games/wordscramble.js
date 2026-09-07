import { el, overlay, choice, shuffle, scoreBar } from '../engine.js';

const WORDS = {
  easy: ['CAT', 'DOG', 'SUN', 'BOOK', 'TREE', 'FISH', 'STAR', 'MOON', 'CAKE', 'BIRD'],
  medium: ['PLANET', 'GUITAR', 'PUZZLE', 'CASTLE', 'GARDEN', 'WINDOW', 'PENCIL', 'ROCKET'],
  hard: ['JAVASCRIPT', 'ELEPHANT', 'ADVENTURE', 'KEYBOARD', 'TELESCOPE', 'CHOCOLATE', 'MICROSCOPE'],
  animals: ['TIGER', 'RABBIT', 'PANDA', 'ZEBRA', 'OTTER', 'FALCON', 'LIZARD', 'WALRUS'],
  food: ['NOODLE', 'BURGER', 'WAFFLE', 'CARROT', 'MANGO', 'BISCUIT', 'YOGURT', 'PEPPER'],
  sports: ['SOCCER', 'TENNIS', 'BOXING', 'ARCHERY', 'ROWING', 'SKATING', 'CYCLING', 'DIVING'],
  space: ['COMET', 'ORBIT', 'ROVER', 'COSMOS', 'LUNAR', 'SATURN', 'GALAXY', 'PLUTO'],
  colors: ['SCARLET', 'AMBER', 'VIOLET', 'INDIGO', 'CORAL', 'IVORY', 'OLIVE', 'BEIGE'],
  countries: ['FRANCE', 'KENYA', 'PERU', 'GREECE', 'FINLAND', 'VIETNAM', 'CHILE', 'MOROCCO'],
  music: ['GUITAR', 'RHYTHM', 'MELODY', 'TRUMPET', 'CHORUS', 'BALLAD', 'VIOLIN', 'TEMPO'],
  jobs: ['DOCTOR', 'LAWYER', 'TEACHER', 'FARMER', 'DENTIST', 'BAKER', 'PAINTER', 'BUTCHER'],
};

function scramble(word) {
  let s;
  do { s = shuffle(word.split('')).join(''); } while (s === word);
  return s;
}

export default function wordscramble(container, config) {
  const list = WORDS[config.difficulty] || WORDS.easy;
  const used = new Set();
  let word = '', score = 0, over = false, nextTimer = null;

  const wrap = el('div', {});
  const bar = scoreBar(wrap, 'Score');
  const scrambledEl = el('div', { style: 'font-size:2em;letter-spacing:.2em;margin:.6em 0' });
  const input = el('input', { type: 'text', placeholder: 'Type the word', autocomplete: 'off' });
  const submitBtn = el('button', {}, 'Submit');
  const skipBtn = el('button', {}, 'Skip');
  const msg = el('div', { class: 'overlay-sub' });

  function nextWord() {
    if (used.size >= list.length) return endGame();
    let w;
    do { w = choice(list); } while (used.has(w));
    used.add(w);
    word = w;
    scrambledEl.textContent = scramble(word);
    input.value = '';
    msg.textContent = '';
  }

  function submit() {
    if (over) return;
    if (input.value.trim().toUpperCase() === word) {
      score++; bar.setScore(score); msg.textContent = 'Correct!';
      nextTimer = setTimeout(nextWord, 500);
    } else {
      msg.textContent = 'Try again!';
    }
  }

  function endGame() {
    over = true;
    overlay(wrap, 'All words done!', `Score: ${score} / ${list.length}`);
  }

  submitBtn.addEventListener('click', submit);
  skipBtn.addEventListener('click', () => { msg.textContent = `It was ${word}`; nextTimer = setTimeout(nextWord, 700); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  wrap.append(bar.el, scrambledEl, input, el('div', { style: 'display:flex;gap:.5em;margin-top:.5em' }, [submitBtn, skipBtn]), msg);
  container.appendChild(wrap);
  nextWord();

  return { destroy() { over = true; clearTimeout(nextTimer); } };
}
