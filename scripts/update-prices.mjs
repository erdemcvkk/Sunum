import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const packages = await prisma.package.findMany({ orderBy: { order: 'asc' } });
  
  // Premium Paket'i bul ve güncelle (order: 4 veya title PREMIUM)
  for (const pkg of packages) {
    if (pkg.order === 4 || pkg.title.toLowerCase().includes('premium')) {
      // JSON features'ı da 20 post/story'e göre güncelleyelim
      const features = [
        '20 Post Tasarımı',
        '20 Story Tasarımı',
        'Marka Renklerinize Özel',
        'Kendi Logonuzla Kullanım',
        'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
        'Size Özel Şablon (Telefon Numarası, Adres vb.)',
        '5 Revize Hakkı',
        'Özel Kampanya Tasarımları',
        'Öncelikli Destek',
        'Aylık İçerik Planlama Desteği',
        'Tek Seferlik Tasarım Paketi'
      ];

      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          price: '9.999',
          postCount: 20,
          features: JSON.stringify(features)
        },
      });
      console.log(`Updated database: ${pkg.title} -> ₺9.999, 20 post`);
    } else {
      // Diğer paketlerin de features listesine "Size Özel Şablon..." maddesi eklenmesini sağlayalım
      try {
        let list = JSON.parse(pkg.features);
        if (Array.isArray(list)) {
          if (!list.some(f => f.toLowerCase().includes('şablon') || f.toLowerCase().includes('telefon numarası'))) {
            list.splice(5, 0, 'Size Özel Şablon (Telefon Numarası, Adres vb.)');
            await prisma.package.update({
              where: { id: pkg.id },
              data: { features: JSON.stringify(list) }
            });
            console.log(`Added template feature to database: ${pkg.title}`);
          }
        }
      } catch (e) {
        console.error(`Error parsing features for ${pkg.title}`, e);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
