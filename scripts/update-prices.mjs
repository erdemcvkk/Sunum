import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({ orderBy: { order: 'asc' } });
  
  const priceMap = {
    1: '6.999',
    2: '9.999',
    3: '12.999',
    4: '15.999',
  };

  for (const pkg of packages) {
    const newPrice = priceMap[pkg.order];
    if (newPrice) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: { price: newPrice },
      });
      console.log(`Updated DB: ${pkg.title} -> ₺${newPrice}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
