import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Tüm galeri görsellerini 'Sürücü Kursu' kategorisi altında toplayalım
  const result = await prisma.galleryImage.updateMany({
    data: {
      category: 'Sürücü Kursu'
    }
  });

  console.log(`Updated ${result.count} gallery images' category to 'Sürücü Kursu'.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
