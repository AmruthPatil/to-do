import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const DB_FILE = join(DATA_DIR, 'tasks.json');

const DEFAULT = { tasks: [] };

function ensureFile() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, JSON.stringify(DEFAULT, null, 2));
}

export function readDb() {
  ensureFile();
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { ...DEFAULT };
  }
}

export function writeDb(data) {
  ensureFile();
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
