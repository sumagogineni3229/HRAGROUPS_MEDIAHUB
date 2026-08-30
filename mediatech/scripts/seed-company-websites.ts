import { db } from '../src/lib/db';
import { parseAllLines, ParsedWebsite } from './test-parse';
import { ProductType, PlatformStatus } from '@prisma/client';

const COMPANY_PUBLISHER_ID = 'cmteqswqm0000k6re5we03vhc';

async function main() {
  console.log('🚀 Starting company publisher website seeding...');

  // Verify company publisher exists
  const publisher = await db.user.findUnique({
    where: { id: COMPANY_PUBLISHER_ID }
  });

  if (!publisher) {
    throw new Error(`Company publisher user with ID ${COMPANY_PUBLISHER_ID} not found!`);
  }

  console.log(`✅ Found company publisher: ${publisher.email} (${publisher.id})`);

  const { websites, errors } = parseAllLines();
  console.log(`📊 Parsed ${websites.length} website entries (${errors.length} errors)`);

  // Group by unique domain
  const domainMap = new Map<string, ParsedWebsite[]>();
  for (const w of websites) {
    if (!domainMap.has(w.domain)) {
      domainMap.set(w.domain, []);
    }
    domainMap.get(w.domain)!.push(w);
  }

  console.log(`🌐 Total unique websites to insert: ${domainMap.size}`);

  const startTime = Date.now();
  let createdCount = 0;
  let updatedCount = 0;
  let packageCount = 0;

  // Process in chunks of 50 for optimal database performance
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

        // Check if platform exists
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
          // Update status to ACTIVE and ensure publisherId is company publisher
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

        // Determine packages to create/upsert
        const packagesToEnsure: {
          type: ProductType;
          price: number;
          turnaround: number;
          description: string;
        }[] = [];

        // Check for Guest Post
        const gpEntry = entries.find(e => e.service === 'ARTICLE_POSTING' || e.service === 'BOTH');
        if (gpEntry) {
          packagesToEnsure.push({
            type: ProductType.ARTICLE_POSTING,
            price: gpEntry.price,
            turnaround: gpEntry.tat || 7,
            description: 'Guest post placement with permanent do-follow backlink.'
          });
        }

        // Check for Link Insertion
        const liEntry = entries.find(e => e.service === 'LINK_INSERTION' || e.service === 'BOTH');
        if (liEntry) {
          packagesToEnsure.push({
            type: ProductType.LINK_INSERTION,
            price: liEntry.price,
            turnaround: liEntry.tat || 7,
            description: 'Contextual in-content link insertion with do-follow backlink.'
          });
        }

        // Default if neither was explicitly flagged
        if (packagesToEnsure.length === 0) {
          packagesToEnsure.push({
            type: ProductType.ARTICLE_POSTING,
            price: bestEntry.price || 50,
            turnaround: bestEntry.tat || 7,
            description: 'Standard guest post placement with permanent do-follow backlink.'
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
                isDoFollow: true,
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
                isDoFollow: true,
                isActive: true
              }
            });
            packageCount++;
          }
        }
      })
    );

    const progress = Math.min(i + CHUNK_SIZE, entriesArray.length);
    const pct = ((progress / entriesArray.length) * 100).toFixed(1);
    console.log(`⏳ Progress: ${progress}/${entriesArray.length} (${pct}%) - Created: ${createdCount}, Packages added: ${packageCount}`);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 SEEDING COMPLETED IN ${durationSec}s!`);
  console.log(`✨ Total Created Platforms: ${createdCount}`);
  console.log(`✨ Total Updated Platforms: ${updatedCount}`);
  console.log(`✨ Total Packages Added: ${packageCount}`);

  const totalInDb = await db.platform.count({ where: { publisherId: COMPANY_PUBLISHER_ID } });
  console.log(`📊 Total Platforms under Company Publisher in DB: ${totalInDb}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
