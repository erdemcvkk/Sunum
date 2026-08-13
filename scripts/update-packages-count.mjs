import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({ orderBy: { order: 'asc' } });
  
  const packageConfigs = {
    1: {
      postCount: 6,
      features: [
        '6 Post Tasarımı',
        '6 Story Tasarımı',
        'Marka Renklerinize Özel',
        'Kendi Logonuzla Kullanım',
        'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
        'Size Özel Şablon (Telefon Numarası, Adres vb.)',
        'Özel Gün Tasarımları Dahil',
        '1 Revize Hakkı',
        'Standart Tasarım Desteği',
        '7 İş Günü İçerisinde Teslimat',
        'Tek Seferlik Tasarım Paketi'
      ]
    },
    2: {
      postCount: 8,
      features: [
        '8 Post Tasarımı',
        '8 Story Tasarımı',
        'Marka Renklerinize Özel',
        'Kendi Logonuzla Kullanım',
        'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
        'Size Özel Şablon (Telefon Numarası, Adres vb.)',
        'Özel Gün Tasarımları Dahil',
        '2 Revize Hakkı',
        'Kampanya Tasarımları',
        '7 İş Günü İçerisinde Teslimat',
        'Tek Seferlik Tasarım Paketi'
      ]
    },
    3: {
      postCount: 12,
      features: [
        '12 Post Tasarımı',
        '12 Story Tasarımı',
        'Marka Renklerinize Özel',
        'Kendi Logonuzla Kullanım',
        'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
        'Size Özel Şablon (Telefon Numarası, Adres vb.)',
        'Özel Gün Tasarımları Dahil',
        '3 Revize Hakkı',
        'Özel Kampanya Tasarımları',
        'Öncelikli Destek',
        '5-7 İş Günü İçerisinde Teslimat',
        'Tek Seferlik Tasarım Paketi'
      ]
    },
    4: {
      postCount: 15,
      features: [
        '15 Post Tasarımı',
        '15 Story Tasarımı',
        'Marka Renklerinize Özel',
        'Kendi Logonuzla Kullanım',
        'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
        'Size Özel Şablon (Telefon Numarası, Adres vb.)',
        'Özel Gün Tasarımları Dahil',
        '5 Revize Hakkı',
        'Özel Kampanya Tasarımları',
        'Öncelikli Destek',
        'Aylık İçerik Planlama Desteği',
        'Tek Seferlik Tasarım Paketi'
      ]
    }
  };

  for (const pkg of packages) {
    const config = packageConfigs[pkg.order];
    if (config) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          postCount: config.postCount,
          features: JSON.stringify(config.features)
        }
      });
      console.log(`Updated DB: ${pkg.title} -> ${config.postCount} posts & features updated.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
