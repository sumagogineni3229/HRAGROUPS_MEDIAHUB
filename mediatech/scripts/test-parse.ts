import { rawPages1To10 } from './data/pages_1_10';
import { rawPages11To20 } from './data/pages_11_20';
import { rawPages21To30 } from './data/pages_21_30';
import { rawPages31To40 } from './data/pages_31_40';
import { rawPages41To50 } from './data/pages_41_50';
import { rawPages51To64 } from './data/pages_51_64';

export interface ParsedWebsite {
  domain: string;
  url: string;
  niche: string;
  da: number;
  dr: number;
  price: number;
  traffic: number;
  service: 'ARTICLE_POSTING' | 'LINK_INSERTION' | 'BOTH';
  tat: number;
  country: string;
  isDoFollow: boolean;
  language: string;
}

const KNOWN_COUNTRIES = [
  'United States',
  'United Kingdom',
  'UnitedStates',
  'Canada',
  'India',
  'Australia',
  'Brazil',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Nigeria',
  'Turkey',
  'Philippines',
  'Indonesia',
  'Qatar',
  'Pakistan',
  'Bangladesh',
  'Malaysia',
  'Singapore',
  'Iceland',
  'Romania',
  'Greece',
  'Kenya',
  'Bulgaria',
  'Finland',
  'Algeria',
  'Bolivia',
  'Norway',
  'Poland',
  'Sweden',
  'Ukraine',
  'Monaco',
  'Bahrain'
];

export function cleanDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  // Strip http:// or https:// if present
  d = d.replace(/^https?:\/\//, '');
  // Strip trailing slashes
  d = d.replace(/\/+$/, '');
  // Strip trailing OCR tag artifacts
  const artifacts = [
    'advance', 'advnace', 'purehome', 'purecasino', 'puretravel',
    'pureeducation', 'puregaming', 'purecrypto', 'purefashion',
    'purehealth', 'purelaw', 'purelawwebsite', 'nakedlinkonly'
  ];
  for (const art of artifacts) {
    if (d.endsWith(art)) {
      d = d.slice(0, -art.length);
    }
  }
  return d;
}

export function parseAllLines(): { websites: ParsedWebsite[]; errors: { line: string; error: string }[] } {
  const allRaw = [
    rawPages1To10,
    rawPages11To20,
    rawPages21To30,
    rawPages31To40,
    rawPages41To50,
    rawPages51To64,
  ].join('\n');

  const lines = allRaw.split('\n');
  const websites: ParsedWebsite[] = [];
  const errors: { line: string; error: string }[] = [];

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('==Start') || line.startsWith('==End')) continue;
    if (line.startsWith('WEBSITE DOMAIN') || line.startsWith('Domain Category')) continue;

    try {
      const parsed = parseLine(line);
      if (parsed) {
        websites.push(parsed);
      }
    } catch (e: any) {
      errors.push({ line, error: e.message || String(e) });
    }
  }

  return { websites, errors };
}

function parseLine(line: string): ParsedWebsite | null {
  // Tokens
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length < 5) return null;

  // 1. Raw Domain
  const rawDomain = tokens[0];
  const domain = cleanDomain(rawDomain);
  if (!domain.includes('.')) return null;

  // 2. Extract Link Type (ends with Do Follow / Nofollow)
  let isDoFollow = true;
  let remainingTokens = tokens.slice(1);
  const endStr = remainingTokens.slice(-2).join(' ').toLowerCase();
  if (endStr === 'do follow' || endStr === 'dofollow') {
    isDoFollow = true;
    remainingTokens = remainingTokens.slice(0, -2);
  } else if (remainingTokens[remainingTokens.length - 1].toLowerCase() === 'follow' && remainingTokens[remainingTokens.length - 2]?.toLowerCase() === 'do') {
    isDoFollow = true;
    remainingTokens = remainingTokens.slice(0, -2);
  } else if (remainingTokens[remainingTokens.length - 1].toLowerCase() === 'nofollow') {
    isDoFollow = false;
    remainingTokens = remainingTokens.slice(0, -1);
  }

  // 3. Extract Country from end of remainingTokens
  let country = 'United States';
  for (const c of KNOWN_COUNTRIES) {
    const cTokens = c.split(' ');
    const endSlice = remainingTokens.slice(-cTokens.length).join(' ');
    if (endSlice.toLowerCase() === c.toLowerCase()) {
      country = c === 'UnitedStates' ? 'United States' : c;
      remainingTokens = remainingTokens.slice(0, -cTokens.length);
      break;
    }
  }

  // 4. Extract TAT (number usually 7, before country)
  let tat = 7;
  if (remainingTokens.length > 0 && /^\d+$/.test(remainingTokens[remainingTokens.length - 1])) {
    const parsedTat = parseInt(remainingTokens[remainingTokens.length - 1], 10);
    if (parsedTat > 0 && parsedTat <= 60) {
      tat = parsedTat;
      remainingTokens = remainingTokens.slice(0, -1);
    }
  }

  // 5. Extract Service from end: "Link Insertion & Guest Post", "Guest Post", "Link Insertion"
  let service: 'ARTICLE_POSTING' | 'LINK_INSERTION' | 'BOTH' = 'ARTICLE_POSTING';
  const remStr = remainingTokens.join(' ');
  
  if (/link insertion & guest post/i.test(remStr) || /guest post & link insertion/i.test(remStr)) {
    service = 'BOTH';
    // remove matching tokens
    const idx = remStr.search(/link insertion & guest post/i);
    const before = remStr.slice(0, idx).trim();
    remainingTokens = before.split(/\s+/).filter(Boolean);
  } else if (/link insertion/i.test(remStr)) {
    service = 'LINK_INSERTION';
    const idx = remStr.search(/link insertion/i);
    const before = remStr.slice(0, idx).trim();
    remainingTokens = before.split(/\s+/).filter(Boolean);
  } else if (/guest post/i.test(remStr)) {
    service = 'ARTICLE_POSTING';
    const idx = remStr.search(/guest post/i);
    const before = remStr.slice(0, idx).trim();
    remainingTokens = before.split(/\s+/).filter(Boolean);
  }

  // Now remainingTokens contains: [Category (1 or more words), DA?, DR?, Price, Traffic]
  // Let's parse numbers from the end of remainingTokens:
  // Usually the last number is Traffic.
  // The number before traffic is Price (might have $ sign).
  // The number(s) before Price are DR and DA.
  // The words before numbers are Category.

  if (remainingTokens.length === 0) {
    throw new Error(`Cannot parse numbers/category: ${line}`);
  }

  // Find numeric indices from right to left
  // Traffic: integer (can be 0 or large number)
  let traffic = 0;
  let price = 50;
  let dr = 50;
  let da = 50;

  // Let's pop traffic
  const trafficToken = remainingTokens.pop()!;
  traffic = parseInt(trafficToken.replace(/,/g, ''), 10) || 0;

  // Price token (might be like "$120", "120$", "$4,135", "70", "50")
  const priceToken = remainingTokens.pop();
  if (!priceToken) throw new Error(`Missing price token in line: ${line}`);
  price = parseFloat(priceToken.replace(/[$,]/g, '')) || 50;

  // Next token could be DR
  const nextToken = remainingTokens[remainingTokens.length - 1];
  const isNumber = (s: string) => /^\d+(\.\d+)?$/.test(s);

  if (nextToken && isNumber(nextToken)) {
    // We have DR
    dr = Math.round(parseFloat(remainingTokens.pop()!));

    // Check if there is another number for DA
    const daToken = remainingTokens[remainingTokens.length - 1];
    if (daToken && isNumber(daToken)) {
      da = Math.round(parseFloat(remainingTokens.pop()!));
    } else {
      // Single authority column, assign both DA & DR
      da = dr;
    }
  } else {
    // If no explicit DR/DA token, default to 50
    da = 50;
    dr = 50;
  }

  // Whatever is left is the Category (niche)
  let niche = remainingTokens.join(' ').trim();
  if (!niche) {
    niche = 'Technology';
  }

  // Clean niche
  if (niche === 'SAAS' || niche === 'SaaS') niche = 'SaaS';
  if (niche === 'Finance Business') niche = 'Finance & Business';
  if (niche === 'News Magazine') niche = 'News & Magazine';
  if (niche.startsWith('TOP Link') || niche.startsWith('Go Link') || niche.startsWith('TOP LINK')) {
    niche = 'Technology';
  }
  if (niche.startsWith('Premium PR') || niche === 'PREMIUM' || niche === 'Premium') {
    niche = 'General & News';
  }

  return {
    domain,
    url: `https://${domain}/`,
    niche,
    da,
    dr,
    price,
    traffic,
    service,
    tat,
    country,
    isDoFollow,
    language: 'English'
  };
}

// Quick run
const { websites, errors } = parseAllLines();
console.log(`Successfully parsed: ${websites.length} websites`);
console.log(`Errors count: ${errors.length}`);
if (errors.length > 0) {
  console.log('Sample errors:', JSON.stringify(errors.slice(0, 10), null, 2));
}
console.log('First 3 parsed:', JSON.stringify(websites.slice(0, 3), null, 2));
console.log('Last 3 parsed:', JSON.stringify(websites.slice(-3), null, 2));
