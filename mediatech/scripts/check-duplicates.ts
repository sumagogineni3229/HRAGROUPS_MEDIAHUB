import { parseAllLines } from './test-parse';

const { websites } = parseAllLines();

const uniqueDomains = new Map<string, typeof websites[0][]>();

for (const w of websites) {
  if (!uniqueDomains.has(w.domain)) {
    uniqueDomains.set(w.domain, []);
  }
  uniqueDomains.get(w.domain)!.push(w);
}

console.log('Total entries:', websites.length);
console.log('Unique domains count:', uniqueDomains.size);

let multiPackageCount = 0;
for (const [domain, entries] of uniqueDomains.entries()) {
  if (entries.length > 1) {
    multiPackageCount++;
  }
}
console.log('Domains with multiple entries/services:', multiPackageCount);
