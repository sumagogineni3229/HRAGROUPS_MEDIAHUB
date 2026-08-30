import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(__dirname, '../../data.md');
const content = fs.readFileSync(dataPath, 'utf-8');
const lines = content.split('\n');

let guestPostCount = 0;
let linkInsertionCount = 0;
let otherCount = 0;

for (const line of lines) {
  if (!line.trim() || line.toLowerCase().startsWith('website domain')) continue;
  if (/link insertion/i.test(line)) {
    linkInsertionCount++;
  } else if (/guest post/i.test(line)) {
    guestPostCount++;
  } else {
    otherCount++;
  }
}

console.log({ guestPostCount, linkInsertionCount, otherCount });
