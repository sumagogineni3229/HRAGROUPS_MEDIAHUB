import { db } from '../src/lib/db';

const COMPANY_PUBLISHER_ID = 'cmteqswqm0000k6re5we03vhc';

function normalizeDomain(urlOrDomain: string): string {
  let d = urlOrDomain.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '');
  d = d.replace(/\/+$/, '');
  d = d.split('/')[0];
  return d;
}

async function verifyAndDeduplicate() {
  console.log('🔍 Checking for any duplicate platforms across company publisher...');

  const platforms = await db.platform.findMany({
    where: { publisherId: COMPANY_PUBLISHER_ID },
    include: { packages: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Found ${platforms.length} total platform rows in DB.`);

  const domainGroups = new Map<string, typeof platforms>();

  for (const p of platforms) {
    const domain = normalizeDomain(p.url);
    if (!domainGroups.has(domain)) {
      domainGroups.set(domain, []);
    }
    domainGroups.get(domain)!.push(p);
  }

  let duplicatePlatformsFound = 0;
  let deletedDuplicates = 0;

  for (const [domain, list] of domainGroups.entries()) {
    if (list.length > 1) {
      duplicatePlatformsFound++;
      // Keep the primary one (with highest metrics or most packages)
      list.sort((a, b) => (b.packages.length - a.packages.length) || (b.da - a.da) || (b.traffic - a.traffic));
      const [primary, ...duplicates] = list;

      // Merge packages to primary
      for (const dup of duplicates) {
        for (const pkg of dup.packages) {
          const existsInPrimary = primary.packages.some(p => p.type === pkg.type);
          if (!existsInPrimary) {
            await db.package.create({
              data: {
                platformId: primary.id,
                type: pkg.type,
                price: pkg.price,
                turnaround: pkg.turnaround,
                description: pkg.description,
                isDoFollow: pkg.isDoFollow,
                isActive: true
              }
            });
            primary.packages.push(pkg);
          }
        }
        // Delete the duplicate platform
        await db.platform.delete({ where: { id: dup.id } });
        deletedDuplicates++;
      }

      // Ensure primary URL is formatted cleanly
      await db.platform.update({
        where: { id: primary.id },
        data: {
          url: `https://${domain}/`,
          name: domain,
          status: 'ACTIVE'
        }
      });
    }
  }

  console.log(`🧹 Cleaned up ${deletedDuplicates} duplicate rows across ${duplicatePlatformsFound} domains.`);

  const finalPlatforms = await db.platform.findMany({
    where: { publisherId: COMPANY_PUBLISHER_ID },
    include: { packages: true }
  });

  console.log(`\n======================================================`);
  console.log(`✅ VERIFICATION & INTEGRITY REPORT:`);
  console.log(`======================================================`);
  console.log(`Total Unique Platforms: ${finalPlatforms.length}`);
  console.log(`Total Active Platforms: ${finalPlatforms.filter(p => p.status === 'ACTIVE').length}`);
  console.log(`Total Packages: ${finalPlatforms.reduce((acc, p) => acc + p.packages.length, 0)}`);
  console.log(`Platforms with Guest Post Package: ${finalPlatforms.filter(p => p.packages.some(k => k.type === 'ARTICLE_POSTING')).length}`);
  console.log(`Platforms with Link Insertion Package: ${finalPlatforms.filter(p => p.packages.some(k => k.type === 'LINK_INSERTION')).length}`);
  console.log(`======================================================\n`);
}

verifyAndDeduplicate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
