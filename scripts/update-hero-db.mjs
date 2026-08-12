import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // hero_badge güncellemesi
  const badge = await prisma.siteContent.findUnique({ where: { sectionKey: 'hero_badge' } });
  if (badge) {
    await prisma.siteContent.update({
      where: { sectionKey: 'hero_badge' },
      data: { textValue: 'MARKANIZA ÖZEL' }
    });
    console.log('Updated hero_badge in DB.');
  }

  // hero_subtitle güncellemesi
  const subtitle = await prisma.siteContent.findUnique({ where: { sectionKey: 'hero_subtitle' } });
  if (subtitle) {
    await prisma.siteContent.update({
      where: { sectionKey: 'hero_subtitle' },
      data: { textValue: 'Markanız için özel olarak hazırladığımız sosyal medya tasarımları ile markanızı dijitalde bir adım öne taşıyın.' }
    });
    console.log('Updated hero_subtitle in DB.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
