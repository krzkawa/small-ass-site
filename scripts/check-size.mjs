#!/usr/bin/env node
// Reports the byte budget for the arcade: what a first page load transfers
// (HTML + CSS + shell JS, before any game is opened) vs. the size of the
// whole site (every game module combined). Run: node scripts/check-size.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUDGET = 512 * 1024;

function sizes(paths) {
  let raw = 0, gz = 0;
  for (const p of paths) {
    const buf = readFileSync(p);
    raw += buf.length;
    gz += gzipSync(buf).length;
  }
  return { raw, gz };
}

function fmt(n) { return (n / 1024).toFixed(2) + ' KB'; }

const shellFiles = [
  join(root, 'index.html'),
  join(root, 'css/style.css'),
  join(root, 'js/app.js'),
  join(root, 'js/engine.js'),
  join(root, 'js/registry.js'),
];

const gameFiles = readdirSync(join(root, 'js/games'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => join(root, 'js/games', f));

const shell = sizes(shellFiles);
const games = sizes(gameFiles);
const all = { raw: shell.raw + games.raw, gz: shell.gz + games.gz };

console.log('--- 512KB Retro Arcade — size report ---\n');
console.log(`Initial page load (shell only, before any game is opened):`);
console.log(`  raw:  ${fmt(shell.raw)}`);
console.log(`  gzip: ${fmt(shell.gz)}  (this is roughly what actually transfers over HTTP)`);
console.log(`  budget: 512 KB → ${shell.gz < BUDGET ? 'PASS' : 'FAIL'} (${((shell.gz / BUDGET) * 100).toFixed(1)}% of budget)\n`);

console.log(`All ${gameFiles.length} game modules combined (only fetched on demand, one at a time):`);
console.log(`  raw:  ${fmt(games.raw)}`);
console.log(`  gzip: ${fmt(games.gz)}`);
console.log(`  avg per game module: ${fmt(games.raw / gameFiles.length)} raw / ${fmt(games.gz / gameFiles.length)} gzip\n`);

console.log(`Entire site (shell + all ${gameFiles.length} engines — every one of the 600 presets reuses one of these):`);
console.log(`  raw:  ${fmt(all.raw)}`);
console.log(`  gzip: ${fmt(all.gz)}`);
console.log(`  budget: 512 KB → ${all.gz < BUDGET ? 'PASS' : 'FAIL'} (${((all.gz / BUDGET) * 100).toFixed(1)}% of budget)`);
