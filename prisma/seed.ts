import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Seeding database with 4 packages...')

  // Clear existing data
  await prisma.package.deleteMany()

  // Seed 4 Packages
  await prisma.package.createMany({
    data: [
      {
        title: 'BAŞLANGIÇ PAKETİ',
        postCount: 6,
        price: '6.999',
        features: JSON.stringify([
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
          'Tek Seferlik Tasarım Paketi',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: false,
        order: 1,
      },
      {
        title: 'STANDART PAKET',
        postCount: 8,
        price: '9.999',
        features: JSON.stringify([
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
          'Tek Seferlik Tasarım Paketi',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: false,
        order: 2,
      },
      {
        title: 'PROFESYONEL PAKET',
        postCount: 12,
        price: '12.999',
        features: JSON.stringify([
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
          'Tek Seferlik Tasarım Paketi',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: true,
        order: 3,
      },
      {
        title: 'PREMIUM PAKET',
        postCount: 15,
        price: '15.999',
        features: JSON.stringify([
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
          'Tek Seferlik Tasarım Paketi',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: false,
        order: 4,
      },
    ],
  })

  console.log('Database seeded successfully with 4 packages!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
