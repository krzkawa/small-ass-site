# 512KB Retro Arcade

600 retro mini-games in a single site that transfers **well under 512KB**, even
if a player worked through every game in one sitting. No build step, no
frameworks, no images, no web fonts — vanilla HTML/CSS/JS only.

## How it stays under budget

1. **Lazy loading.** `index.html` loads a tiny shell (`css/style.css`,
   `js/app.js`, `js/engine.js`, `js/registry.js`) — the game grid, search, and
   player. A game's code is only fetched via dynamic `import()` the moment a
   player opens it. Nobody downloads all 600 games to play one.
2. **Shared engines, config-driven variants.** 600 games are built from 50
   engines (`js/games/*.js`). "Snake · 14×14 Board" and "Snake · Poison Fruit"
   are the same ~3KB module with a different config object in
   `js/registry.js` — so listing 600 games costs almost nothing extra over
   listing 50. Board size, mine density, guess range, difficulty tier, word
   category, and theme are the axes that turn one engine into a dozen games.
3. **No dependencies.** No React, no bundler, no icon fonts, no stock photos.
   Icons are emoji, boards are CSS grid or `<canvas>`, and everything is
   hand-written JS.

Run `node scripts/check-size.mjs` for a live report. Last measured:

| | raw | gzip |
|---|---|---|
| Initial page load (shell only) | ~53 KB | ~13 KB |
| All 50 game engines combined | ~181 KB | ~71 KB |
| **Entire site** (shell + every engine) | **~234 KB** | **~85 KB** |

That's about a sixth of the 512KB budget for the *whole site* — every engine
behind all 600 presets, loaded at once — and about 2.6% of budget for what a
visitor actually downloads before picking a game. The page also shows a live
"Transferred: X KB / 512 KB" badge in the header, computed from the real
Resource Timing API — open dev tools and watch it stay essentially flat as
you play.

## Structure

```
index.html          shell page
css/style.css        all styling (no framework)
js/engine.js          shared helpers: canvas/grid/loop/input/localStorage/cards
js/app.js             router: renders the game grid, dynamically imports games
js/registry.js        the 600 games — title/family/category/icon/config
js/games/*.js         50 game engines, one file per family
scripts/check-size.mjs   byte-budget report
```

## The 600 games

50 families, each configured into anywhere from 1 to dozens of variants
(difficulty, board size, speed, theme, or word category):

Snake, Tic-Tac-Toe, Minesweeper, Memory Match, Connect Four, 2048, Lights
Out, Sliding Puzzle, Simon Says, Whack-a-Mole, Reaction/Reflex tests,
Hangman, Word Scramble, Nim, Mastermind, Rock Paper Scissors, Number Guess,
Pong, Breakout, Flappy Bird, Space Invaders, Maze Runner, Sokoban, Othello,
Checkers, Dots and Boxes, Tower of Hanoi, Blackjack, War, Yahtzee, Asteroids,
Pixel Runner, a falling-blocks (Tetris-style) game, Sudoku, Battleship, a
Wordle-style word guesser, Picross/Nonogram, Match-3 gems, a Frogger-style
road crossing, Bubble Shooter, Air Hockey, Mini Golf, Darts, a trivia quiz
(10 categories), a typing speed test, Math Blitz, three Solitaire variants
(Aces Up, Golf, Pyramid), Go Fish, Bingo, and a card Hi-Lo game.

Board/strategy games (Tic-Tac-Toe, Connect Four, Othello, Checkers) play
against a real AI opponent — minimax for Tic-Tac-Toe, heuristic search for
the rest. Misère variants flip the win condition (completing a line loses).
Nim's AI plays the optimal nim-sum strategy, adjusted for misère play.

High scores and best times are saved to `localStorage` per game variant.

## Running locally

Static files only — serve the folder with anything, e.g.:

```
npx serve .
# or
python3 -m http.server 8000
```

No install, no build.
