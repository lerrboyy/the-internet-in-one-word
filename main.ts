// The Internet in One Word — entry program.
//
// Writes the entry word to <OUTPUT_DIR>/entry.txt and verifies the write
// byte-for-byte. No dependencies, no network. The output directory is
// created with a recursive mkdir only; the directory itself is never
// removed, because the grader's /output is a mount point.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENTRY_WORD = "Timesuck";

const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function checkWord(word: string): void {
  if (word.length === 0) fail("entry word is empty");
  if (word.length > 30) fail(`entry word is ${word.length} chars, over the 30-char gate`);
  if (word.trim() !== word) fail("entry word has leading or trailing whitespace");
  if (word.trim().length === 0) fail("entry word is only whitespace");
  if (/\s/.test(word)) fail("entry word contains whitespace — it must be a single word");
  if (word.includes("-")) fail("entry word contains a hyphen — it must be one solid word");
  if (!/^[A-Za-z]+$/.test(word)) fail("entry word must be letters only — one solid word");
}

// The gate is checked twice: once on the constant before anything is
// written, and once on the bytes read back from disk, so a bad write can
// never slip past as a valid entry.

checkWord(ENTRY_WORD);

mkdirSync(OUTPUT_DIR, { recursive: true });

const outPath = join(OUTPUT_DIR, "entry.txt");
writeFileSync(outPath, ENTRY_WORD, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY_WORD) {
  fail(`read-back mismatch: wrote ${JSON.stringify(ENTRY_WORD)}, read ${JSON.stringify(roundTrip)}`);
}
checkWord(roundTrip);

if (!existsSync(OUTPUT_DIR)) fail("output directory vanished after the write");

console.log(`wrote ${outPath} (${ENTRY_WORD.length} chars): ${ENTRY_WORD}`);
