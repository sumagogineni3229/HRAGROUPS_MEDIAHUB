import { db } from '../src/lib/db';
import { ProductType } from '@prisma/client';

const COMPANY_PUBLISHER_ID = 'cmteqswqm0000k6re5we03vhc';

async function fixDuplicatedPrices() {
  console.log('🔧 Fixing duplicate price packages for company publisher...');

  const platforms = await db.platform.findMany({
    where: { publisherId: COMPANY_PUBLISHER_ID },
    include: { packages: true },
  });

  console.log(`Found ${platforms.length} platforms to check.`);

  let removedDuplicates = 0;

  for (const platform of platforms) {
    const articlePkg = platform.packages.find(p => p.type === ProductType.ARTICLE_POSTING);
    const linkPkg = platform.packages.find(p => p.type === ProductType.LINK_INSERTION);

    // If both exist and have the exact same price, remove the duplicate LINK_INSERTION
    // so the platform only has its true single Content Placement price
    if (articlePkg && linkPkg && articlePkg.price === linkPkg.price) {
      await db.package.delete({
        where: { id: linkPkg.id }
      });
      removedDuplicates++;
    }
  }

  console.log(`✅ Successfully removed ${removedDuplicates} duplicated Link Insertion packages with identical prices.`);

  const finalPackages = await db.package.count({
    where: { platform: { publisherId: COMPANY_PUBLISHER_ID } }
  });
  console.log(`📊 Final Total Packages for Company Publisher: ${finalPackages}`);
}

fixDuplicatedPrices()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
