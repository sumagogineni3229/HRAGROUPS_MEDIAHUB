import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(__dirname, '../../data.md');
const content = fs.readFileSync(dataPath, 'utf-8');

const lines = content.split('\n');
console.log('Total lines in data.md:', lines.length);

interface Row {
  rawDomain: string;
  domain: string;
  category: string;
  da: number;
  dr: number;
  price: number;
  traffic: number;
  tat: number;
  country: string;
  linkType: string;
  serviceType: string;
}

const parsedRows: Row[] = [];
let headerFound = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  if (line.toLowerCase().startsWith('website domain')) {
    headerFound = true;
    continue;
  }

  // Split by tab first, fallback to regex
  let parts = line.split('\t').map(s => s.trim());
  if (parts.length < 5) {
    // try multi-space split
    parts = line.split(/\s{2,}/).map(s => s.trim());
  }

  // If still less than 5, try smart token splitting
  if (parts.length < 5) {
    const spaceTokens = line.split(/\s+/).filter(Boolean);
    // e.g. domain, category, etc.
    if (spaceTokens.length >= 5) {
      parts = spaceTokens;
    } else {
      console.log(`Skipping line ${i+1}: ${line}`);
      continue;
    }
  }

  const rawDomain = parts[0] || '';
  let domain = rawDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  // clean OCR suffixes if any
  domain = domain.replace(/nakedlinkonly$|purehome$|purecasino$|puretravel$|pureeducation$|puregaming$|purecrypto$|purefashion$|purehealth$|purelawwebsite$|purelaw$|advance$|advnace$/g, '');

  if (!domain.includes('.')) continue;

  const category = parts[1] || 'Technology';
  
  // Extract numbers
  let da = 0;
  let dr = 0;
  let price = 50;
  let traffic = 0;
  let tat = 7;
  let country = 'United States';
  let linkType = 'Do Follow';

  if (parts.length >= 8) {
    const daStr = parts[2];
    const drStr = parts[3];
    const priceStr = parts[4];
    const trafficStr = parts[5];
    const tatStr = parts[6];
    const countryStr = parts[7];
    const linkStr = parts[8] || 'Do Follow';

    da = parseInt(daStr.replace(/\D/g, ''), 10) || 0;
    dr = parseInt(drStr.replace(/\D/g, ''), 10) || 0;
    if (da === 0 && dr > 0) da = dr;
    if (dr === 0 && da > 0) dr = da;
    if (da === 0 && dr === 0) { da = 50; dr = 50; }

    price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 50;
    traffic = parseInt(trafficStr.replace(/\D/g, ''), 10) || 0;
    tat = parseInt(tatStr.replace(/\D/g, ''), 10) || 7;
    country = countryStr || 'United States';
    linkType = linkStr;
  } else {
    // parse flexible
    const priceStr = parts.find(p => p.includes('$')) || parts[3] || '50';
    price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 50;
  }

  // Determine service type
  let serviceType = 'ARTICLE_POSTING';
  if (/link insertion/i.test(line) && /guest post/i.test(line)) {
    serviceType = 'BOTH';
  } else if (/link insertion/i.test(line)) {
    serviceType = 'LINK_INSERTION';
  } else {
    serviceType = 'ARTICLE_POSTING';
  }

  parsedRows.push({
    rawDomain,
    domain,
    category,
    da,
    dr,
    price,
    traffic,
    tat,
    country,
    linkType,
    serviceType
  });
}

console.log('Total parsed rows from data.md:', parsedRows.length);

const domainMap = new Map<string, Row[]>();
for (const r of parsedRows) {
  if (!domainMap.has(r.domain)) domainMap.set(r.domain, []);
  domainMap.get(r.domain)!.push(r);
}
console.log('Unique domains from data.md:', domainMap.size);
