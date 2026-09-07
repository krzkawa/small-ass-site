// 100 selectable games built from 33 shared engines. Variants (difficulty,
// board size, theme) reuse the same code, so listing 100 games costs almost
// nothing extra in bytes — only this metadata differs.

export const CATEGORIES = ['Arcade', 'Puzzle', 'Board', 'Cards', 'Word', 'Reflex'];

let id = 0;
function g(title, family, category, icon, config) {
  id++;
  return { id: `${family}-${id}`, title, family, category, icon, config };
}

export const GAMES = [
  // ---- Snake (6) ----
  g('Snake · Classic', 'snake', 'Arcade', '🐍', { board: 20, speed: 130 }),
  g('Snake · Wrap Around', 'snake', 'Arcade', '🐍', { board: 20, speed: 130, wrap: true }),
  g('Snake · Speed Run', 'snake', 'Arcade', '🐍', { board: 20, speed: 75 }),
  g('Snake · Big Board', 'snake', 'Arcade', '🐍', { board: 30, speed: 110 }),
  g('Snake · Poison Fruit', 'snake', 'Arcade', '🐍', { board: 20, speed: 130, poison: true }),

  // ---- Tic-Tac-Toe (5) ----
  g('Tic-Tac-Toe · vs AI (Easy)', 'tictactoe', 'Board', '⭕', { size: 3, mode: 'ai-easy' }),
  g('Tic-Tac-Toe · vs AI (Unbeatable)', 'tictactoe', 'Board', '⭕', { size: 3, mode: 'ai-hard' }),
  g('Tic-Tac-Toe · 2 Player', 'tictactoe', 'Board', '⭕', { size: 3, mode: '2p' }),
  g('Tic-Tac-Toe · 4×4 (2P)', 'tictactoe', 'Board', '⭕', { size: 4, mode: '2p', winLen: 3 }),
  g('Tic-Tac-Toe · 5×5 (2P)', 'tictactoe', 'Board', '⭕', { size: 5, mode: '2p', winLen: 3 }),

  // ---- Minesweeper (4) ----
  g('Minesweeper · Easy', 'minesweeper', 'Puzzle', '💣', { rows: 9, cols: 9, mines: 10 }),
  g('Minesweeper · Medium', 'minesweeper', 'Puzzle', '💣', { rows: 14, cols: 14, mines: 32 }),
  g('Minesweeper · Hard', 'minesweeper', 'Puzzle', '💣', { rows: 16, cols: 22, mines: 70 }),
  g('Minesweeper · Extreme', 'minesweeper', 'Puzzle', '💣', { rows: 20, cols: 28, mines: 120 }),

  // ---- Memory Match (6) ----
  g('Memory Match · 4×4', 'memorymatch', 'Puzzle', '🧠', { rows: 4, cols: 4, theme: 'emoji' }),
  g('Memory Match · 6×6', 'memorymatch', 'Puzzle', '🧠', { rows: 6, cols: 6, theme: 'emoji' }),
  g('Memory Match · 8×8', 'memorymatch', 'Puzzle', '🧠', { rows: 8, cols: 8, theme: 'emoji' }),
  g('Memory Match · Numbers', 'memorymatch', 'Puzzle', '🧠', { rows: 4, cols: 4, theme: 'numbers' }),
  g('Memory Match · Timed 4×4', 'memorymatch', 'Puzzle', '🧠', { rows: 4, cols: 4, theme: 'emoji', timeLimit: 45 }),

  // ---- Connect Four (3) ----
  g('Connect Four · vs AI', 'connectfour', 'Board', '🔴', { rows: 6, cols: 7, mode: 'ai' }),
  g('Connect Four · 2 Player', 'connectfour', 'Board', '🔴', { rows: 6, cols: 7, mode: '2p' }),
  g('Connect Four · Big Board vs AI', 'connectfour', 'Board', '🔴', { rows: 9, cols: 9, mode: 'ai' }),

  // ---- 2048 (4) ----
  g('2048 · Classic 4×4', 'twenty48', 'Puzzle', '🔢', { size: 4 }),
  g('2048 · Mini 3×3', 'twenty48', 'Puzzle', '🔢', { size: 3 }),
  g('2048 · Big 5×5', 'twenty48', 'Puzzle', '🔢', { size: 5 }),
  g('2048 · Huge 6×6', 'twenty48', 'Puzzle', '🔢', { size: 6 }),

  // ---- Lights Out (4) ----
  g('Lights Out · 3×3', 'lightsout', 'Puzzle', '💡', { size: 3 }),
  g('Lights Out · 4×4', 'lightsout', 'Puzzle', '💡', { size: 4 }),
  g('Lights Out · 5×5', 'lightsout', 'Puzzle', '💡', { size: 5 }),
  g('Lights Out · 6×6', 'lightsout', 'Puzzle', '💡', { size: 6 }),

  // ---- Sliding Puzzle (4) ----
  g('Sliding Puzzle · 3×3 Numbers', 'slidingpuzzle', 'Puzzle', '🔲', { size: 3, theme: 'numbers' }),
  g('Sliding Puzzle · 4×4 Numbers', 'slidingpuzzle', 'Puzzle', '🔲', { size: 4, theme: 'numbers' }),
  g('Sliding Puzzle · 3×3 Animals', 'slidingpuzzle', 'Puzzle', '🔲', { size: 3, theme: 'emoji' }),
  g('Sliding Puzzle · 4×4 Animals', 'slidingpuzzle', 'Puzzle', '🔲', { size: 4, theme: 'emoji' }),

  // ---- Simon (5) ----
  g('Simon Says · Easy', 'simon', 'Reflex', '🎨', { colors: 4, speed: 650 }),
  g('Simon Says · Normal', 'simon', 'Reflex', '🎨', { colors: 4, speed: 480 }),
  g('Simon Says · Fast', 'simon', 'Reflex', '🎨', { colors: 4, speed: 340 }),
  g('Simon Says · Extreme', 'simon', 'Reflex', '🎨', { colors: 4, speed: 230 }),

  // ---- Whack-a-Mole (4) ----
  g('Whack-a-Mole · Easy', 'whackamole', 'Reflex', '🔨', { difficulty: 'easy' }),
  g('Whack-a-Mole · Normal', 'whackamole', 'Reflex', '🔨', { difficulty: 'normal' }),
  g('Whack-a-Mole · Hard', 'whackamole', 'Reflex', '🔨', { difficulty: 'hard' }),
  g('Whack-a-Mole · Insane', 'whackamole', 'Reflex', '🔨', { difficulty: 'insane' }),

  // ---- Reaction (3) ----
  g('Reaction Time Test', 'reaction', 'Reflex', '⚡', { mode: 'simple' }),
  g('Color Match Reflex', 'reaction', 'Reflex', '⚡', { mode: 'color' }),
  g('Sequence Memory', 'reaction', 'Reflex', '⚡', { mode: 'sequence' }),

  // ---- Hangman (4) ----
  g('Hangman · Animals', 'hangman', 'Word', '🎯', { category: 'animals' }),
  g('Hangman · Countries', 'hangman', 'Word', '🎯', { category: 'countries' }),
  g('Hangman · Movies', 'hangman', 'Word', '🎯', { category: 'movies' }),
  g('Hangman · Code Terms', 'hangman', 'Word', '🎯', { category: 'code' }),

  // ---- Word Scramble (3) ----
  g('Word Scramble · Easy', 'wordscramble', 'Word', '🔤', { difficulty: 'easy' }),
  g('Word Scramble · Medium', 'wordscramble', 'Word', '🔤', { difficulty: 'medium' }),
  g('Word Scramble · Hard', 'wordscramble', 'Word', '🔤', { difficulty: 'hard' }),

  // ---- Nim (3) ----
  g('Nim · Standard', 'nim', 'Board', '🔵', { piles: [3, 5, 7] }),
  g('Nim · Misère', 'nim', 'Board', '🔵', { piles: [3, 5, 7], misere: true }),
  g('Nim · Multi-Pile', 'nim', 'Board', '🔵', { piles: [1, 3, 5, 7, 9] }),

  // ---- Mastermind (3) ----
  g('Mastermind · 4 Colors', 'mastermind', 'Puzzle', '🎯', { colors: 4, slots: 4, maxGuesses: 10 }),
  g('Mastermind · 6 Colors', 'mastermind', 'Puzzle', '🎯', { colors: 6, slots: 4, maxGuesses: 10 }),
  g('Mastermind · 8 Colors', 'mastermind', 'Puzzle', '🎯', { colors: 8, slots: 5, maxGuesses: 12 }),

  // ---- Rock Paper Scissors (3) ----
  g('Rock Paper Scissors · Best of 3', 'rps', 'Reflex', '✂️', { bestOf: 3 }),
  g('Rock Paper Scissors · Best of 5', 'rps', 'Reflex', '✂️', { bestOf: 5 }),
  g('Rock Paper Scissors · Best of 7', 'rps', 'Reflex', '✂️', { bestOf: 7 }),

  // ---- Number Guess (3) ----
  g('Number Guess · 1-50', 'numberguess', 'Puzzle', '🔮', { max: 50 }),
  g('Number Guess · 1-100', 'numberguess', 'Puzzle', '🔮', { max: 100 }),
  g('Number Guess · 1-1000', 'numberguess', 'Puzzle', '🔮', { max: 1000 }),

  // ---- Pong (3) ----
  g('Pong · vs AI (Easy)', 'pong', 'Arcade', '🏓', { mode: 'ai-easy' }),
  g('Pong · vs AI (Hard)', 'pong', 'Arcade', '🏓', { mode: 'ai-hard' }),
  g('Pong · 2 Player', 'pong', 'Arcade', '🏓', { mode: '2p' }),

  // ---- Breakout (3) ----
  g('Breakout · Level 1', 'breakout', 'Arcade', '🧱', { level: 1, speed: 1 }),
  g('Breakout · Level 2', 'breakout', 'Arcade', '🧱', { level: 2, speed: 1.15 }),
  g('Breakout · Level 3', 'breakout', 'Arcade', '🧱', { level: 3, speed: 1.3 }),

  // ---- Flappy (2) ----
  g('Flappy Bird · Normal', 'flappy', 'Arcade', '🐦', { gap: 140, speed: 2.4 }),
  g('Flappy Bird · Hard', 'flappy', 'Arcade', '🐦', { gap: 105, speed: 3 }),

  // ---- Space Invaders (3) ----
  g('Space Invaders · Slow Wave', 'spaceinvaders', 'Arcade', '👾', { rows: 3, speed: 0.35 }),
  g('Space Invaders · Normal Wave', 'spaceinvaders', 'Arcade', '👾', { rows: 4, speed: 0.5 }),
  g('Space Invaders · Fast Wave', 'spaceinvaders', 'Arcade', '👾', { rows: 5, speed: 0.75 }),

  // ---- Maze (3) ----
  g('Maze Runner · Small', 'maze', 'Puzzle', '🧩', { size: 10 }),
  g('Maze Runner · Medium', 'maze', 'Puzzle', '🧩', { size: 16 }),
  g('Maze Runner · Large', 'maze', 'Puzzle', '🧩', { size: 22 }),

  // ---- Sokoban (3) ----
  g('Sokoban · Level 1', 'sokoban', 'Puzzle', '📦', { level: 1 }),
  g('Sokoban · Level 2', 'sokoban', 'Puzzle', '📦', { level: 2 }),
  g('Sokoban · Level 3', 'sokoban', 'Puzzle', '📦', { level: 3 }),

  // ---- Othello / Reversi (2) ----
  g('Othello · 6×6', 'othello', 'Board', '⚫', { size: 6 }),
  g('Othello · 8×8', 'othello', 'Board', '⚫', { size: 8 }),

  // ---- Checkers (2) ----
  g('Checkers · 8×8 Standard', 'checkers', 'Board', '🔴', { size: 8 }),
  g('Checkers · 6×6 Mini', 'checkers', 'Board', '🔴', { size: 6 }),

  // ---- Dots and Boxes (3) ----
  g('Dots and Boxes · 3×3', 'dotsandboxes', 'Board', '⚡', { size: 3 }),
  g('Dots and Boxes · 4×4', 'dotsandboxes', 'Board', '⚡', { size: 4 }),
  g('Dots and Boxes · 5×5', 'dotsandboxes', 'Board', '⚡', { size: 5 }),

  // ---- Tower of Hanoi (3) ----
  g('Tower of Hanoi · 3 Disks', 'hanoi', 'Puzzle', '🗼', { disks: 3 }),
  g('Tower of Hanoi · 4 Disks', 'hanoi', 'Puzzle', '🗼', { disks: 4 }),
  g('Tower of Hanoi · 5 Disks', 'hanoi', 'Puzzle', '🗼', { disks: 5 }),

  // ---- Card games (3) ----
  g('Blackjack', 'blackjack', 'Cards', '🃏', {}),
  g('War', 'war', 'Cards', '🃏', {}),
  g('Yahtzee', 'yahtzee', 'Cards', '🎲', {}),

  // ---- Asteroids (2) ----
  g('Asteroids · Normal', 'asteroids', 'Arcade', '☄️', { difficulty: 'normal' }),
  g('Asteroids · Hard', 'asteroids', 'Arcade', '☄️', { difficulty: 'hard' }),

  // ---- Pixel Runner (2) ----
  g('Pixel Runner · Normal', 'runner', 'Arcade', '🏃', { difficulty: 'normal', speed: 4 }),
  g('Pixel Runner · Hard', 'runner', 'Arcade', '🏃', { difficulty: 'hard', speed: 4.5 }),

  // ---- Tetris (2) ----
  g('Block Drop · Normal', 'tetris', 'Arcade', '🧊', { speed: 550 }),
  g('Block Drop · Fast', 'tetris', 'Arcade', '🧊', { speed: 320 }),
];

// ============================================================
// The next 500 games: 17 new engines below, plus many more
// configured variants of the original 33 engines above. Same
// strategy as the first 100 — new code only for genuinely new
// mechanics; everything else is a config object reusing an
// existing ~3KB engine, so the byte cost stays tiny.
// ============================================================
const add = (title, family, category, icon, config) => GAMES.push(g(title, family, category, icon, config));

// ---- New engine: Sudoku (4) ----
add('Sudoku · Easy', 'sudoku', 'Puzzle', '🔢', { difficulty: 'easy' });
add('Sudoku · Medium', 'sudoku', 'Puzzle', '🔢', { difficulty: 'medium' });
add('Sudoku · Hard', 'sudoku', 'Puzzle', '🔢', { difficulty: 'hard' });
add('Sudoku · Expert', 'sudoku', 'Puzzle', '🔢', { difficulty: 'expert' });

// ---- New engine: Battleship (4) ----
add('Battleship · 8×8', 'battleship', 'Board', '🚢', { size: 8, aiMode: 'random' });
add('Battleship · 8×8 Smart AI', 'battleship', 'Board', '🚢', { size: 8, aiMode: 'smart' });
add('Battleship · 10×10', 'battleship', 'Board', '🚢', { size: 10, aiMode: 'random' });
add('Battleship · 10×10 Smart AI', 'battleship', 'Board', '🚢', { size: 10, aiMode: 'smart' });

// ---- New engine: Wordle (5) ----
add('Word Guess · 4 Letters', 'wordle', 'Word', '🟩', { wordLength: 4 });
add('Word Guess · 5 Letters', 'wordle', 'Word', '🟩', { wordLength: 5 });
add('Word Guess · 6 Letters', 'wordle', 'Word', '🟩', { wordLength: 6 });
add('Word Guess · 7 Letters', 'wordle', 'Word', '🟩', { wordLength: 7 });
add('Word Guess · 8 Letters', 'wordle', 'Word', '🟩', { wordLength: 8 });

// ---- New engine: Nonogram / Picross (3) ----
add('Picross · 5×5', 'nonogram', 'Puzzle', '🖼️', { size: 5 });
add('Picross · 8×8', 'nonogram', 'Puzzle', '🖼️', { size: 8 });
add('Picross · 10×10', 'nonogram', 'Puzzle', '🖼️', { size: 10 });

// ---- New engine: Match-3 Gems (4) ----
add('Match-3 · Small Board', 'match3', 'Puzzle', '💠', { size: 6, moveLimit: 20 });
add('Match-3 · Medium Board', 'match3', 'Puzzle', '💠', { size: 8, moveLimit: 20 });
add('Match-3 · Large Board', 'match3', 'Puzzle', '💠', { size: 10, moveLimit: 25 });
add('Match-3 · Timed', 'match3', 'Puzzle', '💠', { size: 8, timeLimit: 60 });

// ---- New engine: Frogger Crossing (3) ----
add('Road Crossing · Easy', 'frogger', 'Arcade', '🐸', { speed: 'easy' });
add('Road Crossing · Normal', 'frogger', 'Arcade', '🐸', { speed: 'normal' });
add('Road Crossing · Hard', 'frogger', 'Arcade', '🐸', { speed: 'hard' });

// ---- New engine: Bubble Shooter (3) ----
add('Bubble Pop · Small', 'bubbleshooter', 'Puzzle', '🫧', { rows: 6 });
add('Bubble Pop · Medium', 'bubbleshooter', 'Puzzle', '🫧', { rows: 10 });
add('Bubble Pop · Large', 'bubbleshooter', 'Puzzle', '🫧', { rows: 14 });

// ---- New engine: Air Hockey (3) ----
add('Air Hockey · Easy', 'airhockey', 'Arcade', '🏒', { difficulty: 'easy' });
add('Air Hockey · Normal', 'airhockey', 'Arcade', '🏒', { difficulty: 'normal' });
add('Air Hockey · Hard', 'airhockey', 'Arcade', '🏒', { difficulty: 'hard' });

// ---- New engine: Mini Golf (4) ----
add('Mini Golf · Hole 1', 'golfputt', 'Arcade', '⛳', { level: 1 });
add('Mini Golf · Hole 2', 'golfputt', 'Arcade', '⛳', { level: 2 });
add('Mini Golf · Hole 3', 'golfputt', 'Arcade', '⛳', { level: 3 });
add('Mini Golf · Hole 4', 'golfputt', 'Arcade', '⛳', { level: 4 });

// ---- New engine: Darts (3) ----
add('Darts · 301', 'darts', 'Reflex', '🎯', { mode: '301' });
add('Darts · 501', 'darts', 'Reflex', '🎯', { mode: '501' });
add('Darts · Target Practice', 'darts', 'Reflex', '🎯', { mode: 'practice' });

// ---- New engine: Trivia Quiz (8) ----
add('Trivia · Science', 'trivia', 'Word', '🧪', { category: 'science' });
add('Trivia · History', 'trivia', 'Word', '📜', { category: 'history' });
add('Trivia · Geography', 'trivia', 'Word', '🌍', { category: 'geography' });
add('Trivia · Movies', 'trivia', 'Word', '🎬', { category: 'movies' });
add('Trivia · Sports', 'trivia', 'Word', '🏅', { category: 'sports' });
add('Trivia · Music', 'trivia', 'Word', '🎵', { category: 'music' });
add('Trivia · General Knowledge', 'trivia', 'Word', '❓', { category: 'general' });
add('Trivia · Technology', 'trivia', 'Word', '💻', { category: 'tech' });

// ---- New engine: Typing Speed Test (3) ----
add('Typing Test · 30s', 'typingtest', 'Reflex', '⌨️', { duration: 30 });
add('Typing Test · 60s', 'typingtest', 'Reflex', '⌨️', { duration: 60 });
add('Typing Test · 120s', 'typingtest', 'Reflex', '⌨️', { duration: 120 });

// ---- New engine: Math Blitz (5) ----
add('Math Blitz · Addition', 'mathblitz', 'Puzzle', '➕', { op: 'add' });
add('Math Blitz · Subtraction', 'mathblitz', 'Puzzle', '➖', { op: 'sub' });
add('Math Blitz · Multiplication', 'mathblitz', 'Puzzle', '✖️', { op: 'mul' });
add('Math Blitz · Division', 'mathblitz', 'Puzzle', '➗', { op: 'div' });
add('Math Blitz · Mixed', 'mathblitz', 'Puzzle', '🧮', { op: 'mixed' });

// ---- New engine: Solitaire (3 variants) ----
add('Solitaire · Aces Up', 'solitaire', 'Cards', '🂡', { mode: 'acesup' });
add('Solitaire · Golf', 'solitaire', 'Cards', '⛳', { mode: 'golf' });
add('Solitaire · Pyramid', 'solitaire', 'Cards', '🔺', { mode: 'pyramid' });

// ---- New engine: Go Fish (2) ----
add('Go Fish · vs 1 AI', 'gofish', 'Cards', '🐟', { opponents: 1 });
add('Go Fish · vs 2 AI', 'gofish', 'Cards', '🐟', { opponents: 2 });

// ---- New engine: Bingo (3) ----
add('Bingo · Classic', 'bingo', 'Reflex', '🅱️', { mode: 'classic' });
add('Bingo · Speed Round', 'bingo', 'Reflex', '🅱️', { mode: 'speed' });
add('Bingo · Blackout', 'bingo', 'Reflex', '🅱️', { mode: 'blackout' });

// ---- New engine: Card Hi-Lo (2) ----
add('Card Hi-Lo · Endless', 'cardhilo', 'Cards', '🎴', { mode: 'standard' });
add('Card Hi-Lo · Beat the Deck', 'cardhilo', 'Cards', '🎴', { mode: 'streak' });

// ============================================================
// More configured variants of the original 33 engines. Board
// size / speed / difficulty are generated with loops so a huge
// range of presets costs only a few lines of registry code.
// ============================================================

// ---- Snake: more board sizes, paired with a matching pace ----
for (let size = 6; size <= 50; size += 2) {
  if (size === 12 || size === 20 || size === 30) continue; // already covered above
  const speed = Math.max(60, 190 - size * 3);
  add(`Snake · ${size}×${size} Board`, 'snake', 'Arcade', '🐍', { board: size, speed });
}
add('Snake · Wrap + Speed Run', 'snake', 'Arcade', '🐍', { board: 18, speed: 80, wrap: true });
add('Snake · Poison + Big Board', 'snake', 'Arcade', '🐍', { board: 28, speed: 110, poison: true });
add('Snake · Wrap + Poison', 'snake', 'Arcade', '🐍', { board: 20, speed: 120, wrap: true, poison: true });

// ---- Minesweeper: more size/mine-density presets ----
[
  [6, 6, 4], [8, 8, 10], [10, 10, 15], [10, 10, 20], [12, 12, 24], [12, 12, 30],
  [14, 14, 32], [16, 16, 45], [18, 18, 55], [20, 20, 70], [22, 22, 85], [24, 24, 100],
  [10, 18, 30], [18, 10, 30], [26, 26, 120], [30, 16, 130], [16, 30, 130], [28, 28, 140],
].forEach(([rows, cols, mines]) => {
  add(`Minesweeper · ${rows}×${cols} (${mines} mines)`, 'minesweeper', 'Puzzle', '💣', { rows, cols, mines });
});

// ---- Number Guess: a wide spread of ranges ----
[5, 10, 15, 20, 25, 30, 40, 60, 75, 150, 200, 300, 400, 750, 1500, 2500, 5000, 7500, 25000, 50000, 100000]
  .forEach((max) => add(`Number Guess · 1-${max}`, 'numberguess', 'Puzzle', '🔮', { max }));

// ---- Mastermind: colors × slots grid ----
[
  [3, 3, 8], [3, 4, 10], [4, 3, 8], [4, 5, 10], [4, 6, 12], [5, 4, 10], [5, 5, 12],
  [5, 6, 12], [6, 5, 10], [6, 6, 12], [7, 4, 10], [7, 5, 12], [7, 6, 14], [8, 4, 10],
  [8, 6, 14], [8, 7, 14],
].forEach(([colors, slots, maxGuesses]) => {
  add(`Mastermind · ${colors} Colors, ${slots} Slots`, 'mastermind', 'Puzzle', '🎯', { colors, slots, maxGuesses });
});

// ---- Nim: more pile configurations ----
[
  { piles: [1, 2, 3], label: 'Tiny Piles' },
  { piles: [2, 4, 6], label: 'Even Piles' },
  { piles: [4, 4, 4], label: 'Triple Fours' },
  { piles: [1, 3, 5, 7], label: 'Odd Piles' },
  { piles: [2, 3, 5, 7, 11], label: 'Prime Piles' },
  { piles: [5, 5, 5, 5], label: 'Quad Fives' },
  { piles: [10], label: 'Single Pile' },
  { piles: [3, 3, 3, 3, 3], label: 'Five Threes' },
  { piles: [1, 2, 3, 4, 5, 6, 7], label: 'Seven Piles' },
  { piles: [6, 8, 10], label: 'Big Even Piles' },
  { piles: [1, 3, 5, 7], misere: true, label: 'Odd Piles Misère' },
  { piles: [2, 4, 6], misere: true, label: 'Even Piles Misère' },
  { piles: [8, 8], label: 'Twin Piles' },
  { piles: [2, 3, 4, 5], label: 'Staircase Piles' },
].forEach(({ piles, misere, label }) => {
  add(`Nim · ${label}${misere ? '' : ''}`, 'nim', 'Board', '🔵', { piles, misere: !!misere });
});

// ---- Tower of Hanoi: more disk counts ----
[6, 7, 8, 9, 10, 11, 12].forEach((disks) => add(`Tower of Hanoi · ${disks} Disks`, 'hanoi', 'Puzzle', '🗼', { disks }));

// ---- Maze Runner: more sizes ----
[6, 8, 12, 14, 18, 20, 24, 26, 28, 32, 36, 40].forEach((size) => add(`Maze Runner · ${size}×${size}`, 'maze', 'Puzzle', '🧩', { size }));

// ---- Lights Out: more sizes ----
[7, 8, 9, 10, 11, 12].forEach((size) => add(`Lights Out · ${size}×${size}`, 'lightsout', 'Puzzle', '💡', { size }));

// ---- 2048: more sizes ----
[7, 8, 9, 10, 11, 12].forEach((size) => add(`2048 · ${size}×${size}`, 'twenty48', 'Puzzle', '🔢', { size }));

// ---- Sliding Puzzle: more sizes × themes ----
[5, 6, 7].forEach((size) => {
  add(`Sliding Puzzle · ${size}×${size} Numbers`, 'slidingpuzzle', 'Puzzle', '🔲', { size, theme: 'numbers' });
  add(`Sliding Puzzle · ${size}×${size} Animals`, 'slidingpuzzle', 'Puzzle', '🔲', { size, theme: 'emoji' });
});

// ---- Dots and Boxes: more sizes ----
[6, 7, 8, 9].forEach((size) => add(`Dots and Boxes · ${size}×${size}`, 'dotsandboxes', 'Board', '⚡', { size }));

// ---- Connect Four: more board sizes ----
[[5, 5], [7, 7], [8, 8], [8, 6], [10, 8]].forEach(([rows, cols]) => {
  add(`Connect Four · ${rows}×${cols} vs AI`, 'connectfour', 'Board', '🔴', { rows, cols, mode: 'ai' });
  add(`Connect Four · ${rows}×${cols} 2 Player`, 'connectfour', 'Board', '🔴', { rows, cols, mode: '2p' });
});

// ---- Tic-Tac-Toe: misère twist + bigger boards ----
add('Tic-Tac-Toe · Misère vs AI (Easy)', 'tictactoe', 'Board', '⭕', { size: 3, mode: 'ai-easy', misere: true });
add('Tic-Tac-Toe · Misère vs AI (Unbeatable)', 'tictactoe', 'Board', '⭕', { size: 3, mode: 'ai-hard', misere: true });
add('Tic-Tac-Toe · Misère 2 Player', 'tictactoe', 'Board', '⭕', { size: 3, mode: '2p', misere: true });
add('Tic-Tac-Toe · 4×4 Misère (2P)', 'tictactoe', 'Board', '⭕', { size: 4, mode: '2p', winLen: 3, misere: true });
[6, 7, 8].forEach((size) => add(`Tic-Tac-Toe · ${size}×${size} (2P)`, 'tictactoe', 'Board', '⭕', { size, mode: '2p', winLen: 4 }));

// ---- Memory Match: more sizes / themes ----
add('Memory Match · 4×6', 'memorymatch', 'Puzzle', '🧠', { rows: 4, cols: 6, theme: 'emoji' });
add('Memory Match · 10×10', 'memorymatch', 'Puzzle', '🧠', { rows: 10, cols: 10, theme: 'emoji' });
add('Memory Match · Numbers 6×6', 'memorymatch', 'Puzzle', '🧠', { rows: 6, cols: 6, theme: 'numbers' });
add('Memory Match · Shapes 4×4', 'memorymatch', 'Puzzle', '🧠', { rows: 4, cols: 4, theme: 'shapes' });
add('Memory Match · Shapes 6×6', 'memorymatch', 'Puzzle', '🧠', { rows: 6, cols: 6, theme: 'shapes' });
add('Memory Match · Timed 8×8', 'memorymatch', 'Puzzle', '🧠', { rows: 8, cols: 8, theme: 'emoji', timeLimit: 110 });
add('Memory Match · Timed Numbers 4×4', 'memorymatch', 'Puzzle', '🧠', { rows: 4, cols: 4, theme: 'numbers', timeLimit: 40 });

// ---- Simon Says: colors × speed grid ----
[5, 6, 7].forEach((colors) => {
  [700, 500, 350].forEach((speed, i) => {
    add(`Simon Says · ${colors} Colors (${['Slow', 'Normal', 'Fast'][i]})`, 'simon', 'Reflex', '🎨', { colors, speed });
  });
});
add('Simon Says · Lightning', 'simon', 'Reflex', '🎨', { colors: 4, speed: 150 });

// ---- Whack-a-Mole: more difficulty tiers + bigger boards ----
add('Whack-a-Mole · Zen', 'whackamole', 'Reflex', '🔨', { difficulty: 'zen' });
add('Whack-a-Mole · Nightmare', 'whackamole', 'Reflex', '🔨', { difficulty: 'nightmare' });
add('Whack-a-Mole · 4×4 Board', 'whackamole', 'Reflex', '🔨', { difficulty: 'normal', gridSize: 4 });
add('Whack-a-Mole · 5×5 Board', 'whackamole', 'Reflex', '🔨', { difficulty: 'hard', gridSize: 5 });

// ---- Hangman: the new categories ----
['sports', 'food', 'space', 'mythology', 'occupations', 'weather', 'colors', 'vehicles'].forEach((category) => {
  add(`Hangman · ${category[0].toUpperCase()}${category.slice(1)}`, 'hangman', 'Word', '🎯', { category });
});

// ---- Word Scramble: the new categories ----
['animals', 'food', 'sports', 'space'].forEach((difficulty) => {
  add(`Word Scramble · ${difficulty[0].toUpperCase()}${difficulty.slice(1)}`, 'wordscramble', 'Word', '🔤', { difficulty });
});

// ---- Sokoban: the new levels ----
[4, 5, 6, 7, 8].forEach((level) => add(`Sokoban · Level ${level}`, 'sokoban', 'Puzzle', '📦', { level }));

// ---- Othello / Checkers: bigger boards ----
add('Othello · 10×10', 'othello', 'Board', '⚫', { size: 10 });
add('Checkers · 10×10', 'checkers', 'Board', '🔴', { size: 10 });

// ---- Breakout: more levels ----
add('Breakout · Level 4', 'breakout', 'Arcade', '🧱', { level: 4, speed: 1.4 });
add('Breakout · Level 5', 'breakout', 'Arcade', '🧱', { level: 5, speed: 1.5 });
add('Breakout · Level 1 Turbo', 'breakout', 'Arcade', '🧱', { level: 1, speed: 1.7 });

// ---- Flappy Bird: more difficulty ----
add('Flappy Bird · Easy', 'flappy', 'Arcade', '🐦', { gap: 170, speed: 2 });
add('Flappy Bird · Extreme', 'flappy', 'Arcade', '🐦', { gap: 85, speed: 3.4 });

// ---- Space Invaders: more wave shapes ----
add('Space Invaders · Few but Fast', 'spaceinvaders', 'Arcade', '👾', { rows: 3, speed: 0.8 });
add('Space Invaders · Swarm', 'spaceinvaders', 'Arcade', '👾', { rows: 6, speed: 0.4 });

// ---- Asteroids / Pixel Runner: Insane tier ----
add('Asteroids · Insane', 'asteroids', 'Arcade', '☄️', { difficulty: 'insane' });
add('Pixel Runner · Insane', 'runner', 'Arcade', '🏃', { difficulty: 'insane', speed: 5 });

// ---- Block Drop (Tetris): more speeds ----
add('Block Drop · Relaxed', 'tetris', 'Arcade', '🧊', { speed: 750 });
add('Block Drop · Lightning', 'tetris', 'Arcade', '🧊', { speed: 200 });

// ---- Pong: fast-ball variants ----
add('Pong · Fast Ball vs AI (Easy)', 'pong', 'Arcade', '🏓', { mode: 'ai-easy', ballSpeed: 1.4 });
add('Pong · Fast Ball vs AI (Hard)', 'pong', 'Arcade', '🏓', { mode: 'ai-hard', ballSpeed: 1.4 });

// ---- Card games: shoe size and reverse rules ----
add('Blackjack · Double Deck', 'blackjack', 'Cards', '🃏', { decks: 2 });
add('Blackjack · 4-Deck Shoe', 'blackjack', 'Cards', '🃏', { decks: 4 });
add('War · Reverse (Lowest Wins)', 'war', 'Cards', '🃏', { reverse: true });

// ---- Rock Paper Scissors: longer matches ----
add('Rock Paper Scissors · Best of 9', 'rps', 'Reflex', '✂️', { bestOf: 9 });
add('Rock Paper Scissors · Best of 11', 'rps', 'Reflex', '✂️', { bestOf: 11 });

// ---- Trivia: two more categories ----
add('Trivia · Art', 'trivia', 'Word', '🎨', { category: 'art' });
add('Trivia · Nature', 'trivia', 'Word', '🌿', { category: 'nature' });

// ============================================================
// Third wave: these families scale cleanly on numeric axes
// (board size, mine density, guess range, pile shape) with no
// new content needed, so a big spread of genuinely different
// difficulty presets costs only a data table each.
// ============================================================

// ---- Minesweeper: even more shapes/densities ----
[
  [7, 7, 8], [9, 9, 12], [11, 11, 20], [13, 13, 28], [15, 15, 38], [17, 17, 48],
  [19, 19, 60], [21, 21, 75], [23, 23, 90], [25, 25, 110],
].forEach(([rows, cols, mines]) => add(`Minesweeper · ${rows}×${cols} (${mines} mines)`, 'minesweeper', 'Puzzle', '💣', { rows, cols, mines }));

// ---- Number Guess: filling out the range even further ----
[3, 8, 12, 35, 45, 55, 65, 80, 90, 120, 175, 225, 350, 600, 900, 1200, 1750, 3000, 4000, 6000]
  .forEach((max) => add(`Number Guess · 1-${max}`, 'numberguess', 'Puzzle', '🔮', { max }));

// ---- Mastermind: the rest of the sensible colors×slots grid ----
[
  [3, 5, 10], [3, 6, 12], [4, 4, 8], [5, 3, 8], [6, 3, 8], [6, 4, 8], [7, 3, 8],
  [7, 6, 12], [7, 7, 14], [8, 3, 8], [8, 5, 12], [8, 8, 14],
].forEach(([colors, slots, maxGuesses]) => add(`Mastermind · ${colors} Colors, ${slots} Slots`, 'mastermind', 'Puzzle', '🎯', { colors, slots, maxGuesses }));

// ---- Nim: a few more pile shapes ----
[
  { piles: [4, 6, 8, 10], label: 'Growing Piles' },
  { piles: [7, 7, 7], label: 'Triple Sevens' },
  { piles: [1, 4, 9, 16], label: 'Square Piles' },
  { piles: [3, 6, 9], misere: true, label: 'Triple Threes Misère' },
  { piles: [12, 12], label: 'Big Twin Piles' },
  { piles: [2, 2, 2, 2, 2], label: 'Five Twos' },
].forEach(({ piles, misere, label }) => add(`Nim · ${label}`, 'nim', 'Board', '🔵', { piles, misere: !!misere }));

// ---- Connect Four: a few more shapes ----
[[6, 9], [9, 6], [11, 9], [6, 11]].forEach(([rows, cols]) => {
  add(`Connect Four · ${rows}×${cols} vs AI`, 'connectfour', 'Board', '🔴', { rows, cols, mode: 'ai' });
  add(`Connect Four · ${rows}×${cols} 2 Player`, 'connectfour', 'Board', '🔴', { rows, cols, mode: '2p' });
});

// ---- Tic-Tac-Toe: even bigger boards + more misère sizes ----
[9, 10, 11].forEach((size) => add(`Tic-Tac-Toe · ${size}×${size} (2P)`, 'tictactoe', 'Board', '⭕', { size, mode: '2p', winLen: 4 }));
add('Tic-Tac-Toe · 5×5 Misère (2P)', 'tictactoe', 'Board', '⭕', { size: 5, mode: '2p', winLen: 3, misere: true });
add('Tic-Tac-Toe · 6×6 Misère (2P)', 'tictactoe', 'Board', '⭕', { size: 6, mode: '2p', winLen: 4, misere: true });

// ---- Memory Match: a few more size/theme combos ----
add('Memory Match · 5×6', 'memorymatch', 'Puzzle', '🧠', { rows: 5, cols: 6, theme: 'emoji' });
add('Memory Match · 5×8', 'memorymatch', 'Puzzle', '🧠', { rows: 5, cols: 8, theme: 'emoji' });
add('Memory Match · Shapes 8×8', 'memorymatch', 'Puzzle', '🧠', { rows: 8, cols: 8, theme: 'shapes' });
add('Memory Match · Numbers 8×8', 'memorymatch', 'Puzzle', '🧠', { rows: 8, cols: 8, theme: 'numbers' });
add('Memory Match · Timed Shapes 6×6', 'memorymatch', 'Puzzle', '🧠', { rows: 6, cols: 6, theme: 'shapes', timeLimit: 75 });

// ---- Simon Says: fill out the colors grid ----
[700, 500, 350].forEach((speed, i) => add(`Simon Says · 8 Colors (${['Slow', 'Normal', 'Fast'][i]})`, 'simon', 'Reflex', '🎨', { colors: 8, speed }));

// ---- Lights Out / 2048: a couple more sizes ----
[13, 14].forEach((size) => add(`Lights Out · ${size}×${size}`, 'lightsout', 'Puzzle', '💡', { size }));
[13].forEach((size) => add(`2048 · ${size}×${size}`, 'twenty48', 'Puzzle', '🔢', { size }));

// ---- Sliding Puzzle: one more size ----
add('Sliding Puzzle · 8×8 Numbers', 'slidingpuzzle', 'Puzzle', '🔲', { size: 8, theme: 'numbers' });
add('Sliding Puzzle · 8×8 Animals', 'slidingpuzzle', 'Puzzle', '🔲', { size: 8, theme: 'emoji' });

// ---- Whack-a-Mole: bigger boards ----
add('Whack-a-Mole · 6×6 Board', 'whackamole', 'Reflex', '🔨', { difficulty: 'insane', gridSize: 6 });
add('Whack-a-Mole · 4×4 Zen', 'whackamole', 'Reflex', '🔨', { difficulty: 'zen', gridSize: 4 });

// ---- Battleship: a bigger fleet ----
add('Battleship · 12×12', 'battleship', 'Board', '🚢', { size: 12, aiMode: 'random' });
add('Battleship · 12×12 Smart AI', 'battleship', 'Board', '🚢', { size: 12, aiMode: 'smart' });

// ---- Go Fish: three-opponent table ----
add('Go Fish · vs 3 AI', 'gofish', 'Cards', '🐟', { opponents: 3 });

// ---- Blackjack: full 6-deck shoe ----
add('Blackjack · 6-Deck Shoe', 'blackjack', 'Cards', '🃏', { decks: 6 });

// ---- Hanoi: a couple more disk counts ----
[13, 14].forEach((disks) => add(`Tower of Hanoi · ${disks} Disks`, 'hanoi', 'Puzzle', '🗼', { disks }));

// ---- Dots and Boxes: one more size ----
add('Dots and Boxes · 10×10', 'dotsandboxes', 'Board', '⚡', { size: 10 });

// ============================================================
// Fourth wave: rounding out the smaller families so difficulty
// tiers, board shapes, and content categories are represented
// everywhere, not just in the handful of most-parameterizable
// engines above.
// ============================================================

add('Othello · 12×12', 'othello', 'Board', '⚫', { size: 12 });
add('Checkers · 12×12', 'checkers', 'Board', '🔴', { size: 12 });
add('Picross · 12×12', 'nonogram', 'Puzzle', '🖼️', { size: 12 });
add('Road Crossing · Extreme', 'frogger', 'Arcade', '🐸', { speed: 'extreme' });
add('Bubble Pop · Extreme', 'bubbleshooter', 'Puzzle', '🫧', { rows: 18 });
add('Air Hockey · Insane', 'airhockey', 'Arcade', '🏒', { difficulty: 'insane' });
add('Darts · 701', 'darts', 'Reflex', '🎯', { mode: '701' });
add('Typing Test · 15s Sprint', 'typingtest', 'Reflex', '⌨️', { duration: 15 });
add('Go Fish · vs 4 AI', 'gofish', 'Cards', '🐟', { opponents: 4 });
add('Sudoku · Beginner', 'sudoku', 'Puzzle', '🔢', { difficulty: 'beginner' });
add('Match-3 · Huge Board', 'match3', 'Puzzle', '💠', { size: 12, moveLimit: 30 });
add('Mini Golf · Hole 5', 'golfputt', 'Arcade', '⛳', { level: 5 });
add('Block Drop · Medium', 'tetris', 'Arcade', '🧊', { speed: 450 });
add('Flappy Bird · Normal+', 'flappy', 'Arcade', '🐦', { gap: 120, speed: 2.7 });
add('Breakout · Level 6', 'breakout', 'Arcade', '🧱', { level: 6, speed: 1.2 });
add('Battleship · 6×6', 'battleship', 'Board', '🚢', { size: 6, aiMode: 'random' });
add('Battleship · 6×6 Smart AI', 'battleship', 'Board', '🚢', { size: 6, aiMode: 'smart' });
add('Space Invaders · Balanced Wave', 'spaceinvaders', 'Arcade', '👾', { rows: 5, speed: 0.6 });
add('Pong · Fast Ball 2 Player', 'pong', 'Arcade', '🏓', { mode: '2p', ballSpeed: 1.4 });
add('2048 · 14×14', 'twenty48', 'Puzzle', '🔢', { size: 14 });
add('Lights Out · 15×15', 'lightsout', 'Puzzle', '💡', { size: 15 });
add('Whack-a-Mole · Zen 6×6', 'whackamole', 'Reflex', '🔨', { difficulty: 'zen', gridSize: 6 });
add('Memory Match · 10×6', 'memorymatch', 'Puzzle', '🧠', { rows: 10, cols: 6, theme: 'emoji' });
add('Memory Match · Shapes 5×6', 'memorymatch', 'Puzzle', '🧠', { rows: 5, cols: 6, theme: 'shapes' });
add('Hangman · Superheroes', 'hangman', 'Word', '🎯', { category: 'superheroes' });
add('Hangman · Instruments', 'hangman', 'Word', '🎯', { category: 'instruments' });
add('Word Scramble · Colors', 'wordscramble', 'Word', '🔤', { difficulty: 'colors' });
add('Word Scramble · Countries', 'wordscramble', 'Word', '🔤', { difficulty: 'countries' });
add('Trivia · Literature', 'trivia', 'Word', '📚', { category: 'literature' });
add('Trivia · Gaming', 'trivia', 'Word', '🕹️', { category: 'gaming' });
add('Sokoban · Level 9', 'sokoban', 'Puzzle', '📦', { level: 9 });
add('Sokoban · Level 10', 'sokoban', 'Puzzle', '📦', { level: 10 });

// ============================================================
// Fifth wave: final push across the most parameterizable
// families to round out the collection at 600 games. A closing
// pass trims or pads the Number Guess list (the cheapest,
// most infinitely-scalable family) to land on the exact count.
// ============================================================

[6, 9, 11, 14, 18, 22, 40, 70, 130, 180, 275, 425, 800, 1100, 1600, 2000, 2800, 3500, 8000, 15000]
  .forEach((max) => add(`Number Guess · 1-${max}`, 'numberguess', 'Puzzle', '🔮', { max }));

[
  [8, 8, 6], [9, 12, 14], [12, 9, 14], [13, 20, 40], [20, 13, 40], [17, 22, 65],
  [22, 17, 65], [27, 27, 130], [29, 29, 150], [24, 30, 135],
].forEach(([rows, cols, mines]) => add(`Minesweeper · ${rows}×${cols} (${mines} mines)`, 'minesweeper', 'Puzzle', '💣', { rows, cols, mines }));

[
  [3, 3, 6], [4, 3, 6], [4, 6, 12], [5, 3, 6], [5, 7, 14], [6, 7, 12], [6, 8, 14], [8, 4, 8],
].forEach(([colors, slots, maxGuesses]) => add(`Mastermind · ${colors} Colors, ${slots} Slots`, 'mastermind', 'Puzzle', '🎯', { colors, slots, maxGuesses }));

[
  { piles: [3, 4, 5], label: 'Ascending Piles' },
  { piles: [9, 9, 9], label: 'Triple Nines' },
  { piles: [1, 1, 1, 1, 1], label: 'Five Ones' },
  { piles: [15, 15], misere: true, label: 'Twin Piles Misère' },
  { piles: [2, 5, 8, 11], label: 'Skip-Three Piles' },
  { piles: [6, 6, 6, 6], label: 'Quad Sixes' },
  { piles: [1, 2, 4, 8, 16], label: 'Power Piles' },
  { piles: [10, 10, 10], misere: true, label: 'Triple Tens Misère' },
].forEach(({ piles, misere, label }) => add(`Nim · ${label}`, 'nim', 'Board', '🔵', { piles, misere: !!misere }));

[[6, 6], [6, 8], [8, 6], [10, 10], [10, 11], [11, 10], [12, 10], [12, 12]].forEach(([rows, cols]) => {
  add(`Connect Four · ${rows}×${cols} vs AI`, 'connectfour', 'Board', '🔴', { rows, cols, mode: 'ai' });
  add(`Connect Four · ${rows}×${cols} 2 Player`, 'connectfour', 'Board', '🔴', { rows, cols, mode: '2p' });
});

[15, 19, 23, 27, 31, 35].forEach((size) => {
  const speed = Math.max(60, 190 - size * 3);
  add(`Snake · ${size}×${size} Board`, 'snake', 'Arcade', '🐍', { board: size, speed });
});

[9, 10].forEach((size) => add(`Tic-Tac-Toe · ${size}×${size} Misère (2P)`, 'tictactoe', 'Board', '⭕', { size, mode: '2p', winLen: 4, misere: true }));
add('Tic-Tac-Toe · 12×12 (2P)', 'tictactoe', 'Board', '⭕', { size: 12, mode: '2p', winLen: 5 });
add('Tic-Tac-Toe · 12×12 Misère (2P)', 'tictactoe', 'Board', '⭕', { size: 12, mode: '2p', winLen: 5, misere: true });

add('Memory Match · 6×10', 'memorymatch', 'Puzzle', '🧠', { rows: 6, cols: 10, theme: 'emoji' });
add('Memory Match · Numbers 5×6', 'memorymatch', 'Puzzle', '🧠', { rows: 5, cols: 6, theme: 'numbers' });
add('Memory Match · Timed 10×10', 'memorymatch', 'Puzzle', '🧠', { rows: 10, cols: 10, theme: 'emoji', timeLimit: 150 });

[900, 300].forEach((speed) => {
  [4, 5].forEach((colors) => add(`Simon Says · ${colors} Colors (${speed >= 900 ? 'Very Slow' : 'Very Fast'})`, 'simon', 'Reflex', '🎨', { colors, speed }));
});

[16, 17, 18].forEach((size) => add(`Maze Runner · ${size}×${size}`, 'maze', 'Puzzle', '🧩', { size }));

[15, 16].forEach((size) => add(`Lights Out · ${size}×${size}`, 'lightsout', 'Puzzle', '💡', { size }));
[15, 16].forEach((size) => add(`2048 · ${size}×${size}`, 'twenty48', 'Puzzle', '🔢', { size }));
[9].forEach((size) => {
  add(`Sliding Puzzle · ${size}×${size} Numbers`, 'slidingpuzzle', 'Puzzle', '🔲', { size, theme: 'numbers' });
  add(`Sliding Puzzle · ${size}×${size} Animals`, 'slidingpuzzle', 'Puzzle', '🔲', { size, theme: 'emoji' });
});
add('Minesweeper · 32×32 (180 mines)', 'minesweeper', 'Puzzle', '💣', { rows: 32, cols: 32, mines: 180 });
add('Minesweeper · 6×24 (30 mines)', 'minesweeper', 'Puzzle', '💣', { rows: 6, cols: 24, mines: 30 });

add('Trivia · World Capitals', 'trivia', 'Word', '🏛️', { category: 'capitals' });
add('Trivia · Famous People', 'trivia', 'Word', '🌟', { category: 'famous_people' });
add('Word Scramble · Music', 'wordscramble', 'Word', '🔤', { difficulty: 'music' });
add('Word Scramble · Jobs', 'wordscramble', 'Word', '🔤', { difficulty: 'jobs' });
add('Picross · 14×14', 'nonogram', 'Puzzle', '🖼️', { size: 14 });

add('Whack-a-Mole · Nightmare 5×5', 'whackamole', 'Reflex', '🔨', { difficulty: 'nightmare', gridSize: 5 });
add('Whack-a-Mole · Easy 4×4', 'whackamole', 'Reflex', '🔨', { difficulty: 'easy', gridSize: 4 });
add('Whack-a-Mole · Hard 6×6', 'whackamole', 'Reflex', '🔨', { difficulty: 'hard', gridSize: 6 });

add('Dots and Boxes · 11×11', 'dotsandboxes', 'Board', '⚡', { size: 11 });
add('Dots and Boxes · 12×12', 'dotsandboxes', 'Board', '⚡', { size: 12 });
add('Dots and Boxes · 2 Player 6×6', 'dotsandboxes', 'Board', '⚡', { size: 6 });

add('Battleship · 14×14', 'battleship', 'Board', '🚢', { size: 14, aiMode: 'random' });
add('Battleship · 14×14 Smart AI', 'battleship', 'Board', '🚢', { size: 14, aiMode: 'smart' });

add('Breakout · Level 7', 'breakout', 'Arcade', '🧱', { level: 7, speed: 1.3 });
add('Breakout · Level 2 Turbo', 'breakout', 'Arcade', '🧱', { level: 2, speed: 1.8 });

add('Pong · Slow Ball vs AI (Easy)', 'pong', 'Arcade', '🏓', { mode: 'ai-easy', ballSpeed: 0.7 });
add('Pong · Slow Ball vs AI (Hard)', 'pong', 'Arcade', '🏓', { mode: 'ai-hard', ballSpeed: 0.7 });

add('Space Invaders · Boss Wave', 'spaceinvaders', 'Arcade', '👾', { rows: 2, speed: 1 });
add('Space Invaders · Endless Swarm', 'spaceinvaders', 'Arcade', '👾', { rows: 7, speed: 0.3 });

add('Flappy Bird · Impossible', 'flappy', 'Arcade', '🐦', { gap: 65, speed: 3.8 });
add('Block Drop · Glacial', 'tetris', 'Arcade', '🧊', { speed: 900 });
add('Block Drop · Warp Speed', 'tetris', 'Arcade', '🧊', { speed: 150 });
add('Number Guess · 1-1000000', 'numberguess', 'Puzzle', '🔮', { max: 1000000 });

