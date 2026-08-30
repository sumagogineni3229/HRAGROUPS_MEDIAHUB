import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db';
import { ProductType, PlatformStatus } from '@prisma/client';

const COMPANY_PUBLISHER_ID = 'cmteqswqm0000k6re5we03vhc';

interface WebsiteRecord {
  domain: string;
  url: string;
  niche: string;
  da: number;
  dr: number;
  price: number;
  traffic: number;
  tat: number;
  country: string;
  isDoFollow: boolean;
  serviceType: 'ARTICLE_POSTING' | 'LINK_INSERTION' | 'BOTH';
}

function cleanDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '');
  d = d.replace(/\/+$/, '');
  // strip unwanted query params or suffixes
  d = d.split('/')[0];
  d = d.replace(/nakedlinkonly$|purehome$|purecasino$|puretravel$|pureeducation$|puregaming$|purecrypto$|purefashion$|purehealth$|purelawwebsite$|purelaw$|advance$|advnace$/g, '');
  return d.trim();
}

async function syncAllFromDataMd() {
  console.log('🔄 Reading and syncing from data.md...');

  const dataPath = path.resolve(__dirname, '../../data.md');
  const content = fs.readFileSync(dataPath, 'utf-8');
  const lines = content.split('\n');

  const records: WebsiteRecord[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.toLowerCase().startsWith('website domain')) continue;

    let parts = line.split('\t').map(s => s.trim());
    if (parts.length < 5) {
      parts = line.split(/\s{2,}/).map(s => s.trim());
    }
    if (parts.length < 5) {
      const spaceTokens = line.split(/\s+/).filter(Boolean);
      if (spaceTokens.length >= 5) {
        parts = spaceTokens;
      } else {
        continue;
      }
    }

    const rawDomain = parts[0] || '';
    const domain = cleanDomain(rawDomain);
    if (!domain.includes('.')) continue;

    let niche = parts[1] || 'Technology';
    if (niche === 'SAAS' || niche === 'SaaS') niche = 'SaaS';
    if (niche === 'Finance Business' || niche === 'Finnance Business') niche = 'Finance & Business';
    if (niche === 'News Magazine') niche = 'News & Magazine';
    if (niche.startsWith('TOP Link') || niche.startsWith('Go Link') || niche.startsWith('TOP LINK')) niche = 'Technology';
    if (niche.startsWith('Premium PR') || niche === 'PREMIUM' || niche === 'Premium') niche = 'General & News';

    let da = 0;
    let dr = 0;
    let price = 50;
    let traffic = 0;
    let tat = 7;
    let country = 'United States';
    let isDoFollow = true;

    if (parts.length >= 8) {
      const daStr = parts[2];
      const drStr = parts[3];
      const priceStr = parts[4];
      const trafficStr = parts[5];
      const tatStr = parts[6];
      const countryStr = parts[7];
      const linkStr = parts[8] || 'Do Follow';

      da = parseInt(daStr?.replace(/\D/g, '') || '0', 10) || 0;
      dr = parseInt(drStr?.replace(/\D/g, '') || '0', 10) || 0;
      if (da === 0 && dr > 0) da = dr;
      if (dr === 0 && da > 0) dr = da;
      if (da === 0 && dr === 0) { da = 50; dr = 50; }

      price = parseFloat(priceStr?.replace(/[^0-9.]/g, '') || '50') || 50;
      traffic = parseInt(trafficStr?.replace(/\D/g, '') || '0', 10) || 0;
      tat = parseInt(tatStr?.replace(/\D/g, '') || '7', 10) || 7;
      country = countryStr?.trim() || 'United States';
      if (country.toLowerCase() === 'unitedstates') country = 'United States';
      isDoFollow = !/nofollow/i.test(linkStr);
    } else {
      const priceStr = parts.find(p => p.includes('$')) || parts[3] || '50';
      price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 50;
    }

    let serviceType: 'ARTICLE_POSTING' | 'LINK_INSERTION' | 'BOTH' = 'ARTICLE_POSTING';
    if (/link insertion/i.test(line) && /guest post/i.test(line)) {
      serviceType = 'BOTH';
    } else if (/link insertion/i.test(line)) {
      serviceType = 'LINK_INSERTION';
    } else {
      serviceType = 'ARTICLE_POSTING';
    }

    records.push({
      domain,
      url: `https://${domain}/`,
      niche,
      da,
      dr,
      price,
      traffic,
      tat,
      country,
      isDoFollow,
      serviceType
    });
  }

  console.log(`📊 Extracted ${records.length} records from data.md`);

  // Group by domain
  const domainMap = new Map<string, WebsiteRecord[]>();
  for (const r of records) {
    if (!domainMap.has(r.domain)) domainMap.set(r.domain, []);
    domainMap.get(r.domain)!.push(r);
  }

  console.log(`🌐 Unique domains count: ${domainMap.size}`);

  let createdCount = 0;
  let updatedCount = 0;
  let packageCount = 0;

  const entriesArray = Array.from(domainMap.entries());
  const CHUNK_SIZE = 50;

  for (let i = 0; i < entriesArray.length; i += CHUNK_SIZE) {
    const chunk = entriesArray.slice(i, i + CHUNK_SIZE);

    await Promise.all(
      chunk.map(async ([domain, entries]) => {
        const bestEntry = entries[0];
        const da = Math.max(...entries.map(e => e.da));
        const dr = Math.max(...entries.map(e => e.dr));
        const traffic = Math.max(...entries.map(e => e.traffic));
        const niche = entries.find(e => e.niche && e.niche !== 'General & News')?.niche || bestEntry.niche || 'Technology';
        const country = entries.find(e => e.country && e.country !== 'United States')?.country || bestEntry.country || 'United States';
        const url = `https://${domain}/`;

        let platform = await db.platform.findFirst({
          where: {
            url: {
              in: [url, `https://${domain}`, `http://${domain}/`, `http://${domain}`, domain]
            }
          },
          include: { packages: true }
        });

        if (!platform) {
          platform = await db.platform.create({
            data: {
              publisherId: COMPANY_PUBLISHER_ID,
              url,
              name: domain,
              da,
              dr,
              traffic,
              niche,
              country,
              language: 'English',
              status: PlatformStatus.ACTIVE,
              isIndexed: true,
            },
            include: { packages: true }
          });
          createdCount++;
        } else {
          platform = await db.platform.update({
            where: { id: platform.id },
            data: {
              publisherId: COMPANY_PUBLISHER_ID,
              status: PlatformStatus.ACTIVE,
              da: Math.max(platform.da, da),
              dr: Math.max(platform.dr, dr),
              traffic: Math.max(platform.traffic, traffic),
              niche: platform.niche || niche,
              country: platform.country || country,
            },
            include: { packages: true }
          });
          updatedCount++;
        }

        // Packages to sync
        const packagesToEnsure: {
          type: ProductType;
          price: number;
          turnaround: number;
          description: string;
          isDoFollow: boolean;
        }[] = [];

        const gpEntry = entries.find(e => e.serviceType === 'ARTICLE_POSTING' || e.serviceType === 'BOTH');
        if (gpEntry) {
          packagesToEnsure.push({
            type: ProductType.ARTICLE_POSTING,
            price: gpEntry.price,
            turnaround: gpEntry.tat || 7,
            description: 'Guest post placement with permanent do-follow backlink.',
            isDoFollow: gpEntry.isDoFollow
          });
        }

        const liEntry = entries.find(e => e.serviceType === 'LINK_INSERTION' || e.serviceType === 'BOTH');
        if (liEntry) {
          packagesToEnsure.push({
            type: ProductType.LINK_INSERTION,
            price: liEntry.price,
            turnaround: liEntry.tat || 7,
            description: 'Contextual in-content link insertion with do-follow backlink.',
            isDoFollow: liEntry.isDoFollow
          });
        }

        if (packagesToEnsure.length === 0) {
          packagesToEnsure.push({
            type: ProductType.ARTICLE_POSTING,
            price: bestEntry.price || 50,
            turnaround: bestEntry.tat || 7,
            description: 'Standard guest post placement with permanent do-follow backlink.',
            isDoFollow: bestEntry.isDoFollow
          });
        }

        for (const pkg of packagesToEnsure) {
          const existingPkg = platform.packages.find(p => p.type === pkg.type);
          if (existingPkg) {
            await db.package.update({
              where: { id: existingPkg.id },
              data: {
                price: pkg.price,
                turnaround: pkg.turnaround,
                isDoFollow: pkg.isDoFollow,
                isActive: true
              }
            });
          } else {
            await db.package.create({
              data: {
                platformId: platform.id,
                type: pkg.type,
                price: pkg.price,
                turnaround: pkg.turnaround,
                description: pkg.description,
                isDoFollow: pkg.isDoFollow,
                isActive: true
              }
            });
            packageCount++;
          }
        }
      })
    );

    const progress = Math.min(i + CHUNK_SIZE, entriesArray.length);
    console.log(`⏳ Progress: ${progress}/${entriesArray.length}`);
  }

  console.log('✅ Sync completed successfully!');
  console.log(`✨ Created: ${createdCount}, Updated: ${updatedCount}, Packages added: ${packageCount}`);
  const finalCount = await db.platform.count({ where: { publisherId: COMPANY_PUBLISHER_ID } });
  console.log(`📊 Final Total Platforms for Company Publisher: ${finalCount}`);
}

syncAllFromDataMd()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
